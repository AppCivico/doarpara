import type { RaisedAndSource } from '~/doar-para';

type ConsolidatedTotal = {
  recurringPercent: number,
  newDonorsPercent: number,
  totalDonors: number,
  totalDonations: number,
};

export default (sources: RaisedAndSource[] | undefined):ConsolidatedTotal => {
  let totalDonors = 0;
  let totalDonations = 0;
  let totalNewDonorsAmount = 0;
  let totalRecurringAmount = 0;

  if (Array.isArray(sources)) {
    sources.forEach((source) => {
      totalDonations += source.total_donations;
      totalDonors += source.total_donors;
      if (source.new_donors_percent !== null && source.new_donors_percent !== undefined) {
        const parsedPercentage = typeof source.new_donors_percent === 'string'
          ? tryParseFloat(source.new_donors_percent)
          : source.new_donors_percent;

        if (typeof parsedPercentage === 'number') {
          totalNewDonorsAmount += (parsedPercentage / 100) * source.total_donors;
        }
      }
      if (source.recurring_percent !== null && source.recurring_percent !== undefined) {
        const parsedPercentage = typeof source.recurring_percent === 'string'
          ? tryParseFloat(source.recurring_percent)
          : source.recurring_percent;

        if (typeof parsedPercentage === 'number') {
          totalRecurringAmount += (parsedPercentage / 100) * source.total_donors;
        }
      }
    });
  }

  return {
    totalDonors,
    totalDonations,
    newDonorsPercent: (totalNewDonorsAmount / totalDonors) * 100,
    recurringPercent: (totalRecurringAmount / totalDonors) * 100,
  };
};
