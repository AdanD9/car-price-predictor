import { Suspense, ReactNode } from 'react';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TabbedInterface from "@/components/TabbedInterface";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Metadata } from 'next';

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Car Price Predictor - AI-Powered Car Valuation',
  description: 'Get instant, accurate car price predictions powered by AI. Our advanced machine learning model analyzes thousands of data points to give you the most reliable car valuation in seconds.',
  keywords: 'car price prediction, car valuation, AI car pricing, used car value, car appraisal, machine learning',
};

export default function Home(): JSX.Element {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      <main>
        {/* Car Price Predictor - AI-powered car valuation platform */}
        <Hero />
        <TabbedInterface />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
