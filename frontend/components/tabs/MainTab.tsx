'use client';

import FeaturesGrid from '../FeaturesGrid';
import TestimonialsAvatars from '../TestimonialsAvatars';

const MainTab = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section for Main Tab */}
      <div className="text-center">
        <h2 className="text-4xl lg:text-6xl font-extrabold mb-6">
          AI-Powered Car Valuation
        </h2>
        <p className="text-xl text-base-content/80 max-w-3xl mx-auto mb-8">
          Get instant, accurate car price predictions powered by advanced machine learning. 
          Our platform analyzes millions of data points to provide you with the most reliable 
          car valuations in the market.
        </p>
        
        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Instant Results</h3>
            <p className="text-base-content/70">Get accurate price predictions in seconds</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">98.3% Accuracy</h3>
            <p className="text-base-content/70">Industry-leading prediction accuracy</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Market Insights</h3>
            <p className="text-base-content/70">Comprehensive market data and trends</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="stats stats-horizontal shadow-lg bg-base-200">
            <div className="stat">
              <div className="stat-title">Cars Analyzed</div>
              <div className="stat-value text-primary">3M+</div>
            </div>
            <div className="stat">
              <div className="stat-title">Accuracy Rate</div>
              <div className="stat-value text-secondary">98.3%</div>
            </div>
            <div className="stat">
              <div className="stat-title">Users Served</div>
              <div className="stat-value text-accent">50K+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Social Proof */}
      <div className="text-center">
        <p className="text-lg text-base-content/70 mb-6">
          Trusted by thousands of car buyers, sellers, and dealers
        </p>
        <TestimonialsAvatars />
      </div>

      {/* How It Works */}
      <div className="bg-base-200 rounded-3xl p-8 lg:p-12">
        <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl text-primary-content mx-auto mb-4">
              1
            </div>
            <h4 className="text-xl font-bold mb-2">Enter Car Details</h4>
            <p className="text-base-content/70">
              Provide basic information about your vehicle or use VIN lookup for automatic data entry
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-2xl text-secondary-content mx-auto mb-4">
              2
            </div>
            <h4 className="text-xl font-bold mb-2">AI Analysis</h4>
            <p className="text-base-content/70">
              Our advanced machine learning model analyzes market data and vehicle specifications
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl text-accent-content mx-auto mb-4">
              3
            </div>
            <h4 className="text-xl font-bold mb-2">Get Results</h4>
            <p className="text-base-content/70">
              Receive instant, accurate price predictions with confidence intervals and market insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTab;
