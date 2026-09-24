export function formatPrice(amount, currency = 'USD') {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatUZSPrice(amount) {
  if (amount == null || amount === '') return '';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return `${amount} UZS`;
  return `${new Intl.NumberFormat('en-US').format(Math.round(num))} UZS`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
