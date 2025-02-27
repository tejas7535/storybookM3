import { Injectable } from '@angular/core';

import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import { RecommendationType } from '@gq/core/store/transactions/models/recommendation-type.enum';
import { Coefficients } from '@gq/shared/models/quotation-detail';

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
    transactions: ComparableLinkedTransaction[],
    recommendationType: RecommendationType,
    appliedExchangeRatio: number
  ): number[][] => {
    const { coefficient1, coefficient2 } = coefficients;
    // Get max quantity
    const max = Math.max(...transactions.map((t) => t.quantity));
    const data = [];

    // datapoints from 0 to 1
    data.push([0, 100]);
    for (let i = 0.0001; i < 1; i *= 2) {
      const calculatedValue = this.regressionFunction(
        coefficient1,
        coefficient2,
        i
      );
      const datapoint = [
        i,
        this.considerAppliedExchangeRatio(
          calculatedValue,
          recommendationType,
          appliedExchangeRatio
        ),
      ];
      data.push(datapoint);
    }

    // datapoints from 1 to max quantity
    for (let i = 1; i <= max; i += 0.5) {
      const calculatedValue = this.regressionFunction(
        coefficient1,
        coefficient2,
        i
      );
      const datapoint = [
        i,
        this.considerAppliedExchangeRatio(
          calculatedValue,
          recommendationType,
          appliedExchangeRatio
        ),
      ];
      data.push(datapoint);
    }

    return data;
  };

  /**
   * Calculate value for identified regression function (received from gq-robust-powerlaw).
   * @param coefficient1 represents intercept (a)
   * @param coefficient2 represents first regression coefficient (b)
   * @param quantity quantity (x)
   * @returns value for given quantity
   */
  regressionFunction = (
    coefficient1: number,
    coefficient2: number,
    quantity: number
  ): number =>
    // f(x) = exp(a)* x^(b)
    Math.exp(coefficient1) * Math.pow(quantity, coefficient2);

  /**
   * For price values the initially calculated coefficients were on the basis of EUR. In case the quotation currency differs, the calculated datapoint needs to be converted to the same currency.
   * @param dp data point
   * @param recommendationType recommendation type
   * @param appliedExchangeRatio applied exchange ratio
   * @returns  updated dp
   */
  private readonly considerAppliedExchangeRatio = (
    dp: number,
    recommendationType: RecommendationType,
    appliedExchangeRatio: number
  ) =>
    recommendationType === RecommendationType.PRICE && appliedExchangeRatio
      ? dp * appliedExchangeRatio
      : dp;
}
