import React, { createContext, useReducer, ReactNode } from 'react';
import { Product } from '../data/products';

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: number } };

const initialState: WishlistState = {
  items: [],
};

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const itemExists = state.items.some(item => item.id === action.payload.id);
      if (itemExists) {
        return state; // Do not add if it already exists
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };

    default:
      return state;
  }
};

interface WishlistContextProps {
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
}

export const WishlistContext = createContext<WishlistContextProps>({
  state: initialState,
  dispatch: () => null,
});

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};