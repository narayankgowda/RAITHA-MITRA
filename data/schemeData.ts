
export interface Scheme {
  id: string;
  name: string;
  category: 'Subsidy' | 'Loan' | 'Insurance' | 'Training' | 'Infrastructure' | 'Pension' | 'Health';
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
      'Must have cultivable land.',
      'Must not be an institutional landholder or fall under certain exclusion criteria.',
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
    description: 'A sub-component of Soil Health Management (SHM) scheme under National Mission of Sustainable Agriculture (NMSA) aims at development of sustainable models of organic farming.',
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
  {
    id: 'pm-ksy',
    name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    category: 'Infrastructure',
    description: 'Aims to enhance physical access of water on farm and expand cultivable area under assured irrigation, improve on-farm water use efficiency, introduce sustainable water conservation practices, etc.',
    eligibility: [
        'Farmers across all states and districts.',
        'Implementation is state-led.'
    ],
    benefits: [
        'Financial assistance for creating water sources.',
        'Subsidy on micro-irrigation systems like drip and sprinkler.',
        'Promotes "Per Drop, More Crop" for water efficiency.'
    ],
    link: 'https://pmksy.gov.in/'
  },
  {
    id: 'shc',
    name: 'Soil Health Card Scheme',
    category: 'Health',
    description: 'A scheme to provide every farmer with a soil health card, which will display the soil health status of their holding and advice on the dosage of different nutrients needed.',
    eligibility: [
        'All farmers are eligible to get their soil tested.'
    ],
    benefits: [
        'Provides a report on the nutrient status of the soil.',
        'Recommends appropriate dosage of fertilizers for improved soil health.',
        'Helps in increasing crop yield and reducing cultivation cost.'
    ],
    link: 'https://soilhealth.dac.gov.in/'
  },
  {
    id: 'e-nam',
    name: 'National Agriculture Market (e-NAM)',
    category: 'Infrastructure',
    description: 'A pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.',
    eligibility: [
        'Farmers, traders, and buyers with a license from any APMC in the state.'
    ],
    benefits: [
        'Provides a single window service for all APMC-related information and services.',
        'Enables transparent price discovery and better returns for farmers.',
        'Access to a larger national market for their produce.'
    ],
    link: 'https://www.enam.gov.in/web/'
  },
  {
    id: 'smam',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    category: 'Subsidy',
    description: 'Aims at making farm machines accessible and affordable for the small and marginal farmers (SMFs) through the establishment of Custom Hiring Centers (CHCs).',
    eligibility: [
        'Individual farmers, entrepreneurs, SHGs, and cooperative societies.'
    ],
    benefits: [
        'Subsidy ranging from 40% to 50% for purchase of various agricultural machinery.',
        'Financial assistance for setting up Custom Hiring Centers.',
        'Promotes mechanization to increase farm productivity.'
    ],
    link: 'https://farmech.gov.in/'
  },
  {
    id: 'pm-kmy',
    name: 'Pradhan Mantri Kisan Maan-Dhan Yojana (PM-KMY)',
    category: 'Pension',
    description: 'A government scheme for old age protection and social security of Small and Marginal Farmers (SMF).',
    eligibility: [
        'Small and Marginal Farmers in the age group of 18-40 years.',
        'Having cultivable land up to 2 hectares as per land records.'
    ],
    benefits: [
        'Provides a minimum fixed pension of ₹3,000 per month on attaining the age of 60.',
        'Voluntary and contributory pension scheme.',
        'Central Government also contributes an equal amount to the pension fund.'
    ],
    link: 'https://pmkmy.gov.in/'
  },
  {
    id: 'aif',
    name: 'Agriculture Infrastructure Fund (AIF)',
    category: 'Loan',
    description: 'A pan-India central sector scheme to provide a medium - long term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    eligibility: [
        'Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, Farmer Producers Organizations (FPOs), SHGs, Farmers, etc.'
    ],
    benefits: [
        'Financial support of up to ₹2 crore.',
        'Interest subvention of 3% per annum.',
        'Credit guarantee coverage for loans.'
    ],
    link: 'https://agriinfra.dac.gov.in/'
  },
  {
    id: 'rgm',
    name: 'Rashtriya Gokul Mission',
    category: 'Subsidy',
    description: 'Aims to develop and conserve indigenous breeds, and enhance milk production and productivity of bovines.',
    eligibility: [
        'Farmers, breeders, and entrepreneurs involved in bovine breeding.'
    ],
    benefits: [
        'Establishment of integrated indigenous cattle centers (Gokul Grams).',
        'Incentives for farmers maintaining elite animals of indigenous breeds.',
        'Support for establishing breed multiplication farms.'
    ],
    link: 'https://dahd.nic.in/rashtriya_gokul_mission'
  },
  {
    id: 'nlm',
    name: 'National Livestock Mission',
    category: 'Subsidy',
    description: 'Aims to ensure quantitative and qualitative improvement in livestock production systems and capacity building of all stakeholders.',
    eligibility: [
        'Individuals, SHGs, FPOs, Farmer Cooperatives, and Section 8 companies.'
    ],
    benefits: [
        '50% subsidy up to ₹50 lakh for establishing sheep/goat breeding units.',
        'Financial assistance for fodder development.',
        'Support for risk management and insurance.'
    ],
    link: 'https://nlm.udyamimitra.in/'
  },
  {
    id: 'deds',
    name: 'Dairy Entrepreneurship Development Scheme (DEDS)',
    category: 'Loan',
    description: 'Aimed at generating self-employment and providing infrastructure for the dairy sector, managed by NABARD.',
    eligibility: [
        'Farmers, individual entrepreneurs, NGOs, companies, groups of organized and unorganized sectors, etc.'
    ],
    benefits: [
        'Back-ended capital subsidy of 25% of the project cost (33.33% for SC/ST).',
        'Covers activities such as establishment of small dairy units, milk procurement, processing, and marketing.',
        'Promotes modernization of the dairy sector.'
    ],
    link: 'https://www.nabard.org/content.aspx?id=517'
  },
  {
    id: 'pm-aasha',
    name: 'Pradhan Mantri Annadata Aay SanraksHan Abhiyan (PM-AASHA)',
    category: 'Subsidy',
    description: 'An umbrella scheme aimed at ensuring remunerative prices to the farmers for their produce as announced in the Union Budget for 2018.',
    eligibility: [
        'Farmers growing oilseeds, pulses, and copra.'
    ],
    benefits: [
        'Ensures that farmers receive Minimum Support Price (MSP).',
        'Includes Price Support Scheme (PSS), Price Deficiency Payment Scheme (PDPS), and Pilot of Private Procurement & Stockist Scheme (PPPS).',
        'Strengthens the procurement mechanism for farmers.'
    ],
    link: 'https://agricoop.nic.in/en/Policy-and-Guidelines/pm-aasha'
  }
];
