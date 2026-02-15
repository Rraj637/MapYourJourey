# Google Maps API Setup Guide

## Overview
This website now includes an interactive Google Earth/Maps viewer integrated into the "Live Map" section. Follow these steps to enable it.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Name it something like "MapYourJourney"

## Step 2: Enable the Maps API

1. In the Cloud Console, enable the following APIs:
   - **Google Maps JavaScript API**
   - **Maps Static API** (optional)
   - **Geocoding API** (optional)

2. Go to **Credentials** → **Create Credentials** → **API Key**
3. Copy your API Key

## Step 3: Add API Key to Your Website

In `index.html`, find this line in the `<head>` section:

```html
<script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places,maps3d"></script>
```

Replace `YOUR_GOOGLE_MAPS_API_KEY` with the API key you copied.

**Example:**
```html
<script async src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC_1234567890abcdefg&libraries=places,maps3d"></script>
```

## Step 4: Set API Restrictions (Optional but Recommended)

1. In **Credentials**, click on your API Key
2. Under **API restrictions**, select "Google Maps JavaScript API"
3. Under **Application restrictions**, select "HTTP referrers (web sites)"
4. Add your website URL

## Features Included

✅ **Interactive 3D Earth View** - Tilt and rotate the Earth  
✅ **2D Map View** - Traditional flat map  
✅ **Satellite Imagery** - High-resolution satellite view  
✅ **Zoom Controls** - Zoom in/out buttons  
✅ **Custom Styling** - Futuristic dark theme with cyan accents  
✅ **GIS Markers** - Automatically placed marker for reference  

## Map Controls

- **2D Button** - Switch to flat map view
- **3D Button** - Switch to tilted 3D Earth view
- **Satellite Button** - Switch to satellite imagery
- **+ / - Buttons** - Zoom in and out

## Troubleshooting

**"Google Maps API Key Required" message:**
- Check that you've replaced `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key
- Ensure the API is enabled in Google Cloud Console
- Check browser console for specific error messages

**Map not loading:**
- Verify your API key is correct
- Check that Maps JavaScript API is enabled
- Clear browser cache and refresh

**3D view not working:**
- Not all locations support 3D imagery
- Try different locations by modifying the `defaultLocation` in `script.js`
- 3D view works best with satellite or hybrid map types

## Customization

To change the default location, edit `script.js` and modify:

```javascript
const defaultLocation = { lat: 37.7749, lng: -122.4194 };
```

Example coordinates:
- **New York**: `{ lat: 40.7128, lng: -74.0060 }`
- **London**: `{ lat: 51.5074, lng: -0.1278 }`
- **Paris**: `{ lat: 48.8566, lng: 2.3522 }`
- **Tokyo**: `{ lat: 35.6762, lng: 139.6503 }`

## Pricing

Google Maps API usage may incur charges based on your usage tier. Check [Google Maps Pricing](https://developers.google.com/maps/billing-and-pricing) for details.

---

For more information, visit [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
