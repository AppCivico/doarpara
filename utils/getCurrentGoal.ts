import type { Goal } from '@/doar-para';

export default (goals:Goal[], totalAmount:number = 0) => (
  goals.find((x: Goal) => x.amount > totalAmount)
   || goals[goals.length - 1]
)?.amount
  || totalAmount
  || 0;
