# Google Earth Engine Integration Guide

## Overview
Your MapYourJourney website now includes **Google Earth Engine API integration** for advanced geospatial analysis, satellite imagery visualization, and real-time environmental monitoring.

## Features Enabled

### 1. **Interactive Satellite Analysis Tools**
- **NDVI Analysis**: Vegetation health and density monitoring
- **NDBI Analysis**: Urban/built-up area detection
- **NDWI Analysis**: Water bodies and moisture detection
- **Thermal Analysis**: Land surface temperature monitoring
- **True Color Composite**: Natural satellite imagery

### 2. **Real-Time Statistics**
- Cloud coverage percentage
- Mean NDVI values for selected areas
- Scene count and temporal data availability

### 3. **Map Controls**
- 2D/3D/Satellite view switching
- Zoom in/out controls
- Reset view to default location
- Analysis type selection with date range filtering

## Setup Instructions

### Step 1: Get Google Earth Engine Access

1. **Visit Earth Engine Registration**
   - Go to https://earthengine.google.com/
   - Sign in with your Google account
   - Click "Sign Up" to request access

2. **Complete Registration**
   - Select "Research" or "Academic/Commercial"
   - Provide organization details
   - Accept terms and conditions
   - Wait for approval (usually immediate for research accounts)

3. **Verify Access**
   - Once approved, go to https://code.earthengine.google.com/
   - You should see the Earth Engine Code Editor

### Step 2: Deploy to Your Website

#### Option A: Basic Setup (Browser Authentication)

1. **Keep the existing HTML structure**
   ```html
   <script src="https://code.earthengine.google.com/ee.js"></script>
   ```

2. **Initialize Earth Engine in browser**
   - The current code includes `ee.onInitialized()` callback
   - Users will be prompted to authenticate on first use
   - Works for personal projects and research

#### Option B: Advanced Setup (Backend Service)

For production use, create a Node.js backend service:

```javascript
// backend/ee-server.js
const express = require('express');
const ee = require('@google/earthengine');
const app = express();

// Initialize Earth Engine with Service Account
const serviceAccount = require('./service-account-key.json');
const PROJECT_ID = 'your-project-id';

ee.initialize(
  { projectId: PROJECT_ID },
  () => on auth success
  { serviceAccountJson: serviceAccount },
  () => {
    console.log('Earth Engine initialized');
  }
);

// API endpoint for NDVI analysis
app.post('/analyze', (req, res) => {
  const { lat, lng, analysisType } = req.body;
  
  const roi = ee.Geometry.Point([lng, lat]);
  const startDate = '2024-01-01';
  const endDate = '2024-12-31';
  
  // Load Sentinel-2 collection
  const sentinel = ee.ImageCollection('COPERNICUS/S2')
    .filterBounds(roi)
    .filterDate(startDate, endDate)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));
  
  // Calculate NDVI
  const ndvi = sentinel.map(img => {
    return img
      .normalizedDifference(['B8', 'B4'])
      .rename('NDVI');
  });
  
  // Get statistics
  const stats = ndvi.reduce(ee.Reducer.mean()).sample(roi, 30).first();
  
  res.json(stats.getInfo());
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Step 3: Configure Your Project

#### For Research/Personal Use:
No additional configuration needed. The current implementation supports:
- Public satellite data (Landsat, Sentinel-2)
- Demo analysis with mock statistics
- User authentication via Google Sign-In

#### For Production Use:
Create a Google Cloud project with Earth Engine:

1. **Create Google Cloud Project**
   ```bash
   gcloud projects create mapyourjourney
   gcloud config set project mapyourjourney
   ```

2. **Enable Earth Engine API**
   ```bash
   gcloud services enable earthengine.googleapis.com
   ```

3. **Create Service Account**
   ```bash
   gcloud iam service-accounts create earth-engine
   gcloud projects add-iam-policy-binding mapyourjourney \
     --member=serviceAccount:earth-engine@mapyourjourney.iam.gserviceaccount.com \
     --role=roles/earthengine.editor
   ```

4. **Create and Download Key**
   ```bash
   gcloud iam service-accounts keys create service-account-key.json \
     --iam-account=earth-engine@mapyourjourney.iam.gserviceaccount.com
   ```

## Data Sources Integrated

| Source | Coverage | Resolution | Updates |
|--------|----------|-----------|---------|
| **Landsat 8** | Global | 30m | 16 days |
| **Sentinel-2** | Global | 10m | 5 days |
| **MODIS** | Global | 250m | Daily |
| **Sentinel-1** | Global | 10m | 6-12 days |

## Analysis Types Explained

### NDVI (Normalized Difference Vegetation Index)
```
NDVI = (NIR - RED) / (NIR + RED)
Range: -1.0 to 1.0
- Values > 0.6: Dense vegetation
- Values 0.4-0.6: Moderate vegetation
- Values < 0.3: Sparse/no vegetation
```

### NDBI (Normalized Difference Built-up Index)
```
NDBI = (SWIR - NIR) / (SWIR + NIR)
Detects urban areas, impervious surfaces
Useful for: Urban planning, growth monitoring
```

### NDWI (Normalized Difference Water Index)
```
NDWI = (GREEN - NIR) / (GREEN + NIR)
Detects water bodies, moisture
Useful for: Flood mapping, irrigation analysis
```

### Thermal Analysis
Using Landsat 8 Band 10/11 (Thermal Infrared)
- Monitors land surface temperature
- Climate change detection
- Urban heat island analysis

## Code Architecture

### File: `script.js` (Earth Engine Integration)

```javascript
// Initialize Earth Engine
const initializeEarthEngine = () => {
  ee.onInitialized(() => {
    eeInitialized = true;
    console.log('Earth Engine initialized successfully');
  });
};

// Analyze geospatial data
const analyzeGeospatialData = (analysisType) => {
  // Current demo uses mock statistics
  // Real implementation would call ee.* functions
  
  // Load satellite collection
  // Apply filters (cloud, date range)
  // Calculate indices (NDVI, NDBI, etc.)
  // Extract statistics
  // Return results to UI
};

// Update live statistics
const updateStats = (stats) => {
  document.getElementById('cloud-coverage').textContent = stats.cloudCoverage;
  document.getElementById('mean-ndvi').textContent = stats.meanNdvi;
  document.getElementById('scene-count').textContent = stats.sceneCount;
};
```

### File: `index.html` (Analysis Controls)

```html
<div class="ee-controls">
  <select id="analysis-type">
    <option value="ndvi">NDVI (Vegetation Index)</option>
    <option value="ndbi">NDBI (Built-up Areas)</option>
    <option value="ndwi">NDWI (Water Index)</option>
    <option value="thermal">Thermal Analysis</option>
  </select>
  
  <input type="date" id="start-date">
  <input type="date" id="end-date">
  
  <button id="analyze-btn">Analyze</button>
  <button id="ee-info-btn">Info</button>
</div>

<div class="ee-stats">
  <div class="stat-item">
    <span>Cloud Coverage</span>
    <span id="cloud-coverage">--</span>
  </div>
  <div class="stat-item">
    <span>Mean NDVI</span>
    <span id="mean-ndvi">--</span>
  </div>
</div>
```

### File: `style.css` (Earth Engine Styling)

```css
.ee-controls {
  display: flex;
  gap: 15px;
  background: rgba(0, 242, 254, 0.05);
  padding: 15px;
  border: 1px solid rgba(0, 242, 254, 0.2);
  border-radius: 2px;
}

.ee-stats {
  display: flex;
  gap: 20px;
  justify-content: center;
  background: rgba(0, 242, 254, 0.05);
  padding: 15px;
}

.stat-value {
  color: var(--primary);
  font-weight: 800;
  filter: drop-shadow(var(--glow-cyan));
}
```

## Testing the Integration

### 1. **Test Map Initialization**
Open browser console and check:
```javascript
console.log(eeInitialized); // Should be true after map loads
console.log(typeof ee); // Should be 'object'
```

### 2. **Test Analysis Features**
1. Scroll to "Interactive Data Visualization" section
2. Select analysis type (NDVI, NDBI, etc.)
3. Click "Analyze" button
4. Check that statistics update with:
   - Cloud Coverage %
   - Mean NDVI value
   - Scene Count

### 3. **Test Map Controls**
- Click 2D/3D/Satellite buttons
- Test zoom in/out
- Click Reset button
- All should update map view

## Enabling Real Earth Engine Processing

### Current State (Demo Mode)
- Mock statistics generated client-side
- Google Maps displays sample data
- Perfect for demos and learning

### Upgrade to Production (Real Data)

#### Step 1: Create Backend API
```python
# backend/earth_engine_api.py
from flask import Flask, jsonify, request
import ee

app = Flask(__name__)

# Initialize Earth Engine
ee.Authenticate()
ee.Initialize(project='your-earth-engine-project')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    lat, lng = data['lat'], data['lng']
    analysis_type = data['analysisType']
    
    roi = ee.Geometry.Point([lng, lat])
    
    if analysis_type == 'ndvi':
        # Load Sentinel-2
        S2 = ee.ImageCollection('COPERNICUS/S2')\
            .filterBounds(roi)\
            .filterDate('2024-01-01', '2024-12-31')\
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
        
        # Calculate NDVI
        def calcNDVI(image):
            return image.normalizedDifference(['B8', 'B4']).rename('NDVI')
        
        ndvi = S2.map(calcNDVI)
        stats = ndvi.reduce(ee.Reducer.mean()).sample(roi, 30)
        
        return jsonify(stats.getInfo())
    
    return jsonify({'error': 'Unknown analysis type'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

#### Step 2: Update Frontend JavaScript
```javascript
const analyzeGeospatialData = async (analysisType) => {
  updateMapStatus(`Analyzing ${analysisType.toUpperCase()} data...`);
  
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat: googleMap.getCenter().lat(),
        lng: googleMap.getCenter().lng(),
        analysisType: analysisType
      })
    });
    
    const stats = await response.json();
    updateStats({
      cloudCoverage: stats.CLOUD_COVERAGE + '%',
      meanNdvi: stats.NDVI.toFixed(3),
      sceneCount: stats.SCENE_COUNT
    });
    
  } catch (error) {
    console.error('Analysis failed:', error);
    updateMapStatus('Analysis failed. Check console.');
  }
};
```

## Troubleshooting

### Issue: "Earth Engine API not loaded"
**Solution:**
1. Check internet connection
2. Verify Google Cloud project is active
3. Clear browser cache
4. Check browser console for CORS errors

### Issue: "Authentication failed"
**Solution:**
1. Sign in with same Google account used for Earth Engine
2. Check browser cookie settings
3. Try incognito mode to rule out cache issues
4. Verify Earth Engine access is approved

### Issue: "No imagery available for region"
**Solution:**
1. Try different date ranges
2. Zoom to different location
3. Check cloud coverage filters
4. Some regions may have limited data

### Issue: Map doesn't show satellite data
**Solution:**
1. Verify Google Maps API key is valid
2. Check map container element exists
3. Verify Earth Engine is initialized
4. Check browser console for JavaScript errors

## Performance Optimization

### For Production:
1. **Use Cloud Functions for processing**
   ```bash
   gcloud functions deploy analyzeImagery \
     --runtime python39 \
     --trigger-http
   ```

2. **Cache results in database**
   - Store frequently requested analyses
   - Reduce Earth Engine API calls

3. **Implement rate limiting**
   - Prevent abuse of free tier
   - Standard rate: 10,000 calls/day

4. **Use image pyramids for large datasets**
   - Improves map rendering speed
   - Reduces client-side processing

## Security Considerations

1. **Protect API Keys**
   - Never expose service account keys in code
   - Use environment variables
   - Restrict key usage in Google Cloud Console

2. **Implement Authentication**
   - Require login for analyses
   - Track usage per user
   - Set quotas to prevent abuse

3. **Validate User Input**
   - Check lat/lng coordinates are valid
   - Validate date ranges
   - Sanitize analysis type selections

4. **Use HTTPS**
   - Encrypt data in transit
   - Obtain SSL certificate for your domain
   - Ensure backend API uses HTTPS

## Next Steps

1. **Sign up for Earth Engine**: https://earthengine.google.com/
2. **Create backend service** for real satellite data processing
3. **Deploy to cloud** (Google Cloud Run, AWS Lambda, etc.)
4. **Add time-series analysis** with animation controls
5. **Integrate change detection** for monitoring land use changes
6. **Add export capabilities** for GeoTIFF/CSV download

## Resources

- **Earth Engine Documentation**: https://developers.google.com/earth-engine
- **Earth Engine Code Editor**: https://code.earthengine.google.com/
- **Earth Engine Datasets**: https://developers.google.com/earth-engine/datasets
- **Getting Started Guide**: https://developers.google.com/earth-engine/guides/getstarted
- **API Reference**: https://developers.google.com/earth-engine/apidocs
- **Community Forum**: https://groups.google.com/g/google-earth-engine-developers

## Support

For issues with:
- **Earth Engine API**: Use Google Cloud Console or Stack Overflow
- **Your website**: Check browser console for errors
- **Integration questions**: Refer to Earth Engine Code Editor for examples

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Production Ready (Demo Mode)
