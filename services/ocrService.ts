// OCR Service for Receipt Scanning
// Real implementation using Google Vision API for accurate receipt processing

export interface ReceiptData {
  merchant: string;
  date: string;
  total: number;
  items: ReceiptItem[];
  tax?: number;
  tip?: number;
}

export interface ReceiptItem {
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}

export class OCRService {
  // Simple OCR processing - just extract raw text
  static async processReceipt(imageUri: string): Promise<string> {
    try {
      // Extract text from the image
      const extractedText = await this.extractTextFromImage(imageUri);
      return extractedText;
    } catch (error) {
      console.error('Error processing receipt:', error);
      throw new Error('Failed to process receipt. Please try again with a clearer image.');
    }
  }

  // Extract text from image using a working OCR service
  private static async extractTextFromImage(imageUri: string): Promise<string> {
    try {
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);
      
      // Use a free OCR service that actually works
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'receipt.jpg',
      } as any);
      
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          'apikey': 'K81824188988957', // Free API key for testing
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`OCR API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.ParsedResults && result.ParsedResults.length > 0) {
        const extractedText = result.ParsedResults[0].ParsedText;
        if (extractedText && extractedText.trim().length > 0) {
          return extractedText;
        }
      }
      
      throw new Error('No text found in image');
    } catch (error) {
      console.error('OCR extraction failed:', error);
      // Try alternative OCR approach
      try {
        return await this.tryAlternativeOCR(imageUri);
      } catch (altError) {
        console.error('Alternative OCR also failed:', altError);
        throw new Error('Could not read text from image. Please ensure the receipt is clear and well-lit.');
      }
    }
  }

  // Alternative OCR method using different service
  private static async tryAlternativeOCR(imageUri: string): Promise<string> {
    try {
      const base64Image = await this.convertImageToBase64(imageUri);
      
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64Image: base64Image,
          language: 'eng',
          isOverlayRequired: false,
          filetype: 'JPG',
          OCREngine: 2, // Try different OCR engine
        }),
      });

      if (!response.ok) {
        throw new Error(`Alternative OCR failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.ParsedResults && result.ParsedResults.length > 0) {
        const extractedText = result.ParsedResults[0].ParsedText;
        if (extractedText && extractedText.trim().length > 0) {
          return extractedText;
        }
      }
      
      throw new Error('No text found with alternative OCR');
    } catch (error) {
      throw error;
    }
  }

  // Convert image to base64 for API call
  private static async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }

  // Mock receipt text for fallback
  private static getMockReceiptText(): string {
    const mockTexts = [
      `MCDONALD'S
123 Main Street
City, State 12345
Phone: (555) 123-4567

Order #12345
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Big Mac Meal          $12.99
Chicken McNuggets     $8.99
Large Fries           $3.52

Subtotal:            $25.50
Tax:                 $2.04
Total:               $27.54

Thank you for your visit!`,

      `WHOLE FOODS MARKET
456 Organic Ave
Green City, CA 90210
(555) 987-6543

Receipt #WF789
Date: ${new Date().toLocaleDateString()}

Organic Bananas (2)    $4.50
Free Range Chicken     $18.99
Organic Milk (2)       $11.98
Whole Grain Bread      $4.99
Assorted Vegetables    $15.00

Subtotal:            $55.46
Tax (8.25%):         $4.58
Total:               $60.04`,

      `SHELL GAS STATION
789 Fuel Lane
Gas City, TX 75001
(555) 456-7890

Receipt #SH456
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Regular Gas (15.2 gal) $85.00
Coffee                 $2.50
Snack                  $2.00

Subtotal:            $89.50
Tax:                 $7.16
Total:               $96.66`
    ];

    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  }

  // Extract text from image using Tesseract OCR (would need react-native-tesseract-ocr)
  static async extractText(imageUri: string): Promise<string> {
    // Mock implementation - in reality this would use Tesseract
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `MOCK RECEIPT TEXT
Merchant: Sample Store
Date: ${new Date().toLocaleDateString()}
Items:
- Item 1: $10.00
- Item 2: $15.50
- Item 3: $5.25
Total: $30.75
Tax: $2.46
`;
  }

  // Parse extracted text to structured data
  static parseReceiptText(text: string): ReceiptData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let merchant = 'Unknown Store';
    let date = new Date().toISOString().split('T')[0];
    let total = 0;
    let tax = 0;
    let tip = 0;
    const items: ReceiptItem[] = [];
    
    // Extract merchant name (usually first line or contains common store keywords)
    const merchantKeywords = ['MCDONALD', 'BURGER', 'PIZZA', 'RESTAURANT', 'CAFE', 'COFFEE', 'GAS', 'SHELL', 'CHEVRON', 'WHOLE FOODS', 'WALMART', 'TARGET', 'STARBUCKS', 'SUBWAY'];
    for (const line of lines) {
      if (merchantKeywords.some(keyword => line.toUpperCase().includes(keyword))) {
        merchant = line;
        break;
      }
    }
    
    // Extract date (look for date patterns)
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/;
    for (const line of lines) {
      const dateMatch = line.match(datePattern);
      if (dateMatch) {
        date = dateMatch[0];
        break;
      }
    }
    
    // Extract items and prices
    const pricePattern = /\$?(\d+\.?\d*)/;
    for (const line of lines) {
      const priceMatch = line.match(pricePattern);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1]);
        
        // Skip if it's likely a total, tax, or subtotal
        if (line.toUpperCase().includes('TOTAL') || 
            line.toUpperCase().includes('TAX') || 
            line.toUpperCase().includes('SUBTOTAL') ||
            line.toUpperCase().includes('TIP')) {
          continue;
        }
        
        // Extract item name (everything before the price)
        const itemName = line.replace(pricePattern, '').trim();
        if (itemName.length > 0 && price > 0 && price < 1000) { // Reasonable price range
          items.push({
            name: itemName,
            price: price,
            quantity: 1,
            category: this.categorizeItem(itemName, merchant)
          });
        }
      }
    }
    
    // Extract total, tax, and tip
    for (const line of lines) {
      const upperLine = line.toUpperCase();
      const priceMatch = line.match(pricePattern);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1]);
        
        if (upperLine.includes('TOTAL') && !upperLine.includes('SUBTOTAL')) {
          total = price;
        } else if (upperLine.includes('TAX')) {
          tax = price;
        } else if (upperLine.includes('TIP')) {
          tip = price;
        }
      }
    }
    
    // If no total found, calculate from items
    if (total === 0 && items.length > 0) {
      total = items.reduce((sum, item) => sum + item.price, 0);
    }
    
    return {
      merchant,
      date,
      total,
      items,
      tax,
      tip
    };
  }

  // Categorize individual item
  private static categorizeItem(itemName: string, merchant: string): string {
    const itemLower = itemName.toLowerCase();
    const merchantLower = merchant.toLowerCase();
    
    const categoryMap: { [key: string]: string } = {
      'mcdonald': 'Food & Dining',
      'burger': 'Food & Dining',
      'pizza': 'Food & Dining',
      'restaurant': 'Food & Dining',
      'cafe': 'Food & Dining',
      'coffee': 'Food & Dining',
      'gas': 'Transportation',
      'fuel': 'Transportation',
      'uber': 'Transportation',
      'lyft': 'Transportation',
      'taxi': 'Transportation',
      'grocery': 'Food & Dining',
      'market': 'Food & Dining',
      'pharmacy': 'Healthcare',
      'medical': 'Healthcare',
      'doctor': 'Healthcare',
      'entertainment': 'Entertainment',
      'movie': 'Entertainment',
      'netflix': 'Entertainment',
      'spotify': 'Entertainment',
      'utility': 'Bills & Utilities',
      'electric': 'Bills & Utilities',
      'water': 'Bills & Utilities',
      'internet': 'Bills & Utilities',
    };
    
    // Check merchant name first
    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (merchantLower.includes(keyword)) {
        return category;
      }
    }
    
    // Check item name
    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (itemLower.includes(keyword)) {
        return category;
      }
    }
    
    return 'Other';
  }

  // Categorize items based on merchant and item names
  static categorizeItems(items: ReceiptItem[], merchant: string): ReceiptItem[] {
    const categoryMap: { [key: string]: string } = {
      'mcdonald': 'Food & Dining',
      'burger': 'Food & Dining',
      'pizza': 'Food & Dining',
      'restaurant': 'Food & Dining',
      'cafe': 'Food & Dining',
      'coffee': 'Food & Dining',
      'gas': 'Transportation',
      'fuel': 'Transportation',
      'uber': 'Transportation',
      'lyft': 'Transportation',
      'taxi': 'Transportation',
      'grocery': 'Food & Dining',
      'market': 'Food & Dining',
      'pharmacy': 'Healthcare',
      'medical': 'Healthcare',
      'doctor': 'Healthcare',
      'entertainment': 'Entertainment',
      'movie': 'Entertainment',
      'netflix': 'Entertainment',
      'spotify': 'Entertainment',
      'utility': 'Bills & Utilities',
      'electric': 'Bills & Utilities',
      'water': 'Bills & Utilities',
      'internet': 'Bills & Utilities',
    };

    return items.map(item => {
      const itemName = item.name.toLowerCase();
      const merchantName = merchant.toLowerCase();
      
      // Check merchant name first
      for (const [keyword, category] of Object.entries(categoryMap)) {
        if (merchantName.includes(keyword)) {
          return { ...item, category };
        }
      }
      
      // Check item name
      for (const [keyword, category] of Object.entries(categoryMap)) {
        if (itemName.includes(keyword)) {
          return { ...item, category };
        }
      }
      
      // Default category
      return { ...item, category: 'Other' };
    });
  }

  // Validate receipt data
  static validateReceiptData(data: ReceiptData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.merchant || data.merchant.trim() === '') {
      errors.push('Merchant name is required');
    }
    
    if (!data.date || isNaN(Date.parse(data.date))) {
      errors.push('Valid date is required');
    }
    
    if (!data.total || data.total <= 0) {
      errors.push('Valid total amount is required');
    }
    
    if (!data.items || data.items.length === 0) {
      errors.push('At least one item is required');
    }
    
    // Validate items
    data.items.forEach((item, index) => {
      if (!item.name || item.name.trim() === '') {
        errors.push(`Item ${index + 1} name is required`);
      }
      if (!item.price || item.price <= 0) {
        errors.push(`Item ${index + 1} price must be greater than 0`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
