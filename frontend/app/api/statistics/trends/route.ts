import { NextResponse } from 'next/server';

export async function GET() {
  // Mock trends data for the Market Stats page
  const mockData = {
    year_trends: [
      { year: 2015, count: 145230, avg_price: 18500, avg_mileage: 85000 },
      { year: 2016, count: 167890, avg_price: 20200, avg_mileage: 78000 },
      { year: 2017, count: 189450, avg_price: 22100, avg_mileage: 71000 },
      { year: 2018, count: 212340, avg_price: 24300, avg_mileage: 64000 },
      { year: 2019, count: 234560, avg_price: 26800, avg_mileage: 57000 },
      { year: 2020, count: 198760, avg_price: 28900, avg_mileage: 45000 },
      { year: 2021, count: 176890, avg_price: 32400, avg_mileage: 35000 },
      { year: 2022, count: 203450, avg_price: 35600, avg_mileage: 25000 },
      { year: 2023, count: 245670, avg_price: 38200, avg_mileage: 15000 },
      { year: 2024, count: 156780, avg_price: 41500, avg_mileage: 8000 }
    ],
    price_ranges: [
      { range: "Under $10K", count: 427109, percentage: 15.0 },
      { range: "$10K - $15K", count: 569478, percentage: 20.0 },
      { range: "$15K - $25K", count: 854217, percentage: 30.0 },
      { range: "$25K - $35K", count: 569478, percentage: 20.0 },
      { range: "$35K - $50K", count: 284739, percentage: 10.0 },
      { range: "Over $50K", count: 142370, percentage: 5.0 }
    ],
    mileage_distribution: [
      { range: "0-25K miles", count: 427109, percentage: 15.0, avg_price: 35600 },
      { range: "25K-50K miles", count: 569478, percentage: 20.0, avg_price: 28900 },
      { range: "50K-75K miles", count: 711848, percentage: 25.0, avg_price: 24200 },
      { range: "75K-100K miles", count: 569478, percentage: 20.0, avg_price: 20800 },
      { range: "100K-150K miles", count: 427109, percentage: 15.0, avg_price: 16500 },
      { range: "Over 150K miles", count: 142370, percentage: 5.0, avg_price: 12300 }
    ],
    insights: {
      depreciation_rate: "Cars lose approximately 15-20% of their value per year",
      sweet_spot: "3-5 year old cars offer the best value proposition",
      high_mileage_threshold: "100,000+ miles significantly impacts resale value"
    },
    last_updated: new Date().toISOString(),
    data_sources: ["NHTSA Vehicle API", "Market Analysis", "Dealer Networks"]
  };

  return NextResponse.json(mockData);
}
