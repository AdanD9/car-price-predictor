'use client';

import { useState } from 'react';
import PricePredictorTab from './tabs/PricePredictorTab';
import VinLookupTab from './tabs/VinLookupTab';
import MarketStatisticsTab from './tabs/MarketStatisticsTab';
import MainTab from './tabs/MainTab';

type TabType = 'main' | 'predictor' | 'vin' | 'statistics';

const TabbedInterface = () => {
  const [activeTab, setActiveTab] = useState<TabType>('main');

  const tabs = [
    { id: 'main', label: 'Home', icon: '🏠' },
    { id: 'predictor', label: 'Price Predictor', icon: '💰' },
    { id: 'vin', label: 'VIN Lookup', icon: '🔍' },
    { id: 'statistics', label: 'Market Stats', icon: '📊' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'main':
        return <MainTab />;
      case 'predictor':
        return <PricePredictorTab />;
      case 'vin':
        return <VinLookupTab />;
      case 'statistics':
        return <MarketStatisticsTab />;
      default:
        return <MainTab />;
    }
  };

  return (
    <section className="bg-base-100 py-12" id="main-interface">
      <div className="max-w-7xl mx-auto px-8">
        {/* Tab Navigation */}
        <div className="tabs tabs-boxed justify-center mb-8 bg-base-200 p-2 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab tab-lg gap-2 ${
                activeTab === tab.id ? 'tab-active' : ''
              }`}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {renderTabContent()}
        </div>
      </div>
    </section>
  );
};

export default TabbedInterface;
