'use client';

import { useState, useEffect } from 'react';
import StatisticsCard from '../statistics/StatisticsCard';
import BarChart from '../statistics/BarChart';
import PieChart from '../statistics/PieChart';

interface StatsSummary {
  total_listings: number;
  average_price: number;
  most_popular_make: string;
  most_popular_model: string;
  price_range_mode: string;
}

interface PopularMake {
  make: string;
  count: number;
  avg_price: number;
  percentage: number;
}

interface PopularModel {
  model: string;
  make: string;
  count: number;
  avg_price: number;
}

interface BodyType {
  type: string;
  count: number;
  percentage: number;
  avg_price: number;
}

interface FuelType {
  type: string;
  count: number;
  percentage: number;
  avg_price: number;
}

interface StatisticsData {
  summary: StatsSummary;
  popular_makes: PopularMake[];
  popular_models: PopularModel[];
  body_types: BodyType[];
  fuel_types: FuelType[];
  last_updated: string;
  data_sources: string[];
}

const MarketStatisticsTab = () => {
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        const response = await fetch(`${apiUrl}/statistics/overview`);

        if (!response.ok) {
          throw new Error('Failed to fetch statistics data');
        }

        const data = await response.json();
        setStatisticsData(data);
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
      <div className="text-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-lg">Loading market statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="alert alert-error max-w-md mx-auto">
          <span>Failed to load statistics: {error}</span>
        </div>
      </div>
    );
  }

  if (!statisticsData) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold mb-2">No Data Available</h3>
        <p className="text-base-content/70">
          Unable to load market statistics at this time.
        </p>
      </div>
    );
  }

  // Prepare chart data
  const makesChartData = statisticsData.popular_makes.slice(0, 10).map(make => ({
    name: make.make,
    value: make.count,
    price: make.avg_price
  }));

  const bodyTypesChartData = statisticsData.body_types.map(type => ({
    name: type.type,
    value: type.count,
    percentage: type.percentage
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
          📊 Market Statistics
        </h2>
        <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
          Comprehensive automotive market insights powered by real-time data analysis. 
          Explore trends, pricing patterns, and market dynamics across the industry.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Total Listings"
          value={statisticsData.summary.total_listings}
          subtitle="Active car listings"
          icon="🚗"
        />
        <StatisticsCard
          title="Average Price"
          value={`$${statisticsData.summary.average_price.toLocaleString()}`}
          subtitle="Market average"
          icon="💰"
        />
        <StatisticsCard
          title="Most Popular Make"
          value={statisticsData.summary.most_popular_make}
          subtitle="Leading brand"
          icon="🏆"
        />
        <StatisticsCard
          title="Top Model"
          value={statisticsData.summary.most_popular_model}
          subtitle="Best-selling model"
          icon="⭐"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-base-200 rounded-2xl p-6">
          <BarChart
            title="Most Popular Car Makes"
            data={makesChartData}
            height={400}
          />
        </div>
        <div className="bg-base-200 rounded-2xl p-6">
          <PieChart
            title="Vehicle Body Types Distribution"
            data={bodyTypesChartData}
            height={400}
          />
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Makes Table */}
        <div className="bg-base-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Popular Makes</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Make</th>
                  <th>Count</th>
                  <th>Avg Price</th>
                  <th>Market %</th>
                </tr>
              </thead>
              <tbody>
                {statisticsData.popular_makes.slice(0, 8).map((make, index) => (
                  <tr key={index}>
                    <td className="font-semibold">{make.make}</td>
                    <td>{make.count.toLocaleString()}</td>
                    <td>${make.avg_price.toLocaleString()}</td>
                    <td>{make.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Models Table */}
        <div className="bg-base-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Popular Models</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Make</th>
                  <th>Count</th>
                  <th>Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {statisticsData.popular_models.slice(0, 8).map((model, index) => (
                  <tr key={index}>
                    <td className="font-semibold">{model.model}</td>
                    <td>{model.make}</td>
                    <td>{model.count.toLocaleString()}</td>
                    <td>${model.avg_price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Body Types and Fuel Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Body Types */}
        <div className="bg-base-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Body Types</h3>
          <div className="space-y-3">
            {statisticsData.body_types.map((type, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                <div>
                  <span className="font-semibold">{type.type}</span>
                  <div className="text-sm text-base-content/70">
                    {type.count.toLocaleString()} listings ({type.percentage}%)
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${type.avg_price.toLocaleString()}</div>
                  <div className="text-sm text-base-content/70">avg price</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fuel Types */}
        <div className="bg-base-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Fuel Types</h3>
          <div className="space-y-3">
            {statisticsData.fuel_types.map((type, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                <div>
                  <span className="font-semibold">{type.type}</span>
                  <div className="text-sm text-base-content/70">
                    {type.count.toLocaleString()} listings ({type.percentage}%)
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${type.avg_price.toLocaleString()}</div>
                  <div className="text-sm text-base-content/70">avg price</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-base-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">Data Sources & Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Data Sources:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {statisticsData.data_sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Last Updated:</h4>
            <p className="text-sm">{new Date(statisticsData.last_updated).toLocaleString()}</p>
            <div className="mt-4">
              <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100">
                <div className="stat">
                  <div className="stat-title">Accuracy</div>
                  <div className="stat-value text-primary text-lg">98.3%</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Coverage</div>
                  <div className="stat-value text-secondary text-lg">50 States</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStatisticsTab;
