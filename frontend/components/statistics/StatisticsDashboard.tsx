'use client';

import React, { useState, useEffect } from 'react';
import StatisticsCard from './StatisticsCard';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import InteractiveModelsChart from './InteractiveModelsChart';
import DataSourcesInfo from './DataSourcesInfo';

interface StatisticsData {
  summary: {
    total_listings: number;
    average_price: number;
    most_popular_make: string;
    most_popular_model: string;
    price_range_mode: string;
  };
  popular_makes: Array<{
    make: string;
    count: number;
    avg_price: number;
    percentage: number;
  }>;
  popular_models: Array<{
    model: string;
    make: string;
    count: number;
    avg_price: number;
  }>;
  body_types: Array<{
    type: string;
    count: number;
    percentage: number;
    avg_price: number;
  }>;
  fuel_types: Array<{
    type: string;
    count: number;
    percentage: number;
    avg_price: number;
  }>;
  last_updated?: string;
  data_sources?: string[];
}

interface TrendsData {
  year_trends: Array<{
    year: number;
    count: number;
    avg_price: number;
    avg_mileage: number;
  }>;
  price_ranges: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  mileage_distribution: Array<{
    range: string;
    count: number;
    percentage: number;
    avg_price: number;
  }>;
}

const StatisticsDashboard: React.FC = () => {
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use backend API endpoints for statistics data
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const [statsResponse, trendsResponse] = await Promise.all([
          fetch(`${apiUrl}/statistics/overview`),
          fetch(`${apiUrl}/statistics/trends`)
        ]);

        if (!statsResponse.ok || !trendsResponse.ok) {
          throw new Error('Failed to fetch statistics data');
        }

        const statsData = await statsResponse.json();
        const trendsData = await trendsResponse.json();

        setStatisticsData(statsData);
        setTrendsData(trendsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Statistics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading statistics: {error}</span>
      </div>
    );
  }

  if (!statisticsData || !trendsData) {
    return (
      <div className="alert alert-warning">
        <span>No statistics data available</span>
      </div>
    );
  }

  // Add safety checks for data structure
  if (!statisticsData.summary || !statisticsData.popular_makes || !statisticsData.body_types ||
      !trendsData.year_trends || !trendsData.price_ranges) {
    return (
      <div className="alert alert-error">
        <span>Invalid statistics data structure. Please refresh the page.</span>
      </div>
    );
  }

  // Prepare chart data with safety checks
  const makesChartData = {
    labels: statisticsData.popular_makes.slice(0, 8).map(item => item?.make || 'Unknown'),
    datasets: [
      {
        label: 'Number of Listings',
        data: statisticsData.popular_makes.slice(0, 8).map(item => item?.count || 0),
        backgroundColor: [
          '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
          '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
        ],
        borderWidth: 1,
      },
    ],
  };

  const bodyTypesChartData = {
    labels: statisticsData.body_types.map(item => item?.type || 'Unknown'),
    datasets: [
      {
        data: statisticsData.body_types.map(item => item?.count || 0),
        backgroundColor: [
          '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
          '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
        ],
      },
    ],
  };

  const yearTrendsChartData = {
    labels: trendsData.year_trends.map(item => item?.year?.toString() || 'Unknown'),
    datasets: [
      {
        label: 'Average Price ($)',
        data: trendsData.year_trends.map(item => item?.avg_price || 0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const priceRangesChartData = {
    labels: trendsData.price_ranges.map(item => item?.range || 'Unknown'),
    datasets: [
      {
        label: 'Number of Listings',
        data: trendsData.price_ranges.map(item => item?.count || 0),
        backgroundColor: '#10B981',
        borderWidth: 1,
      },
    ],
  };

  // Prepare interactive models chart data
  const interactiveModelsData = statisticsData.popular_makes.map(make => ({
    make: make.make,
    models: statisticsData.popular_models
      .filter(model => model.make === make.make)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(model => ({
        model: model.model,
        count: model.count,
        avg_price: model.avg_price
      }))
  })).filter(make => make.models.length > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-base-content mb-4">
          Car Market Statistics
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto mb-4">
          Comprehensive insights into the used car market based on millions of listings
        </p>

        {/* Data Freshness Indicator */}
        {statisticsData?.last_updated && (
          <div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>
              Last updated: {new Date(statisticsData.last_updated).toLocaleString()}
            </span>
            {statisticsData.data_sources && (
              <span className="ml-4">
                Sources: {statisticsData.data_sources.join(', ')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatisticsCard
          title="Total Listings"
          value={statisticsData.summary?.total_listings || 0}
          subtitle="Active car listings"
          icon="🚗"
        />
        <StatisticsCard
          title="Average Price"
          value={`$${(statisticsData.summary?.average_price || 0).toLocaleString()}`}
          subtitle="Market average"
          icon="💰"
        />
        <StatisticsCard
          title="Most Popular Make"
          value={statisticsData.summary?.most_popular_make || 'Unknown'}
          subtitle="Leading brand"
          icon="🏆"
        />
        <StatisticsCard
          title="Top Model"
          value={statisticsData.summary?.most_popular_model || 'Unknown'}
          subtitle="Best-selling model"
          icon="⭐"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <BarChart
          title="Most Popular Car Makes"
          data={makesChartData}
          height={400}
        />
        <PieChart
          title="Vehicle Body Types Distribution"
          data={bodyTypesChartData}
          height={400}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <LineChart
          title="Average Price by Year"
          data={yearTrendsChartData}
          height={400}
        />
        <BarChart
          title="Price Range Distribution"
          data={priceRangesChartData}
          height={400}
        />
      </div>

      {/* Interactive Models Chart */}
      <div className="mb-12">
        <InteractiveModelsChart data={interactiveModelsData} />
      </div>

      {/* Data Sources Information */}
      <div className="mb-12">
        <DataSourcesInfo />
      </div>
    </div>
  );
};

export default StatisticsDashboard;
