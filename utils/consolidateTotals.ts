import type { RaisedAndSource } from '~/doar-para';

type ConsolidatedTotal = {
  recurringPercent: number,
  newDonorsPercent: number,
  amount: number,
};

export default (sources: RaisedAndSource[] | undefined): ConsolidatedTotal => {
  let totalAmount = 0;
  let totalWeightedNewDonorsPercent = 0;
  let totalWeightedRecurringDonorsPercent = 0;

  if (Array.isArray(sources)) {
    sources.forEach((source) => {
      totalAmount += source.total_donations;
      if (source.new_donors_percent !== null && source.new_donors_percent !== undefined) {
        const parsedPercentage = typeof source.new_donors_percent === 'string'
          ? tryParseFloat(source.new_donors_percent)
          : source.new_donors_percent;

        if (typeof parsedPercentage === 'number') {
          totalWeightedRecurringDonorsPercent += source.total_donations * parsedPercentage;
        }
      }
      if (source.recurring_percent !== null && source.recurring_percent !== undefined) {
        const parsedPercentage = typeof source.recurring_percent === 'string'
          ? tryParseFloat(source.recurring_percent)
          : source.recurring_percent;

        if (typeof parsedPercentage === 'number') {
          totalWeightedNewDonorsPercent += source.total_donations * parsedPercentage;
        }
      }
    });
  }

  const recurringPercent = totalWeightedNewDonorsPercent / totalAmount;
  const newDonorsPercent = totalWeightedRecurringDonorsPercent / totalAmount;

  return {
    amount: totalAmount,
    newDonorsPercent,
    recurringPercent,
  };
};
