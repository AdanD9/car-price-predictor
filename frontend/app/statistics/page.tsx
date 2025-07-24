import { Suspense } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatisticsDashboard from "@/components/statistics/StatisticsDashboard";
import { Metadata } from 'next';

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Car Market Statistics - Car Price Predictor',
  description: 'Explore comprehensive car market statistics including most popular makes and models, price trends, fuel type distributions, and market insights powered by AI analysis.',
  keywords: 'car statistics, car market data, popular car makes, car price trends, automotive statistics, car market analysis',
};

export default function StatisticsPage(): JSX.Element {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      <main className="min-h-screen bg-base-200">
        <StatisticsDashboard />
      </main>
      <Footer />
    </>
  );
}
