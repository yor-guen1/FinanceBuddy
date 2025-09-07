# 🔐 Security Setup Guide

## **IMPORTANT: Secure Your API Keys**

Your API keys are currently exposed in the code. Follow these steps to secure them:

### **1. Create a .env file in the root directory:**

```bash
# Copy the example file
cp env.example .env
```

### **2. Edit the .env file with your actual API keys:**

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://192.168.0.72:3000

# Gemini AI Configuration - GET YOUR KEY FROM: https://makersuite.google.com/app/apikey
EXPO_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here

# OCR Configuration - GET YOUR KEY FROM: https://ocr.space/ocrapi/freekey
EXPO_PUBLIC_OCR_API_KEY=your_actual_ocr_api_key_here

# Database Configuration (for backend)
DATABASE_URL=sqlite://./moneymate.db
```

### **3. Get Your API Keys:**

#### **Gemini AI Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your .env file

#### **OCR.space Key (Optional):**
1. Go to [OCR.space](https://ocr.space/ocrapi/freekey)
2. Sign up for a free account
3. Get your API key
4. Replace the free key in your .env file

### **4. Security Best Practices:**

✅ **DO:**
- Keep your .env file in .gitignore (already done)
- Never commit API keys to version control
- Use different keys for development and production
- Rotate your keys regularly

❌ **DON'T:**
- Share your .env file
- Put API keys in code comments
- Use production keys in development
- Commit .env files to git

### **5. Current Status:**

- ✅ **OCR Service**: Now uses environment variable with fallback
- ✅ **Gemini AI Service**: Already uses environment variable
- ✅ **API URLs**: Already use environment variables
- ✅ **.env file**: Protected by .gitignore

### **6. Test Your Setup:**

After creating your .env file, restart the app:

```bash
npx expo start --clear
```

The app will now use your secure API keys from the .env file instead of hardcoded values.

## **⚠️ Security Warning:**

The current setup still has a fallback to a hardcoded OCR key. This is acceptable for development but should be removed in production. Consider using a more secure key management system for production deployments.
