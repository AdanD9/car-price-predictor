import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data sources information
  const mockData = {
    sources: [
      {
        name: "NHTSA Vehicle API",
        description: "National Highway Traffic Safety Administration vehicle database",
        url: "https://vpic.nhtsa.dot.gov/api/",
        type: "Government",
        coverage: "Vehicle makes, models, and specifications",
        update_frequency: "Real-time"
      },
      {
        name: "Market Analysis",
        description: "Aggregated market data and trends",
        type: "Analysis",
        coverage: "Price trends, depreciation patterns",
        update_frequency: "Daily"
      },
      {
        name: "Dealer Networks",
        description: "Automotive dealer inventory and pricing data",
        type: "Commercial",
        coverage: "Current market prices, inventory levels",
        update_frequency: "Hourly"
      },
      {
        name: "Auction Data",
        description: "Vehicle auction results and wholesale prices",
        type: "Commercial",
        coverage: "Wholesale values, market demand indicators",
        update_frequency: "Weekly"
      }
    ],
    data_quality: {
      accuracy_rate: 98.3,
      coverage_percentage: 95.7,
      freshness_score: 92.1,
      total_records: 2847392
    },
    last_updated: new Date().toISOString(),
    update_schedule: {
      statistics: "Every 6 hours",
      trends: "Daily at 2:00 AM EST",
      market_data: "Real-time streaming"
    }
  };

  return NextResponse.json(mockData);
}
