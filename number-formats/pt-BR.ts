export default {
  currency: {
    style: 'currency',
    currency: 'BRL',
    notation: 'standard',
  },
  decimal: {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  percent: {
    style: 'percent',
    useGrouping: false,
  },
} as const;
