import type { Goal } from '@/doar-para';

export default (goals:Goal[], totalAmount:number = 0) => {
  const sortedGoals = [...goals].sort((a, b) => a.amount - b.amount);

  return (
    sortedGoals.find((x: Goal) => x.amount > totalAmount)
    || sortedGoals[sortedGoals.length - 1]
  )?.amount
  || totalAmount
  || 0;
};
