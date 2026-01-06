import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { Product, initialProducts } from '../data/products';

interface ProductState {
  products: Product[];
}

type ProductAction =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: { id: number } };

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [action.payload, ...state.products],
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'DELETE_PRODUCT':
        return {
            ...state,
            products: state.products.filter(p => p.id !== action.payload.id),
        }
    default:
      return state;
  }
};

interface ProductContextProps {
  state: ProductState;
  dispatch: Dispatch<ProductAction>;
}

export const ProductContext = createContext<ProductContextProps>({
  state: { products: initialProducts },
  dispatch: () => null,
});

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, { products: initialProducts });

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};
