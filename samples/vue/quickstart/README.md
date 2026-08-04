# ThunderID Vue Quickstart

<a href="https://stackblitz.com/fork/github/thunder-id/javascript-sdks/tree/main/samples/vue/quickstart?file=.env&terminal=dev" target="_blank"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz" /></a>

A minimal Vue 3 + Vite application demonstrating ThunderID authentication with OAuth 2.0, PKCE, and JWT support using the `@thunderid/vue` SDK.

## Prerequisites

- Node.js 18+
- pnpm
- A ThunderID application

## Setup

1. Copy the environment template:
   ```sh
   cp .env.example .env
   ```

2. Fill in your ThunderID credentials in `.env`, using the values you set in `thunderid-config/thunderid.env`:
   ```
   VITE_THUNDERID_CLIENT_ID=VUE_QUICKSTART
   VITE_THUNDERID_BASE_URL=https://your-thunderid-instance
   ```

3. Install dependencies and start the dev server:
   ```sh
   pnpm install
   pnpm dev
   ```

The app will be available at `http://localhost:5173`.

## Docs

Full SDK reference: [thunderid.dev/docs](https://thunderid.dev/docs)
