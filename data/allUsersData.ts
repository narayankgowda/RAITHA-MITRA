export interface User {
    id: string;
    name: string;
    email: string;
    role: 'farmer' | 'admin';
    lastLogin: string;
    status: 'Active' | 'Inactive';
}

export const allUsersData: User[] = [
    {
        id: 'user-1',
        name: 'NARAYAN K GOWDA',
        email: 'appu01452@example.com',
        role: 'farmer',
        lastLogin: '2024-05-21T10:00:00Z',
        status: 'Active',
    },
    {
        id: 'user-2',
        name: 'Sunita Sharma',
        email: 'sunita.s@example.com',
        role: 'farmer',
        lastLogin: '2024-05-20T15:30:00Z',
        status: 'Active',
    },
    {
        id: 'user-3',
        name: 'Admin User',
        email: 'admin@agri-ai.com',
        role: 'admin',
        lastLogin: '2024-05-21T11:00:00Z',
        status: 'Active',
    },
    {
        id: 'user-4',
        name: 'Ramesh Gupta',
        email: 'ramesh.g@example.com',
        role: 'farmer',
        lastLogin: '2024-05-19T08:00:00Z',
        status: 'Inactive',
    },
];
