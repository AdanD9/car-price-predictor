import themes from "daisyui/src/theming/themes";
import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "CarInsight Pro",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Complete automotive intelligence platform with AI-powered price predictions, VIN lookup, market analytics, and professional tools for dealers and consumers. Get instant, accurate car valuations with 94.5% accuracy.",
  // REQUIRED (no https://, not trailing slash at the end, just the naked domain)
  domainName: "carpricepredictor.com",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h"
            : "price_basic",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Basic",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for individual car buyers and sellers",
        // The price you want to display, the one user will be charged on Stripe.
        price: 9.99,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 19.99,
        features: [
          {
            name: "10 price predictions per month",
          },
          { name: "Basic market statistics" },
          { name: "VIN lookup (5 per month)" },
          { name: "Email support" },
          { name: "Mobile app access" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw"
            : "price_pro",
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        name: "Professional",
        description: "Ideal for dealers and automotive professionals",
        price: 29.99,
        priceAnchor: 49.99,
        features: [
          {
            name: "Unlimited price predictions",
          },
          { name: "Advanced market analytics" },
          { name: "Unlimited VIN lookups" },
          { name: "Bulk pricing tools" },
          { name: "API access" },
          { name: "Priority support" },
          { name: "Custom reports" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw"
            : "price_enterprise",
        name: "Enterprise",
        description: "For large dealerships and automotive businesses",
        price: 99.99,
        priceAnchor: 149.99,
        features: [
          {
            name: "Everything in Professional",
          },
          { name: "White-label solution" },
          { name: "Custom integrations" },
          { name: "Dedicated account manager" },
          { name: "Advanced analytics dashboard" },
          { name: "24/7 phone support" },
          { name: "Custom ML model training" },
          { name: "Multi-location support" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `Car Price Predictor <noreply@resend.carpricepredictor.com>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Diaz at Car Price Predictor <diaz@resend.carpricepredictor.com>`,
    // Email shown to customer if they need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "diaz@resend.carpricepredictor.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you use any theme other than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["light"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users to after a successful login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
