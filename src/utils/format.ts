// ============================================================================
// Formatting Utilities
// ============================================================================

import { format, formatDistance, formatRelative } from 'date-fns';

/**
 * Format a date string to a readable format
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
}

/**
 * Format a date string to a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return 'Invalid Date';
  }
}

/**
 * Format a date string to a relative format (e.g., "yesterday at 3:30 PM")
 */
export function formatRelativeDate(date: string | Date): string {
  try {
    return formatRelative(new Date(date), new Date());
  } catch (error) {
    console.error('Relative date formatting error:', error);
    return 'Invalid Date';
  }
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: string | number,
  currency: string = 'USDC',
  decimals: number = 2
): string {
  try {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '0.00 ' + currency;

    return `${numAmount.toFixed(decimals)} ${currency}`;
  } catch (error) {
    console.error('Currency formatting error:', error);
    return '0.00 ' + currency;
  }
}

/**
 * Format a wallet address to a short format
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address || address.length < chars * 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a transaction hash to a short format
 */
export function formatTxHash(hash: string, chars: number = 6): string {
  if (!hash || hash.length < chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

/**
 * Format a number with thousands separator
 */
export function formatNumber(num: number | string): string {
  try {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return '0';

    return new Intl.NumberFormat('en-US').format(numValue);
  } catch (error) {
    console.error('Number formatting error:', error);
    return '0';
  }
}

/**
 * Format a percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  try {
    return `${value.toFixed(decimals)}%`;
  } catch (error) {
    console.error('Percentage formatting error:', error);
    return '0.00%';
  }
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
