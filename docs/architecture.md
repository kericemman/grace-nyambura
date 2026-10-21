# Application architecture

The project is an npm-workspaces monorepo with a React/Vite client and CommonJS Express API. The client owns public and admin presentation. The API owns authorization, validation, publishing rules, integrations, and persistence.

## Directory responsibilities

- `client/src/app`: router and application providers.
- `client/src/components/layout`: shared site shell components with Tailwind utilities kept directly in their JSX.
- `client/src/components/ui`: narrowly scoped UI primitives with their visual rules visible directly in the component.
- `client/src/features`: domain modules such as articles, case studies, enquiries, authentication, media, and settings.
- `client/src/pages`: route-level composition, content, and page-specific design. A complex page may have its own `components` folder, ordered through an `index.js`; each section keeps its Tailwind design in its JSX file.
- `client/src/lib`: shared client utilities and API access.
- `server/src/routes`: route declarations only.
- `server/src/controllers`: HTTP translation and response handling.
- `server/src/services`: business rules and third-party integrations.
- `server/src/models`: Mongoose persistence models.
- `server/src/validation`: request schemas.
- `server/src/middleware`: authentication, authorization, CSRF, errors, and upload controls.
- `server/src/config`: environment and service initialization.

## API conventions

Versioned endpoints live below `/api/v1`. Successful single-resource responses use `{ data: ... }`; list responses use `{ data: [...], pagination: ... }`; failures use `{ error: { code, message, details? } }`. Public routes expose published and explicitly approved records only. Mutating admin routes require authenticated server-side authorization and CSRF protection. The public enquiry route is intentionally unauthenticated but is validated, rate-limited, and spam-protected.

## Rendering and SEO

React Router owns navigation and route composition. During the public-page phase, public marketing, article, and case-study routes will receive a Vite SSR/prerender entry so production builds emit crawlable HTML while retaining client hydration. Admin routes remain client-rendered and excluded from indexing. Route-level metadata, canonical URLs, structured data, sitemap generation, and robots directives are implemented alongside the public routes.

## Content states

Articles support draft, published, and archived states. Case studies support draft, published, and archived states plus a separate `publicationApproved` gate; publication requires both published status and approval. Testimonials require permission confirmation and published status. Media deletion checks references in published content. Public API queries encode these rules rather than relying on the client.

## Design-system decision

The supplied brand brief is the source of truth: Playfair Display, DM Sans, Twilight Blue, Soft Champagne Gold, Muted Emerald, Warm Ivory, and restrained editorial layouts. The generated UI guidance contributed spacing, focus visibility, touch targets, responsive checks, and reduced-motion handling. Its proposed liquid-glass style and alternate colors/fonts were rejected because they conflict with the brief.

`client/src/styles/index.css` is limited to font loading, theme tokens, document defaults, focus behavior, and reduced-motion support. Layout and presentation use Tailwind utilities directly in the page or component that renders them. This keeps page designs independent and makes the visual source for any section easy to find.

## Security boundary

Secrets remain server-only. Authentication will use short-lived JWT access sessions in secure HttpOnly cookies, refresh rotation, login throttling, explicit origin checks, and CSRF tokens for cookie-authenticated mutations. No public registration route will exist. Bootstrap admin provisioning will be idempotent and environment-driven.

