'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface VinResult {
  vin: string;
  make_name: string;
  model_name: string;
  year: number;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  engine_displacement?: number;
  engine_cylinders?: string;
  success: boolean;
  message: string;
}

const VinLookupTab = () => {
  const [vinNumber, setVinNumber] = useState('');
  const [vinResult, setVinResult] = useState<VinResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVinLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vinNumber || vinNumber.length !== 17) {
      toast.error('Please enter a valid 17-character VIN number');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.carpricepredictor.com';
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

      const vinData: VinResult = await response.json();
      setVinResult(vinData);

      if (!vinData.success) {
        toast.warning(vinData.message || 'VIN decoded with limited information');
      } else {
        toast.success(vinData.message || 'VIN decoded successfully!');
      }
    } catch (error) {
      console.error('VIN lookup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to decode VIN. Please try again.';
      toast.error(errorMessage);
      setVinResult(null);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setVinResult(null);
    setVinNumber('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
          🔍 VIN Lookup
        </h2>
        <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
          Decode any Vehicle Identification Number (VIN) to get detailed vehicle information. 
          Our system connects to official databases to provide accurate vehicle specifications.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* VIN Input Section */}
        <div className="bg-base-200 rounded-2xl p-8">
          <form onSubmit={handleVinLookup} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Vehicle Identification Number (VIN)</span>
              </label>
              <input
                type="text"
                value={vinNumber}
                onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                placeholder="Enter 17-character VIN (e.g., 1HGCM82633A004352)"
                className="input input-bordered w-full text-lg font-mono"
                maxLength={17}
                required
              />
              <label className="label">
                <span className="label-text-alt">
                  VIN must be exactly 17 characters long
                </span>
                <span className="label-text-alt">
                  {vinNumber.length}/17
                </span>
              </label>
            </div>

            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <div className="text-sm">
                  <strong>Where to find your VIN:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Dashboard on driver's side (visible through windshield)</li>
                    <li>Driver's side door frame</li>
                    <li>Vehicle registration or insurance documents</li>
                    <li>Engine block or other major components</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || vinNumber.length !== 17}
                className="btn btn-primary flex-1"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Decoding VIN...
                  </>
                ) : (
                  'Decode VIN'
                )}
              </button>
              
              {vinResult && (
                <button
                  type="button"
                  onClick={clearResults}
                  className="btn btn-outline"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-base-200 rounded-2xl p-8">
          {vinResult ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Vehicle Information</h3>
                <div className={`badge ${vinResult.success ? 'badge-success' : 'badge-warning'}`}>
                  {vinResult.success ? 'Complete' : 'Partial'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-base-100 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">VIN:</span>
                    <span className="font-mono font-bold text-lg">{vinResult.vin}</span>
                  </div>
                  
                  <div className="divider my-2"></div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Make:</span>
                      <span className="font-semibold">{vinResult.make_name || 'Unknown'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Model:</span>
                      <span className="font-semibold">{vinResult.model_name || 'Unknown'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Year:</span>
                      <span className="font-semibold">{vinResult.year || 'Unknown'}</span>
                    </div>
                    
                    {vinResult.body_type && (
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Body Type:</span>
                        <span className="font-semibold">{vinResult.body_type}</span>
                      </div>
                    )}
                    
                    {vinResult.fuel_type && (
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Fuel Type:</span>
                        <span className="font-semibold">{vinResult.fuel_type}</span>
                      </div>
                    )}
                    
                    {vinResult.transmission && (
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Transmission:</span>
                        <span className="font-semibold">{vinResult.transmission}</span>
                      </div>
                    )}
                    
                    {vinResult.engine_displacement && (
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Engine Size:</span>
                        <span className="font-semibold">{vinResult.engine_displacement.toFixed(1)}L</span>
                      </div>
                    )}
                    
                    {vinResult.engine_cylinders && (
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Cylinders:</span>
                        <span className="font-semibold">{vinResult.engine_cylinders}</span>
                      </div>
                    )}
                  </div>
                </div>

                {vinResult.message && (
                  <div className={`alert ${vinResult.success ? 'alert-success' : 'alert-warning'}`}>
                    <span className="text-sm">{vinResult.message}</span>
                  </div>
                )}

                {vinResult.success && (
                  <div className="alert alert-info">
                    <span className="text-sm">
                      💡 You can now use this information in the Price Predictor tab to get an estimated value for this vehicle.
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Ready to Decode</h3>
              <p className="text-base-content/70">
                Enter a 17-character VIN to get detailed vehicle information
              </p>
              
              <div className="mt-6 text-left max-w-md mx-auto">
                <h4 className="font-semibold mb-2">Sample VINs to try:</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-base-100 rounded p-2 font-mono">1HGCM82633A004352</div>
                  <div className="bg-base-100 rounded p-2 font-mono">1FTFW1ET5DFC10312</div>
                  <div className="bg-base-100 rounded p-2 font-mono">1G1ZT53806F109149</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VinLookupTab;
