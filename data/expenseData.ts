
export type TransactionType = 'income' | 'expense';

export type ExpenseCategory = 'Seeds' | 'Fertilizers' | 'Labor' | 'Machinery' | 'Livestock Feed' | 'Utilities' | 'Other';
export type IncomeCategory = 'Crop Sales' | 'Dairy Sales' | 'Machinery Rental' | 'Govt Scheme' | 'Scrap/By-product' | 'Other';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  description: string;
  amount: number;
  receiptUrl?: string;
  cropType?: string; // Optional tagging by crop
}

export const initialTransactionData: Transaction[] = [
  // Realistic mixed history for demo
  { id: 'T1', date: '2024-05-10', type: 'expense', category: 'Seeds', description: 'Hybrid Paddy Seeds - 20kg', amount: 3500 },
  { id: 'T2', date: '2024-05-12', type: 'expense', category: 'Fertilizers', description: 'Urea (4 bags) & DAP (1 bag)', amount: 2800 },
  { id: 'T3', date: '2024-05-15', type: 'expense', category: 'Labor', description: 'Sowing Labor (Group of 4)', amount: 1600 },
  { id: 'T4', date: '2024-05-25', type: 'income', category: 'Dairy Sales', description: 'May Week 3 Milk Supply (120L)', amount: 5400 },
  { id: 'T5', date: '2024-06-01', type: 'income', category: 'Govt Scheme', description: 'PM-KISAN Installment 1', amount: 2000 },
  { id: 'T6', date: '2024-06-05', type: 'expense', category: 'Machinery', description: 'Tractor Service & Diesel Fill', amount: 4200 },
  { id: 'T7', date: '2024-06-10', type: 'expense', category: 'Labor', description: 'Manual Weeding - North Field', amount: 1200 },
  { id: 'T8', date: '2024-06-18', type: 'income', category: 'Crop Sales', description: 'Early Harvest Tomato Batch A', amount: 15500 },
  { id: 'T9', date: '2024-06-22', type: 'income', category: 'Dairy Sales', description: 'June Week 3 Milk Supply', amount: 4800 },
  { id: 'T10', date: '2024-06-25', type: 'expense', category: 'Other', description: 'Farm Tool Repairs', amount: 850 },
];
