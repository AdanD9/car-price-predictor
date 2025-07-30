'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface PredictionResult {
  predicted_price: number;
  confidence_interval: {
    lower: number;
    upper: number;
    confidence_level: number;
  };
  model_info: {
    model_type: string;
    algorithm?: string;
    accuracy?: string;
    note?: string;
  };
}

interface CarFormData {
  make_name: string;
  model_name: string;
  year: number;
  mileage: number;
  engine_displacement?: number;
  horsepower?: number;
  engine_cylinders?: string;
  city_fuel_economy?: number;
  highway_fuel_economy?: number;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  wheel_system?: string;
  length?: number;
  width?: number;
  height?: number;
  wheelbase?: number;
  maximum_seating?: number;
  front_legroom?: number;
  back_legroom?: number;
  listing_color?: string;
  owner_count?: number;
  has_accidents?: boolean;
  frame_damaged?: boolean;
  fleet?: boolean;
  salvage?: boolean;
  theft_title?: boolean;
}

const PricePredictorTab = () => {
  const [formData, setFormData] = useState<CarFormData>({
    make_name: '',
    model_name: '',
    year: 2020,
    mileage: 50000,
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.make_name || !formData.model_name || !formData.year || !formData.mileage) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.carpricepredictor.com';
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to get prediction');
      }

      const result: PredictionResult = await response.json();
      setPrediction(result);
      toast.success('Prediction generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get prediction. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
          🚗 Car Price Predictor
        </h2>
        <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
          Get instant, accurate car price predictions powered by AI. Our advanced machine learning model 
          analyzes thousands of data points to provide you with the most reliable car valuation.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Form Section */}
        <div className="bg-base-200 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Make *</span>
                </label>
                <input
                  type="text"
                  name="make_name"
                  value={formData.make_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Toyota"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Model *</span>
                </label>
                <input
                  type="text"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Camry"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Year *</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1990"
                  max="2025"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Mileage *</span>
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="e.g., 50000"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  checked={showAdvanced}
                  onChange={(e) => setShowAdvanced(e.target.checked)}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Show advanced options</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Analyzing...
                </>
              ) : (
                'Get Price Prediction'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-base-200 rounded-2xl p-8">
          {prediction ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Predicted Price</h3>
                <div className="text-5xl font-extrabold text-primary mb-4">
                  {formatPrice(prediction.predicted_price)}
                </div>
                <div className="text-sm text-base-content/70">
                  Range: {formatPrice(prediction.confidence_interval.lower)} - {formatPrice(prediction.confidence_interval.upper)}
                </div>
              </div>

              <div className="divider"></div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Model Information</h4>
                <div className="bg-base-100 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Model Type:</span>
                    <span className="font-medium">{prediction.model_info.model_type}</span>
                  </div>
                  {prediction.model_info.algorithm && (
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Algorithm:</span>
                      <span className="font-medium">{prediction.model_info.algorithm}</span>
                    </div>
                  )}
                  {prediction.model_info.accuracy && (
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Accuracy:</span>
                      <span className="font-medium">{prediction.model_info.accuracy}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Confidence:</span>
                    <span className="font-medium">{(prediction.confidence_interval.confidence_level * 100).toFixed(1)}%</span>
                  </div>
                </div>
                {prediction.model_info.note && (
                  <div className="alert alert-info">
                    <span className="text-sm">{prediction.model_info.note}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Ready for Analysis</h3>
              <p className="text-base-content/70">
                Fill out the form to get your car's predicted market value
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePredictorTab;
