export interface Scheme {
  id: string;
  name: string;
  category: 'Subsidy' | 'Loan' | 'Insurance' | 'Training';
  description: string;
  eligibility: string[];
  benefits: string[];
  link: string;
}

export const schemeData: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    category: 'Subsidy',
    description: 'An income support scheme for all landholding farmer families in the country to supplement their financial needs.',
    eligibility: [
      'All landholding farmer families.',
      'Must have cultivable land up to 2 hectares.',
      'Must not be an institutional landholder.',
    ],
    benefits: [
      'Financial benefit of ₹6000 per year.',
      'Paid in three equal 4-monthly installments of ₹2000.',
      'Direct benefit transfer to the bank accounts.',
    ],
    link: 'https://pmkisan.gov.in/',
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    category: 'Loan',
    description: 'A scheme to provide farmers with timely access to credit for their cultivation and other needs.',
    eligibility: [
      'All farmers – individuals/joint borrowers who are owner cultivators.',
      'Tenant farmers, oral lessees & sharecroppers.',
      'Self Help Groups (SHGs) or Joint Liability Groups (JLGs) of farmers.',
    ],
    benefits: [
      'Short-term credit for cultivation of crops.',
      'Post-harvest expenses and marketing loan.',
      'Consumption requirements of farmer household.',
      'Working capital for maintenance of farm assets.',
    ],
    link: 'https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card',
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Insurance',
    description: 'A crop insurance scheme that integrates multiple stakeholders on a single platform to provide insurance cover and financial support to farmers in the event of failure of any of the notified crops.',
    eligibility: [
      'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.',
    ],
    benefits: [
      'Provides comprehensive insurance coverage against crop loss due to non-preventable natural risks.',
      'Stabilizes the income of farmers to ensure their continuance in farming.',
      'Encourages farmers to adopt innovative and modern agricultural practices.',
    ],
    link: 'https://pmfby.gov.in/',
  },
  {
    id: 'pkvy',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    category: 'Training',
    description: 'A sub-component of Soil Health Management (SHM) scheme under National Mission of Sustainable Agriculture (NMSA) aims at development of sustainable models of organic farming through a mix of traditional wisdom and modern science.',
    eligibility: [
      'Farmers willing to form a cluster of 50 acres for organic farming.',
      'Each farmer must have a valid Aadhaar card.',
    ],
    benefits: [
      'Financial assistance of ₹50,000 per hectare for 3 years.',
      'Training and capacity building for farmers in organic farming.',
      'Support for certification and marketing of organic produce.',
    ],
    link: 'https://pgsindia-ncof.gov.in/pkvy/index.html',
  },
];
