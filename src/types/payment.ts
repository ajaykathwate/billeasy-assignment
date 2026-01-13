export interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: string;
}

export interface TransactionResult {
  cardholderName: string;
  maskedCardNumber: string;
  expiryDate: string;
  amount: string;
  status: 'Success' | 'Failed';
  transactionId: string;
}

export interface ValidationErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  amount?: string;
}
