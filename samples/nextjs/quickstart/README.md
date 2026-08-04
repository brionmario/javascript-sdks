# ThunderID Next.js Quickstart

<a href="https://stackblitz.com/fork/github/thunder-id/javascript-sdks/tree/main/samples/nextjs/quickstart?file=.env" target="_blank"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz" /></a>

A minimal Next.js 15 App Router application demonstrating ThunderID authentication with OAuth 2.0, PKCE, and JWT out of the box.

## Prerequisites

- Node.js 18+
- pnpm
- A ThunderID application

## Getting started

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Fill in your ThunderID credentials in `.env`, using the values you set in `thunderid-config/thunderid.env`.
   By default the file is set up for the native flow:

   ```dotenv
   NEXT_PUBLIC_THUNDERID_BASE_URL=https://localhost:8090
   NEXT_PUBLIC_THUNDERID_APPLICATION_ID=<the NEXTJS_QUICKSTART_APPLICATION_ID value>
   NEXT_PUBLIC_THUNDERID_SIGN_IN_URL=/signin
   NEXT_PUBLIC_THUNDERID_SIGN_UP_URL=/signup
   THUNDERID_CLIENT_SECRET=<the NEXTJS_QUICKSTART_CLIENT_SECRET value>
   THUNDERID_SECRET=<run: openssl rand -base64 32>
   ```

   To use the redirect-based flow instead, comment out the three native-flow vars above (leaving
   `NEXT_PUBLIC_THUNDERID_BASE_URL`, `THUNDERID_CLIENT_SECRET`, and `THUNDERID_SECRET` enabled) and uncomment
   `NEXT_PUBLIC_THUNDERID_CLIENT_ID` — or regenerate `.env` for that flow directly:

   ```bash
   npm run prepare-dev:redirect
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

   The app is now running at [http://localhost:3000](http://localhost:3000).
