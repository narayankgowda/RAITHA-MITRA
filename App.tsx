import React from 'react';
import { useAuth } from './hooks/useAuth';

import FarmerLogin from './components/FarmerLogin';
import FarmerDashboard from './components/FarmerDashboard';

const App: React.FC = () => {
    const { user, login, logout } = useAuth();

    if (user) {
        // Since only the farmer role exists, we can directly render the FarmerDashboard.
        return <FarmerDashboard onLogout={logout} />;
    }

    // If no user is logged in, show the FarmerLogin page.
    return <FarmerLogin onLogin={login} />;
};

export default App;
