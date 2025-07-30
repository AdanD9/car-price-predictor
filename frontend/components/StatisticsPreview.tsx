'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StatisticsCard from './statistics/StatisticsCard';

interface StatsSummary {
  total_listings: number;
  average_price: number;
  most_popular_make: string;
  most_popular_model: string;
}

const StatisticsPreview: React.FC = () => {
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use backend API endpoint for statistics
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/statistics/overview`);

        if (response.ok) {
          const data = await response.json();
          setStats(data.summary);
        } else {
          console.error('Failed to fetch statistics:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-base-100">
        <div className="container mx-auto px-8">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-base-100" id="market-stats">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Market Insights at a Glance
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto mb-8">
            Our AI analyzes millions of car listings to bring you the most accurate market data
          </p>
          <Link 
            href="/statistics" 
            className="btn btn-outline btn-primary"
          >
            View Full Statistics →
          </Link>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <StatisticsCard
              title="Total Listings Analyzed"
              value={stats.total_listings}
              subtitle="Active market data"
              icon="📊"
              className="hover:shadow-2xl transition-shadow duration-300"
            />
            <StatisticsCard
              title="Average Market Price"
              value={`$${stats.average_price.toLocaleString()}`}
              subtitle="Current market average"
              icon="💰"
              className="hover:shadow-2xl transition-shadow duration-300"
            />
            <StatisticsCard
              title="Most Popular Brand"
              value={stats.most_popular_make}
              subtitle="Leading manufacturer"
              icon="🏆"
              className="hover:shadow-2xl transition-shadow duration-300"
            />
            <StatisticsCard
              title="Top Selling Model"
              value={stats.most_popular_model}
              subtitle="Best-selling car model"
              icon="⭐"
              className="hover:shadow-2xl transition-shadow duration-300"
            />
          </div>
        )}

        <div className="text-center mt-12">
          <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-200">
            <div className="stat">
              <div className="stat-title">Data Sources</div>
              <div className="stat-value text-primary">3M+</div>
              <div className="stat-desc">Car listings analyzed</div>
            </div>
            <div className="stat">
              <div className="stat-title">Accuracy Rate</div>
              <div className="stat-value text-secondary">98.3%</div>
              <div className="stat-desc">R² score on predictions</div>
            </div>
            <div className="stat">
              <div className="stat-title">Market Coverage</div>
              <div className="stat-value text-accent">50</div>
              <div className="stat-desc">US states covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsPreview;
