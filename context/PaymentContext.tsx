import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { PaymentMethodId } from "@/assets/data/food";

export type CardBrand = "visa" | "mastercard";

export type SavedCard = {
  id: string;
  brand: CardBrand;
  holder: string;
  last4: string;
  /** MM/YY */
  expiry: string;
};

type PaymentContextValue = {
  method: PaymentMethodId;
  setMethod: (method: PaymentMethodId) => void;
  cards: SavedCard[];
  cardFor: (method: PaymentMethodId) => SavedCard | undefined;
  addCard: (card: Omit<SavedCard, "id">) => void;
};

const PaymentContext = createContext<PaymentContextValue | null>(null);

/** In-memory payment state. Never store real card numbers like this. */
export function PaymentProvider({ children }: { children: ReactNode }) {
  const [method, setMethod] = useState<PaymentMethodId>("cash");
  const [cards, setCards] = useState<SavedCard[]>([]);

  const addCard = useCallback((card: Omit<SavedCard, "id">) => {
    setCards((list) => [
      ...list.filter((c) => c.brand !== card.brand),
      { ...card, id: String(Date.now()) },
    ]);
    setMethod(card.brand);
  }, []);

  const cardFor = useCallback(
    (m: PaymentMethodId) => cards.find((c) => c.brand === m),
    [cards],
  );

  const value = useMemo(
    () => ({ method, setMethod, cards, cardFor, addCard }),
    [method, cards, cardFor, addCard],
  );

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used inside <PaymentProvider>");
  return ctx;
}
