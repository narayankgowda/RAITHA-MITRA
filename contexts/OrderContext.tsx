import React, { createContext, useReducer, ReactNode } from 'react';
import { CartItem } from './CartContext';

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
}

interface OrderState {
  orders: Order[];
}

type OrderAction =
  | { type: 'ADD_ORDER'; payload: Order };

const initialState: OrderState = {
  orders: [],
};

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'ADD_ORDER':
      // Add the new order to the beginning of the list
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };
    default:
      return state;
  }
};

interface OrderContextProps {
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
}

export const OrderContext = createContext<OrderContextProps>({
  state: initialState,
  dispatch: () => null,
});

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};