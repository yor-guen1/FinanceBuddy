# Gemini AI Setup for MoneyMate

## 🚀 **Get Your Gemini API Key**

### **Step 1: Go to Google AI Studio**
1. Visit: https://aistudio.google.com/
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key"
5. Copy your API key

### **Step 2: Add API Key to Your App**

#### **Option A: Environment File (Recommended)**
1. Copy `env.example` to `.env`:
   ```bash
   copy env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

#### **Option B: Direct in Code (For Testing)**
Edit `services/geminiAIService.ts` and replace:
```typescript
this.genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');
```
with:
```typescript
this.genAI = new GoogleGenerativeAI('your_actual_api_key_here');
```

## 🧪 **Test the Integration**

### **Step 1: Start the Backend**
```bash
cd backend
npm run dev
```

### **Step 2: Start the Expo App**
```bash
npx expo start
```

### **Step 3: Test Receipt Scanning**
1. Go to the Scanner tab
2. Take a photo or select from library
3. Choose "Use AI Analysis"
4. Watch Gemini AI analyze the receipt!

## 🤖 **What Gemini AI Does**

### **Intelligent Analysis:**
- **Merchant Detection**: Extracts store names accurately
- **Date Parsing**: Converts various date formats to YYYY-MM-DD
- **Item Recognition**: Identifies individual items and prices
- **Smart Categorization**: Automatically categorizes items (Food, Transportation, etc.)
- **Confidence Scoring**: Provides confidence levels for each analysis
- **Spending Insights**: Generates intelligent spending recommendations
- **Budget Impact**: Calculates how expenses affect different budget categories

### **Database Integration:**
- **Transactions Table**: Saves structured transaction data
- **Receipts Table**: Stores raw text and AI analysis in JSONB
- **Categories**: Automatically maps to appropriate categories
- **Real-time Saving**: Data is saved immediately after analysis

## 📊 **Example Analysis**

**Input Receipt Text:**
```
MCDONALD'S
123 Main Street
Order #12345
Date: 01/15/2024

Big Mac Meal          $12.99
Chicken McNuggets     $8.99
Large Fries           $3.52

Subtotal:            $25.50
Tax:                 $2.04
Total:               $27.54
```

**Gemini AI Output:**
```json
{
  "merchant": "MCDONALD'S",
  "date": "2024-01-15",
  "total": 27.54,
  "items": [
    {
      "name": "Big Mac Meal",
      "price": 12.99,
      "category": "Food & Dining",
      "confidence": 0.95
    },
    {
      "name": "Chicken McNuggets", 
      "price": 8.99,
      "category": "Food & Dining",
      "confidence": 0.95
    },
    {
      "name": "Large Fries",
      "price": 3.52,
      "category": "Food & Dining", 
      "confidence": 0.90
    }
  ],
  "suggestedCategory": "Food & Dining",
  "spendingInsights": [
    "This receipt is primarily Food & Dining (100% of total)",
    "Fast food purchase - consider meal planning to save money"
  ],
  "confidence": 0.93
}
```

## 🔧 **Troubleshooting**

### **API Key Issues:**
- Make sure your API key is correct
- Check that the environment variable is loaded
- Restart the Expo app after adding the API key

### **Analysis Failures:**
- Check the console for error messages
- Ensure the receipt text is clear and readable
- The system will fallback to mock data if Gemini fails

### **Database Issues:**
- Ensure the backend API is running
- Check that PostgreSQL is running
- Verify database connection in backend logs

## 🎯 **Next Steps**

Once Gemini is working:
1. **Test with real receipts** - Take photos of actual receipts
2. **Verify data accuracy** - Check that categories and amounts are correct
3. **Customize categories** - Add your own category mappings
4. **Add more AI features** - Implement spending predictions, budget alerts, etc.

The AI agent is now ready to intelligently read receipt text and populate your database with structured, categorized data!

