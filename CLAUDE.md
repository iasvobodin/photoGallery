# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional photography portfolio website for Anastasia Svobodina, built with SvelteKit. The site showcases photo series (photoseries) from various events like weddings, portraits, and bachelorette parties, with advanced smooth scrolling and animation effects.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (outputs to /build directory)
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run check

# Type checking in watch mode
npm run check:watch

# Lint code
npm run lint

# Format code
npm run format
```

## Key Architecture

### SvelteKit Configuration

- **Adapter**: Static site generation (`@sveltejs/adapter-static`)
- **Build Output**: `/build` directory
- **Deployment**: Configured for Netlify (see `netlify.toml`)
- **Prerendering**: Most routes use `export const prerender = true`

### GSAP Integration

The site uses GSAP with ScrollTrigger and ScrollSmoother for advanced scroll animations:

- **Initialization**: GSAP is initialized once in `src/routes/+layout.svelte` using `initGSAP()` from `src/lib/gsap/core.ts`
- **ScrollSmoother**: Created in layout and passed via Svelte context to child components
- **Wrapper/Content IDs**: `#smooth-wrapper` and `#smooth-content` are required for ScrollSmoother
- **Important**: GSAP plugins are registered globally in `src/lib/gsap/core.ts` to prevent multiple registrations

When working with GSAP:
- Access GSAP instances via `getContext('gsap')` in components
- ScrollSmoother instance is shared across the app
- ScrollTriggers should be cleaned up in `onDestroy` hooks

### Data Architecture

Photo data is managed through two main systems:

1. **Legacy System** (`src/lib/db/Photoseries.json`, `static/db/*.json`):
   - Individual JSON files per photo series
   - Used for backward compatibility

2. **Current System** (`src/lib/db/data.js`):
   - Centralized photo database (large file, ~414KB)
   - Photos tagged with keywords: `ph__<route>` for series, `name__<title>` for titles, `phcover` for cover images
   - Data filtering happens in `+page.server.ts` files using keyword-based queries

Photo data structure:
```typescript
{
  Name: string,        // Photo filename
  Colors: string[],    // Dominant colors
  ShSp: string,        // Shutter speed
  Ap: number,          // Aperture
  FL: number,          // Focal length
  Aspect: number,      // Aspect ratio
  Keywords: string[]   // Tags for categorization
}
```

### Routing Structure

- `/` - Homepage with animated photo galleries
- `/about` - About the photographer
- `/photoseries` - Gallery of all photo series
- `/photoseries/[Route]` - Individual photo series page (dynamic route)
- `/price` - Pricing information
- `/reviews` - Client reviews
- `/blog` - Blog section
- `/admin` - Admin interface
- `/inf` - Additional info page
- `/sitemap.xml` - Generated sitemap

### State Management

Global stores in `src/lib/store.js`:
- `progress` - Tweened progress indicator
- `photoseries` - Photo series data
- `wWidth/wHeight` - Window dimensions
- `showPrelader` - Preloader visibility
- Animation-related flags: `eventAnimation`, `homePageState`, `inrtoAnimationStart`, etc.

### Important Implementation Details

1. **Mobile Viewport Fix**: Custom `--vh` CSS variable is set in `+layout.svelte` to handle mobile browser viewport issues

2. **Analytics**: Yandex.Metrika (ID: 47422762) and Cloudflare Analytics are only loaded in production

3. **Image Source**: Photos are loaded from external CDN at `https://img.svobodinaphoto.ru/`

4. **TypeScript/JavaScript Mix**: The codebase uses both `.ts` and `.js` files; stores and data files use JS, while type definitions and some utilities use TS

5. **CSS Variables**: Main font size uses fluid typography: `clamp(30px, 20px + 4.5vh, 90px)`

## Common Patterns

### Creating a New Page

1. Create `+page.svelte` in `src/routes/<route>/`
2. Add `+page.ts` or `+page.server.ts` for data loading
3. Use `export const prerender = true` for static generation
4. Access GSAP via context if animations are needed

### Adding Photo Series

Photo series are identified through keywords in the main data file:
- Add photos with `ph__<routename>` keyword
- Add `name__<Title>` keyword for the series title
- Mark one photo with `phcover` keyword for the cover image

### Working with Animations

- Import and register GSAP plugins from `src/lib/gsap/core.ts`
- Use `getContext('gsap')` to access `{ gsap, ScrollTrigger, smoother }`
- Clean up ScrollTriggers in `onDestroy()` lifecycle hooks
- Avoid re-registering GSAP plugins in individual components

## Deployment

The site is configured for static deployment on Netlify:
- Build command: `vite build`
- Publish directory: `build`
- API routes redirect to Netlify Functions (see `netlify.toml`)

## Dependencies to Note

- **GSAP 3.13**: Professional animation library (commercial license required)
- **Lenis**: Alternative smooth scroll library (currently imported but may not be actively used)
- **CurtainsJS**: WebGL library for image effects
- **justified-layout**: Photo gallery layout algorithm
- **scrolly-video**: Scroll-based video playback
