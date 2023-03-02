import { Injectable } from '@angular/core';

import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';

import { Coefficients } from '../../../../shared/models/quotation-detail';

@Injectable({
  providedIn: 'root',
})
export class RegressionService {
  /**
   * build a list of data points for displaying the regression function
   * @param coefficients intercept(a) and first regression coefficient (b)
   * @param transactions list of transactions
   * @returns list of data points
   */
  buildRegressionPoints = (
    coefficients: Coefficients,
    transactions: ComparableLinkedTransaction[]
  ): number[][] => {
    const { coefficient1, coefficient2 } = coefficients;
    // Get max quantity
    const max = Math.max(...transactions.map((t) => t.quantity));
    const data = [];

    // datapoints from 0 to 1
    data.push([0, 100]);
    for (let i = 0.0001; i < 1; i *= 2) {
      const datapoint = [
        i,
        this.regressionFunction(coefficient1, coefficient2, i),
      ];
      data.push(datapoint);
    }

    // datapoints from 1 to max quantity
    for (let i = 1; i <= max; i += 0.5) {
      const datapoint = [
        i,
        this.regressionFunction(coefficient1, coefficient2, i),
      ];
      data.push(datapoint);
    }

    return data;
  };

  /**
   * calculate gpi for a quantity
   * @param coefficient1 represents intercept (a)
   * @param coefficient2 represents first regression coefficient (b)
   * @param quantity quantity (x)
   * @returns gpi for quantity
   */
  regressionFunction = (
    coefficient1: number,
    coefficient2: number,
    quantity: number
  ): number =>
    // f(x) = exp(a)* x^(b)
    Math.exp(coefficient1) * Math.pow(quantity, coefficient2);
}
