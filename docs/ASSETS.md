# Asset sources

Keep licensed originals in the ignored `_assets-source/` directory. The website uses the built assets committed in `app/fonts/` and `public/`. See the [README](../README.md) for rebuild commands.

| Asset | Source folder under `_assets-source/` | Source |
| --- | --- | --- |
| Hertloom Regular | `fonts/hertloom/` | [Hertloom](https://elements.envato.com/hertloom-LC63D48) |
| Helvena Regular and Medium | `fonts/helvena/` | [Helvena Grotesk](https://elements.envato.com/helvena-grotesk-modern-bold-brand-identity-font-RMJGV4K) |
| Hero knights and knight piece | `3d/knights-black-wood/` | [Chess Knights](https://elements.envato.com/chess-knights-black-and-wood-horse-MEMBGW9) |
| Board and pawn | `3d/board-full-set/` | [Wooden chessboard set](https://elements.envato.com/wooden-chessboard-with-pieces-in-starting-formatio-CWDJMH4) |
| King and boxwood grain | `3d/detailed-wooden-chess-king-piece/` | [Wooden king](https://elements.envato.com/detailed-wooden-chess-king-piece-E9WUPB4) |
| Queen | `3d/classic-wood-chess-queen/` | [Wooden queen](https://elements.envato.com/classic-wood-chess-queen-LSU53A7) |
| Rook | `3d/wooden-chess-rook-piece/` | [Wooden rook](https://elements.envato.com/wooden-chess-rook-piece-CMKS6LU) |
| Bishop | `3d/detailed-wooden-chess-bishop/` | [Wooden bishop](https://elements.envato.com/detailed-wooden-chess-bishop-RGECSN8) |
| Client films and logos | `site/` | Original Chessboard Strategy website assets |

The app uses the Hertloom WOFF2 on web pages and the TTF to render the Open Graph image. The homepage still in `public/images/brand/knights-preview.webp` is a render of the knight scene. Keep the Envato project registration for these assets under `chessboardstrategy.com`.

## Media folders

Place source files under `_assets-source/site/` and run `npm run assets:media` to generate the corresponding files under `public/`. Set `ASSET_ROOT` to use a different source root. The production build uses the committed output.

| Source folder under `site/` | Generated files under `public/` |
| --- | --- |
| `videos/work/<case-slug>/` | `videos/work/<case-slug>/`, plus `videos/previews/<case-slug>.mp4` |
| `videos/behind-the-scenes/` | `videos/behind-the-scenes/` |
| `images/posters/work/<case-slug>/` | `images/posters/work/<case-slug>/` |
| `images/posters/behind-the-scenes/` | `images/posters/behind-the-scenes/` |
| `images/brand/` and `images/clients/` | `images/brand/` and `images/clients/` |

Use the case slug from `lib/content.ts` for the work folder. Name the main film `film.mp4`, `film.mov`, or `film.webm`. Additional reels in the same folder appear after the main film in numeric filename order. For a custom poster, use the same filename stem as the film in the matching poster folder. The script generates a first-frame poster when the source poster is absent.

Case films retain their audio when present. They start muted and loop when visible, with playback and sound controls available on the player. Work previews use up to six seconds of the main film. Case films, studio loops and work previews use still artwork when reduced motion or data saving is on until the visitor starts playback where controls are available.
