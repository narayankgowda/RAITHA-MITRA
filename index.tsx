import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { OrderProvider } from './contexts/OrderContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProductProvider } from './contexts/ProductContext';
import './i18n'; // Initialize i18next

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Suspense fallback="Loading...">
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <WishlistProvider>
              <OrderProvider>
                <ProductProvider>
                  <CartProvider>
                    <App />
                  </CartProvider>
                </ProductProvider>
              </OrderProvider>
            </WishlistProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
);
