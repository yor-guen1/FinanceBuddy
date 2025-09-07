// Centralized Category Management Service
// This service provides consistent category management across the application

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface CategoryMapping {
  [key: string]: string; // keyword -> category name
}

export class CategoryService {
  // Default categories that match the database schema
  static readonly DEFAULT_CATEGORIES: Category[] = [
    { id: 'food-dining', name: 'Food & Dining', icon: '🍽️', color: '#FF6B6B', isDefault: true },
    { id: 'transportation', name: 'Transportation', icon: '🚗', color: '#4ECDC4', isDefault: true },
    { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#45B7D1', isDefault: true },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#96CEB4', isDefault: true },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#FFEAA7', isDefault: true },
    { id: 'bills-utilities', name: 'Bills & Utilities', icon: '💡', color: '#DDA0DD', isDefault: true },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#98D8C8', isDefault: true },
    { id: 'other', name: 'Other', icon: '📦', color: '#F7DC6F', isDefault: true }
  ];

  // Comprehensive category mapping for intelligent categorization
  static readonly CATEGORY_MAPPINGS: CategoryMapping = {
    // Food & Dining
    'mcdonald': 'Food & Dining',
    'burger': 'Food & Dining',
    'pizza': 'Food & Dining',
    'restaurant': 'Food & Dining',
    'cafe': 'Food & Dining',
    'coffee': 'Food & Dining',
    'starbucks': 'Food & Dining',
    'subway': 'Food & Dining',
    'kfc': 'Food & Dining',
    'taco': 'Food & Dining',
    'mexican': 'Food & Dining',
    'chinese': 'Food & Dining',
    'italian': 'Food & Dining',
    'thai': 'Food & Dining',
    'indian': 'Food & Dining',
    'fast food': 'Food & Dining',
    'dining': 'Food & Dining',
    'meal': 'Food & Dining',
    'lunch': 'Food & Dining',
    'dinner': 'Food & Dining',
    'breakfast': 'Food & Dining',
    'snack': 'Food & Dining',
    'drink': 'Food & Dining',
    'soda': 'Food & Dining',
    'juice': 'Food & Dining',
    'water': 'Food & Dining',
    'beer': 'Food & Dining',
    'wine': 'Food & Dining',
    'alcohol': 'Food & Dining',

    // Transportation
    'gas': 'Transportation',
    'fuel': 'Transportation',
    'gasoline': 'Transportation',
    'diesel': 'Transportation',
    'uber': 'Transportation',
    'lyft': 'Transportation',
    'taxi': 'Transportation',
    'bus': 'Transportation',
    'train': 'Transportation',
    'metro': 'Transportation',
    'subway': 'Transportation',
    'parking': 'Transportation',
    'toll': 'Transportation',
    'shell': 'Transportation',
    'chevron': 'Transportation',
    'exxon': 'Transportation',
    'bp': 'Transportation',
    'mobil': 'Transportation',
    'car': 'Transportation',
    'vehicle': 'Transportation',
    'auto': 'Transportation',
    'transport': 'Transportation',

    // Groceries
    'grocery': 'Groceries',
    'market': 'Groceries',
    'whole foods': 'Groceries',
    'walmart': 'Groceries',
    'target': 'Groceries',
    'costco': 'Groceries',
    'safeway': 'Groceries',
    'organic': 'Groceries',
    'fresh': 'Groceries',
    'produce': 'Groceries',
    'meat': 'Groceries',
    'dairy': 'Groceries',
    'bread': 'Groceries',
    'milk': 'Groceries',
    'eggs': 'Groceries',
    'vegetables': 'Groceries',
    'fruits': 'Groceries',
    'bananas': 'Groceries',
    'apples': 'Groceries',
    'chicken': 'Groceries',
    'beef': 'Groceries',
    'pork': 'Groceries',
    'fish': 'Groceries',
    'rice': 'Groceries',
    'pasta': 'Groceries',
    'soup': 'Groceries',
    'cereal': 'Groceries',
    'snacks': 'Groceries',
    'candy': 'Groceries',
    'chocolate': 'Groceries',

    // Healthcare
    'pharmacy': 'Healthcare',
    'medical': 'Healthcare',
    'doctor': 'Healthcare',
    'hospital': 'Healthcare',
    'clinic': 'Healthcare',
    'cvs': 'Healthcare',
    'walgreens': 'Healthcare',
    'medicine': 'Healthcare',
    'prescription': 'Healthcare',
    'vitamin': 'Healthcare',
    'supplement': 'Healthcare',
    'health': 'Healthcare',
    'dental': 'Healthcare',
    'vision': 'Healthcare',
    'eye': 'Healthcare',
    'glasses': 'Healthcare',
    'contact': 'Healthcare',
    'insurance': 'Healthcare',
    'medical bill': 'Healthcare',

    // Entertainment
    'movie': 'Entertainment',
    'cinema': 'Entertainment',
    'theater': 'Entertainment',
    'netflix': 'Entertainment',
    'spotify': 'Entertainment',
    'music': 'Entertainment',
    'game': 'Entertainment',
    'gaming': 'Entertainment',
    'entertainment': 'Entertainment',
    'amusement': 'Entertainment',
    'arcade': 'Entertainment',
    'bowling': 'Entertainment',
    'golf': 'Entertainment',
    'sports': 'Entertainment',
    'concert': 'Entertainment',
    'show': 'Entertainment',
    'ticket': 'Entertainment',
    'subscription': 'Entertainment',
    'streaming': 'Entertainment',

    // Bills & Utilities
    'utility': 'Bills & Utilities',
    'electric': 'Bills & Utilities',
    'electricity': 'Bills & Utilities',
    'water': 'Bills & Utilities',
    'internet': 'Bills & Utilities',
    'phone': 'Bills & Utilities',
    'cable': 'Bills & Utilities',
    'insurance': 'Bills & Utilities',
    'rent': 'Bills & Utilities',
    'mortgage': 'Bills & Utilities',
    'bills': 'Bills & Utilities',
    'utilities': 'Bills & Utilities',
    'gas bill': 'Bills & Utilities',
    'heating': 'Bills & Utilities',
    'cooling': 'Bills & Utilities',
    'trash': 'Bills & Utilities',
    'sewer': 'Bills & Utilities',

    // Shopping
    'clothing': 'Shopping',
    'shirt': 'Shopping',
    'pants': 'Shopping',
    'shoes': 'Shopping',
    'dress': 'Shopping',
    'jacket': 'Shopping',
    'accessories': 'Shopping',
    'electronics': 'Shopping',
    'phone': 'Shopping',
    'computer': 'Shopping',
    'laptop': 'Shopping',
    'tablet': 'Shopping',
    'camera': 'Shopping',
    'appliance': 'Shopping',
    'furniture': 'Shopping',
    'home': 'Shopping',
    'decor': 'Shopping',
    'gift': 'Shopping',
    'book': 'Shopping',
    'magazine': 'Shopping',
    'toy': 'Shopping',
    'game': 'Shopping'
  };

  // Get all default categories
  static getDefaultCategories(): Category[] {
    return [...this.DEFAULT_CATEGORIES];
  }

  // Get category by ID
  static getCategoryById(id: string): Category | undefined {
    return this.DEFAULT_CATEGORIES.find(cat => cat.id === id);
  }

  // Get category by name
  static getCategoryByName(name: string): Category | undefined {
    return this.DEFAULT_CATEGORIES.find(cat => cat.name === name);
  }

  // Categorize item based on name and merchant
  static categorizeItem(itemName: string, merchant?: string): string {
    const searchText = `${itemName} ${merchant || ''}`.toLowerCase();
    
    // Check for exact matches first
    for (const [keyword, category] of Object.entries(this.CATEGORY_MAPPINGS)) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
    
    // Check for partial matches
    for (const [keyword, category] of Object.entries(this.CATEGORY_MAPPINGS)) {
      const keywordWords = keyword.split(' ');
      if (keywordWords.length > 1) {
        const matchCount = keywordWords.filter(word => 
          searchText.includes(word.toLowerCase())
        ).length;
        
        // If most words match, use this category
        if (matchCount >= keywordWords.length * 0.7) {
          return category;
        }
      }
    }
    
    return 'Other';
  }

  // Calculate confidence score for categorization
  static calculateConfidence(itemName: string, merchant?: string, category?: string): number {
    if (!category) return 0.5;
    
    const searchText = `${itemName} ${merchant || ''}`.toLowerCase();
    const categoryKeywords = Object.entries(this.CATEGORY_MAPPINGS)
      .filter(([, cat]) => cat === category)
      .map(([keyword]) => keyword.toLowerCase());
    
    let matchCount = 0;
    let totalKeywords = categoryKeywords.length;
    
    for (const keyword of categoryKeywords) {
      if (searchText.includes(keyword)) {
        matchCount++;
      }
    }
    
    if (totalKeywords === 0) return 0.5;
    
    const baseConfidence = matchCount / totalKeywords;
    return Math.min(0.95, Math.max(0.5, baseConfidence));
  }

  // Get category icon
  static getCategoryIcon(categoryName: string): string {
    const category = this.getCategoryByName(categoryName);
    return category?.icon || '📦';
  }

  // Get category color
  static getCategoryColor(categoryName: string): string {
    const category = this.getCategoryByName(categoryName);
    return category?.color || '#F7DC6F';
  }

  // Validate category name
  static isValidCategory(categoryName: string): boolean {
    return this.DEFAULT_CATEGORIES.some(cat => cat.name === categoryName);
  }

  // Get all category names
  static getAllCategoryNames(): string[] {
    return this.DEFAULT_CATEGORIES.map(cat => cat.name);
  }
}
