# ThunderID Next.js Quickstart

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/thunder-id/javascript-sdks/tree/main/samples/nextjs/quickstart?file=.env.local&terminal=dev)

A minimal Next.js 15 App Router application demonstrating ThunderID authentication with OAuth 2.0, PKCE, and JWT out of the box.

## Prerequisites

- Node.js 18+
- pnpm
- A ThunderID application

## Getting started

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your ThunderID credentials in `.env.local`, using the values you set in `thunderid-config/thunderid.env`:

   ```
   NEXT_PUBLIC_THUNDERID_BASE_URL=https://localhost:8090
   NEXT_PUBLIC_THUNDERID_CLIENT_ID=NEXTJS_QUICKSTART
   NEXT_PUBLIC_THUNDERID_APPLICATION_ID=<the NEXTJS_QUICKSTART_APPLICATION_ID value>
   THUNDERID_CLIENT_SECRET=<the NEXTJS_QUICKSTART_CLIENT_SECRET value>
   THUNDERID_SECRET=<run: openssl rand -base64 32>
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

   The app is now running at [http://localhost:3000](http://localhost:3000).
