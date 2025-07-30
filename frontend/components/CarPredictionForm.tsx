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
    r2_score: number;
    mae: number;
    rmse: number;
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

const CarPredictionForm = () => {
  const [activeTab, setActiveTab] = useState<'prediction' | 'vin'>('prediction');
  const [vinNumber, setVinNumber] = useState('');
  const [vinLoading, setVinLoading] = useState(false);

  const [formData, setFormData] = useState<CarFormData>({
    make_name: '',
    model_name: '',
    year: 2020,
    mileage: 50000,
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleVinLookup = async () => {
    if (!vinNumber || vinNumber.length !== 17) {
      toast.error('Please enter a valid 17-character VIN number');
      return;
    }

    setVinLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/vin/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vin: vinNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to decode VIN');
      }

      const vinData = await response.json();

      if (!vinData.success) {
        toast.warning(vinData.message || 'VIN decoded with limited information');
      } else {
        toast.success(vinData.message || 'VIN decoded successfully!');
      }

      // Update form data with VIN information
      setFormData(prev => ({
        ...prev,
        make_name: vinData.make_name || '',
        model_name: vinData.model_name || '',
        year: vinData.year || 2020,
        body_type: vinData.body_type || '',
        fuel_type: vinData.fuel_type || '',
        transmission: vinData.transmission || '',
        engine_displacement: vinData.engine_displacement || 0,
        engine_cylinders: vinData.engine_cylinders || '',
        mileage: prev.mileage, // Keep existing mileage
      }));

      setActiveTab('prediction');
      toast.info('Please verify the details and add mileage before getting prediction.');
    } catch (error) {
      console.error('VIN lookup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to decode VIN. Please try again.';
      toast.error(errorMessage);
    } finally {
      setVinLoading(false);
    }
  };

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result: PredictionResult = await response.json();
      setPrediction(result);
      toast.success('Prediction generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get prediction. Please try again.');
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
    <section className="bg-base-100 py-24" id="car-predictor">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
            Get Your Car's Value in Seconds
          </h2>
          <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
            Our AI-powered model analyzes thousands of data points to provide you with the most accurate car price prediction
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <div className="bg-base-200 rounded-2xl p-8">
            {/* Tabs */}
            <div className="tabs tabs-boxed mb-6">
              <button
                type="button"
                className={`tab ${activeTab === 'prediction' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('prediction')}
              >
                Price Prediction
              </button>
              <button
                type="button"
                className={`tab ${activeTab === 'vin' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('vin')}
              >
                VIN Lookup
              </button>
            </div>

            {/* VIN Lookup Tab */}
            {activeTab === 'vin' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Decode Your VIN</h3>
                  <p className="text-base-content/70">
                    Enter your 17-character VIN number to automatically populate vehicle details
                  </p>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">VIN Number *</span>
                  </label>
                  <input
                    type="text"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                    placeholder="Enter 17-character VIN"
                    className="input input-bordered w-full"
                    maxLength={17}
                  />
                  <div className="label">
                    <span className="label-text-alt">
                      {vinNumber.length}/17 characters
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleVinLookup}
                    disabled={vinLoading || vinNumber.length !== 17}
                    className="btn btn-primary flex-1"
                  >
                    {vinLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Decoding VIN...
                      </>
                    ) : (
                      'Decode VIN'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('prediction')}
                    className="btn btn-outline"
                  >
                    ← Go Back
                  </button>
                </div>

                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div className="text-sm">
                    VIN lookup will automatically fill in your vehicle's make, model, year, and other specifications.
                  </div>
                </div>
              </div>
            )}

            {/* Price Prediction Tab */}
            {activeTab === 'prediction' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Go Back Button */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Vehicle Details</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('vin')}
                    className="btn btn-outline btn-sm"
                  >
                    ← Go Back
                  </button>
                </div>
              {/* Required Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Make *</span>
                  </label>
                  <input
                    type="text"
                    name="make_name"
                    value={formData.make_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Toyota, Honda, BMW"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Model *</span>
                  </label>
                  <input
                    type="text"
                    name="model_name"
                    value={formData.model_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Camry, Civic, 3 Series"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Year *</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="2001"
                    max="2025"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Mileage *</span>
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    min="0"
                    max="200000"
                    placeholder="Miles"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <div className="divider">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="btn btn-ghost btn-sm"
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </button>
              </div>

              {/* Advanced Fields */}
              {showAdvanced && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Engine Displacement (cc)</span>
                      </label>
                      <input
                        type="number"
                        name="engine_displacement"
                        value={formData.engine_displacement || ''}
                        onChange={handleInputChange}
                        min="700"
                        max="8400"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Horsepower</span>
                      </label>
                      <input
                        type="number"
                        name="horsepower"
                        value={formData.horsepower || ''}
                        onChange={handleInputChange}
                        min="55"
                        max="1001"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Body Type</span>
                      </label>
                      <select
                        name="body_type"
                        value={formData.body_type || ''}
                        onChange={handleInputChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select body type</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV / Crossover">SUV / Crossover</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Pickup Truck">Pickup Truck</option>
                        <option value="Wagon">Wagon</option>
                        <option value="Van">Van</option>
                        <option value="Minivan">Minivan</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Fuel Type</span>
                      </label>
                      <select
                        name="fuel_type"
                        value={formData.fuel_type || ''}
                        onChange={handleInputChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select fuel type</option>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Flex Fuel Vehicle">Flex Fuel</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">City MPG</span>
                      </label>
                      <input
                        type="number"
                        name="city_fuel_economy"
                        value={formData.city_fuel_economy || ''}
                        onChange={handleInputChange}
                        min="7"
                        max="127"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Highway MPG</span>
                      </label>
                      <input
                        type="number"
                        name="highway_fuel_economy"
                        value={formData.highway_fuel_economy || ''}
                        onChange={handleInputChange}
                        min="10"
                        max="127"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Previous Owners</span>
                      </label>
                      <input
                        type="number"
                        name="owner_count"
                        value={formData.owner_count || ''}
                        onChange={handleInputChange}
                        min="1"
                        max="19"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>

                  {/* Condition Checkboxes */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                          <input
                            type="checkbox"
                            name="has_accidents"
                            checked={formData.has_accidents || false}
                            onChange={handleInputChange}
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text">Has accident history</span>
                        </label>
                      </div>
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                          <input
                            type="checkbox"
                            name="frame_damaged"
                            checked={formData.frame_damaged || false}
                            onChange={handleInputChange}
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text">Frame damaged</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                          <input
                            type="checkbox"
                            name="fleet"
                            checked={formData.fleet || false}
                            onChange={handleInputChange}
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text">Former fleet vehicle</span>
                        </label>
                      </div>
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                          <input
                            type="checkbox"
                            name="salvage"
                            checked={formData.salvage || false}
                            onChange={handleInputChange}
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text">Salvage title</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
            )}
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
                  <h4 className="font-semibold text-lg">Model Performance</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-base-100 p-3 rounded-lg">
                      <div className="font-medium">Accuracy (R²)</div>
                      <div className="text-lg font-bold text-success">
                        {(prediction.model_info.r2_score * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-base-100 p-3 rounded-lg">
                      <div className="font-medium">Avg Error</div>
                      <div className="text-lg font-bold">
                        {formatPrice(prediction.model_info.mae)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div className="text-sm">
                    This prediction is based on market data and should be used as a reference. 
                    Actual prices may vary based on condition, location, and market factors.
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-semibold mb-2">Ready to Get Started?</h3>
                <p className="text-base-content/70">
                  Fill out the form to get an instant AI-powered price prediction for your car.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarPredictionForm;
