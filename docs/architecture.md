# VaidyaDesk Architecture & Delivery Tracker

## Mission

Digitize Panchakarma therapy management with a dual-portal platform that lets practitioners orchestrate treatments, resources, and feedback while guiding patients through personalized cleanse journeys with timely notifications and progress insights.

## High-Level Architecture

### Frontend (React · Vite · Tailwind)

- **Routing & Access Control:** React Router with protected routes keyed off `AuthContext`; role-aware dashboard layout selects practitioner vs patient shells.
- **State & Context:** Auth, notifications, and role-specific dashboard providers coordinate API data and refresh flows.
- **UI Composition:** Tailwind-based design system, chart components (planned), and reusable layout primitives shared across dashboards.
- **API Layer:** `services/api` wraps fetch helpers with token injection and centralized endpoint definitions.

### Backend (Node.js · Express · MongoDB)

- **Application Core:** `app.js` wires middleware, routing, and error handling; `server.js` manages bootstrapping with environment configuration.
- **Domain Services:** Feature-specific services (auth, scheduling, notifications, templates) encapsulate business rules and call repositories.
- **Data Access:** Mongoose models (`User`, `TherapyTemplate`, `Appointment`, `Resource`, `Feedback`) backed by repository helpers for complex queries.
- **Integrations:** Planned connectors for Twilio (SMS), SendGrid/Nodemailer (email), and cron-based notification jobs orchestrated under `jobs/` and `services/notificationService.js`.
- **Validation & Security:** Joi/Zod-style validators (in `validations/`), JWT auth middleware, and role guards securing practitioner-only routes.

### Shared Workspace

- **Constants & Types:** `shared/constants` for canonical role names, appointment statuses, notification channels; `shared/types` to house reusable API payload schemas.
- **Utilities:** Cross-cutting helpers (validators, date utilities) referenced by both frontend and backend builds.

### Supporting Infrastructure

- **Environment & Secrets:** `.env` / `.env.example` capture server ports, Mongo connection strings, JWT secrets, and external provider keys.
- **Tooling:** ESLint/Vitest (client) and Jest/Supertest (server) scaffolds for linting, unit, and integration coverage.
- **Tasks & Automation:** npm scripts for lint/build/test on both client and server; cron scheduler for automated notifications.

## System View

```mermaid
flowchart LR
	subgraph Client [Client (React App)]
		UI[Role-Aware Dashboards]
		Ctx[Context Providers]
		APIClient[API Layer]
	end

	subgraph Server [Server (Express)]
		Routes[REST Routes]
		Services[Domain Services]
		Repos[Repositories]
		Jobs[Cron / Notifications]
	end

	DB[(MongoDB)]
	External[(Twilio / SendGrid)]

	UI --> Ctx --> APIClient --> Routes
	Routes --> Services --> Repos --> DB
	Jobs --> Services
	Services --> External
```

## Delivery Phases & Status

| Phase | Focus | Status | Notes |
| --- | --- | --- | --- |
| Phase 0 – Foundation & Alignment | Repo scaffolding, environment setup, shared constants/types, lint/test tooling | ✅ **Complete (baseline)** | Folder skeleton established, env loader + config wired, lint/test scripts available. API spec evolving alongside implementation. |
| Phase 1 – Auth & Core Infrastructure | Auth endpoints, JWT middleware, login/register UI, protected routing | ✅ **Complete** | AuthController + middleware deployed; React AuthContext, login/register pages, and protected routes operational end-to-end. |
| Phase 2 – Scheduling Engine & Calendar UI | Templates, scheduling services, practitioner/patient dashboards | 🟡 **In Progress** | Scheduling service & repositories enhanced; practitioner dashboard live; patient portal shell + dashboard provider and overview page implemented. Calendar visualization pending. |
| Phase 3 – Notification & Feedback System | Multi-channel alerts, in-app notifications, feedback capture & charts | ⏳ **Not Started** | Integration scaffolds (jobs, notification service) exist; concrete channel wiring and UI components forthcoming. |

## Progress Log

| Date | Highlight |
| --- | --- |
| 2025-09-26 | Added patient dashboard provider, layout routing logic, and patient overview page to deliver role-specific dashboards. |
| 2025-09-20 | Extended scheduling service/controllers with patient-facing endpoints; introduced patient routes and guards. |
| 2025-09-15 | Brought practitioner dashboard online with context providers, scheduling widgets, and base layout. |
| 2025-09-05 | Completed auth flow: JWT issuance, middleware, frontend AuthContext, and protected routes. |
| 2025-08-28 | Repository initialized with shared constants/types, environment config, and base tooling for client/server workspaces. |

> _Maintain this log as features land. Reference `docs/api-spec.md` whenever payload shapes evolve._

## Upcoming Focus

- Complete practitioner calendar (Phase 2) and patient read-only schedule timelines.
- Integrate notification channels with Twilio and SendGrid, including retry/flag logic.
- Build feedback analytics dashboards (charts) for both practitioner and patient views.
- Harden API validation + error responses; expand integration test coverage across scheduling flows.

## Open Questions & Risks

- **Notification infrastructure:** Need clarity on provider credentials and rate limits for Twilio/SendGrid in deployment environments.
- **Scheduling constraints:** Define precise business rules for resource conflicts, prep/recovery windows, and patient availability ingestion.
- **Analytics requirements:** Confirm charting KPIs (e.g., detox progress metrics) to shape feedback data model extensions.

Keep this document updated as phases advance, noting deployment blockers and cross-team dependencies.
