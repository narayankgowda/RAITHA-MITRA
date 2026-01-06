
export interface MandiPrice {
  state: string;
  district: string;
  market: string;
  commodity: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  arrival_date: string;
  latitude?: number;
  longitude?: number;
  priceHistory: number[]; // Last 7 days modal prices
  forecast: { trend: 'up' | 'down' | 'stable'; percent: number }; // AI Prediction
}

// Comprehensive Karnataka APMC Data
export const liveMandiPriceData: MandiPrice[] = [
  // --- DHARWAD REGION ---
  { 
      state: "Karnataka", district: "Dharwad", market: "Hubli (Amaragol) APMC", commodity: "Onion", 
      min_price: 1200, max_price: 2400, modal_price: 1800, arrival_date: "2024-06-25", 
      latitude: 15.3934, longitude: 75.0859,
      priceHistory: [1650, 1700, 1680, 1750, 1780, 1800, 1800],
      forecast: { trend: 'up', percent: 5 }
  },
  { 
      state: "Karnataka", district: "Dharwad", market: "Hubli (Amaragol) APMC", commodity: "Dry Chilli", 
      min_price: 25000, max_price: 32000, modal_price: 28500, arrival_date: "2024-06-25", 
      latitude: 15.3934, longitude: 75.0859,
      priceHistory: [28000, 28200, 27500, 28000, 28400, 28500, 28500],
      forecast: { trend: 'stable', percent: 1 }
  },
  { 
      state: "Karnataka", district: "Dharwad", market: "Hubli (Amaragol) APMC", commodity: "Cotton", 
      min_price: 7200, max_price: 7800, modal_price: 7550, arrival_date: "2024-06-25", 
      latitude: 15.3934, longitude: 75.0859,
      priceHistory: [7400, 7450, 7500, 7520, 7550, 7550, 7550],
      forecast: { trend: 'up', percent: 3 }
  },

  // --- KOLAR REGION ---
  { 
      state: "Karnataka", district: "Kolar", market: "Kolar APMC", commodity: "Tomato", 
      min_price: 1500, max_price: 3200, modal_price: 2400, arrival_date: "2024-06-25", 
      latitude: 13.1364, longitude: 78.1292,
      priceHistory: [1800, 1950, 2100, 2000, 2150, 2400, 2400],
      forecast: { trend: 'up', percent: 15 }
  },
  { 
      state: "Karnataka", district: "Kolar", market: "Kolar APMC", commodity: "Mango", 
      min_price: 2500, max_price: 4500, modal_price: 3500, arrival_date: "2024-06-25", 
      latitude: 13.1364, longitude: 78.1292,
      priceHistory: [3800, 3700, 3600, 3550, 3500, 3500, 3500],
      forecast: { trend: 'down', percent: 4 }
  },

  // --- BELAGAVI REGION ---
  { 
      state: "Karnataka", district: "Belagavi", market: "Belagavi Main Market", commodity: "Vegetables (Mixed)", 
      min_price: 1800, max_price: 2500, modal_price: 2200, arrival_date: "2024-06-25", 
      latitude: 15.8497, longitude: 74.4977,
      priceHistory: [2000, 2100, 2150, 2100, 2200, 2200, 2200],
      forecast: { trend: 'up', percent: 2 }
  },
  { 
      state: "Karnataka", district: "Belagavi", market: "Belagavi Main Market", commodity: "Jaggery", 
      min_price: 3400, max_price: 4100, modal_price: 3800, arrival_date: "2024-06-25", 
      latitude: 15.8497, longitude: 74.4977,
      priceHistory: [3900, 3850, 3800, 3800, 3800, 3800, 3800],
      forecast: { trend: 'stable', percent: 0 }
  },

  // --- MYSURU REGION ---
  { 
      state: "Karnataka", district: "Mysuru", market: "Bandipalya APMC", commodity: "Ragi", 
      min_price: 2800, max_price: 3400, modal_price: 3100, arrival_date: "2024-06-24", 
      latitude: 12.2602, longitude: 76.6418,
      priceHistory: [3200, 3180, 3150, 3120, 3100, 3100, 3100],
      forecast: { trend: 'down', percent: 2 }
  },
  { 
      state: "Karnataka", district: "Mysuru", market: "Bandipalya APMC", commodity: "Banana (Nendra)", 
      min_price: 2200, max_price: 3000, modal_price: 2600, arrival_date: "2024-06-24", 
      latitude: 12.2602, longitude: 76.6418,
      priceHistory: [2400, 2500, 2550, 2600, 2600, 2600, 2600],
      forecast: { trend: 'up', percent: 6 }
  },

  // --- SHIVAMOGGA REGION ---
  { 
      state: "Karnataka", district: "Shivamogga", market: "Shivamogga APMC", commodity: "Arecanut (Red)", 
      min_price: 42000, max_price: 48000, modal_price: 45500, arrival_date: "2024-06-25", 
      latitude: 13.9328, longitude: 75.5732,
      priceHistory: [44000, 44500, 45000, 45200, 45500, 45500, 45500],
      forecast: { trend: 'up', percent: 3 }
  },
  { 
      state: "Karnataka", district: "Shivamogga", market: "Shivamogga APMC", commodity: "Ginger (Green)", 
      min_price: 6000, max_price: 9000, modal_price: 7500, arrival_date: "2024-06-25", 
      latitude: 13.9328, longitude: 75.5732,
      priceHistory: [7000, 7200, 7300, 7400, 7500, 7500, 7500],
      forecast: { trend: 'up', percent: 5 }
  },

  // --- RAICHUR REGION ---
  { 
      state: "Karnataka", district: "Raichur", market: "Raichur APMC", commodity: "Paddy (Sona Masuri)", 
      min_price: 2100, max_price: 2600, modal_price: 2450, arrival_date: "2024-06-25", 
      latitude: 16.2006, longitude: 77.3621,
      priceHistory: [2400, 2400, 2420, 2450, 2450, 2450, 2450],
      forecast: { trend: 'stable', percent: 1 }
  },
  { 
      state: "Karnataka", district: "Raichur", market: "Raichur APMC", commodity: "Cotton", 
      min_price: 7400, max_price: 8100, modal_price: 7800, arrival_date: "2024-06-25", 
      latitude: 16.2006, longitude: 77.3621,
      priceHistory: [7600, 7650, 7700, 7750, 7800, 7800, 7800],
      forecast: { trend: 'up', percent: 2 }
  },

  // --- BAGALKOT REGION ---
  { 
      state: "Karnataka", district: "Bagalkot", market: "Bagalkot APMC", commodity: "Maize", 
      min_price: 1950, max_price: 2250, modal_price: 2100, arrival_date: "2024-06-25", 
      latitude: 16.1736, longitude: 75.6667,
      priceHistory: [2000, 2050, 2080, 2100, 2100, 2100, 2100],
      forecast: { trend: 'stable', percent: 0 }
  },
  { 
      state: "Karnataka", district: "Bagalkot", market: "Bagalkot APMC", commodity: "Jowar (Sorghum)", 
      min_price: 2800, max_price: 3500, modal_price: 3200, arrival_date: "2024-06-25", 
      latitude: 16.1736, longitude: 75.6667,
      priceHistory: [3100, 3150, 3180, 3200, 3200, 3200, 3200],
      forecast: { trend: 'up', percent: 2 }
  },

  // --- HAVERI REGION ---
  { 
      state: "Karnataka", district: "Haveri", market: "Byadgi APMC", commodity: "Dry Chilli (Byadgi)", 
      min_price: 32000, max_price: 45000, modal_price: 38000, arrival_date: "2024-06-25", 
      latitude: 14.6766, longitude: 75.4853,
      priceHistory: [36000, 36500, 37000, 37500, 38000, 38000, 38000],
      forecast: { trend: 'up', percent: 4 }
  },
  { 
      state: "Karnataka", district: "Haveri", market: "Haveri APMC", commodity: "Groundnut", 
      min_price: 5800, max_price: 6500, modal_price: 6200, arrival_date: "2024-06-25", 
      latitude: 14.7960, longitude: 75.4093,
      priceHistory: [6000, 6100, 6150, 6200, 6200, 6200, 6200],
      forecast: { trend: 'up', percent: 3 }
  },

  // --- TUMAKURU REGION ---
  { 
      state: "Karnataka", district: "Tumakuru", market: "Tiptur APMC", commodity: "Copra (Dry Coconut)", 
      min_price: 8500, max_price: 9800, modal_price: 9200, arrival_date: "2024-06-25", 
      latitude: 13.2625, longitude: 76.4862,
      priceHistory: [9000, 9100, 9150, 9200, 9200, 9200, 9200],
      forecast: { trend: 'stable', percent: 1 }
  },
  { 
      state: "Karnataka", district: "Tumakuru", market: "Tumakuru APMC", commodity: "Ragi", 
      min_price: 3000, max_price: 3500, modal_price: 3250, arrival_date: "2024-06-25", 
      latitude: 13.3379, longitude: 77.1173,
      priceHistory: [3300, 3280, 3260, 3250, 3250, 3250, 3250],
      forecast: { trend: 'down', percent: 1 }
  },

  // --- BENGALURU REGION ---
  { 
      state: "Karnataka", district: "Bengaluru", market: "Yeshwanthpur APMC", commodity: "Onion", 
      min_price: 1800, max_price: 2600, modal_price: 2200, arrival_date: "2024-06-25", 
      latitude: 13.0286, longitude: 77.5460,
      priceHistory: [2000, 2100, 2150, 2180, 2200, 2200, 2200],
      forecast: { trend: 'up', percent: 7 }
  },
  { 
      state: "Karnataka", district: "Bengaluru", market: "Yeshwanthpur APMC", commodity: "Potato", 
      min_price: 1600, max_price: 2200, modal_price: 1900, arrival_date: "2024-06-25", 
      latitude: 13.0286, longitude: 77.5460,
      priceHistory: [1800, 1850, 1880, 1900, 1900, 1900, 1900],
      forecast: { trend: 'stable', percent: 2 }
  },
  { 
      state: "Karnataka", district: "Bengaluru", market: "Binny Mill (Fruit Market)", commodity: "Banana (Robusta)", 
      min_price: 1200, max_price: 1800, modal_price: 1500, arrival_date: "2024-06-25", 
      latitude: 12.9698, longitude: 77.5663,
      priceHistory: [1400, 1450, 1480, 1500, 1500, 1500, 1500],
      forecast: { trend: 'up', percent: 4 }
  },

  // --- CHITRADURGA REGION ---
  { 
      state: "Karnataka", district: "Chitradurga", market: "Chitradurga APMC", commodity: "Arecanut", 
      min_price: 40000, max_price: 46000, modal_price: 43500, arrival_date: "2024-06-25", 
      latitude: 14.2263, longitude: 76.4007,
      priceHistory: [42000, 42500, 43000, 43500, 43500, 43500, 43500],
      forecast: { trend: 'up', percent: 2 }
  },
  { 
      state: "Karnataka", district: "Chitradurga", market: "Chitradurga APMC", commodity: "Groundnut", 
      min_price: 5900, max_price: 6600, modal_price: 6300, arrival_date: "2024-06-25", 
      latitude: 14.2263, longitude: 76.4007,
      priceHistory: [6100, 6200, 6250, 6300, 6300, 6300, 6300],
      forecast: { trend: 'up', percent: 3 }
  },

  // --- MANDYA REGION ---
  { 
      state: "Karnataka", district: "Mandya", market: "Mandya APMC", commodity: "Jaggery (Cube)", 
      min_price: 3800, max_price: 4400, modal_price: 4100, arrival_date: "2024-06-25", 
      latitude: 12.5206, longitude: 76.8999,
      priceHistory: [4000, 4050, 4080, 4100, 4100, 4100, 4100],
      forecast: { trend: 'stable', percent: 1 }
  },
  { 
      state: "Karnataka", district: "Mandya", market: "Mandya APMC", commodity: "Paddy", 
      min_price: 2000, max_price: 2400, modal_price: 2200, arrival_date: "2024-06-25", 
      latitude: 12.5206, longitude: 76.8999,
      priceHistory: [2100, 2150, 2180, 2200, 2200, 2200, 2200],
      forecast: { trend: 'up', percent: 2 }
  },

  // --- KALABURAGI REGION ---
  { 
      state: "Karnataka", district: "Kalaburagi", market: "Kalaburagi APMC", commodity: "Tur (Red Gram)", 
      min_price: 7800, max_price: 8800, modal_price: 8400, arrival_date: "2024-06-25", 
      latitude: 17.3297, longitude: 76.8343,
      priceHistory: [8200, 8300, 8350, 8400, 8400, 8400, 8400],
      forecast: { trend: 'up', percent: 3 }
  },

  // --- UDUPI REGION ---
  { 
      state: "Karnataka", district: "Udupi", market: "Udupi APMC", commodity: "Coconut", 
      min_price: 2500, max_price: 3200, modal_price: 2800, arrival_date: "2024-06-25", 
      latitude: 13.3409, longitude: 74.7421,
      priceHistory: [2600, 2700, 2750, 2800, 2800, 2800, 2800],
      forecast: { trend: 'stable', percent: 2 }
  },

  // --- MANGALURU REGION ---
  { 
      state: "Karnataka", district: "Dakshina Kannada", market: "Mangaluru (Baikampady) APMC", commodity: "Arecanut (White)", 
      min_price: 38000, max_price: 44000, modal_price: 41500, arrival_date: "2024-06-25", 
      latitude: 12.9467, longitude: 74.8277,
      priceHistory: [40000, 40500, 41000, 41500, 41500, 41500, 41500],
      forecast: { trend: 'up', percent: 3 }
  },
  { 
      state: "Karnataka", district: "Dakshina Kannada", market: "Mangaluru (Baikampady) APMC", commodity: "Cashewnut", 
      min_price: 9500, max_price: 12000, modal_price: 10800, arrival_date: "2024-06-25", 
      latitude: 12.9467, longitude: 74.8277,
      priceHistory: [10500, 10600, 10700, 10800, 10800, 10800, 10800],
      forecast: { trend: 'up', percent: 4 }
  },

  // --- BALLARI REGION ---
  { 
      state: "Karnataka", district: "Ballari", market: "Ballari APMC", commodity: "Onion", 
      min_price: 1300, max_price: 1900, modal_price: 1600, arrival_date: "2024-06-25", 
      latitude: 15.1394, longitude: 76.9214,
      priceHistory: [1500, 1550, 1580, 1600, 1600, 1600, 1600],
      forecast: { trend: 'stable', percent: 1 }
  },

  // --- VIJAYAPURA REGION ---
  { 
      state: "Karnataka", district: "Vijayapura", market: "Vijayapura APMC", commodity: "Grapes (Raisins)", 
      min_price: 15000, max_price: 25000, modal_price: 21000, arrival_date: "2024-06-25", 
      latitude: 16.8302, longitude: 75.7100,
      priceHistory: [20000, 20500, 20800, 21000, 21000, 21000, 21000],
      forecast: { trend: 'stable', percent: 2 }
  },
  { 
      state: "Karnataka", district: "Vijayapura", market: "Vijayapura APMC", commodity: "Jowar", 
      min_price: 3000, max_price: 3600, modal_price: 3300, arrival_date: "2024-06-25", 
      latitude: 16.8302, longitude: 75.7100,
      priceHistory: [3200, 3250, 3280, 3300, 3300, 3300, 3300],
      forecast: { trend: 'up', percent: 1 }
  },

  // --- HASSAN REGION ---
  { 
      state: "Karnataka", district: "Hassan", market: "Hassan APMC", commodity: "Potato", 
      min_price: 1800, max_price: 2400, modal_price: 2100, arrival_date: "2024-06-25", 
      latitude: 13.0072, longitude: 76.1032,
      priceHistory: [2000, 2050, 2080, 2100, 2100, 2100, 2100],
      forecast: { trend: 'stable', percent: 2 }
  },
  { 
      state: "Karnataka", district: "Hassan", market: "Hassan APMC", commodity: "Coconut", 
      min_price: 2400, max_price: 3000, modal_price: 2700, arrival_date: "2024-06-25", 
      latitude: 13.0072, longitude: 76.1032,
      priceHistory: [2600, 2650, 2680, 2700, 2700, 2700, 2700],
      forecast: { trend: 'up', percent: 3 }
  },

  // --- DAVANAGERE REGION ---
  { 
      state: "Karnataka", district: "Davanagere", market: "Davanagere APMC", commodity: "Maize", 
      min_price: 1950, max_price: 2150, modal_price: 2050, arrival_date: "2024-06-25", 
      latitude: 14.4644, longitude: 75.9218,
      priceHistory: [2000, 2020, 2030, 2040, 2050, 2050, 2050],
      forecast: { trend: 'up', percent: 2 }
  },
  { 
      state: "Karnataka", district: "Davanagere", market: "Davanagere APMC", commodity: "Cotton", 
      min_price: 7500, max_price: 7800, modal_price: 7650, arrival_date: "2024-06-25", 
      latitude: 14.4644, longitude: 75.9218,
      priceHistory: [7400, 7500, 7550, 7600, 7650, 7650, 7650],
      forecast: { trend: 'up', percent: 4 }
  }
];
