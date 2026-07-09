export const formatCurrency = (amount, currencySymbol = '$') => {
  const num = Number(amount) || 0;
  const hasCents = Math.abs(num % 1) > 0.005;

  return `${currencySymbol}${num.toLocaleString(undefined, {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  })}`;
};

export const formatCurrencyNoCents = (amount, currencySymbol = '$') => {
  const num = Number(amount) || 0;
  return `${currencySymbol}${num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const availableCurrencies = [
  { symbol: '$', label: 'USD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' },
  { symbol: 'Rs.', label: 'LKR (Rs.)' },
  { symbol: '₹', label: 'INR (₹)' },
  { symbol: '¥', label: 'JPY (¥)' },
  { symbol: 'A$', label: 'AUD (A$)' },
  { symbol: 'C$', label: 'CAD (C$)' },
];
