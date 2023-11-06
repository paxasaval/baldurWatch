import { ValuationID } from "./valuation";

export interface Rubric{
  valuation:ValuationID|string,
  qualify:number|boolean
}
export interface RubricID extends Rubric{id:string}
