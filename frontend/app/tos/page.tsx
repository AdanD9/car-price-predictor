import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://fenago.com
// - Name: FeNAgO
// - Contact information: support@fenago.com
// - Description: A Next.js agentic SaaS boilerplate to help entrepreneurs build AI-powered applications more efficiently
// - Ownership: when buying a package, users can download code to create apps. 
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://fenago.com/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: July 29, 2025

Welcome to Car Price Predictor!

These Terms of Service ("Terms") govern your use of the Car Price Predictor website at https://carpricepredictor.com ("Website") and the services provided by Car Price Predictor. By using our Website and services, you agree to these Terms.

1. Description of Car Price Predictor

Car Price Predictor is an AI-powered platform that provides car valuation services, market statistics, VIN lookup functionality, and automotive market insights. Our service uses machine learning algorithms to analyze market data and provide price predictions for vehicles.

2. Service Usage and Limitations

2.1 Accuracy Disclaimer: While our AI model strives for high accuracy, all price predictions are estimates based on available market data and should be used for reference purposes only. Actual vehicle values may vary based on condition, location, market fluctuations, and other factors not captured in our model.

2.2 VIN Lookup: Our VIN lookup service provides vehicle specifications based on publicly available data. We do not guarantee the completeness or accuracy of VIN-decoded information.

2.3 Subscription Plans: Different subscription tiers provide varying levels of access to our services, including prediction limits, VIN lookup quotas, and advanced features as outlined in your chosen plan.

3. User Responsibilities

3.1 You agree to provide accurate information when using our services.
3.2 You will not attempt to reverse engineer, copy, or redistribute our proprietary algorithms or data.
3.3 You will not use our service for any illegal or unauthorized purposes.
3.4 Commercial users must comply with any additional terms specific to their subscription level.

4. Data Collection and Privacy

We collect and store user data including name, email, payment information, and vehicle search history as necessary to provide our services. We also collect non-personal data through web cookies to improve user experience. For complete details on data handling, please refer to our Privacy Policy at https://carpricepredictor.com/privacy-policy.

5. Intellectual Property

All content, algorithms, models, and data provided through our service are proprietary to Car Price Predictor. Users may not reproduce, distribute, or create derivative works from our content without explicit written permission.

6. Limitation of Liability

Car Price Predictor provides information services only. We are not responsible for any financial decisions made based on our predictions. Users assume all risks associated with vehicle purchases, sales, or valuations based on our estimates.

7. Refund Policy

We offer refunds within 7 days of subscription purchase. Refunds are processed according to our refund policy available on our website.

8. Governing Law

These Terms are governed by the laws of the United States.

9. Updates to Terms

We may update these Terms periodically. Users will be notified of significant changes via email. Continued use of our service after changes constitutes acceptance of new terms.

10. Contact Information

For questions regarding these Terms of Service, please contact us at support@carpricepredictor.com.

Thank you for using Car Price Predictor!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
