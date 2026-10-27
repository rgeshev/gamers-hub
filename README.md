# Gamers Hub

A React SPA where players start discussion topics about games, read replies, and comment. Data and auth live on **Supabase** (Option A: BaaS). The frontend is a Vite production build; reviewers should use the live URL below, not localhost.

**Live app:** https://gamers-hub.roskata-geshev19.workers.dev/

**Backend:** hosted Supabase project (`rest/v1` + `auth/v1`). Nothing else to deploy. Data persists between visits.

## How to run locally

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_API_KEY=your_supabase_publishable_key
```

Start the app:

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/`).

Production build:

```bash
npm run build
npm run preview
```

---

# Functional Guide

## 1. Project Overview

**Application Name:** Gamers Hub

**Application Category / Topic:** Discussion Forum (gaming)

**Main Purpose:**  
Gamers Hub is a place to ask for help, share tips, and find people to play with. Guests can browse topics and read comments. Registered users can start topics, edit or delete their own posts, and add comments. The app solves the need for a simple, persistent game-talk board instead of a static HTML template.

## 2. User Access & Permissions

### Guest (Not Authenticated)

**Available pages / routes:**

- `/` — Home (welcome + latest 3 topics)
- `/catalog` — Catalog (all topics)
- `/topic-details/:topicId` — Topic details and comments (read-only)
- `/login`, `/register`

Guests **cannot** open `/create`, `/edit/:topicId`, or `/logout` (AuthGuard sends them to `/login`).

**Public data shown:** topic list (title, platform, category, content), topic details (author username, date, body), and the comments list. Header shows Catalog, Login, Register.

### Authenticated User

**Main sections / pages:** Home, Catalog, Add Topic (`/create`), topic details, Edit (`/edit/:topicId`), Logout. Header shows Catalog, Add Topic, `Hi, {username}`, Logout. Login/Register are hidden (GuestGuard redirects to `/`).

**Details pages:** same topic + comments view. Logged-in users get the comment form.

**Create / Edit / Delete:**

- Create a topic (`/create`) — any logged-in user
- Edit / Delete — **only the author** (`author_id` matches the logged-in user id). Other users do not see those buttons. Opening another user’s edit URL redirects back to details.

## 3. Authentication & Session Handling

### Authentication Flow

1. **App load:** `AuthContextProvider` wraps the tree in `main.jsx`. `usePersistedState('user')` reads `localStorage`. If a `refreshToken` exists, the app calls Supabase `POST /token?grant_type=refresh_token` and rebuilds the session. If refresh fails, the stored user is cleared.
2. **Auth status:** `isAuthenticated` is `Boolean(user?.accessToken)`. Header, guards, and details use `useAuthContext()`.
3. **Login:** `POST /auth/v1/token?grant_type=password`. On success, user + tokens are saved, a `profiles` row is ensured, then navigate to `/`.
4. **Register:** `POST /auth/v1/signup` with `{ email, password, data: { username } }`. Same session completion + profile create. If email confirmation is required and there is no `access_token`, the UI shows that the user must confirm email and log in.
5. **Logout:** `POST /auth/v1/logout`, then clear `localStorage` and redirect to `/`.

### Session Persistence

- Stored in **React Context** (`AuthContext`) and **`localStorage` key `user`** (JSON: id, email, username, accessToken, refreshToken, authorId).
- Custom hook `usePersistedState` keeps Context and `localStorage` in sync.
- After refresh, the stored user is restored immediately; the refresh-token request updates tokens if still valid.
- REST calls send `Authorization: Bearer {accessToken}` from that stored user (`src/utils/request.js`).

## 4. Routing Structure

### Route Guards Logic

- **AuthGuard** (`Outlet`): `/create`, `/edit/:topicId`, `/logout` — guests → `/login`.
- **GuestGuard** (`Outlet`): `/login`, `/register` — logged-in users → `/`.
- Public: `/`, `/catalog`, `/topic-details/:topicId`.

### Main Routes

Eight top-level routes:

| Path | Page |
|---|---|
| `/` | Home |
| `/catalog` | Catalog |
| `/topic-details/:topicId` | Topic details |
| `/create` | Create topic (private) |
| `/edit/:topicId` | Edit topic (private) |
| `/login` | Login (guest-only) |
| `/register` | Register (guest-only) |
| `/logout` | Logout (private) |

### Nested & Parameterized Routes

- Nested layout routes: `AuthGuard` and `GuestGuard` wrap child routes via `<Outlet />`.
- URL params: `/topic-details/:topicId`, `/edit/:topicId` (`useParams().topicId`).

## 5. List → Details Flow

### Catalog / List Page

- Fetches `GET /topics?order=created_at.desc` and renders `TopicCard` for each row (title, platform, category, content).
- Filter/search/sort controls are **visible but not wired** (UI only). List order is newest first from the API.
- Empty state: “No topics match your filters…” when the request succeeds with no rows. Loading and error banners while fetching.

### Details Page

- Each card is a `<Link to={`/topic-details/${id}`}>`.
- `topicId` comes from the route. The page loads `GET /topics?id=eq.{id}&select=*,profiles!author_id(username)` and comments for that id.
- Tags show the topic’s real `platform` and `category`. Platform CSS class is mapped (`PlayStation` → `ps`, etc.).

## 6. Data Source & Backend

**Backend type:** real BaaS — **Supabase**.

- Auth: GoTrue (`/auth/v1/signup`, `/token`, `/logout`)
- Data: PostgREST (`/rest/v1/topics`, `/comments`, `/profiles`)
- Frontend talks to it through `src/utils/request.js` and `src/api/*` (not a custom Node server).

Collections: `topics` (main CRUD), `comments` (create + read), `profiles` (username for `author_id`).

## 7. Data Operations (CRUD)

Main collection: **topics** (not users).

### Create (POST)

Logged-in user fills `/create` and submits. The app POSTs `/topics` with `title`, `game_title`, `platform`, `category`, `content`, optional `image_url`, and `author_id` (current user). Then it navigates to `/catalog`.

### Read (GET)

- Home: latest 3 topics
- Catalog: all topics, newest first
- Details / Edit: one topic by id
- Comments: `GET /comments?topic_id=eq.{id}&select=*,profiles(username)`

### Update (PUT)

Author opens Edit, form is prefilled, PUT `/topics?id=eq.{topicId}` with the editable fields + `author_id`. Then navigate to `/topic-details/:topicId` so the user sees the updated record.

### Delete

Author clicks Delete on details. `DELETE /topics?id=eq.{topicId}`, then navigate to `/catalog`. Errors show on the details page.

**Ownership:** Edit/Delete UI and the edit load check `author_id ===` logged-in user id.

**Extra interaction:** logged-in users **comment** (POST `/comments`). There is no Like API; the stub Like button was removed.

## 8. Forms & Validation

### Forms Used

- Login
- Register
- Create topic
- Edit topic
- Add comment

All of these are **controlled** (`value` + `onChange`) with field errors under the input and a form-level error banner for API failures. Submit buttons disable and show a pending label.

### Validation Rules

- **Title** (create/edit): required, **5–100 characters**.
- **Email** (login/register): required, must match `name@domain`.
- **Password** (register): at least **6 characters**, and **Repeat password must match**.

Also validated: username ≥ 3 chars; game, platform, category required; content ≥ 20 chars; optional image must be `http(s)://…`; comment not empty and ≥ 2 chars.

## 9. React-Specific Techniques

### Hooks & Component Lifecycle

- `useState` — form values, loading/error flags, topic/comment lists
- `useEffect` — fetch on mount/update (catalog, home, details, edit, comments); logout on mount
- `useReducer` — comments list (`SET_COMMENTS`)
- `useContext` / `useAuthContext` — session
- `useParams`, `useNavigate` — routing
- `useCallback` — auth handlers
- Custom hook **`usePersistedState`** — session in `localStorage`

**Mount / update / unmount:** Home `useEffect` starts `AbortController`, fetches latest topics, and **aborts the request on unmount** so a fast navigation does not update an unmounted component. Catalog/details re-fetch when `topicId` / `refresh` changes (update).

### Context API

`AuthContext` shares `user`, `isAuthenticated`, `login`, `register`, `logout`. Consumers include Header, AuthGuard, GuestGuard, Login, Register, Logout, TopicCreate, TopicEdit, TopicDetails, CreateComment.

### Component Styling

External CSS in `public/styles/` (`style.css` imports typography, navigation, welcome, catalog, details, create-edit, login-register, comments). Linked from `index.html`. No CSS Modules.

### Architecture

```
src/
  api/           auth, topics, comments, profiles
  components/    pages, header, footer, guards, comments
  contexts/      AuthContext
  hooks/         usePersistedState
  utils/         request, validation, formatDate
  App.jsx        routes
```

## 10. Typical User Flow

1. Open Home, browse latest topics, go to Catalog.
2. Open a topic, read comments; guest is asked to log in to comment.
3. Register or log in; header switches to Add Topic / Hi, username / Logout.
4. Create a topic, then comment on it. Only that user can Edit or Delete it.

## 11. Error & Edge Case Handling

**Authentication errors:** invalid email/password, missing fields, password mismatch, signup rate limit / email confirmation — shown in the form (`alert-error` or field `error-text`), not `alert()`.

**Network / data errors:** failed GET/POST/PUT/DELETE set an on-page error banner (catalog, home, details, comments, create/edit). Delete keeps the user on details if it fails.

**Empty / missing data:** Home “No topics yet”; Catalog empty message; Details “Topic not found.”; Comments “No comments.”; loading states (“Loading topics…”, “Loading comments…”) so the empty message is not shown during fetch.

**Guards:** unknown/private URLs for guests go to login; logged-in users cannot stay on login/register.
