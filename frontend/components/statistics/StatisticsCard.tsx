'use client';

import React from 'react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = ''
}) => {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="card-title text-sm font-medium text-base-content/70">
              {title}
            </h3>
            <div className="text-2xl font-bold text-base-content mt-1">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {subtitle && (
              <p className="text-sm text-base-content/60 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? 'text-success' : 'text-error'
                  }`}
                >
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-base-content/60 ml-1">
                  vs last period
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="text-3xl text-primary opacity-80">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
