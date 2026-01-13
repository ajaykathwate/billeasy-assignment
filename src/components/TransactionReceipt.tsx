import { createSignal, onMount, Show, type Component } from 'solid-js';
import type { TransactionResult } from '../types/payment';
import { usePaymentStore } from '../stores/paymentStore';

const TransactionReceipt: Component = () => {
  const { getTransaction, clearTransaction } = usePaymentStore();
  const [transaction, setTransaction] = createSignal<TransactionResult | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(() => {
    const result = getTransaction();
    setTransaction(result);
    setIsLoading(false);
  });

  const handleNewPayment = () => {
    clearTransaction();
    window.location.href = '/';
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <Show when={!isLoading()} fallback={
          <div class="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p class="mt-4 text-slate-600">Loading receipt...</p>
          </div>
        }>
          <Show when={transaction()} fallback={
            <div class="bg-white rounded-2xl shadow-2xl p-8 text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-slate-800 mb-2">No Transaction Found</h2>
              <p class="text-slate-500 mb-6">Please complete a payment first.</p>
              <button
                onClick={() => window.location.href = '/'}
                class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Go to Payment
              </button>
            </div>
          }>
            <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Success Header */}
              <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 class="text-2xl font-bold text-white">Payment Successful!</h1>
                <p class="text-green-100 mt-1">Your transaction has been completed</p>
              </div>

              {/* Receipt Details */}
              <div class="p-6 space-y-4">
                {/* Amount */}
                <div class="text-center pb-4 border-b border-slate-200">
                  <p class="text-slate-500 text-sm">Amount Paid</p>
                  <p class="text-3xl font-bold text-slate-800">${transaction()!.amount}</p>
                </div>

                {/* Transaction Details */}
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-500">Name</span>
                    <span class="font-medium text-slate-800">{transaction()!.cardholderName}</span>
                  </div>

                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-500">Card Number</span>
                    <span class="font-medium text-slate-800 font-mono">{transaction()!.maskedCardNumber}</span>
                  </div>

                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-500">Expiry Date</span>
                    <span class="font-medium text-slate-800">{transaction()!.expiryDate}</span>
                  </div>

                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-500">Status</span>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <span class="w-2 h-2 bg-green-500 rounded-full" />
                      {transaction()!.status}
                    </span>
                  </div>

                  <div class="flex justify-between items-center py-2 border-t border-slate-200 mt-2 pt-4">
                    <span class="text-slate-500">Transaction ID</span>
                    <span class="font-medium text-slate-800 font-mono text-sm">{transaction()!.transactionId}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div class="p-6 pt-0">
                <button
                  onClick={handleNewPayment}
                  class="w-full py-4 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition active:scale-[0.98]"
                >
                  Make Another Payment
                </button>
              </div>
            </div>
          </Show>
        </Show>

        <p class="text-center text-slate-400 text-sm mt-6">
          Thank you for using BillEasy Payments
        </p>
      </div>
    </div>
  );
};

export default TransactionReceipt;
