# 🚀 Quick Start: CSV Upload Guide

## ✅ Status: All Functions Working!

---

## Upload CSV via Web Interface (Easiest Method)

### Step 1: Open Application
```
http://localhost:3000
```

### Step 2: Go to Data Entry Tab
Click on "Data Entry" in the navigation

### Step 3: Download Template (Optional)
Click "Download Template" button to get the correct CSV format

### Step 4: Upload Your CSV
- **Option A**: Drag and drop your CSV file into the upload area
- **Option B**: Click "Choose File" button and select your CSV

### Step 5: Wait for Confirmation
You'll see: "Successfully imported X records to database!"

---

## CSV File Format

### Template
```csv
location,latitude,longitude,date,lead,mercury,cadmium,arsenic,chromium,copper,zinc,nickel
Mumbai,19.0760,72.8777,2024-11-08,0.012,0.004,0.002,0.015,0.03,0.15,0.8,0.05
```

### Rules
- ✅ First row must be headers (exactly as shown above)
- ✅ All columns are required
- ✅ Metal values in mg/L
- ✅ Date format: YYYY-MM-DD
- ✅ Latitude: -90 to 90
- ✅ Longitude: -180 to 180

---

## What Happens Automatically

When you upload a CSV:

1. ✅ **File Validation** - Checks if it's a valid CSV
2. ✅ **Location Creation** - Creates locations if they don't exist
3. ✅ **HPI Calculation** - Heavy Metal Pollution Index
4. ✅ **HEI Calculation** - Heavy Metal Evaluation Index
5. ✅ **Cd Calculation** - Contamination Degree
6. ✅ **Health Risk** - Automatic risk assessment
7. ✅ **Database Save** - Stores in MongoDB
8. ✅ **Map Update** - Adds markers to map
9. ✅ **Leaderboard Update** - Updates rankings
10. ✅ **Analytics Update** - Updates charts

---

## View Your Data

### Interactive Map
- Click "Interactive Map" tab
- See all locations with color-coded markers
- Click markers for details

### Leaderboard
- Click "Leaderboard" tab
- See highest/lowest pollution rankings
- View statistics

### Analytics
- Click "Analytics" tab
- See charts and graphs
- View trends

---

## Export Data

### Method 1: Via Web Interface
1. Go to Data Entry tab
2. Click "Export Results" button
3. CSV file downloads automatically

### Method 2: Via API
```
GET http://localhost:3000/api/measurements/export
```

---

## Troubleshooting

### "Please upload a CSV file"
- Make sure file extension is .csv
- Check file is not corrupted

### "Backend unavailable, processing locally..."
- Server might be down
- Check if http://localhost:3000 is accessible
- Data will still work locally

### "Failed to import CSV"
- Check CSV format matches template
- Verify all required columns present
- Check for special characters in data

### No data showing on map
- Refresh the page
- Check browser console (F12) for errors
- Verify latitude/longitude are valid numbers

---

## Test Your Setup

Run this command to verify everything works:
```powershell
powershell -ExecutionPolicy Bypass -File verify-all-functions.ps1
```

Expected output: "ALL TESTS PASSED!"

---

## Quick Test

1. Download template: Click "Download Template" button
2. Open the downloaded CSV in Excel/Notepad
3. Modify the sample data (change location names, values)
4. Save the file
5. Upload it back to the application
6. Check the map and leaderboard for your data

---

## API Endpoints (Advanced)

### Upload CSV
```
POST http://localhost:3000/api/measurements/import
Content-Type: multipart/form-data
Body: file (CSV file)
```

### Get All Data
```
GET http://localhost:3000/api/measurements
```

### Export CSV
```
GET http://localhost:3000/api/measurements/export
```

### Create Single Measurement
```
POST http://localhost:3000/api/measurements
Content-Type: application/json
Body: {
  "location_id": "...",
  "sample_date": "2024-11-08",
  "lead": 0.012,
  "mercury": 0.004,
  ...
}
```

---

## Need Help?

1. Check browser console (F12) for errors
2. Check server logs in terminal
3. Run verification script: `verify-all-functions.ps1`
4. Review `FUNCTION_VERIFICATION_COMPLETE.md` for details

---

**✅ Everything is working! Start uploading your water quality data now!**
