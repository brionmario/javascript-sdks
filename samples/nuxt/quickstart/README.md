# ThunderID Nuxt Quickstart

<a href="https://stackblitz.com/fork/github/thunder-id/javascript-sdks/tree/main/samples/nuxt/quickstart?file=.env&terminal=dev" target="_blank"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz" /></a>

A minimal Nuxt 3 application demonstrating ThunderID authentication with OAuth 2.0, PKCE, and JWT out of the box.

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
   NUXT_PUBLIC_THUNDERID_BASE_URL=https://localhost:8090
   NUXT_PUBLIC_THUNDERID_APPLICATION_ID=<the NUXT_QUICKSTART_APPLICATION_ID value>
   NUXT_PUBLIC_THUNDERID_SIGN_IN_URL=/signin
   NUXT_PUBLIC_THUNDERID_SIGN_UP_URL=/signup
   THUNDERID_CLIENT_SECRET=<the NUXT_QUICKSTART_CLIENT_SECRET value>
   THUNDERID_SESSION_SECRET=<run: openssl rand -base64 32>
   ```

   To use the redirect-based flow instead, comment out the three native-flow vars above (leaving
   `NUXT_PUBLIC_THUNDERID_BASE_URL`, `THUNDERID_CLIENT_SECRET`, and `THUNDERID_SESSION_SECRET` enabled) and
   uncomment `NUXT_PUBLIC_THUNDERID_CLIENT_ID` — or regenerate `.env` for that flow directly:

   ```bash
   npm run prepare-dev:redirect
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

   The app is now running at [http://localhost:3000](http://localhost:3000).
