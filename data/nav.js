// Single source of truth for "go anywhere in the app" navigation. Both the
// hamburger drawer (mobile/app-frame) and the fixed sidebar (Web View) render
// this same list, grouped the same way, so they can't quietly drift apart the
// way they did after the July 21 2026 drawer changes (Quizzes/Playlist added
// to the drawer, never carried over to WebLayout's separate hardcoded copy).
// BottomNav's 5 tabs are deliberately not here — those are a separate
// navigational plane that only exists on the app-frame/native bottom bar;
// WebLayout imports BottomNav's own TABS export instead, so that also can't
// drift out of sync with its single source.
//
// Quizzes and Tools removed Aug 14 2026 (nav-duplication audit, Matt's ask):
// every one of Tools' 9 tiles and all 6 of Quizzes' items were reachable
// elsewhere already — Quizzes was a near-exact subset of You tab's
// Assessments list, Tools had zero destinations not already on a pillar tab,
// You tab, or Home. Removing them here cuts real duplication, not coverage
// — nothing they pointed to moved or disappeared. See docs/roadmap.md #70.
// The screens themselves (app/tools.js, app/quizzes.js) were deleted along
// with this, since nothing links to them anymore.

import { BOOKING_URL } from './booking';
import { SPOTIFY_PROFILE_URL } from './content/music';

export const NAV_SECTIONS = [
  [
    { key: 'home',    label: 'Home',           href: '/' },
    { key: 'profile', label: 'Your Profile',   href: '/you' },
    { key: 'journey', label: 'My Journey',     href: '/journey' },
  ],
  [
    { key: 'learn',   label: 'Learn',          href: '/learn' },
    { key: 'journal', label: 'Journal',        href: '/journal' },
    { key: 'about',   label: 'About Thea',     href: '/about' },
    { key: 'booking', label: 'Book a Session', external: BOOKING_URL },
  ],
  [
    { key: 'playlist', label: 'Playlist', external: SPOTIFY_PROFILE_URL },
  ],
];

// Kept out of NAV_SECTIONS itself (rather than baked in and hidden by a
// per-item flag) so both render sites — HamburgerDrawer and WebLayout —
// append it the same conditional way instead of one of them quietly
// drifting out of sync, the exact failure mode this file's own header
// comment exists to prevent. Only ever shown for role === 'practitioner'
// accounts (see context/AuthContext.js's isPractitioner).
export const PRACTITIONER_NAV_SECTION = [
  { key: 'practitioner', label: 'Practitioner Hub', href: '/practitioner' },
];
