import { createSignal } from 'solid-js';
import type { TransactionResult } from '../types/payment';

const [transactionResult, setTransactionResult] = createSignal<TransactionResult | null>(null);

export function usePaymentStore() {
  const saveTransaction = (result: TransactionResult) => {
    setTransactionResult(result);
    // Also save to sessionStorage for page navigation persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('transactionResult', JSON.stringify(result));
    }
  };

  const getTransaction = (): TransactionResult | null => {
    // First check the signal
    const result = transactionResult();
    if (result) return result;

    // Fall back to sessionStorage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('transactionResult');
      if (stored) {
        const parsed = JSON.parse(stored) as TransactionResult;
        setTransactionResult(parsed);
        return parsed;
      }
    }
    return null;
  };

  const clearTransaction = () => {
    setTransactionResult(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('transactionResult');
    }
  };

  return {
    saveTransaction,
    getTransaction,
    clearTransaction,
    transactionResult,
  };
}

export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN-${timestamp}-${random}`;
}

export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const lastFour = cleaned.slice(-4);
  return `**** **** **** ${lastFour}`;
}
