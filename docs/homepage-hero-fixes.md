CodeContent# Homepage Hero Editor — Issues & Fixes

## 1. TypeScript build errors after manual edits

**Problem:** `HeroEditor.tsx` referenced `setError`/`error` that didn't exist, and `HomepageEditor.tsx` passed a `value`/`onChange` prop pair that no longer matched `HeroEditorProps`.

**Fix:**
- Added `const [error, setError] = useState<string | null>(null);` to `HeroEditor.tsx`.
- Updated `HomepageEditor.tsx` to pass the props `HeroEditor` actually expects.

Files: `src/components/admin/homepage/HeroEditor.tsx`, `src/components/admin/homepage/HomepageEditor.tsx`

---

## 2. Parser/syntax errors ("Expression expected")

**Problem:** Manual edits left mismatched braces and duplicated `return (...)` blocks in `HeroEditor.tsx`, so Next.js's SWC parser couldn't compile the file at all (not a TypeScript type error — the file was structurally invalid JS/TSX).

**Fix:** Rewrote the button/input JSX block with matching braces and a single `return` statement.

File: `src/components/admin/homepage/HeroEditor.tsx`

---

## 3. Frontend never reflected the backend's actual hero image

**Problem:** Both the public homepage and the admin editor imported a **static** `heroContent` object from `src/data/homepage.ts`. Uploading a new image via the backend (`POST /api/v1/admin/homepage/hero/image`) updated the database, but nothing on the frontend ever called `GET /api/v1/admin/homepage`, so the old hardcoded image kept showing.

**Fix:**
- Added `getHomepage()` to `src/services/homepage.service.ts`.
- `src/app/(public)/page.tsx` (server component) now calls `getHomepage()` on each request and merges the live `heroImageUrl` into the static content, falling back to the static image if the fetch fails.
- `HomepageEditor.tsx` fetches `getHomepage()` on mount to hydrate the preview with the real backend image.

---

## 4. Upload succeeded but the admin preview never updated

**Problem:** `HeroEditor` uploaded the file and stored the new URL in its **own** local state, but nothing told the parent (`HomepageEditor`) about it, so the `HeroSection` preview kept showing the old image until a hard refresh.

**Fix:** Replaced the internal state with an `onUploaded(imageUrl: string)` callback prop. `HomepageEditor` now owns `hero.imageUrl` and updates it when `HeroEditor` reports a successful upload.

---

## 5. `next/image` "Invalid src prop" for Cloudinary URLs

**Problem:** Cloudinary's hostname (`res.cloudinary.com`) wasn't whitelisted, so `next/image` refused to render the uploaded image and crashed the page (`GET / 500`).

**Fix:** Added `images.remotePatterns` to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://res.cloudinary.com/**")],
  },
};
```

(Note: this project's Next.js version deprecated the old `domains` option in favor of `remotePatterns` — confirmed against `node_modules/next/dist/docs`.)

---

## 6. Race condition: new upload silently reverted to the old image

**Problem:** `HomepageEditor` fetched `getHomepage()` once on mount to hydrate the preview. If that fetch resolved **after** a user had already uploaded a new image, its (stale) result would overwrite the freshly uploaded image — making it look like the change didn't stick until a manual refresh.

**Fix:** Added a `hasUploadedRef` flag. The mount-time fetch now checks this flag before applying its result, so it can never clobber a newer upload.

---

## 7. Visible lag before the new image appeared (even after the race fix)

**Problem:** `next/image` proxies and optimizes remote images. The first request for a brand-new Cloudinary URL requires the dev server to fetch and process the image before the browser can render it — causing a multi-second delay even though the state update was instant.

**Fix (optimistic preview):**
- `HeroEditor.tsx`: on file selection, immediately shows a local `URL.createObjectURL(file)` preview via `onUploaded(previewUrl)` *before* the network upload starts, then swaps in the real Cloudinary URL once the upload resolves. The blob URL is revoked afterward.
- `HeroSection.tsx`: added `unoptimized={content.imageUrl.startsWith("blob:")}` so local blob previews skip `next/image`'s optimization pipeline (which doesn't support `blob:` URLs) and render instantly.

Files: `src/components/admin/homepage/HeroEditor.tsx`, `src/components/public/Homepage/HeroSection.tsx`
