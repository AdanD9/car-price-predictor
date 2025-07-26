/* eslint-disable @next/next/no-img-element */
import React from "react";

const features = [
  {
    title: "AI-Powered Accuracy",
    description:
      "Our CatBoost model achieves 98.3% accuracy by analyzing 87+ features including make, model, mileage, condition, and market trends.",
    styles: "bg-primary text-primary-content",
    demo: (
      <div className="overflow-hidden h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <div className="text-2xl font-bold mb-2">98.3%</div>
          <div className="text-sm opacity-80">Prediction Accuracy</div>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse delay-100"></div>
            <div className="w-3 h-3 bg-white/70 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Instant Results",
    description: "Get your car's estimated value in seconds. No waiting, no complicated forms - just fast, reliable predictions.",
    styles: "md:col-span-2 bg-base-300 text-base-content",
    demo: (
      <div className="px-6 max-w-[600px] flex flex-col gap-4 overflow-hidden">
        <div className="bg-base-100 rounded-lg p-4 border-l-4 border-success">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">2020 Toyota Camry</div>
              <div className="text-sm text-base-content/70">45,000 miles</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-success">$24,500</div>
              <div className="text-xs text-base-content/70">Predicted Value</div>
            </div>
          </div>
        </div>
        <div className="bg-base-100 rounded-lg p-4 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">2019 Honda Civic</div>
              <div className="text-sm text-base-content/70">32,000 miles</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">$21,800</div>
              <div className="text-xs text-base-content/70">Predicted Value</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Comprehensive Analysis",
    description: "Our model considers 87+ factors including vehicle history, market trends, and regional pricing data.",
    styles: "md:col-span-2 bg-base-100 text-base-content",
    demo: (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <div className="bg-base-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🚗</div>
          <div className="text-sm font-medium">Vehicle Info</div>
          <div className="text-xs text-base-content/70">Make, Model, Year</div>
        </div>
        <div className="bg-base-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm font-medium">Market Data</div>
          <div className="text-xs text-base-content/70">Regional Pricing</div>
        </div>
        <div className="bg-base-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🔧</div>
          <div className="text-sm font-medium">Condition</div>
          <div className="text-xs text-base-content/70">History & Damage</div>
        </div>
        <div className="bg-base-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-sm font-medium">Performance</div>
          <div className="text-xs text-base-content/70">Engine & MPG</div>
        </div>
        <div className="bg-base-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">📍</div>
          <div className="text-sm font-medium">Location</div>
          <div className="text-xs text-base-content/70">Local Market</div>
        </div>
        <div className="bg-base-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-sm font-medium">Timing</div>
          <div className="text-xs text-base-content/70">Seasonal Trends</div>
        </div>
        <div className="bg-base-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🏷️</div>
          <div className="text-sm font-medium">Features</div>
          <div className="text-xs text-base-content/70">Options & Trim</div>
        </div>
        <div className="bg-primary rounded-lg p-4 text-center text-primary-content">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm font-medium">AI Result</div>
          <div className="text-xs opacity-80">Precise Value</div>
        </div>
      </div>
    ),
  },
  {
    title: "Market Intelligence",
    description: "Real-time market data and trends to ensure your valuation reflects current market conditions.",
    styles: "bg-neutral text-neutral-content",
    demo: (
      <div className="text-neutral-content px-6 space-y-4">
        <div className="bg-neutral-content text-neutral rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Market Trend</span>
            <span className="text-success text-sm">↗ +2.3%</span>
          </div>
          <div className="text-sm opacity-80">Used car prices trending up this month</div>
        </div>
        <div className="bg-neutral-content text-neutral rounded-lg p-4 opacity-0 group-hover:opacity-100 duration-500 translate-x-1/4 group-hover:translate-x-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Regional Data</span>
            <span className="text-primary text-sm">📍 Local</span>
          </div>
          <div className="text-sm opacity-80">Adjusted for your area's market conditions</div>
        </div>
        <div className="bg-neutral-content text-neutral rounded-lg p-4 opacity-0 group-hover:opacity-100 duration-700 translate-x-1/4 group-hover:translate-x-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Seasonal Factor</span>
            <span className="text-warning text-sm">🍂 Fall</span>
          </div>
          <div className="text-sm opacity-80">Seasonal demand patterns included</div>
        </div>
      </div>
    ),
  },
];
const FeaturesGrid = () => {
  return (
    <section className="flex justify-center items-center w-full bg-base-200/50 text-base-content py-20 lg:py-32">
      <div className="flex flex-col max-w-[82rem] gap-16 md:gap-20 px-4">
        <h2 className="max-w-3xl font-black text-4xl md:text-6xl tracking-[-0.01em]">
          Why Our AI <br /> Predictions Are{" "}
          <span className="underline decoration-dashed underline-offset-8 decoration-base-300">
            So Accurate
          </span>
        </h2>
        <div className="flex flex-col w-full h-fit gap-4 lg:gap-10 text-text-default max-w-[82rem]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`${feature.styles} rounded-3xl flex flex-col gap-6 w-full h-[22rem] lg:h-[25rem] pt-6 overflow-hidden group`}
              >
                <div className="px-6 space-y-2">
                  <h3 className="font-bold text-xl lg:text-3xl tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="opacity-80">{feature.description}</p>
                </div>
                {feature.demo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
