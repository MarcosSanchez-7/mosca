"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";
import type { CartState, CartAction, CartItem } from "@/types";

const initialState: CartState = { items: [], total: 0, itemCount: 0 };

function computeTotals(items: CartItem[]): Pick<CartState, "total" | "itemCount"> {
  return {
    total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.product.id === action.payload.id);
      const updatedItems = existing
        ? state.items.map((i) =>
            i.product.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { product: action.payload, quantity: 1 }];
      return { items: updatedItems, ...computeTotals(updatedItems) };
    }
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (i) => i.product.id !== action.payload.productId
      );
      return { items: updatedItems, ...computeTotals(updatedItems) };
    }
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((i) =>
          i.product.id === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
        .filter((i) => i.quantity > 0);
      return { items: updatedItems, ...computeTotals(updatedItems) };
    }
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const value = useMemo(() => ({ ...state, dispatch }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
