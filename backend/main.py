from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional, List
import pandas as pd
import numpy as np
from catboost import CatBoostRegressor
import logging
from datetime import datetime
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Car Price Predictor API",
    description="AI-powered car price prediction service using CatBoost model",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
model = None

# Load the trained model
def load_model():
    global model
    try:
        model_path = "catboost_model.cbm"
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        model = CatBoostRegressor()
        model.load_model(model_path)
        logger.info("Model loaded successfully")
        return True
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return False

# Load model on startup
@app.on_event("startup")
async def startup_event():
    success = load_model()
    if not success:
        logger.error("Failed to load model on startup")

class CarPredictionRequest(BaseModel):
    # Basic car information
    make_name: str = Field(..., description="Car manufacturer (e.g., Toyota, Honda)")
    model_name: str = Field(..., description="Car model (e.g., Camry, Civic)")
    year: int = Field(..., ge=2001, le=2025, description="Manufacturing year")
    mileage: int = Field(..., ge=0, le=200000, description="Car mileage in miles")
    
    # Engine and performance
    engine_displacement: Optional[int] = Field(None, ge=700, le=8400, description="Engine displacement in cc")
    horsepower: Optional[int] = Field(None, ge=55, le=1001, description="Engine horsepower")
    engine_cylinders: Optional[str] = Field(None, description="Number of cylinders (e.g., I4, V6, V8)")
    
    # Fuel economy
    city_fuel_economy: Optional[float] = Field(None, ge=7, le=127, description="City fuel economy (MPG)")
    highway_fuel_economy: Optional[float] = Field(None, ge=10, le=127, description="Highway fuel economy (MPG)")
    
    # Car specifications
    body_type: Optional[str] = Field(None, description="Body type (Sedan, SUV / Crossover, Coupe, etc.)")
    fuel_type: Optional[str] = Field(None, description="Fuel type (Gasoline, Hybrid, Electric, etc.)")
    transmission: Optional[str] = Field(None, description="Transmission type (A, M, CVT)")
    wheel_system: Optional[str] = Field(None, description="Drive system (FWD, RWD, AWD, 4X2)")
    
    # Physical dimensions
    length: Optional[float] = Field(None, description="Car length in inches")
    width: Optional[float] = Field(None, description="Car width in inches")
    height: Optional[float] = Field(None, description="Car height in inches")
    wheelbase: Optional[float] = Field(None, description="Wheelbase in inches")
    
    # Interior features
    maximum_seating: Optional[int] = Field(None, ge=2, le=19, description="Maximum seating capacity")
    front_legroom: Optional[float] = Field(None, description="Front legroom in inches")
    back_legroom: Optional[float] = Field(None, description="Back legroom in inches")
    
    # Other features
    listing_color: Optional[str] = Field(None, description="Car color")
    owner_count: Optional[int] = Field(None, ge=1, le=19, description="Number of previous owners")
    has_accidents: Optional[bool] = Field(None, description="Has accident history")
    frame_damaged: Optional[bool] = Field(None, description="Has frame damage")
    fleet: Optional[bool] = Field(None, description="Was fleet vehicle")
    salvage: Optional[bool] = Field(None, description="Has salvage title")
    theft_title: Optional[bool] = Field(None, description="Has theft title")
    
    @validator('make_name', 'model_name')
    def validate_strings(cls, v):
        if not v or not v.strip():
            raise ValueError('Field cannot be empty')
        return v.strip()

class CarPredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted car price in USD")
    confidence_interval: dict = Field(..., description="Price range estimate")
    model_info: dict = Field(..., description="Model performance metrics")
    
def get_season(month):
    """Convert month to season"""
    if month in [12, 1, 2]:
        return 'Winter'
    elif month in [3, 4, 5]:
        return 'Spring'
    elif month in [6, 7, 8]:
        return 'Summer'
    else:
        return 'Fall'

def preprocess_input(data: CarPredictionRequest) -> pd.DataFrame:
    """
    Preprocess input data to match the model's expected format
    """
    # Create base dataframe with all required columns
    # Based on the model training, we need 87 features (excluding price)

    # Initialize with default values
    processed_data = {
        # Numeric features
        'back_legroom': data.back_legroom if data.back_legroom else 35.0,
        'city_fuel_economy': data.city_fuel_economy if data.city_fuel_economy else 22.0,
        'daysonmarket': 30,  # Default to 30 days
        'engine_displacement': data.engine_displacement if data.engine_displacement else 2500,
        'fleet': data.fleet if data.fleet is not None else False,
        'frame_damaged': data.frame_damaged if data.frame_damaged is not None else False,
        'franchise_dealer': True,  # Default assumption
        'front_legroom': data.front_legroom if data.front_legroom else 42.0,
        'fuel_tank_volume': 16.0,  # Default fuel tank volume
        'has_accidents': data.has_accidents if data.has_accidents is not None else False,
        'height': data.height if data.height else 65.0,
        'highway_fuel_economy': data.highway_fuel_economy if data.highway_fuel_economy else 29.0,
        'horsepower': data.horsepower if data.horsepower else 200,
        'isCab': False,  # Default to not a cab
        'is_new': False,  # Assuming used car
        'length': data.length if data.length else 185.0,
        'maximum_seating': data.maximum_seating if data.maximum_seating else 5,
        'mileage': data.mileage,
        'owner_count': data.owner_count if data.owner_count else 1,
        'salvage': data.salvage if data.salvage is not None else False,
        'seller_rating': 4.0,  # Default seller rating
        'theft_title': data.theft_title if data.theft_title is not None else False,
        'wheelbase': data.wheelbase if data.wheelbase else 110.0,
        'width': data.width if data.width else 75.0,
        'year': data.year,

        # Categorical features (will be filled with defaults)
        'city': 'Unknown',
        'dealer_zip': 'Unknown',
        'engine_cylinders': data.engine_cylinders if data.engine_cylinders else 'I4',
        'franchise_make': data.make_name,
        'make_name': data.make_name,
        'model_name': data.model_name,
        'sp_name': 'Unknown',
        'torque': 'Unknown',
        'transmission_display': 'Unknown',
        'trim_name': 'Unknown',

        # Derived features
        'listing_month': datetime.now().month,
        'listing_year': datetime.now().year,
        'listing_day_of_week': datetime.now().weekday(),
        'is_weekend_listing': datetime.now().weekday() >= 5,
        'car_age': 2025 - data.year,
        'mileage_per_year': data.mileage / max(1, 2025 - data.year),
        'fuel_efficiency_combined': ((data.city_fuel_economy or 22) + (data.highway_fuel_economy or 29)) / 2,
        'power_per_displacement': (data.horsepower or 200) / (data.engine_displacement or 2500),
        'is_luxury_brand': data.make_name in ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Acura', 'Infiniti',
                                             'Cadillac', 'Lincoln', 'Porsche', 'Jaguar', 'Land Rover', 'Volvo'],
        'high_mileage': data.mileage > 100000,
    }

    # Add season
    processed_data['listing_season'] = get_season(processed_data['listing_month'])

    # Add market time category
    if processed_data['daysonmarket'] <= 30:
        processed_data['market_time_category'] = 'Quick_Sale'
    elif processed_data['daysonmarket'] <= 90:
        processed_data['market_time_category'] = 'Normal'
    elif processed_data['daysonmarket'] <= 180:
        processed_data['market_time_category'] = 'Slow'
    else:
        processed_data['market_time_category'] = 'Very_Slow'

    # Handle one-hot encoded features
    # Body type one-hot encoding
    body_types = ['Coupe', 'Hatchback', 'Minivan', 'Pickup Truck', 'SUV / Crossover', 'Sedan', 'Van', 'Wagon', 'nan']
    for bt in body_types:
        processed_data[f'body_type_{bt}'] = (data.body_type == bt) if data.body_type else False

    # Fuel type one-hot encoding
    fuel_types = ['Compressed Natural Gas', 'Diesel', 'Electric', 'Flex Fuel Vehicle', 'Gasoline', 'Hybrid', 'Propane', 'nan']
    for ft in fuel_types:
        processed_data[f'fuel_type_{ft}'] = (data.fuel_type == ft) if data.fuel_type else (ft == 'Gasoline')

    # Transmission one-hot encoding
    transmissions = ['CVT', 'Dual Clutch', 'M', 'nan']
    for trans in transmissions:
        processed_data[f'transmission_{trans}'] = (data.transmission == trans) if data.transmission else False

    # Wheel system one-hot encoding
    wheel_systems = ['4X2', 'AWD', 'FWD', 'RWD', 'nan']
    for ws in wheel_systems:
        processed_data[f'wheel_system_{ws}'] = (data.wheel_system == ws) if data.wheel_system else False

    # Listing color one-hot encoding
    colors = ['BLUE', 'BROWN', 'GOLD', 'GRAY', 'GREEN', 'ORANGE', 'PINK', 'PURPLE', 'RED', 'SILVER', 'TEAL', 'UNKNOWN', 'WHITE', 'YELLOW']
    for color in colors:
        processed_data[f'listing_color_{color}'] = (data.listing_color == color) if data.listing_color else False

    # Create DataFrame
    df = pd.DataFrame([processed_data])

    # Ensure categorical columns are properly typed
    categorical_columns = ['city', 'dealer_zip', 'engine_cylinders', 'franchise_make',
                          'make_name', 'model_name', 'sp_name', 'torque', 'transmission_display',
                          'trim_name', 'listing_season', 'market_time_category']

    for col in categorical_columns:
        if col in df.columns:
            df[col] = df[col].astype('category')

    return df

@app.get("/")
async def root():
    return {"message": "Car Price Predictor API", "status": "running", "model_loaded": model is not None}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict", response_model=CarPredictionResponse)
async def predict_car_price(request: CarPredictionRequest):
    """
    Predict car price based on input features
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Preprocess input data
        input_df = preprocess_input(request)

        # Make prediction (model expects log-transformed target, so we need to reverse it)
        prediction_log = model.predict(input_df)[0]
        predicted_price = np.expm1(prediction_log)  # Convert back from log scale

        # Calculate confidence interval (rough estimate based on model performance)
        # Using RMSE from training: approximately $1,970
        rmse_estimate = 1970
        confidence_lower = max(1000, predicted_price - rmse_estimate)
        confidence_upper = predicted_price + rmse_estimate

        response = CarPredictionResponse(
            predicted_price=float(predicted_price),
            confidence_interval={
                "lower": float(confidence_lower),
                "upper": float(confidence_upper),
                "confidence_level": 0.68  # Approximately 1 standard deviation
            },
            model_info={
                "model_type": "CatBoost Regressor",
                "r2_score": 0.9834,  # From training results
                "mae": 1146.38,      # From training results
                "rmse": 1969.66      # From training results
            }
        )

        logger.info(f"Prediction made: ${predicted_price:.2f} for {request.year} {request.make_name} {request.model_name}")
        return response

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/models/info")
async def get_model_info():
    """
    Get information about the loaded model
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    return {
        "model_type": "CatBoost Regressor",
        "performance_metrics": {
            "r2_score": 0.9834,
            "mae": 1146.38,
            "rmse": 1969.66
        },
        "training_info": {
            "training_samples": 2247145,
            "test_samples": 561787,
            "features": 87
        },
        "categorical_features": [
            'city', 'dealer_zip', 'engine_cylinders', 'franchise_make',
            'make_name', 'model_name', 'sp_name', 'torque', 'transmission_display',
            'trim_name', 'listing_season', 'market_time_category'
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
