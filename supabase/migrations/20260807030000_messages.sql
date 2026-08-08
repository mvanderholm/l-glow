-- L. Glow — in-app messaging between a client and Thea (roadmap #59).
-- Run in the Supabase SQL Editor after 20260807020000_push_tokens.sql.
--
-- Deliberately simple, v1-to-react-to shape, same philosophy as the
-- practitioner dashboard's own v1 (20260712000000_practitioner_view_v1.sql):
-- there's exactly one practitioner right now, so this is one flat thread per
-- client rather than a general multi-party conversation model. `user_id`
-- identifies whose thread a row belongs to regardless of who sent it —
-- Thea's replies to a client also carry that client's user_id, so "all
-- messages in my thread" is just `where user_id = :clientId`.
--
-- No update/delete policies anywhere below — messages are immutable once
-- sent, same as check-ins/journal entries elsewhere in this schema. No
-- read_at/read-receipt tracking either: the push notification (see
-- push_tokens, notify-new-message) already answers "did I miss a message,"
-- same reasoning the roadmap used to justify skipping live-updating threads
-- for v1 — start simple.
--
-- Gated on the same consent flag that already gates every other
-- practitioner-read policy (consented_to_practitioner_view) rather than a
-- new messaging-specific consent concept — a client who hasn't agreed to
-- share their data with Thea shouldn't be corresponding with her either.

create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  sender_id  uuid not null references auth.users(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

create index messages_user_id_created_at_idx on public.messages (user_id, created_at);

alter table public.messages enable row level security;

create policy "Client can read their own thread"
  on public.messages for select
  using (auth.uid() = user_id and public.is_active());

create policy "Client can send messages in their own thread"
  on public.messages for insert
  with check (auth.uid() = user_id and sender_id = auth.uid() and public.is_active());

create policy "Practitioners can read consented clients' messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.users owner
      where owner.id = messages.user_id and owner.consented_to_practitioner_view = true
    )
    and public.is_practitioner()
  );

create policy "Practitioners can send messages to consented clients"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and public.is_practitioner()
    and exists (
      select 1 from public.users owner
      where owner.id = messages.user_id and owner.consented_to_practitioner_view = true
    )
  );
