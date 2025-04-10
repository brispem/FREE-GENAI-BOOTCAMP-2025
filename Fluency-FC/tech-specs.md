# Fluency FC - Retro Spanish Language Learning Game

Welcome to **Fluency FC**, a retro 8-bit football-inspired learning game built in **Phaser**. The player takes on the role of a new signing for Fluency FC and must progress through matches against Spanish teams by answering beginner-level Spanish questions and scoring match-winning penalties. The game is designed as a fun, gamified component of the GEN AI Bootcamp 2025 learning portal.

---

## Game Summary

- **Engine**: Phaser (v3 or v4)
- **Visual Style**: Retro 8-bit pixel art (Sensible Soccer-inspired)
- **Perspective**: Top-down (penalty), side-by-side (VS scenes), full-body front (city intros, practice)
- **Mode**: Single Player
- **Platform**: Browser (fullscreen)
- **Input**: Keyboard + Mouse

---

## Game Flow & Progression

### Onboarding
1. **Title Screen** – Press Start, game intro
2. **Contract Signing** – Newspaper-style "[Name] Signs for Fluency FC"
3. **Changing Room** – Meet your new team, prep for your journey
4. **Mini-Map of Spain** – Blinking marker on the current city (Sevilla > Mallorca > Madrid > Barcelona)

### For Each City (Sevilla, Mallorca, Madrid, Barcelona):
1. **Map Zoom-In + Landing Animation**
2. **VS Screen** – Fluency FC vs Opponent
3. **Welcome to City** – Language immersion cutscene (e.g., Bienvenido a Sevilla)
4. **Quiz Phase** – 2-3 beginner Spanish questions
5. **Stadium Text Scene** – Congratulate/encourage player (e.g. "Well done! Time to strike for glory!")
6. **Penalty Scene** – Direction + power mechanic
7. **Result**:
   - **Score** = Progress to next round
   - **Miss** = Show "Defeat" screen with option to retry

### Finale
- **Reach Final** screen after Madrid
- **VS Barcelona**
- **Victory Sequence**:
  - Podium + Trophy ("Fluency FC Champion!")
  - Alternate victory screen with Barcelona looking defeated

---

## Optional Gameplay Features
- **Penalty Training Mode** – Accessible from changing room before Sevilla begins
- **Dynamic scoring chance based on quiz results**:
  - 3 correct = 90% success
  - 2 correct = 70%
  - 1 correct = 50%
  - 0 correct = 30%
- **Toggle Translations** – Spanish ⇄ English support ("T" key)
- **Progress Tracking** – Save city reached, quiz stats

---

## Cities & Key Elements

| City      | Kit Colours     | Landmark                | Stadium Capacity | Welcome Screen             |
|-----------|------------------|--------------------------|------------------|----------------------------|
| Sevilla   | Red & White      | La Giralda               | 43,883           | Bienvenido a Sevilla       |
| Mallorca  | Red & Black      | Cathedral + Beachfront   | 23,142           | Bienvenido a Mallorca      |
| Madrid    | White            | Royal Palace             | 81,044           | Bienvenido a Madrid        |
| Barcelona | Blue & Claret    | La Sagrada Familia       | 99,354           | Bienvenido a Barcelona     |

---

## Controls

### Quiz Phase
- `A / B / C` = Answer selection
- `Number + Enter` = Numeric input
- `T` = Toggle translation

### Penalty Kick Phase
- `Arrow keys` = Direction
- `Spacebar` = Stop power bar and shoot

---

## Scenes (PNG Asset Map)

| Filename                      | Description                                  |
|------------------------------|----------------------------------------------|
| `title_screen.png`           | Fluency FC logo + Press Start                |
| `contract_screen.png`        | Newspaper style signing announcement         |
| `changing_room.png`          | Player in locker room                        |
| `penalty_training.png`       | Practice penalty shootout                    |
| `map_spain.png`              | Blinking marker showing current city         |
| `vs_sevilla.png`             | VS Screen: Sevilla match                     |
| `welcome_sevilla.png`        | Welcome cutscene: Sevilla                    |
| `progress_to_next_round.png` | Stadium + Textbox scene                      |
| `penalty_scene.png`          | Top-down penalty UI                          |
| `defeat_retry_screen.png`    | Missed shot, retry option                    |
| `vs_mallorca.png`            | VS Screen: Mallorca match                    |
| `welcome_mallorca.png`       | Welcome cutscene: Mallorca                   |
| `vs_madrid.png`              | VS Screen: Madrid match                      |
| `welcome_madrid.png`         | Welcome cutscene: Madrid                     |
| `reach_final.png`            | Cutscene: Reached Final                      |
| `vs_barcelona.png`           | VS Screen: Barcelona (final)                 |
| `welcome_barcelona.png`      | Welcome cutscene: Barcelona                  |
| `fluency_fc_wins_trophy.png` | Confetti victory scene                       |
| `fluency_champion.png`       | Podium + Cup celebration                     |
| `victory_trophy_scene.png`   | Alt: Barcelona defeated                      |

---

## Art & Audio Guidelines

### Visual Style
> **Prompt**: "8-bit retro pixel art football scene, early 90s arcade style, bright colours, pixelated players with outlines, consistent proportions, top-down or side-view depending on scene."

- Top-down for penalty scenes
- Side-by-side for VS screens
- Front-on for welcome & celebrations
- Characters and environments must be stylistically consistent

### Audio
| Sound Effect         | Description                                |
|----------------------|--------------------------------------------|
| Kick                 | Retro-style synth "thud"                   |
| Crowd Cheer          | Arcade cheer loop or burst                 |
| Crowd Boo            | Negative response to missed shot           |
| Correct Answer       | Upward chime                               |
| Wrong Answer         | Downward buzz                              |
| Button Click         | Menu selection blip                        |
| Background Music     | Upbeat chiptune loop                       |

---

## Technical Requirements

- **Framework**: Phaser (HTML5)
- **Data Handling**: LocalStorage or Flask+SQLite (for MVP tracking)
- **Responsive Design**: Fullscreen or scale-to-fit
- **Performance**: Lightweight sprites & short sound loops

---

## Future Considerations
- Additional cities (Valencia, Bilbao, Granada)
- Grammar challenges or listening-based questions
- Difficulty toggle (A1–A2 or B1+ tiers)
- Daily/weekly XP progress bar for bootcamp integration

---



