# Auth, Bookmarks & Favorites APIs — Frontend Integration Doc

Scope: user sign-in (e-mail + password) with profile picture and additional registration details, and the signed-in user's saved items (bookmarks, favorites).
Source of truth: `src/modules/auth/**`, `src/modules/user/**`, `src/validation/auth.validation.ts`, `src/validation/user.validation.ts`, `src/middlewares/*`, `src/utils/*`.
**8 endpoints documented.**

Companion doc: `docs/admin-event-apis.md` (admin event CRUD / ingestion / analytics + public event preview).

---

## 1. Base URL, Auth, Response Envelope

### 1.1 Base URL

| Piece | Value | Source |
|---|---|---|
| App mount | `/api/v1` | `app.use('/api/v1', routes)` — `src/index.ts:93` |
| Auth mount | `/auth` | `router.use("/auth", authRoutes)` — `src/routes/index.ts:11` |
| User routes (bookmarks/favorites) | mounted at `/` | `router.use("/", userRoutes)` — `src/routes/index.ts:12` |
| API base | `http://<host>:<port>/api/v1` | combined |
| Dev port | `8080` (current `.env`), `.env.example` ships `5000` | `.env:1`, `.env.example:8` |
| Swagger/Scalar UI | `GET /api-docs` (raw spec `GET /api-docs/swagger.json`) | `src/swagger/swaggerUi.ts` |

All paths below are relative to `https://api.example.com/api/v1` (replace host/port; the OpenAPI spec lists `https://api.kolkatadairy.ibartstech.com` as the production server).

### 1.2 Request rules

| Rule | Value | Source |
|---|---|---|
| Content type | `multipart/form-data` (when uploading avatar) or `application/json` | `src/modules/auth/index.ts`, `express.json()` |
| Auth header | `Authorization: Bearer <accessToken>` | `src/middlewares/isAuthenticated.middleware.ts:14-20` |
| Auth on auth endpoints | none (public) | `src/modules/auth/index.ts` (no middleware) |
| Auth on bookmarks/favorites | **required** on all 6 routes | `src/modules/user/index.ts:9-24` (`isAuthenticated` chained) |
| CORS | only these origins are allowed: `https://admin.kolkatadairy.ibartstech.com`, `http://web.kolkatadairy.ibartstech.com`, `http://localhost:3000` (`credentials: true`) | hardcoded allow-list — `src/config/app.config.ts:8-12`, `src/index.ts:66-71` |

### 1.3 Success envelope

Every success response (`ResponseHandler.send`, `src/utils/responseHandler.ts:19-30`):

```json
{
  "status": "success",
  "message": "<human message>",
  "data": { },
  "timestamp": "2026-10-07T10:15:04.512Z"
}
```

- `status` is `"success"` on every 2xx documented here.
- Status codes used by this section: **200** (login, lists, removes) and **201** (register, bookmark add, favorite add).

### 1.4 Error envelopes (four different shapes)

**a. AppError — `{ message, errorCode }`** (`src/middlewares/errorHandler.middleware.ts:61-66`) — the standard shape; covers every 401/404/409/500 thrown by the services:

```json
{ "message": "Email already exists", "errorCode": "AUTH_EMAIL_ALREADY_EXISTS" }
```

**b. Zod validation — 400** (`errorHandler.middleware.ts:8-19`) — has an extra `errors[]` array:

```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "entityType", "message": "entityType must be one of: event, category" },
    { "field": "limit", "message": "limit must be less than or equal to 50" }
  ],
  "errorCode": "VALIDATION_ERROR"
}
```

**c. Malformed JSON — 400** (`errorHandler.middleware.ts:30-33`) — **no `errorCode` key at all**:

```json
{ "message": "Invalid JSON format. Please check your request body." }
```

**d. Unhandled crash — 500** (`errorHandler.middleware.ts:68-71`) — uses `error`, not `errorCode`:

```json
{ "message": "Internal Server Error", "error": "<thrown message>" }
```

### 1.5 Common error codes

| HTTP | `errorCode` | `message` (exact) | Thrown by | Source |
|---|---|---|---|---|
| 401 | `ACCESS_UNAUTHORIZED` | `Access token missing` | no/absent `Authorization` header on any bookmark/favorite call | `isAuthenticated.middleware.ts:15-18` |
| 401 | `ACCESS_TOKEN_INVALID` | `Invalid access token` | malformed/failed access JWT | `src/utils/jwt.ts:42-47` |
| 401 | `ACCESS_TOKEN_EXPIRED` | `Access token expired` | expired access JWT | `src/utils/jwt.ts:36-41` |
| 401 | `INVALID_CREDENTIALS` | `Invalid email or password` | login with unknown e-mail, inactive account **or** wrong password | `auth.service.ts:76-89` |
| 409 | `AUTH_EMAIL_ALREADY_EXISTS` | `Email already exists` | register with an existing e-mail | `auth.service.ts:57-61`, `auth.repo.ts:70-75` |
| 400 | `VALIDATION_ERROR` | `Validation failed` (+ `errors[]`) | any Zod schema failure | `errorHandler.middleware.ts:8-19` |
| 404 | `RESOURCE_NOT_FOUND` | `Event not found` / `Category not found` / `Bookmark not found` / `Favorite not found` | target item not found | `entity.repo.ts`, `bookmark.repo.ts`, `favorite.repo.ts` |

---

## 2. Endpoint inventory — 8 endpoints

### Screen A — Sign up / Sign in (public, under `/api/v1/auth`)

| # | Method | Path | Auth | Success |
|---|---|---|---|---|
| 1 | POST | `/auth/register` | none | **201** `User registered successfully` |
| 2 | POST | `/auth/login` | none | **200** `Login successfully` |

### Screen B — Saved items (Bearer required, under `/api/v1`)

| # | Method | Path | Success |
|---|---|---|---|
| 3 | POST | `/bookmarks` | **201** `Bookmark added successfully` |
| 4 | GET | `/bookmarks?page&limit` | **200** `Bookmarks fetched successfully` |
| 5 | DELETE | `/bookmarks/:entityType/:entityId` | **200** `Bookmark removed successfully` |
| 6 | POST | `/favorites` | **201** `Favorite added successfully` |
| 7 | GET | `/favorites?page&limit` | **200** `Favorites fetched successfully` |
| 8 | DELETE | `/favorites/:entityType/:entityId` | **200** `Favorite removed successfully` |

Routes: `src/modules/auth/index.ts`, `src/modules/user/index.ts`. All 8 are present in the OpenAPI spec.

---

## 3. Auth endpoints

### 3.1 `POST /auth/register`

Accepts both `multipart/form-data` (when uploading a profile photo) and `application/json`.
Uploaded images are processed with Sharp, compressed into 400x400 WebP format, and saved under `uploads/users/`.

**Fields** (`registerSchema` — `src/validation/auth.validation.ts`):

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | ✅ | 1–100 chars, trimmed |
| `email` | string | ✅ | valid e-mail, max 150 chars, trimmed; stored lower-cased |
| `password` | string | ✅ | **min 6 chars**, trimmed |
| `profilePicture` | file or string URL | ❌ | Image file (JPEG, PNG, WEBP, max 5MB) or URL string |
| `phoneNumber` | string | ❌ | 5–20 chars (optional contact) |
| `userName` | string | ❌ | 2–50 chars (optional username) |
| `gender` | string | ❌ | optional gender |
| `age` | number | ❌ | optional age (1–120) |

```bash
# Example with JSON:
curl -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123","phoneNumber":"+919876543210"}'

# Example with Multipart (file upload):
curl -X POST "$BASE/auth/register" \
  -F "name=Jane Doe" \
  -F "email=jane@example.com" \
  -F "password=secret123" \
  -F "profilePicture=@avatar.png"
```

Response **201** (`AuthResponse`):

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": 7,
    "publicId": "KD-USR-8FK2ZQ",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "username": null,
    "role": "USER",
    "profilePicture": "uploads/users/users-jane-doe-171234567.webp",
    "age": null,
    "gender": null,
    "countryCode": null,
    "phoneNumber": "+919876543210",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "timestamp": "2026-10-07T10:15:04.512Z"
}
```

Errors:
| HTTP | Body |
|---|---|
| 400 | `{message, errors[], errorCode:"VALIDATION_ERROR"}` — bad/missing fields, password < 6 |
| 409 | `{"message":"Email already exists","errorCode":"AUTH_EMAIL_ALREADY_EXISTS"}` |

### 3.2 `POST /auth/login`

**Body** (`loginSchema`): `email` (valid) + `password` (min 6) — both ✅.

```bash
curl -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'
```

Response **200** `Login successfully` → `data` = `AuthResponse` (§3.1).

Errors:
| HTTP | Body | When |
|---|---|---|
| 400 | validation envelope | malformed body |
| 401 | `{"message":"Invalid email or password","errorCode":"INVALID_CREDENTIALS"}` | unknown e-mail, deactivated account, wrong password |

### 3.3 Token storage & attaching the token


**What to store:** only `data.accessToken` (JWT signed with `JWT_ACCESS_SECRET`; lifetime from `ACCESS_TOKEN_EXPIRES` — **current `.env`: `1d`**, `.env.example` ships `15m`, code fallback `1d` — `src/utils/jwt.ts:13-20`). `data.refreshToken` is also returned, but it is persisted **server-side only** (`auth.repo.ts:124-133`) and **there is no refresh endpoint in this API** — you cannot exchange it yet.

| Option | Pros | Cons |
|---|---|---|
| In-memory (module variable / state store) | XSS-safe-ish: not readable by injected scripts | lost on reload — user must re-auth (or you re-hydrate from a secure HttpOnly cookie later) |
| `localStorage` | survives reload | readable by any injected script (XSS); a stolen token = account until expiry |
| `sessionStorage` | per-tab, cleared on tab close | lost on reload; still XSS-readable |

Practical guidance: keep the token in memory + persist to `localStorage` only if your threat model accepts it (short `ACCESS_TOKEN_EXPIRES` mitigates). Never `console.log` tokens or API responses containing them — the JWT payload carries `userId`, `publicId`, `role`, `e-mail`.

**Attaching it** (`isAuthenticated.middleware.ts:13-20`):

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Handling 401** (order matters — check `errorCode`, not the message):

```ts
if (res.status === 401) {
  const { errorCode } = await res.json().catch(() => ({}));
  // ACCESS_TOKEN_EXPIRED / ACCESS_TOKEN_INVALID  → clear session, force re-login
  // ACCESS_UNAUTHORIZED                          → no token was sent (bug or logged-out state)
  // (no refresh endpoint exists — re-login is the only recovery)
}
```

---

## 4. Bookmarks

`entityType` is a strict enum — **`"event"` | `"category"`** (lower-case, exact) — `src/enums/engagement.enum.ts:1-4`. Anything else → 400. `entityId` is the target's **public id** (`event.eventId` like `EVT-MUL0KXZH-8520`, or `category.categoryId` like `CAT-DAIRY-001`), 1–100 chars (`user.validation.ts:4-17`).

### 4.1 `POST /bookmarks` — add (idempotent)

**Auth:** Bearer. **Body:**

| Field | Type | Required | Rules |
|---|---|---|---|
| `entityType` | enum | ✅ | `event` \| `category` |
| `entityId` | string | ✅ | 1–100 chars, trimmed (public id of the target) |

```bash
curl -X POST "$BASE/bookmarks" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"entityType":"event","entityId":"EVT-MUL0KXZH-8520"}'
```

Response **201** (`bookmark.controller.ts:24-34` → `bookmark.service.ts:12-16`):

```json
{
  "status": "success",
  "message": "Bookmark added successfully",
  "data": {
    "bookmark": {
      "id": 31,
      "userId": 7,
      "entityType": "event",
      "entityId": "EVT-MUL0KXZH-8520",
      "createdAt": "2026-10-07T10:20:00.000Z",
      "updatedAt": "2026-10-07T10:20:00.000Z"
    }
  },
  "timestamp": "2026-10-07T10:20:00.100Z"
}
```

- **Idempotent re-add:** a duplicate insert hits the unique index `(user_id, entity_type, entity_id)` and the repo then returns the **existing** row — still **201**, same `id` (`bookmark.repo.ts:20-34`). Safe to call on every toggle-on; you never get a 409.
- The target must exist **right now** — existence is checked first (`entity.repo.ts:15-34`). Draft/hidden/past events count as existing (only soft-deletes and missing rows 404).
- `userId` is echoed back — ignore it, the list is already scoped to the caller.

Errors: **400** validation (bad enum, empty/>100 `entityId`, malformed JSON), **401** (§1.5), **404** `{"message":"Event not found","errorCode":"RESOURCE_NOT_FOUND"}` (or `Category not found`) for an unknown/soft-deleted target — smoke-tested with `EVT-DOES-NOT-EXIST`.

### 4.2 `GET /bookmarks` — list

**Auth:** Bearer. **Query params** (`engagementListQuerySchema` — `user.validation.ts:23-35`):

| Param | Type | Default | Rules |
|---|---|---|---|
| `page` | int | `1` | ≥1 |
| `limit` | int | `20` | 1–**50** |

Ordering: `created_at DESC` (newest first) — `bookmark.repo.ts:67`.

```bash
curl -G "$BASE/bookmarks" -H "Authorization: Bearer $TOKEN" \
  --data-urlencode "page=1" --data-urlencode "limit=20"
```

Response **200** (`bookmark.service.ts:30-49`):

```json
{
  "status": "success",
  "message": "Bookmarks fetched successfully",
  "data": {
    "items": [
      {
        "id": 31,
        "userId": 7,
        "entityType": "event",
        "entityId": "EVT-MUL0KXZH-8520",
        "createdAt": "2026-10-07T10:20:00.000Z",
        "updatedAt": "2026-10-07T10:20:00.000Z",
        "entity": {
          "eventId": "EVT-MUL0KXZH-8520",
          "title": "Kolkata Literary Meet 2026",
          "imageUrl": "/uploads/events/kolkata-literary-meet-2026.webp",
          "startsAt": "2026-12-05T18:00:00.000Z",
          "endsAt": null,
          "venueName": "Victoria Memorial",
          "city": "Kolkata",
          "area": "Park Street",
          "category": "Literary",
          "priceMin": 0,
          "currency": "INR",
          "isFree": true,
          "status": "active"
        }
      },
      {
        "id": 30,
        "userId": 7,
        "entityType": "category",
        "entityId": "CAT-DAIRY-001",
        "createdAt": "2026-10-07T10:18:00.000Z",
        "updatedAt": "2026-10-07T10:18:00.000Z",
        "entity": {
          "categoryId": "CAT-DAIRY-001",
          "categoryName": "Dairy Products",
          "categorySlug": "dairy-products",
          "categoryIcon": "uploads/categories/categories-dairy-products.webp",
          "isActive": true
        }
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 2, "totalPages": 1 }
  },
  "timestamp": "2026-10-07T10:25:00.100Z"
}
```

**The hydrated `item.entity` contract** (`src/modules/user/repositories/entity.repo.ts:36-109`, types in `src/modules/user/types/engagement.type.ts:19-54`):

| `item.entityType` | `item.entity` shape | Notes |
|---|---|---|
| `event` | `{ eventId, title, imageUrl, startsAt, endsAt, venueName, city, area, category, priceMin, currency, isFree, status }` | **13 fields only** — no `description`, geo, `source`, `ticketUrl`, `sourceLabel`. `priceMin` is coerced to a JS number. |
| `category` | `{ categoryId, categoryName, categorySlug, categoryIcon, isActive }` | **5 fields only** — no `description`, `createdAt`. |
| either | **`null`** | the target row was **soft-deleted** (both models are `paranoid: true` — `event.model.ts:347`, `category.model.ts:95` — so deleted rows never hydrate) |

- There is **no discriminator wrapper** inside `entity` — use `item.entityType` to know which shape you got (`engagement.type.ts:50-54`).
- Hydration does **not** filter by `status`/`isActive`: a `draft`/`hidden` event still hydrates — read `entity.status` if your UI must gate it.
- The bookmark/favorite **row itself is never auto-pruned** when the target dies → `entity: null` rows accumulate; offer a "remove" affordance.
- `pagination` lives inside `data` (same convention as the admin doc): `totalPages = ceil(total / limit)`; an out-of-range page → **200 with `items: []`** (not an error).

Errors: **400** (`limit` > 50, non-integer `page`), **401** (guest → `ACCESS_UNAUTHORIZED`).

### 4.3 `DELETE /bookmarks/:entityType/:entityId` — remove

**Auth:** Bearer. Path params validated with the **same** `bookmarkRefSchema` as the body (bookmark.controller.ts:36-47) — an invalid `entityType` in the path is a **400**, not a 404.

```bash
curl -X DELETE "$BASE/bookmarks/event/EVT-MUL0KXZH-8520" \
  -H "Authorization: Bearer $TOKEN"
```

Response **200** (`bookmark.service.ts:18-28`):

```json
{
  "status": "success",
  "message": "Bookmark removed successfully",
  "data": { "removed": true, "entityType": "event", "entityId": "EVT-MUL0KXZH-8520" },
  "timestamp": "2026-10-07T10:30:00.100Z"
}
```

Errors: **404** `{"message":"Bookmark not found","errorCode":"RESOURCE_NOT_FOUND"}` when you never added it or already removed it (second delete → 404, smoke-tested); **401**; **400** invalid path enum.

> Remove does **not** check whether the target entity still exists — you can always clean up a stale row.

---

## 5. Favorites

Byte-for-byte the same contract as §4 (same validation, same idempotency, same hydration, same status codes), only the messages/`data` key differ. Source: `src/modules/user/controllers/favorite.controller.ts`, `src/modules/user/services/favorite.service.ts`, `src/modules/user/repositories/favorite.repo.ts`.

| # | Method | Path | Success body differences vs bookmarks |
|---|---|---|---|
| 9 | POST | `/favorites` | 201 `Favorite added successfully`, `data.favorite = {id, userId, entityType, entityId, createdAt, updatedAt}` |
| 10 | GET | `/favorites?page&limit` | 200 `Favorites fetched successfully`, `data.items[].entity` same hydration rules (incl. `null` for deleted targets) |
| 11 | DELETE | `/favorites/:entityType/:entityId` | 200 `Favorite removed successfully`, `data = {removed:true, entityType, entityId}`; 404 message is **`Favorite not found`** |

```bash
# add  → 201 (idempotent)
curl -X POST "$BASE/favorites" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"entityType":"category","entityId":"CAT-DAIRY-001"}'

# list → 200
curl -G "$BASE/favorites" -H "Authorization: Bearer $TOKEN" --data-urlencode "limit=50"

# remove → 200 / 404
curl -X DELETE "$BASE/favorites/category/CAT-DAIRY-001" -H "Authorization: Bearer $TOKEN"
```

Bookmarks and favorites are **independent** — bookmarking does not favorite and vice-versa (separate tables, `bookmark.model.ts` / `favorite.model.ts`), each with its own unique `(user_id, entity_type, entity_id)` index.

---

## 6. Copy-paste ready snippets (TypeScript)

No frontend stack exists in this repo (backend-only), so the snippets below are framework-agnostic `fetch` + a drop-in `axios` variant. Copy into e.g. `src/api/client.ts`.

### 6.1 Shared client (fetch)

```ts
// src/api/client.ts
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    public errorCode: string | null,
    message: string,
    public errors?: { field: string; message: string }[],
  ) {
    super(message);
  }
}

// Swap these for your store (Redux/Zustand/Pinia). Memory-first, localStorage optional.
let accessToken: string | null = null;
export const setToken = (t: string | null) => { accessToken = t; };
export const getToken = () => accessToken;

export async function api<T = unknown>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (init.auth !== false && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const body = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const err = new ApiError(
      res.status,
      body?.errorCode ?? null,
      body?.message ?? `HTTP ${res.status}`,
      body?.errors,
    );
    if (res.status === 401) {
      // No refresh endpoint exists → clear session and send the user to sign-in.
      setToken(null);
    }
    throw err;
  }
  return body?.data as T; // envelope: { status, message, data, timestamp }
}
```

### 6.2 Auth endpoints

```ts
// ---- types (src/modules/auth/types/auth.type.ts) ----
export interface AuthUser {
  id: number; publicId: string; name: string; email: string;
  username: string | null; role: string; profilePicture: string | null;
  age: number | null; gender: string | null;
  countryCode: string | null; phoneNumber: string | null;
}
export interface AuthResponse extends AuthUser {
  accessToken: string; refreshToken: string; // store accessToken only
}

// 1) POST /auth/register  → 201
export const register = (input: { name: string; email: string; password: string }) =>
  api<AuthResponse>("/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });

// 2) POST /auth/login  → 200
export const login = async (email: string, password: string) => {
  const data = await api<AuthResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
  setToken(data.accessToken);
  return data;
};

// 3) POST /auth/google  → 200   (idToken from the Firebase web SDK)
export const signInWithGoogle = async (idToken: string) => {
  const data = await api<AuthResponse>("/auth/google", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ idToken }),
  });
  setToken(data.accessToken);
  return data;
};
// usage: const cred = await signInWithPopup(auth, new GoogleAuthProvider());
//        const idToken = await cred.user.getIdToken();   // fresh, ~1 h TTL

// 4) POST /auth/magic-link/request  → 200 (rate-limited: 5/IP/15 min → 429)
export const requestMagicLink = (email: string) =>
  api<{ email: string; expiresInSeconds: number }>("/auth/magic-link/request", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email }),
  });

// 5) POST /auth/magic-link/verify  → 200  (single use — replay → 401)
export const verifyMagicLink = async (token: string) => {
  const data = await api<AuthResponse>("/auth/magic-link/verify", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ token }),
  });
  setToken(data.accessToken);
  // strip the one-time credential from the address bar:
  window.history.replaceState({}, "", window.location.pathname);
  return data;
};

// error handling anywhere:
try {
  await login("jane@example.com", "wrong");
} catch (e) {
  if (e instanceof ApiError) {
    // e.status === 401 && e.errorCode === "INVALID_CREDENTIALS" → wrong password
    // e.status === 409 && e.errorCode === "AUTH_EMAIL_ALREADY_EXISTS" → duplicate
    // e.status === 400 → e.errors[] holds per-field messages
  }
}
```

### 6.3 Bookmarks & favorites

```ts
export type EntityType = "event" | "category";

export interface HydratedEvent {
  eventId: string; title: string; imageUrl: string | null;
  startsAt: string; endsAt: string | null; venueName: string;
  city: string; area: string | null; category: string | null;
  priceMin: number; currency: string; isFree: boolean; status: string;
}
export interface HydratedCategory {
  categoryId: string; categoryName: string; categorySlug: string;
  categoryIcon: string | null; isActive: boolean;
}
export interface EngagementRecord {
  id: number; userId: number;
  entityType: EntityType; entityId: string;
  createdAt: string; updatedAt: string;
}
export interface EngagementItem extends EngagementRecord {
  entity: HydratedEvent | HydratedCategory | null; // null = target deleted
}
export interface EngagementList {
  items: EngagementItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

// ---- bookmarks ----
export const addBookmark = (entityType: EntityType, entityId: string) =>
  api<{ bookmark: EngagementRecord }>("/bookmarks", {
    method: "POST",
    body: JSON.stringify({ entityType, entityId }),
  }); // 201 — safe to repeat (idempotent)

export const listBookmarks = (page = 1, limit = 20) =>
  api<EngagementList>(`/bookmarks?page=${page}&limit=${limit}`); // 200

export const removeBookmark = (entityType: EntityType, entityId: string) =>
  api<{ removed: boolean; entityType: string; entityId: string }>(
    `/bookmarks/${entityType}/${encodeURIComponent(entityId)}`,
    { method: "DELETE" },
  ); // 200 — repeat → 404 (handle gracefully)

// ---- favorites (identical) ----
export const addFavorite = (entityType: EntityType, entityId: string) =>
  api<{ favorite: EngagementRecord }>("/favorites", {
    method: "POST",
    body: JSON.stringify({ entityType, entityId }),
  });

export const listFavorites = (page = 1, limit = 20) =>
  api<EngagementList>(`/favorites?page=${page}&limit=${limit}`);

export const removeFavorite = (entityType: EntityType, entityId: string) =>
  api<{ removed: boolean; entityType: string; entityId: string }>(
    `/favorites/${entityType}/${encodeURIComponent(entityId)}`,
    { method: "DELETE" },
  );

// rendering a row that may have lost its target:
//   item.entity ? renderCard(item.entity, item.entityType) : renderOrphanRow(item)
```

### 6.4 Axios variant (interceptor-based 401 handling)

```ts
import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // or your store
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res.data.data, // unwrap { status, message, data, timestamp }
  (error) => {
    const status = error.response?.status;
    const { message, errorCode, errors } = error.response?.data ?? {};
    if (status === 401 && ["ACCESS_TOKEN_EXPIRED", "ACCESS_TOKEN_INVALID"].includes(errorCode)) {
      localStorage.removeItem("accessToken");
      window.location.assign("/login"); // no refresh endpoint → re-login
    }
    throw new ApiError(status ?? 0, errorCode ?? null, message ?? "Network error", errors);
  },
);

// then: await http.post("/auth/login", { email, password })  → AuthResponse
//       await http.get("/bookmarks", { params: { page: 1, limit: 20 } })
```

---

## 7. Environment variables

### 7.1 Frontend (safe to ship to the browser)

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_BASE_URL` (or `NEXT_PUBLIC_API_BASE_URL` / `REACT_APP_API_BASE_URL`) | API root incl. `/api/v1` | `https://api.kolkatadairy.ibartstech.com/api/v1` |
| `VITE_FIREBASE_API_KEY` | Firebase web app config | `AIzaSy…` (public by design) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase web app config | `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase web app config | `<project-id>` |
| `VITE_FIREBASE_APP_ID` | Firebase web app config | `1:123…:web:abc…` |
| `VITE_FIREBASE_MEASUREMENT_ID` | optional (Analytics) | `G-XXXXXXX` |

Firebase **web** config keys are not secrets — protect the project with *Firebase → Authentication → Settings → Authorized domains* and Firestore/RTDB rules instead.

Frontend routes your backend must be able to reach:
- **Magic-link redirect** — the URL in the e-mail (`MAGIC_LINK_REDIRECT_URL`, backend `.env`, default `http://localhost:3000/auth/magic-link`). That page must read `?token=` and call §3.5.
- **CORS allow-list** — the app must be served from one of the three origins in §1.2 (currently `http://localhost:3000` in dev).

### 7.2 Backend-only — NEVER expose to the client

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key — sends every e-mail incl. magic links |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP fallback (used only when Resend key absent) |
| `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`, `MAIL_FROM` | sender identity |
| `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_JSON`, `FIREBASE_SERVICE_ACCOUNT_BASE64` | Firebase **Admin** credentials (service account) — server-side ID-token verification only |
| `MAGIC_LINK_SECRET`, `MAGIC_LINK_REDIRECT_URL`, `MAGIC_LINK_EXPIRES_MINUTES`, `MAGIC_LINK_RATE_LIMIT_MAX`, `MAGIC_LINK_RATE_LIMIT_WINDOW_MIN` | magic-link signing/expiry/rate-limit |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_EXPIRES`, `REFRESH_TOKEN_EXPIRES`, `SESSION_SECRET` | token signing & lifetimes |
| `DATABASE_*`, `ADMIN_*`, `TICKETMASTER_API_KEY`, `ANALYTICS_HASH_SALT`, other `*_API_KEY` | infra / integrations |

> Rules: backend secrets live only in the server `.env` (git-ignored, `RESEND_API_KEY`/service-account marked "NEVER commit" in `.env.example:39,51`). The client bundle must contain **only** §7.1 values. Never forward the backend's `RESEND_API_KEY`, service account, or JWT secrets to the browser, and never log them.

---

## 8. Edge cases & gotchas

1. **Guest → 401 on everything in §4/§5.** No `Authorization` header → `401 {"message":"Access token missing","errorCode":"ACCESS_UNAUTHORIZED"}`. `cookie-session` exists but plays **no part** in API auth — a browser cookie will not authenticate these calls.
2. **Two "no token" vs "bad token" codes.** Missing header → `ACCESS_UNAUTHORIZED`; malformed JWT → `ACCESS_TOKEN_INVALID`; expired JWT → `ACCESS_TOKEN_EXPIRED`. Clear the session on all three (no refresh endpoint exists).
3. **Magic link is single-use *and* time-limited.** First successful verify consumes it atomically; replay → `401 AUTH_TOKEN_NOT_FOUND` (`Magic link was already used`). Expired (JWT or DB row) → `401 AUTH_TOKEN_EXPIRED`. Two tabs racing → exactly one wins.
4. **Requesting a new link does NOT revoke older ones.** Each request mints a fresh token+row; previous links stay valid until their own expiry. Keep `MAGIC_LINK_EXPIRES_MINUTES` short (5–60, default 20) and tell users to use the newest e-mail.
5. **Magic-link request never reveals account existence** — always 200 with the same body; unknown addresses still receive a link and get an account created on verify. Do not build "no account found" UI.
6. **Rate limit only on the request endpoint** — 5 / IP / 15 min (configurable) → `429 AUTH_TOO_MANY_ATTEMPTS` with standard `RateLimit-*` headers. `verify` is *not* rate-limited (it is protected by single-use + signature). **Only this one endpoint is rate-limited — the other 10 (including `verify`) have none.**
7. **Deleted target ⇒ `entity: null`, row stays.** Lists keep bookmark/favorite rows whose event/category was soft-deleted; render a placeholder + a remove button. Conversely **add** requires the target to exist *now* (404).
8. **Idempotency:** add → always **201** (existing row returned unchanged, same `id`); remove → **200** first time, **404** on repeat. Never treat a 409 as a normal outcome — it never happens here.
9. **`entityType` is case-sensitive** (`event`/`category`) in **both** body and URL path — `Event` or `banana` → 400 `VALIDATION_ERROR`, not 404. Same for `limit > 50` → 400.
10. **Four error shapes** (§1.4): note the 400-invalid-JSON body has **no `errorCode`**, and the crash-500 uses `error` not `errorCode`. Write the parser once, defensively.
11. **Hydrated `entity` is a slim projection** (13 event fields / 5 category fields) — not the full public event payload. If your card needs `description`/`sourceLabel`/geo, fetch the public event endpoint separately (see `docs/admin-event-apis.md` §4.5).
12. **Hydration ignores `status`/`isActive`** — a bookmarked `draft`/`hidden` event still hydrates; gate the UI on `entity.status` if needed.
13. **CORS origin is hardcoded** (§1.2) — a dev server on `localhost:5173`/`3001` will fail preflight until the allow-list (`src/config/app.config.ts:8-12`) is extended. `.env FRONTEND_ORIGIN` is ignored.
14. **Google flow specifics:** e-mail must be **verified** in Firebase or you get 401 `AUTH_INVALID_TOKEN`; expired Firebase token → 401 `AUTH_TOKEN_EXPIRED` (force-refresh `getIdToken(true)` and retry once); backend not configured → 500 `AUTH_PROVIDER_NOT_CONFIGURED` (dev-only condition).
15. **`refreshToken` is a dead end for now** — returned on every auth response and stored server-side, but there is no refresh route. Plan sessions around `ACCESS_TOKEN_EXPIRES` (current deployment: `1d`) and re-login on 401.
16. **Don't log tokens or auth responses** — the access JWT payload contains `userId`/`publicId`/`role`/e-mail; the magic-link `?token=` is a one-time credential (strip it from the URL after verify).
17. **`id`/`userId` are `BIGINT` columns** serialized as JSON numbers — fine at current scale; keep them numeric (or normalize to string) consistently in your state.
18. **Mail outages surface as 500 on the request endpoint** (`INTERNAL_SERVER_ERROR`, `Could not send the sign-in link…`) — show "try again later", do not treat it as user error. In dev without Resend/SMTP the link is printed to the server console instead (the smoke test reads it from there).

---

## 9. Swagger vs actual behaviour (discrepancies found while verifying)

The OpenAPI spec (tags `Auth`, `Bookmarks`, `Favorites` — 11 operations) matches the controllers on paths, methods, status codes and the idempotent/single-use semantics. Differences worth knowing:

1. **`data` schema for auth responses refs `AdminUser`** (`auth.docs.ts` ×5 → `swaggerOptions.ts:89-115`): the real payload also includes **`countryCode`**, and `role` is documented as `enum: ["ADMIN"]` although app sign-ups return **`"USER"`**. Trust this doc / the source type `AuthResponse`.
2. **`ValidationErrorResponse` schema omits the `errors[]` array** that every 400 actually returns (`{field, message}` per issue) — `swaggerOptions.ts:161-167` vs `errorHandler.middleware.ts:14-18`.
3. **`UnauthorizedResponse` example `errorCode: "UNAUTHORIZED"`** (`swaggerOptions.ts:172-174`) is not a real code — real values are `ACCESS_UNAUTHORIZED` / `ACCESS_TOKEN_INVALID` / `ACCESS_TOKEN_EXPIRED` / `INVALID_CREDENTIALS` / `AUTH_*` (§1.5).
4. **The Google 500 response refs `ErrorResponse`** (an envelope with `status`/`timestamp`, `swaggerOptions.ts:130-141`), but the actual 500 is the bare AppError shape `{message, errorCode:"AUTH_PROVIDER_NOT_CONFIGURED"}`.
5. **Bookmark/Favorite `DELETE` omits a documented 400** — an invalid `entityType` in the path *does* return 400 validation (schema parsed from path params, `bookmark.controller.ts:37-40`).
6. **List item schema omits `userId`, `createdAt`, `updatedAt`** — present on every real row (`bookmark.repo.ts` / `favorite.repo` return the full model).
7. **Magic-link request doc says "5 requests per IP per 15 minutes by default"** — accurate for the defaults (`auth.docs.ts:162`), but both values are env-configurable (`MAGIC_LINK_RATE_LIMIT_*`).
8. Swagger `servers` lists dev as `http://localhost:8080` (`swaggerOptions.ts:22-26`) while `.env.example` defaults `PORT=5000` — the current `.env` does run **8080**; read `PORT` from your environment rather than assuming.

Cross-checks performed: every status code, message and `errorCode` in this doc was traced to its throw site, and the documented behaviours (register 201, duplicate 409 `AUTH_EMAIL_ALREADY_EXISTS`, wrong password 401, guest list 401, add/re-add 201, hydrated list 200, unknown entity 404, delete 200 → repeat 404, invalid enum 400, magic-link request 200 / verify 200 / replay 401 / garbage 401, google 401-or-500) match `scripts/smoke-test.mjs:444-607`.
