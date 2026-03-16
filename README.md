This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Connecting Meta WhatsApp Cloud API

To connect the application to the official Meta WhatsApp Cloud API instead of using the local headless browser hack, follow these steps:

1. **Create an App:** Create an app in the [Meta Developer Dashboard](https://developers.facebook.com/). Add the **WhatsApp** product to your app.
2. **Environment Variables:** Locate the necessary values under the "API Setup" section in your Meta app dashboard. Add them to your `.env.local` file:
    * `WHATSAPP_API_TOKEN`: Your temporary or permanent access token.
    * `WHATSAPP_PHONE_NUMBER_ID`: The unique ID for the sending phone number you configure.
    * `WHATSAPP_VERIFY_TOKEN`: A custom secret string you create (e.g., `my-secret-token`) used to verify your webhook endpoints.
3. **Configure Webhook:** In the Meta App dashboard under "WhatsApp" > "Configuration", click "Edit" on the webhook.
    * Set the URL to your deployed domain plus `/api/webhook` (e.g., `https://your-domain.com/api/webhook`).
    * Use ngrok (`ngrok http 3000`) for testing webhook URLs locally.
    * Enter your chosen `WHATSAPP_VERIFY_TOKEN` and verify.
    * Subscribe to the `messages` event.
4. **Test:** Add an approved test phone number in the Meta Dashboard, and text that test number to trigger the bot.
