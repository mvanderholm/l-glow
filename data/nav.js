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

// Nav restructure, Move 3 (Aug 2026): the hamburger drawer this file used
// to feed is gone — WebLayout is the only remaining consumer. The old
// Home/Your Profile/My Journey group is dropped since it just duplicated
// BottomNav's own 4 tabs (My Journey pointed at /journey, now a redirect
// stub to /you); the Playlist link is dropped since Today's Sound
// (app/index.js's MusicCard) already supersedes it; Practitioner Hub moved
// to a plain row on /settings instead of its own section here, matching
// where the mobile app now surfaces it.
export const NAV_SECTIONS = [
  [
    { key: 'learn',   label: 'Learn',          href: '/learn' },
    { key: 'journal', label: 'Journal',        href: '/journal' },
    { key: 'about',   label: 'About Thea',     href: '/about' },
    { key: 'booking', label: 'Book a Session', external: BOOKING_URL },
  ],
];
