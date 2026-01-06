
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/Spinner';
import RoleSelector from './components/RoleSelector';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Load Dashboards
const FarmerDashboard = lazy(() => import('./components/FarmerDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const BuyerDashboard = lazy(() => import('./components/BuyerDashboard'));

// Farmer Features
const DashboardHome = lazy(() => import('./components/DashboardHome'));
const PestDetector = lazy(() => import('./components/PestDetector'));
const SoilAnalysis = lazy(() => import('./components/SoilAnalysis'));
const Marketplace = lazy(() => import('./components/Marketplace'));
const AnimalHusbandry = lazy(() => import('./components/AnimalHusbandry'));
const CropMonitoring = lazy(() => import('./components/CropMonitoring'));
const Weather = lazy(() => import('./components/Weather'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const GovernmentSchemes = lazy(() => import('./components/GovernmentSchemes'));
const AIVetAssistant = lazy(() => import('./components/AIVetAssistant'));
const VetConnect = lazy(() => import('./components/VetConnect'));
const ExpertHelpline = lazy(() => import('./components/ExpertHelpline'));
const FarmerProfile = lazy(() => import('./components/FarmerProfile'));
const About = lazy(() => import('./components/About'));
const LiveMandiPrices = lazy(() => import('./components/LiveMandiPrices'));
const YieldPredictor = lazy(() => import('./components/YieldPredictor'));
const ExpenseTracker = lazy(() => import('./components/ExpenseTracker'));
const CropRotationPlanner = lazy(() => import('./components/CropRotationPlanner'));
const ResourceSharing = lazy(() => import('./components/ResourceSharing'));

// Buyer Features
const BuyerDashboardHome = lazy(() => import('./components/BuyerDashboardHome'));
const TraceabilityGenerator = lazy(() => import('./components/TraceabilityGenerator'));
const BuyerOrders = lazy(() => import('./components/BuyerOrders'));
const BuyerProfile = lazy(() => import('./components/BuyerProfile'));

// Admin Features
const AdminAnalytics = lazy(() => import('./components/AdminAnalytics'));
const ProductManagement = lazy(() => import('./components/ProductManagement'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const OrderManagement = lazy(() => import('./components/OrderManagement'));
const AdminSupport = lazy(() => import('./components/AdminSupport'));
const AdminSettings = lazy(() => import('./components/AdminSettings'));

const App: React.FC = () => {
    return (
        <HashRouter>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                    <Spinner />
                </div>
            }>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<RoleCheckWrapper />} />
                    <Route path="/login" element={<Login />} />

                    {/* Farmer Routes */}
                    <Route path="/farmer" element={
                        <ProtectedRoute allowedRoles={['farmer']}>
                            <FarmerDashboard />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardHome />} />
                        <Route path="weather" element={<Weather />} />
                        <Route path="pest-detector" element={<PestDetector />} />
                        <Route path="soil-analysis" element={<SoilAnalysis />} />
                        <Route path="yield-predictor" element={<YieldPredictor />} />
                        <Route path="crop-rotation" element={<CropRotationPlanner />} />
                        <Route path="ai-vet" element={<AIVetAssistant />} />
                        <Route path="chatbot" element={<Chatbot />} />
                        <Route path="crop-monitoring" element={<CropMonitoring />} />
                        <Route path="animal-husbandry" element={<AnimalHusbandry />} />
                        <Route path="expense-tracker" element={<ExpenseTracker />} />
                        <Route path="resource-sharing" element={<ResourceSharing />} />
                        <Route path="marketplace" element={<Marketplace />} />
                        <Route path="live-prices" element={<LiveMandiPrices />} />
                        <Route path="schemes" element={<GovernmentSchemes />} />
                        <Route path="vet-connect" element={<VetConnect />} />
                        <Route path="expert-helpline" element={<ExpertHelpline />} />
                        <Route path="profile" element={<FarmerProfile />} />
                        <Route path="about" element={<About />} />
                    </Route>

                    {/* Buyer Routes */}
                    <Route path="/buyer" element={
                        <ProtectedRoute allowedRoles={['buyer']}>
                            <BuyerDashboard />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<BuyerDashboardHome />} />
                        <Route path="marketplace" element={<Marketplace />} />
                        <Route path="traceability" element={<TraceabilityGenerator />} />
                        <Route path="orders" element={<BuyerOrders />} />
                        <Route path="profile" element={<BuyerProfile />} />
                        <Route path="about" element={<About />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="analytics" replace />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="support" element={<AdminSupport />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
};

const RoleCheckWrapper = () => {
    const { user } = useAuth();
    if (user) {
        if (user.role === 'farmer') return <Navigate to="/farmer/dashboard" replace />;
        if (user.role === 'buyer') return <Navigate to="/buyer/dashboard" replace />;
        if (user.role === 'admin') return <Navigate to="/admin/analytics" replace />;
    }
    return <RoleSelector />;
};

export default App;
