import { createSignal, type Component } from 'solid-js';
import type { PaymentFormData, ValidationErrors } from '../types/payment';
import { usePaymentStore, generateTransactionId, maskCardNumber } from '../stores/paymentStore';

const PaymentForm: Component = () => {
  const { saveTransaction } = usePaymentStore();

  const [formData, setFormData] = createSignal<PaymentFormData>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    amount: '',
  });

  const [errors, setErrors] = createSignal<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').substring(0, 19) : '';
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = (): boolean => {
    const data = formData();
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!data.cardholderName.trim()) {
      newErrors.cardholderName = 'Name on card is required';
    } else if (data.cardholderName.trim().length < 2) {
      newErrors.cardholderName = 'Name must be at least 2 characters';
    }

    // Card number validation
    const cardDigits = data.cardNumber.replace(/\s/g, '');
    if (!cardDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardDigits.length < 13 || cardDigits.length > 19) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Expiry date validation
    const expiryParts = data.expiryDate.split('/');
    if (!data.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    } else {
      const month = parseInt(expiryParts[0], 10);
      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Invalid month';
      }
    }

    // CVV validation
    if (!data.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (data.cvv.length < 3 || data.cvv.length > 4) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    // Amount validation
    const amount = parseFloat(data.amount);
    if (!data.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const data = formData();

    // Create transaction result
    saveTransaction({
      cardholderName: data.cardholderName.trim(),
      maskedCardNumber: maskCardNumber(data.cardNumber),
      expiryDate: data.expiryDate,
      amount: parseFloat(data.amount).toFixed(2),
      status: 'Success',
      transactionId: generateTransactionId(),
    });

    // Navigate to receipt page
    window.location.href = '/receipt';
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    let processedValue = value;

    if (field === 'cardNumber') {
      processedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      processedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      processedValue = value.replace(/\D/g, '').substring(0, 4);
    } else if (field === 'amount') {
      processedValue = value.replace(/[^0-9.]/g, '');
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    // Clear error when user starts typing
    if (errors()[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-slate-800">Payment Details</h1>
            <p class="text-slate-500 mt-2">Enter your card information</p>
          </div>

          <form onSubmit={handleSubmit} class="space-y-5">
            {/* Name on Card */}
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">
                Name on Card
              </label>
              <input
                type="text"
                value={formData().cardholderName}
                onInput={(e) => handleInputChange('cardholderName', e.currentTarget.value)}
                class={`w-full px-4 py-3 rounded-lg border ${
                  errors().cardholderName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-blue-500'
                } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                placeholder="John Doe"
              />
              {errors().cardholderName && (
                <p class="mt-1 text-sm text-red-500">{errors().cardholderName}</p>
              )}
            </div>

            {/* Card Number */}
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">
                Card Number
              </label>
              <input
                type="text"
                value={formData().cardNumber}
                onInput={(e) => handleInputChange('cardNumber', e.currentTarget.value)}
                class={`w-full px-4 py-3 rounded-lg border ${
                  errors().cardNumber
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-blue-500'
                } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors().cardNumber && (
                <p class="mt-1 text-sm text-red-500">{errors().cardNumber}</p>
              )}
            </div>

            {/* Expiry and CVV */}
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={formData().expiryDate}
                  onInput={(e) => handleInputChange('expiryDate', e.currentTarget.value)}
                  class={`w-full px-4 py-3 rounded-lg border ${
                    errors().expiryDate
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors().expiryDate && (
                  <p class="mt-1 text-sm text-red-500">{errors().expiryDate}</p>
                )}
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">
                  CVV
                </label>
                <input
                  type="password"
                  value={formData().cvv}
                  onInput={(e) => handleInputChange('cvv', e.currentTarget.value)}
                  class={`w-full px-4 py-3 rounded-lg border ${
                    errors().cvv
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                  placeholder="123"
                  maxLength={4}
                />
                {errors().cvv && (
                  <p class="mt-1 text-sm text-red-500">{errors().cvv}</p>
                )}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">
                Payment Amount ($)
              </label>
              <input
                type="text"
                value={formData().amount}
                onInput={(e) => handleInputChange('amount', e.currentTarget.value)}
                class={`w-full px-4 py-3 rounded-lg border ${
                  errors().amount
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-blue-500'
                } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                placeholder="100.00"
              />
              {errors().amount && (
                <p class="mt-1 text-sm text-red-500">{errors().amount}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting()}
              class={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isSubmitting()
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              {isSubmitting() ? (
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Pay Now'
              )}
            </button>
          </form>
        </div>

        <p class="text-center text-slate-400 text-sm mt-6">
          Secure payment simulation - No real charges
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
