import { Order } from '../contexts/OrderContext';

export interface AdminOrder extends Order {
  customerName: string;
}

export const allOrdersData: AdminOrder[] = [
    {
        id: 'ORD-1678886400000',
        date: '2024-05-20T10:30:00Z',
        items: [
            { id: 1, name: 'High-Yield Maize Seeds', price: 250, quantity: 2, image: '', category: 'Seeds', type: 'input', rating: 4, reviews: 1, description: '', inStock: true },
            { id: 4, name: 'NPK 19-19-19 Fertilizer', price: 450, quantity: 1, image: '', category: 'Fertilizers', type: 'input', rating: 4, reviews: 1, description: '', inStock: true },
        ],
        total: 950,
        status: 'Delivered',
        customerName: 'NARAYAN K GOWDA',
    },
    {
        id: 'ORD-1678890000000',
        date: '2024-05-21T11:00:00Z',
        items: [
            { id: 8, name: 'Electric Sprayer Pump', price: 2200, quantity: 1, image: '', category: 'Tools', type: 'input', rating: 4, reviews: 1, description: '', inStock: true },
        ],
        total: 2200,
        status: 'Shipped',
        customerName: 'Sunita Sharma',
    },
    {
        id: 'ORD-1678893600000',
        date: '2024-05-21T12:00:00Z',
        items: [
            { id: 10, name: 'Fresh Organic Tomatoes', price: 40, quantity: 5, image: '', category: 'Vegetables', type: 'produce', rating: 4, reviews: 1, description: '', inStock: true },
            { id: 11, name: 'Farm Fresh Onions', price: 35, quantity: 10, image: '', category: 'Vegetables', type: 'produce', rating: 4, reviews: 1, description: '', inStock: true },
        ],
        total: 550,
        status: 'Pending',
        customerName: 'Ramesh Gupta',
    },
    {
        id: 'ORD-1678897200000',
        date: '2024-05-19T09:15:00Z',
        items: [
            { id: 5, name: 'Organic Vermicompost', price: 300, quantity: 3, image: '', category: 'Fertilizers', type: 'input', rating: 4, reviews: 1, description: '', inStock: true },
        ],
        total: 900,
        status: 'Cancelled',
        customerName: 'Sunita Sharma',
    },
];
