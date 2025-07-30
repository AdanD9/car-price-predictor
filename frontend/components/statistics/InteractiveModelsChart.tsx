'use client';

import React, { useState, useEffect } from 'react';

interface ModelData {
  model: string;
  count: number;
  avg_price: number;
}

interface MakeData {
  make: string;
  models: ModelData[];
}

interface InteractiveModelsChartProps {
  data: MakeData[];
}

const InteractiveModelsChart: React.FC<InteractiveModelsChartProps> = ({ data }) => {
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sort makes alphabetically
  const sortedMakes = data.sort((a, b) => a.make.localeCompare(b.make));
  
  // Filter makes based on search term
  const filteredMakes = sortedMakes.filter(make => 
    make.make.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Set default selected make
  useEffect(() => {
    if (data.length > 0 && !selectedMake) {
      setSelectedMake(data[0].make);
    }
  }, [data, selectedMake]);

  const selectedMakeData = data.find(make => make.make === selectedMake);
  const topModels = selectedMakeData?.models.slice(0, 10) || [];

  // Calculate max count for scaling bars
  const maxCount = Math.max(...topModels.map(model => model.count));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatCount = (count: number) => {
    return new Intl.NumberFormat('en-US').format(count);
  };

  return (
    <div className="bg-base-100 rounded-lg p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-xl font-bold mb-4 sm:mb-0">Top Models by Make</h3>
        
        {/* Custom Dropdown */}
        <div className="relative w-full sm:w-64">
          <div className="dropdown dropdown-end w-full">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-outline w-full justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="truncate">{selectedMake || 'Select Make'}</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {isDropdownOpen && (
              <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto">
                {/* Search input */}
                <div className="p-2 sticky top-0 bg-base-100">
                  <input
                    type="text"
                    placeholder="Search makes..."
                    className="input input-bordered input-sm w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                {/* Make options */}
                <div className="max-h-40 overflow-y-auto">
                  {filteredMakes.slice(0, 50).map((make) => (
                    <li key={make.make}>
                      <button
                        className={`w-full text-left ${selectedMake === make.make ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedMake(make.make);
                          setIsDropdownOpen(false);
                          setSearchTerm('');
                        }}
                      >
                        {make.make}
                      </button>
                    </li>
                  ))}
                </div>
                
                {filteredMakes.length === 0 && (
                  <div className="p-2 text-center text-base-content/60">
                    No makes found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-3">
        {topModels.length > 0 ? (
          topModels.map((model, index) => (
            <div key={model.model} className="flex items-center space-x-4">
              {/* Rank */}
              <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              {/* Model name */}
              <div className="w-24 sm:w-32 text-sm font-medium truncate">
                {model.model}
              </div>
              
              {/* Bar */}
              <div className="flex-1 relative">
                <div className="bg-base-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(model.count / maxCount) * 100}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-base-content">
                    {formatCount(model.count)} listings
                  </div>
                </div>
              </div>
              
              {/* Average price */}
              <div className="w-20 sm:w-24 text-right text-sm font-medium text-success">
                {formatPrice(model.avg_price)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-base-content/60">
            No model data available for {selectedMake}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-base-300">
        <div className="flex flex-wrap gap-4 text-xs text-base-content/70">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded"></div>
            <span>Listing Count</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span>Average Price</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveModelsChart;
