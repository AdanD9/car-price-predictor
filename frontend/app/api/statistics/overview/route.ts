import { NextResponse } from 'next/server';

export async function GET() {
  // Mock statistics data for the Market Stats page
  const mockData = {
    summary: {
      total_listings: 2847392,
      average_price: 24750,
      most_popular_make: "Toyota",
      most_popular_model: "Camry",
      price_range_mode: "$15,000 - $25,000"
    },
    popular_makes: [
      { make: "Toyota", count: 425680, avg_price: 23450, percentage: 14.9 },
      { make: "Ford", count: 398240, avg_price: 22100, percentage: 14.0 },
      { make: "Chevrolet", count: 356890, avg_price: 21800, percentage: 12.5 },
      { make: "Honda", count: 334560, avg_price: 24200, percentage: 11.7 },
      { make: "Nissan", count: 298450, avg_price: 20900, percentage: 10.5 },
      { make: "BMW", count: 187320, avg_price: 35600, percentage: 6.6 },
      { make: "Mercedes-Benz", count: 165890, avg_price: 42300, percentage: 5.8 },
      { make: "Hyundai", count: 156780, avg_price: 19500, percentage: 5.5 },
      { make: "Volkswagen", count: 134560, avg_price: 26800, percentage: 4.7 },
      { make: "Audi", count: 128340, avg_price: 38900, percentage: 4.5 }
    ],
    popular_models: [
      { model: "Camry", make: "Toyota", count: 89450, avg_price: 24800 },
      { model: "Accord", make: "Honda", count: 78320, avg_price: 25200 },
      { model: "F-150", make: "Ford", count: 76890, avg_price: 32400 },
      { model: "Corolla", make: "Toyota", count: 72150, avg_price: 19600 },
      { model: "Civic", make: "Honda", count: 68940, avg_price: 21800 },
      { model: "Altima", make: "Nissan", count: 65780, avg_price: 22100 },
      { model: "Silverado", make: "Chevrolet", count: 63420, avg_price: 35600 },
      { model: "Malibu", make: "Chevrolet", count: 58930, avg_price: 20400 },
      { model: "Elantra", make: "Hyundai", count: 54670, avg_price: 18900 },
      { model: "Sentra", make: "Nissan", count: 52340, avg_price: 17800 }
    ],
    body_types: [
      { type: "Sedan", count: 1138956, percentage: 40.0, avg_price: 22400 },
      { type: "SUV", count: 854217, percentage: 30.0, avg_price: 28900 },
      { type: "Pickup Truck", count: 569478, percentage: 20.0, avg_price: 32100 },
      { type: "Hatchback", count: 142370, percentage: 5.0, avg_price: 19800 },
      { type: "Coupe", count: 113896, percentage: 4.0, avg_price: 26700 },
      { type: "Convertible", count: 28474, percentage: 1.0, avg_price: 35200 }
    ],
    fuel_types: [
      { type: "Gasoline", count: 2419683, percentage: 85.0, avg_price: 24200 },
      { type: "Hybrid", count: 227063, percentage: 8.0, avg_price: 27800 },
      { type: "Electric", count: 113532, percentage: 4.0, avg_price: 31500 },
      { type: "Diesel", count: 85422, percentage: 3.0, avg_price: 29600 }
    ],
    last_updated: new Date().toISOString(),
    data_sources: ["NHTSA Vehicle API", "Market Analysis", "Dealer Networks"]
  };

  return NextResponse.json(mockData);
}
