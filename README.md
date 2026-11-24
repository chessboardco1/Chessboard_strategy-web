# Chessboard Strategy website

Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

- **Motion:** GSAP with ScrollTrigger and SplitText, Lenis smooth scroll, Motion
- **3D:** three.js through React Three Fiber and drei
- **Type:** Hertloom (headlines) and Helvena Grotesk (body), self-hosted from `app/fonts`

## Run it

Needs Node 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # TypeScript check
```

## Where things live

| Path | What |
|---|---|
| `lib/content.ts` | All copy: services, case studies, insights, studio details. Edit content here |
| `app/` | Pages: home, services (+6), work (+4), about, insights (+6), contact, privacy, 404, sitemap, robots, share image |
| `components/three/` | 3D scenes: hero knights, the board scene, single pieces, and the shared piece library (`pieces.ts`) |
| `components/motion/` | Smooth scroll, the responsive board page transition, and text reveals |
| `public/models/` | Compressed GLB models: `knights.glb` (hero), `set.glb` (board + piece positions), `pieces-v2.glb` (one matching set, smoothed at build time) |
| `public/media/` | Compressed case films and poster frames |
| `scripts/` | Asset build scripts (see below) |
| `docs/` | [Asset sources](docs/ASSETS.md) and the [launch content checklist](docs/MOCK-CONTENT.md) |

## Rebuilding assets

The licensed Envato sources and the original site media are not committed. Keep them in `_assets-source/` next to `package.json` (it is git-ignored):

```
_assets-source/
  3d/     Envato chess models (unzipped)
  fonts/  hertloom/, helvena/
  site/   original films, client logos, brand logos, favicon
```

```bash
npm run assets:models   # hero knights + the board (with piece positions) → meshopt GLB with WebP textures
npm run assets:pieces   # the piece library pieces-v2.glb (smoothed here, not in the browser) + boxwood grain texture
npm run assets:media    # films → 720p H.264, poster frames, logos, fonts
```

The model commands use the Windows FBX converter. The normal app build uses the committed assets.

## Deploying

The site is configured for **Vercel**.

1. Import the GitHub repository in Vercel.
2. In Vercel, add the domains `chessboardstrategy.com` and `www.chessboardstrategy.com`.
3. In GoDaddy DNS, replace the four GitHub Pages `A` records with the records Vercel shows. Then add a `CNAME` for `www` pointing to `cname.vercel-dns.com`.
4. In the GitHub repository settings, turn off GitHub Pages.

Do not push `main` to GitHub while GitHub Pages is still switched on: the live site would stop serving the old pages before Vercel is ready.
