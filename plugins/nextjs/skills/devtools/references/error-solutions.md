# Next.js Error Solutions

Common errors and their fixes for Next.js 16.

## Compilation Errors

### "params" is not assignable to type Promise

**Error:**
```
Type '{ id: string }' is not assignable to type 'Promise<{ id: string }>'.
```

**Cause:** Next.js 16 changed params to be async.

**Fix:**
```tsx
// Before
function Page({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}

// After
async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>{id}</div>;
}
```

### Cannot find module 'next/headers'

**Error:**
```
Module not found: Can't resolve 'next/headers'
```

**Cause:** Outdated Next.js version or incorrect import.

**Fix:**
```bash
npm install next@latest
```

### cookies() is not a function

**Error:**
```
TypeError: cookies is not a function
```

**Cause:** Using old sync API.

**Fix:**
```tsx
// Before
const store = cookies();

// After
const store = await cookies();
```

## Runtime Errors

### Hydration Mismatch

**Error:**
```
Hydration failed because the server rendered content did not match the client.
```

**Causes & Fixes:**

1. **Date/time rendering:**
```tsx
// Bad
<p>{new Date().toLocaleString()}</p>

// Good
const [time, setTime] = useState<string>();
useEffect(() => setTime(new Date().toLocaleString()), []);
<p>{time}</p>
```

2. **Browser-only APIs:**
```tsx
// Bad
<p>{window.innerWidth}</p>

// Good
const [width, setWidth] = useState(0);
useEffect(() => setWidth(window.innerWidth), []);
```

3. **Random IDs:**
```tsx
// Bad
<div id={Math.random().toString()}>

// Good
import { useId } from 'react';
const id = useId();
<div id={id}>
```

### "use cache" in client component

**Error:**
```
"use cache" cannot be used in a Client Component
```

**Fix:** Move to server component or extract to separate file:
```tsx
// data.ts (server)
"use cache";
export async function getData() {
  return fetch('/api/data').then(r => r.json());
}

// page.tsx (can be client)
import { getData } from './data';
```

### Missing Suspense boundary

**Error:**
```
Missing Suspense boundary with "use cache"
```

**Fix:**
```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <CachedContent />
    </Suspense>
  );
}
```

### Dynamic server usage

**Error:**
```
Dynamic server usage: Page couldn't be rendered statically because it used `headers`.
```

**Fixes:**

1. **Export dynamic config:**
```tsx
export const dynamic = 'force-dynamic';
```

2. **Use "use cache: private":**
```tsx
"use cache: private";
// User-specific caching
```

3. **Add generateStaticParams:**
```tsx
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}
```

## Build Errors

### Can't resolve '@/...'

**Error:**
```
Module not found: Can't resolve '@/components/Button'
```

**Fix in tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Image optimization disabled

**Error:**
```
Image optimization is disabled. Add `unoptimized: false` to enable.
```

**Fix in next.config.ts:**
```ts
const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
};
```

### Invalid next.config.js

**Error:**
```
Invalid next.config.js options detected
```

**Fix:** Migrate to next.config.ts:
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Your config here
};

export default nextConfig;
```

## Performance Issues

### Slow page load

**Diagnosis:**
```bash
npx tsx errors.ts 3000
npx tsx routes.ts 3000
```

**Common fixes:**

1. **Add caching:**
```tsx
"use cache";
export default async function Page() { ... }
```

2. **Use Suspense:**
```tsx
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>
```

3. **Streaming:**
```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>
        <Content />
      </Suspense>
    </>
  );
}
```

### Large bundle size

**Diagnosis:**
```bash
npx next build --debug
```

**Fixes:**

1. **Dynamic imports:**
```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

2. **Server components (default in app/):**
```tsx
// This component never ships JS to client
export default function ServerOnly() {
  return <div>No client JS</div>;
}
```

## Debug Commands

```bash
# Check for errors
npx tsx errors.ts 3000

# List all routes
npx tsx routes.ts 3000

# Search docs for error
npx tsx docs.ts search "hydration error"

# Get specific doc
npx tsx docs.ts get "/docs/messages/react-hydration-error"
```

## Quick Reference

| Error | Likely Cause | Quick Fix |
|-------|--------------|-----------|
| params not Promise | Old API | Add `await params` |
| Hydration mismatch | Server/client diff | Use useEffect/useId |
| Missing Suspense | Cache without boundary | Wrap in `<Suspense>` |
| Can't resolve @/ | Missing path alias | Fix tsconfig paths |
| cookies() not function | Sync API | Add `await` |
