'use client';

import React, { useState, useEffect } from 'react';

interface DataSource {
  name: string;
  description: string;
  url?: string;
  type: string;
  coverage: string;
  update_frequency: string;
}

interface DataSourcesData {
  sources: DataSource[];
  last_updated: string;
  cache_duration: string;
  data_quality: {
    completeness: string;
    accuracy: string;
    timeliness: string;
  };
}

const DataSourcesInfo: React.FC = () => {
  const [dataSourcesInfo, setDataSourcesInfo] = useState<DataSourcesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        setLoading(true);
        // Use local API endpoint for data sources
        const response = await fetch('/api/statistics/data-sources');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data sources information');
        }

        const data = await response.json();
        setDataSourcesInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDataSources();
  }, []);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-center">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading data sources: {error}</span>
      </div>
    );
  }

  if (!dataSourcesInfo) {
    return null;
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'government':
        return 'badge-primary';
      case 'analysis':
        return 'badge-secondary';
      case 'industry':
        return 'badge-accent';
      default:
        return 'badge-neutral';
    }
  };

  const getQualityColor = (value: string) => {
    if (value.toLowerCase().includes('high') || value.toLowerCase().includes('current')) {
      return 'text-success';
    }
    if (value.includes('%') && parseInt(value) > 90) {
      return 'text-success';
    }
    return 'text-base-content';
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">
          <span className="text-info">📊</span>
          Data Sources & Quality
        </h2>
        
        {/* Data Quality Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Completeness</div>
            <div className={`stat-value text-lg ${getQualityColor(dataSourcesInfo.data_quality.completeness)}`}>
              {dataSourcesInfo.data_quality.completeness}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Accuracy</div>
            <div className={`stat-value text-lg ${getQualityColor(dataSourcesInfo.data_quality.accuracy)}`}>
              {dataSourcesInfo.data_quality.accuracy}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Timeliness</div>
            <div className={`stat-value text-lg ${getQualityColor(dataSourcesInfo.data_quality.timeliness)}`}>
              {dataSourcesInfo.data_quality.timeliness}
            </div>
          </div>
        </div>

        {/* Data Sources List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
          {dataSourcesInfo.sources.map((source, index) => (
            <div key={index} className="border border-base-300 rounded-lg p-4 hover:bg-base-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-base-content">
                    {source.url ? (
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="link link-primary hover:link-accent"
                      >
                        {source.name}
                      </a>
                    ) : (
                      source.name
                    )}
                  </h4>
                  <span className={`badge ${getTypeColor(source.type)}`}>
                    {source.type}
                  </span>
                </div>
                <div className="text-sm text-base-content/60">
                  Updates: {source.update_frequency}
                </div>
              </div>
              <p className="text-base-content/80 mb-2">{source.description}</p>
              <div className="text-sm text-base-content/60">
                <strong>Coverage:</strong> {source.coverage}
              </div>
            </div>
          ))}
        </div>

        {/* Cache Information */}
        <div className="divider"></div>
        <div className="flex items-center justify-between text-sm text-base-content/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Cache Duration: {dataSourcesInfo.cache_duration}</span>
          </div>
          <div>
            Last Updated: {new Date(dataSourcesInfo.last_updated).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourcesInfo;
