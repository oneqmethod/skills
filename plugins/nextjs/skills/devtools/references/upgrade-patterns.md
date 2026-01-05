# Next.js 16 Upgrade Patterns

Common patterns and fixes for upgrading to Next.js 16.

## Async API Changes

### params (Dynamic Routes)

**Before (Next.js 15):**
```tsx
export default function Page({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}
```

**After (Next.js 16):**
```tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>{id}</div>;
}
```

### searchParams

**Before:**
```tsx
export default function Page({ searchParams }: { searchParams: { q: string } }) {
  return <div>Query: {searchParams.q}</div>;
}
```

**After:**
```tsx
export default async function Page({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { q } = await searchParams;
  return <div>Query: {q}</div>;
}
```

### cookies()

**Before:**
```tsx
import { cookies } from 'next/headers';

export default function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  return <div>{token?.value}</div>;
}
```

**After:**
```tsx
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  return <div>{token?.value}</div>;
}
```

### headers()

**Before:**
```tsx
import { headers } from 'next/headers';

export default function Page() {
  const headersList = headers();
  const userAgent = headersList.get('user-agent');
  return <div>{userAgent}</div>;
}
```

**After:**
```tsx
import { headers } from 'next/headers';

export default async function Page() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  return <div>{userAgent}</div>;
}
```

## Config Migration

### next.config.js to next.config.ts

**Before (next.config.js):**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com'],
  },
};

module.exports = nextConfig;
```

**After (next.config.ts):**
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};

export default nextConfig;
```

## Image Component Changes

### Default unoptimized

**Before:**
```tsx
<Image src="/photo.jpg" alt="Photo" width={500} height={300} />
```

**After (if optimization disabled by default):**
```tsx
<Image
  src="/photo.jpg"
  alt="Photo"
  width={500}
  height={300}
  unoptimized={false}  // Explicitly enable optimization
/>
```

### remotePatterns instead of domains

**Before:**
```js
images: {
  domains: ['cdn.example.com'],
}
```

**After:**
```ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.example.com',
      pathname: '/images/**',
    },
  ],
}
```

## React 19 Compatibility

### ref as prop

**Before:**
```tsx
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

**After (React 19):**
```tsx
function Input({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```

### use() hook for promises

```tsx
import { use } from 'react';

function Comments({ commentsPromise }: { commentsPromise: Promise<Comment[]> }) {
  const comments = use(commentsPromise);
  return (
    <ul>
      {comments.map(c => <li key={c.id}>{c.text}</li>)}
    </ul>
  );
}
```

## Cache Components

### Basic "use cache"

```tsx
"use cache";

export default async function CachedPage() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### Private cache (user-specific)

```tsx
"use cache: private";

export default async function UserDashboard() {
  const user = await getCurrentUser();
  return <div>Welcome, {user.name}</div>;
}
```

### cacheLife for TTL

```tsx
import { cacheLife } from 'next/cache';

export default async function Page() {
  cacheLife('hours');  // Cache for hours
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### cacheTag for invalidation

```tsx
import { cacheTag, revalidateTag } from 'next/cache';

async function ProductList() {
  cacheTag('products');
  const products = await getProducts();
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// Invalidate:
await revalidateTag('products');
```

## Middleware Changes

### Edge Runtime by default

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Runs on edge by default in Next.js 16
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

## Route Handlers

### Async context

**Before:**
```ts
import { NextRequest } from 'next/server';

export function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return Response.json({ id: params.id });
}
```

**After:**
```ts
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return Response.json({ id });
}
```

## Codemod Commands

Run the official codemod to automate most changes:

```bash
# Full upgrade
npx @next/codemod@latest upgrade

# Specific transforms
npx @next/codemod@latest async-params .
npx @next/codemod@latest next-config .
```

## Checklist

- [ ] Async params/searchParams/cookies/headers
- [ ] next.config.ts migration
- [ ] Image component remotePatterns
- [ ] React 19 ref handling
- [ ] Route handler async params
- [ ] Middleware edge runtime
- [ ] Cache components setup (optional)
