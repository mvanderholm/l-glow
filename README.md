# Lavender Glow — Mark 1

A daily ayurvedic companion. React Native + Expo, cross-platform (iOS / Android / web).

## What's in mark 1

Five screens, all wired up with mock data:

1. **Welcome** — intro, current ayurvedic season, primary CTAs
2. **Dosha Quiz** — 8 questions, progress bar, scoring
3. **Result** — primary dosha + percentage breakdown across vata / pitta / kapha
4. **Daily Check-in** — physical / mental / emotional sliders + optional note
5. **Recommendations** — foods to favor & reduce, herbs, meditation, lifestyle, all tuned to dosha + season

## Stack

- Expo SDK 51 + Expo Router (file-based routing, mirrors PinPoint)
- React Native 0.74
- AsyncStorage installed but not yet wired (mark 2)
- Theme: warm earth tones — saffron, terracotta, sage on near-black

## Run it

```bash
npm install
npm start
```

Then press `i` for iOS, `a` for Android, `w` for web.

## File layout

```
app/
  _layout.js          Root stack navigator
  index.js            Welcome
  quiz.js             Dosha quiz
  result.js           Quiz result + breakdown
  checkin.js          Daily check-in
  recommendations.js  Personalized guidance
data/
  quiz.js             Questions + dosha info (framework-based)
  recommendations.js  Food/herb/meditation maps + season engine
theme/
  index.js            Colors, spacing, type tokens
```

## Important note on source material

David Frawley's *Ayurveda and the Mind* and *The Yoga of Herbs* are copyrighted. Mark 1 builds on the **classical ayurvedic framework** (doshas, six tastes, ritucharya, herb categories) which is part of the broader tradition — not on text from those books. Frawley is credited as recommended further reading. Before launch, have someone with ayurvedic credentials review the recommendation content for accuracy.

## Roadmap to mark 2

- [ ] Persist quiz result + check-ins via AsyncStorage
- [ ] Account creation (Supabase or Firebase)
- [ ] Layer check-in state into recommendations (e.g. low physical → emphasize grounding foods)
- [ ] Check-in history view with trends
- [ ] Push notifications for daily check-in reminder
- [ ] Expanded herb library with properties (rasa, virya, vipaka)
- [ ] Hemisphere detection for season engine
- [ ] Dual-dosha (prakriti + vikriti) handling
- [ ] Content review by an ayurvedic practitioner

## Roadmap to mark 3

- [ ] Web companion site (Next.js, sharing the data layer)
- [ ] Recipe library tagged by dosha and season
- [ ] Meditation audio
- [ ] Community / sharing features
