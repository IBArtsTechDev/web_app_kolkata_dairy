# User Profile APIs — Frontend Integration Doc

Scope: user-side self-service PROFILE screens (view own profile, edit name/phone/avatar) plus the two auth endpoints every profile screen depends on (register, login).
Source of truth: `src/modules/user/index.ts`, `src/modules/user/controllers/profile.controller.ts`, `src/modules/user/services/profile.service.ts`, `src/modules/user/repositories/profile.repo.ts`, `src/modules/user/types/profile.type.ts`, `src/modules/user/docs/profile.docs.ts`, `src/validation/user.validation.ts`, `src/modules/auth/index.ts`, `src/modules/auth/controllers/auth.controller.ts`, `src/modules/auth/services/auth.service.ts`, `src/modules/auth/types/auth.type.ts`, `src/validation/auth.validation.ts`, `src/config/multer.config.ts`, `src/middlewares/isAuthenticated.middleware.ts`, `src/middlewares/errorHandler.middleware.ts`, `src/utils/*`.
**2 profile endpoints + 2 related auth endpoints documented.** No source file was modified to produce this doc.

---

## 1. Base URL, Auth, Response Envelope

### 1.1 Base URL

| Piece | Value | Source |
|---|---|---|
| App mount | `/api/v1` | ``app.use(`/api/v1`, routes)`` — `src/index.ts:97` |
| Auth mount | `/auth` | `router.use("/auth", authRoutes)` — `src/routes/index.ts:11` |
| User mount | `/` | `router.use("/", userRoutes)` — `src/routes/index.ts:12` |
| Profile base | `http://<host>:<port>/api/v1/profile` | combined |
| Static uploads | `http://<host>:<port>/uploads/...` | `app.use("/uploads", express.static(...))` — `src/index.ts:95` |

Default port is `5000` (`PORT` default — `src/config/app.config.ts:41`).

All paths below are relative to `https://api.example.com/api/v1` (replace host/port); in examples `BASE` = that origin.

### 1.2 Obtain a token — `POST /auth/login` (JSON, no auth)

| Field | Type | Required | Rules |
|---|---|---|---|
| `email` | string | ✅ | valid email, 1–255 chars, trimmed, lowercased server-side |
| `password` | string | ✅ | min 6 chars, trimmed |

```bash
curl -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul.sen@example.com","password":"secret123"}'
```

Response `data` is `AuthResponse = AuthUser + accessToken + refreshToken` (`src/modules/auth/types/auth.type.ts:20-37`, built by `issueAuthSession` — `src/modules/auth/services/auth.service.ts:31-49`):

```json
{
  "status": "success",
  "message": "Login successfully",
  "data": {
    "id": 7,
    "publicId": "KD-USR-7QX4MZ",
    "name": "Rahul Sen",
    "email": "rahul.sen@example.com",
    "username": "rahul_sen",
    "role": "USER",
    "profilePicture": "uploads/users/users-rahul-sen.webp",
    "age": 29,
    "gender": "Male",
    "countryCode": "+91",
    "phoneNumber": "9830012345",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2026-10-13T09:15:04.512Z"
}
```

Field-by-field construction: `formatAuthUser` — `src/modules/auth/services/auth.service.ts:17-29` (note the response key is **`username`**, mapped from the DB column `userName`).

**Store `data.accessToken` (JWT) — that is the only token sent on subsequent requests.** `refreshToken` is persisted server-side on the user row (`src/modules/auth/repositories/auth.repo.ts`); **there is no refresh endpoint under `/auth` in this module** — on `401 ACCESS_TOKEN_EXPIRED` / `ACCESS_TOKEN_INVALID`, force re-login.

Registration (`POST /auth/register`, §4.1) returns the **same shape plus tokens with HTTP 201** — treat it as a login.

### 1.3 Sending the token

Both profile routes are chained `isAuthenticated` only (`src/modules/user/index.ts:20-26`) — no `isAdmin` gate.

```http
Authorization: Bearer <accessToken>
```

| Condition | HTTP | Exact body |
|---|---|---|
| Header absent, or doesn't start with `Bearer ` | 401 | `{ "message": "Access token missing", "errorCode": "ACCESS_UNAUTHORIZED" }` — `src/middlewares/isAuthenticated.middleware.ts:14-19` |
| Token expired | 401 | `{ "message": "Access token expired", "errorCode": "ACCESS_TOKEN_EXPIRED" }` — `src/utils/jwt.ts:36-41` |
| Malformed / bad signature | 401 | `{ "message": "Invalid access token", "errorCode": "ACCESS_TOKEN_INVALID" }` — `src/utils/jwt.ts:42-47` |
| Verifier returns falsy (defensive branch) | 401 | `{ "message": "Invalid or expired token", "errorCode": "ACCESS_TOKEN_INVALID" }` — `src/middlewares/isAuthenticated.middleware.ts:24-29` |

- `accessToken` expiry comes from `.env` `ACCESS_TOKEN_EXPIRES` (this repo's `.env` sets `1d`, `.env.example` ships `15m`; the code falls back to `1d` — `src/utils/jwt.ts:16-18`). **Never hard-code a client-side expiry: always react to `401 ACCESS_TOKEN_EXPIRED`.**
- Branch on `errorCode`: `ACCESS_TOKEN_EXPIRED` is the "refresh/re-login" trigger; everything else → session dead.
- Any valid token (including an `ADMIN` one) resolves **its own** row — the response's `role` tells you who came back.

### 1.4 Response envelope

**Success** (HTTP 200/201; `ResponseHandler.send` — `src/utils/responseHandler.ts:19-29`):

```json
{
  "status": "success",
  "message": "<human message>",
  "data": { },
  "timestamp": "2026-10-13T09:15:04.512Z"
}
```

- `status` ∈ `"success"` | `"fail"` | `"error"`.
- Keys with `undefined` values (`data`, `meta`, `error`) are **omitted by JSON serialization** — parse defensively: `const data = payload.data`.
- `error` only carries a value when a detail is passed **and** `NODE_ENV !== "production"` — never depend on it.

**There are two (plus two) error shapes — none of them use the success envelope.** Source: `src/middlewares/errorHandler.middleware.ts` + `src/utils/appError.ts`.

(a) **Zod validation** → 400 (`errorHandler.middleware.ts:8-19`):

```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "phoneNumber", "message": "String must contain at least 5 character(s)" }
  ],
  "errorCode": "VALIDATION_ERROR"
}
```

(b) **Multer / file errors** → 400 (`errorHandler.middleware.ts:39-57`), `{message, errorCode}` with **no `errors` array**:

| Trigger | `message` |
|---|---|
| file > 5 MB | `File too large. Maximum allowed size is 5MB` |
| wrong file field name | `Unexpected file field in the request` |
| too many files / fields | `Too many files uploaded at once` / `Too many fields in the request` |
| disallowed MIME | `Invalid file type. Only JPEG, PNG, WEBP, SVG allowed.` |

All four carry `errorCode: "VALIDATION_ERROR"`.

(c) **Malformed JSON body** → 400 `{ "message": "Invalid JSON format. Please check your request body." }` (`errorHandler.middleware.ts:29-33`) — no `errorCode`.

(d) **AppError** (401 / 404 / 409 …) → bare `{ message, errorCode }`, no `status`/`data` (`errorHandler.middleware.ts:61-66`):

```json
{ "message": "User not found", "errorCode": "AUTH_USER_NOT_FOUND" }
```

**Frontend rule:** treat HTTP status as truth; read `message` from either the envelope or the bare `{message, errorCode}` / `{message, errors[], errorCode}` shapes.

---

## 2. Enums & Mappings (single reference)

### 2.1 `role`
`USER` | `ADMIN` — default `USER` on register (`src/modules/auth/services/auth.service.ts:75`, `src/models/user.model.ts:5-8`, `:119-123`). **Read-only on these endpoints**; a self-service profile always reports `"USER"`.

### 2.2 Updatable vs read-only profile columns

Source of truth: `updateProfileSchema` (`src/validation/user.validation.ts:29-50`) + repository whitelist comment (`src/modules/user/repositories/profile.repo.ts:10-22`).

| Column | Writable via `PATCH /profile`? | Notes |
|---|---|---|
| `name` | ✅ | NOT NULL — replaceable, never clearable (`profile.repo.ts:17`) |
| `profilePicture` | ✅ | path string or `null` |
| `phoneNumber` | ✅ | nullable |
| `countryCode` | ✅ | nullable |
| `email` | ❌ | login identifier + unique index — **stripped by zod AND unreachable at the repo whitelist** |
| `password`, `role`, `userName` (`username`), `age`, `gender` | ❌ | deliberately absent from schema + whitelist |

### 2.3 Profile image rules

Source: `src/config/multer.config.ts:12-19,40-44` (`userUpload`) + `src/utils/compressImage.ts` + `src/modules/user/controllers/profile.controller.ts:34-50`.

| Aspect | Value |
|---|---|
| multipart field name | **`profilePicture`** (`.single("profilePicture")`) |
| Max size | **5 MB** (`limits: { fileSize: 5 * 1024 * 1024 }`) |
| Allowed MIME | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` |
| Storage | memory buffer → sharp → `uploads/users/<slug>.webp` |
| Transform | 400×400, `fit: cover`, never upscaled, webp `quality: 80` |
| Returned value | **relative path**, e.g. `uploads/users/users-rahul-sen.webp` (no leading `/` — `path.join("uploads", "users")` in `src/utils/compressImage.ts:28,37,54`) |
| Filename slug | `req.body.name ?? req.user.publicId`, lowercased, spaces→`-`, non `[a-z0-9-]` stripped — so `name: "Rahul Sen"` → `uploads/users/users-rahul-sen.webp` |

Uploaded files are served by `app.use("/uploads", express.static(...))` — `src/index.ts:95`.

### 2.4 Error codes you will see here

| `errorCode` | HTTP | Meaning |
|---|---|---|
| `ACCESS_UNAUTHORIZED` | 401 | no / non-Bearer `Authorization` header |
| `ACCESS_TOKEN_EXPIRED` | 401 | token past expiry → re-login |
| `ACCESS_TOKEN_INVALID` | 401 | malformed / bad signature |
| `VALIDATION_ERROR` | 400 (also 409 default) | zod, multer, file-type, Sequelize validation; **default code of `ConflictException`** (`src/utils/appError.ts:70-77`) |
| `AUTH_USER_NOT_FOUND` | 404 | `userId` in token has no row |
| `AUTH_EMAIL_ALREADY_EXISTS` | 409 | register with taken email/userName |
| `INVALID_CREDENTIALS` | 401 | bad login email/password, or inactive account |

Full list: `src/enums/error-code.enum.ts`.

---

## 3. Screen Inventory

### Screen A — Onboarding / auth (no auth required)

| # | Method | Path (under `/api/v1`) | Purpose |
|---|---|---|---|
| 1 | POST | `/auth/register` | multipart signup (optional avatar) → 201 + tokens |
| 2 | POST | `/auth/login` | JSON signin → 200 + tokens |

Also exists (out of scope, one line): the forgot-password trio `POST /auth/forgot-password/request` | `/verify` | `/reset` — `src/modules/auth/index.ts:16-30`, rate-limited via `forgotPasswordLimiter`.

### Screen B — Profile (authenticated)

| # | Method | Path (under `/api/v1`) | Auth | Purpose |
|---|---|---|---|---|
| 3 | GET | `/profile` | Bearer | read own profile → `data.user` |
| 4 | PATCH | `/profile` | Bearer + optional `profilePicture` file | partial update → fresh `data.user` |

---

## 4. Endpoint Reference

### 4.1 `POST /auth/register`

- **Auth:** none. **Content-Type:** `multipart/form-data` when attaching an image, `application/json` otherwise (both are parsed — `src/index.ts:35-36` + multer skips non-multipart).
- **File field:** `profilePicture` (optional) — same `userUpload` rules as §2.3; compressed to 400×400 webp **before** zod parsing (`src/modules/auth/controllers/auth.controller.ts:18-35`).

**Body fields** (`registerSchema` — `src/validation/auth.validation.ts:19-29`):

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | ✅ | 1–100, trimmed (model additionally enforces 2–100 — `src/models/user.model.ts:97-103`) |
| `email` | string | ✅ | valid email, 1–255, trimmed, lowercased |
| `password` | string | ✅ | min 6, trimmed |
| `userName` | string | ❌ | 2–50, trimmed, nullable, **unique column** |
| `phoneNumber` | string | ❌ | 5–20, nullable |
| `countryCode` | string | ❌ | ≤10, nullable |
| `gender` | string | ❌ | ≤20, nullable — **free text, no enum** |
| `age` | number (coerced) | ❌ | 1–120, nullable; multipart `"29"` → `29` |
| `profilePicture` | string | ❌ | server-generated path ≤1024 (the file upload sets it; a raw path string in a JSON body also passes) |

```bash
curl -X POST "$BASE/auth/register" \
  -F "name=Rahul Sen" \
  -F "email=rahul.sen@example.com" \
  -F "password=secret123" \
  -F "userName=rahul_sen" \
  -F "phoneNumber=9830012345" \
  -F "countryCode=+91" \
  -F "gender=Male" \
  -F "age=29" \
  -F "profilePicture=@rahul.jpg"
```

Response **201** `"User registered successfully"` — `data` is the full `AuthResponse` from §1.2 (store the tokens exactly like a login; a welcome mail is fired non-blockingly — `src/modules/auth/services/auth.service.ts:80-83`).

Errors:
| Condition | HTTP | Body |
|---|---|---|
| zod failure / file size / MIME / wrong file field | 400 | shapes (a)/(b) from §1.4 |
| taken `email` (and also a taken `userName` — same generic wording) | 409 | `{ "message": "Email already exists", "errorCode": "AUTH_EMAIL_ALREADY_EXISTS" }` — `src/modules/auth/services/auth.service.ts:59-62`, `src/modules/auth/repositories/auth.repo.ts:81-85` |

### 4.2 `POST /auth/login` — see §1.2

Errors: 400 validation; 401 `{ "message": "Invalid email or password", "errorCode": "INVALID_CREDENTIALS" }` (unknown email, wrong password, or `isActive = false` — `src/modules/auth/services/auth.service.ts:88-103`).

---

### 4.3 `GET /profile` — fetch own profile

- **Auth:** Bearer. No params (the user is taken from the token — `req.user.userId`).
- **Success message:** `"Profile fetched successfully"`.

```bash
curl "$BASE/profile" -H "Authorization: Bearer $TOKEN"
```

Response **200** — `data.user` is `ProfileResponse` (`src/modules/user/types/profile.type.ts:13-39`):

```json
{
  "status": "success",
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "id": 7,
      "publicId": "KD-USR-7QX4MZ",
      "name": "Rahul Sen",
      "email": "rahul.sen@example.com",
      "username": "rahul_sen",
      "role": "USER",
      "profilePicture": "uploads/users/users-rahul-sen.webp",
      "age": 29,
      "gender": "Male",
      "countryCode": "+91",
      "phoneNumber": "9830012345"
    }
  },
  "timestamp": "2026-10-13T09:20:11.412Z"
}
```

`data.user` field contract (identical for GET and PATCH):

| Field | Type | Nullable | Notes |
|---|---|---|---|
| `id` | number | ❌ | **BIGINT UNSIGNED** PK (`src/models/user.model.ts:87-91`) |
| `publicId` | string | ❌ | `KD-` + `USR`/`ADM` + `-` + nanoid(6) upper — e.g. `KD-USR-7QX4MZ` (`src/utils/generateId.ts:3-17`) |
| `name` | string | ❌ | 2–100 |
| `email` | string | ❌ | **read-only here** — always present |
| `username` | string | ✅ | column is `userName` (unique, 50); response key is lowercase |
| `role` | string | ❌ | `"USER"` for this flow |
| `profilePicture` | string \| null | ✅ | relative path or `null` (§2.3) |
| `age` | number \| null | ✅ | read-only (not in the update schema) |
| `gender` | string \| null | ✅ | read-only free text |
| `countryCode` | string \| null | ✅ | e.g. `"+91"` |
| `phoneNumber` | string \| null | ✅ | e.g. `"9830012345"` (code lives in `countryCode`) |

Errors: **401** (§1.3 shapes); **404** `{ "message": "User not found", "errorCode": "AUTH_USER_NOT_FOUND" }` — token's `userId` no longer has a row (`src/modules/user/services/profile.service.ts:13-17`).

---

### 4.4 `PATCH /profile` — partial self-update

- **Auth:** Bearer; route = `isAuthenticated` → `userUpload.single("profilePicture")` (`src/modules/user/index.ts:21-26`).
- **Swagger annotations:** `src/modules/user/docs/profile.docs.ts` (mirrors this section — email immutability called out there too).
- **Content-Type decision:**
  - `application/json` → field-only updates.
  - `multipart/form-data` → when attaching an image (server merges the compressed path into the body **before** zod parsing, so one schema serves both — `src/modules/user/controllers/profile.controller.ts:52-60`).
- **Partial semantics:** only keys present in the parsed body are written; Sequelize skips `undefined`, so omitted keys keep current values (`src/modules/user/services/profile.service.ts:39-43`, `src/modules/user/repositories/profile.repo.ts:29-38`).

**Body fields** (`updateProfileSchema` — `src/validation/user.validation.ts:29-50`):

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | ❌* | trim, **2–100**; NOT NULL column — replace only, `null` → 400 (`Expected string, received null`) |
| `profilePicture` | string \| null | ❌* | trim, **≤1024**; normally the server-injected path — clients don't hand-write it; `null` clears the avatar |
| `phoneNumber` | string \| null | ❌* | trim, **5–20**; `null` clears; `""` → 400 |
| `countryCode` | string \| null | ❌* | trim, **≤10** (no minimum — see gotcha 4); `null` clears |
| `email` | — | — | **NOT ACCEPTED** — unknown keys are stripped, and the repo whitelist blocks it anyway |

\* **At least one of the four must be present**, else 400 with the exact message (verbatim, `src/validation/user.validation.ts:36-50`):

> `At least one field (name, profilePicture, phoneNumber, countryCode) is required`

…emitted as `{ "message": "Validation failed", "errors": [ { "field": "", "message": "At least one field (name, profilePicture, phoneNumber, countryCode) is required" } ], "errorCode": "VALIDATION_ERROR" }` (the issue is added at the object root, so `field` is the empty string).

**JSON update:**

```bash
curl -X PATCH "$BASE/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul Sen","phoneNumber":"9830012345","countryCode":"+91"}'
```

**Multipart update (image + field):** let curl set the multipart boundary — do **not** pass `-H "Content-Type: …"`.

```bash
curl -X PATCH "$BASE/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Rahul Sen" \
  -F "profilePicture=@rahul.jpg"
```

**Image-only update** (no text fields) is valid: the injected `profilePicture` path alone satisfies the ≥1-field rule.

**Browser / TS snippet** — `FormData`, never set `Content-Type` manually (the browser must add its own `boundary`):

```ts
const form = new FormData();
form.append("name", "Rahul Sen");          // optional text fields
form.append("profilePicture", file);       // File from <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml">

const res = await fetch(`${API_BASE}/profile`, {   // e.g. https://api.example.com/api/v1/profile
  method: "PATCH",
  headers: { Authorization: `Bearer ${accessToken}` },   // NO Content-Type here
  body: form,
});
const payload = await res.json();
if (!res.ok) {
  // bare shape: { message, errorCode } or { message, errors[], errorCode }
  const fieldErrors = payload.errors ?? [];
  throw new Error(payload.message);
}
const user = payload.data.user;            // fresh profile — re-render from this
```

Response **200** `"Profile updated successfully"` → `data.user` = same object as §4.3 (fresh row, re-fetch not needed):

```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 7,
      "publicId": "KD-USR-7QX4MZ",
      "name": "Rahul Sen",
      "email": "rahul.sen@example.com",
      "username": "rahul_sen",
      "role": "USER",
      "profilePicture": "uploads/users/users-rahul-sen.webp",
      "age": 29,
      "gender": "Male",
      "countryCode": "+91",
      "phoneNumber": "9830012345"
    }
  },
  "timestamp": "2026-10-13T09:25:00.000Z"
}
```

**Rendering the avatar:** `profilePicture` is a **relative path** — prefix the API origin; `null` (or `""`) → placeholder.

```ts
const avatarUrl = user.profilePicture ? `${API_ORIGIN}/${user.profilePicture}` : null;
// API_ORIGIN = "https://api.example.com"  →  .../uploads/users/users-rahul-sen.webp
// <img src={avatarUrl ?? "/avatar-placeholder.svg"} alt={user.name} />
```

Errors:

| Condition | HTTP | Body |
|---|---|---|
| zod failure (field rules, ≥1-field rule, `name: null`) | 400 | `{message:"Validation failed", errors:[…], errorCode:"VALIDATION_ERROR"}` |
| file > 5 MB / wrong file field / bad MIME | 400 | `{message:"File too large. Maximum allowed size is 5MB" \| "Unexpected file field in the request" \| "Invalid file type. Only JPEG, PNG, WEBP, SVG allowed.", errorCode:"VALIDATION_ERROR"}` |
| malformed JSON | 400 | `{message:"Invalid JSON format. Please check your request body."}` |
| missing / expired / invalid token | 401 | §1.3 shapes |
| token's user row gone | 404 | `{message:"User not found", errorCode:"AUTH_USER_NOT_FOUND"}` |
| `UniqueConstraintError` on update | 409 | `{message:"Profile update conflicts with an existing record", errorCode:"VALIDATION_ERROR"}` — `src/modules/user/repositories/profile.repo.ts:41-44`; `ConflictException` defaults `errorCode` to `VALIDATION_ERROR` (`src/utils/appError.ts:70-77`). The only unique columns (`email`, `userName`) aren't writable here, so this is a defensive case — branch on HTTP 409, not on `errorCode`. |

---

## 5. Pagination convention

**None of the endpoints in this doc paginate** — every one returns a single object (or a single auth payload) inside `data`:

| Endpoint | HTTP | Success message | `data` key(s) |
|---|---|---|---|
| `POST /auth/register` | 201 | `User registered successfully` | flat `AuthResponse` (id…`refreshToken`) |
| `POST /auth/login` | 200 | `Login successfully` | flat `AuthResponse` |
| `GET /profile` | 200 | `Profile fetched successfully` | `user` |
| `PATCH /profile` | 200 | `Profile updated successfully` | `user` |

- No `meta`, no `pagination` object anywhere in this doc's scope.
- If the profile screen later grows list sections (bookmarks, notifications — already routed in `src/modules/user/index.ts`), those are separate endpoints with the standard `{page, limit, total, totalPages}` pagination-inside-`data` convention used across this API.

---

## 6. Gotchas for the frontend

1. **Two error shapes (+1):** success is the `{status, message, data, timestamp}` envelope; failures are bare `{message, errorCode}` (AppError/multer) or `{message, errors[], errorCode}` (zod) — no `status`/`data` key at all. Branch on HTTP status first, then `message` from either shape. On `401 ACCESS_TOKEN_EXPIRED` / `ACCESS_TOKEN_INVALID`, drop the session and re-login — there is no refresh endpoint under `/auth`.
2. **Email is immutable.** It's absent from `updateProfileSchema` and blocked again by the repo column whitelist — no client payload can change it. Sending `{"email":"new@example.com"}` as the *only* field → 400 `At least one field (name, profilePicture, phoneNumber, countryCode) is required` (unknown keys are stripped by zod before the ≥1-field check).
3. **At least one field is mandatory** on every `PATCH /profile` — exact 400 message: `At least one field (name, profilePicture, phoneNumber, countryCode) is required`, with `"field": ""` (root-level zod issue). Note a **file-only** multipart PATCH is fine: the server injects `profilePicture` before validation.
4. **Omit vs `null` vs `""` — three different behaviours.** *Omit* → column untouched. *`null`* → clears (`profilePicture`, `phoneNumber`, `countryCode`) but `name: null` → 400 (not nullable). *`""`* → `name` and `phoneNumber` fail validation (min 2 / min 5 after trim) while **`countryCode: ""` and `profilePicture: ""` pass zod and are stored as empty strings** — always send `null`, never `""`, when clearing.
5. **The file field is `profilePicture`** (`.single("profilePicture")`) — not `profilePictureUrl`, not `image`, not `avatar`. A wrong field name → 400 `Unexpected file field in the request`. Text-field updates must be `application/json`; only image updates use `multipart/form-data`.
6. **5 MB cap, four MIME types:** `image/jpeg|png|webp|svg+xml`. Over size → 400 `File too large. Maximum allowed size is 5MB`; disallowed MIME → 400 `Invalid file type. Only JPEG, PNG, WEBP, SVG allowed.`; wrong field name → 400 `Unexpected file field in the request`. Validate client-side before opening the request (compression to 400×400 webp happens server-side *after* multer passes the file through, so you never see the stored original again).
7. **`profilePicture` is a relative path** (`uploads/users/users-rahul-sen.webp`, no leading slash) — always build `${API_ORIGIN}/${profilePicture}` against the API host (files are served from `/uploads` — `src/index.ts:95`). `null` → render an avatar placeholder. The filename is **deterministic** (derived from `name`, falling back to `publicId`), so re-uploading can return the same URL — append a cache-buster (`?v=Date.now()`) after a successful update to avoid a stale `<img>`.
8. **A profile response never contains tokens.** `ProfileResponse` is `AuthUser` minus `accessToken`/`refreshToken` by design (`src/modules/user/types/profile.type.ts:7-12`). Do `localStorage.accessToken = data.accessToken` **only** on register/login — never on `GET`/`PATCH /profile`, or you'll wipe your session.
9. **`role` stays `"USER"`.** It is returned for context but is not writable; don't render role-switching UI or optimistically change it. (`isAdmin` gates live only under `/admin`.)
10. **`id` is a number but a BIGINT** (`DataTypes.BIGINT.UNSIGNED`) — treat it as a plain number in JS, but use **`publicId` (`KD-USR-7QX4MZ` format) as the stable, display-safe string identifier**; never expose the numeric `id` in URLs or logs when a `publicId` exists. Note the response key is `username` while the DB column/register input is `userName`.
