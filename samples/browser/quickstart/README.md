# ThunderID Browser Quickstart

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/thunder-id/javascript-sdks/tree/main/samples/browser/quickstart?file=.env&terminal=dev)

A minimal Vite + vanilla JS app demonstrating sign-in and sign-out with the ThunderID JavaScript SDK (`@thunderid/browser`).

## Prerequisites

- Node.js 18+
- A running ThunderID instance (default: `https://localhost:8090`)
- A configured application with an authorized redirect URI set to your app's origin

## Getting started

1. Copy the environment file and fill in your values:
   ```sh
   cp .env.example .env
   ```

2. Edit `.env` with the credentials you set in `thunderid-config/thunderid.env`:
   ```
   VITE_THUNDERID_CLIENT_ID=BROWSER_QUICKSTART
   VITE_THUNDERID_BASE_URL=https://localhost:8090
   ```

3. Install dependencies and start the dev server:
   ```sh
   pnpm install
   pnpm dev
   ```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Learn more

- [ThunderID Docs](https://thunderid.dev/docs)
- [`@thunderid/browser` SDK reference](https://thunderid.dev/docs/sdks/javascript/browser)
