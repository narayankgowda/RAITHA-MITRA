import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '../data/products';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

const getInitialState = (): CartState => {
    try {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : { items: [] };
    } catch {
        return { items: [] };
    }
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };

    case 'UPDATE_QUANTITY':
        if (action.payload.quantity <= 0) {
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id),
            };
        }
        return {
            ...state,
            items: state.items.map(item =>
                item.id === action.payload.id
                ? { ...item, quantity: action.payload.quantity }
                : item
            ),
        };
    
    case 'CLEAR_CART':
        return {
            ...state,
            items: [],
        };

    default:
      return state;
  }
};

interface CartContextProps {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

export const CartContext = createContext<CartContextProps>({
  state: { items: [] },
  dispatch: () => null,
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, getInitialState);

  useEffect(() => {
      localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};