import { QuotationDetail } from '@gq/shared/models';
import { Big } from 'big.js';

export const isFNumber = (quotationDetail: QuotationDetail): boolean => {
  if (!quotationDetail) {
    return false;
  }

  if (
    hasMaterialFNumberProductType(quotationDetail) &&
    hasReferencePrice(quotationDetail) &&
    checkStartsWithFOrZ(quotationDetail)
  ) {
    return true;
  }

  return false;
};

export function checkStartsWithFOrZ(quotationDetail: QuotationDetail): boolean {
  return (
    quotationDetail?.material?.materialDescription?.startsWith('F-') ||
    quotationDetail?.material?.materialDescription?.startsWith('Z-')
  );
}

/**
 * Checks if productType is defined. Only F Number materials have productType defined, otherwise it is undefined.
 *
 * @param quotationDetail the quotation detail to check if productType is defined
 * @returns true if productType is defined, false otherwise
 */
export function hasMaterialFNumberProductType(
  quotationDetail: QuotationDetail
): boolean {
  return !!quotationDetail?.material?.productType;
}

/**
 * checks if the quotation detail has a reference price
 *
 * @param quotationDetail the quotation detail to check if it has a reference price
 * @returns true if the quotation detail has a reference price, false otherwise
 */
export function hasReferencePrice(quotationDetail: QuotationDetail): boolean {
  return !!quotationDetail?.fPricing?.referencePrice;
}

// #######################################################################################
// ##################################### Start ###########################################
// ###################      methods to avoid rounding Issues       #######################
// ###################           related to floating point         #######################
// ###################            the big.js lib is used           #######################
// ################### @link{https://floating-point-gui.de/basic/} #######################
// #######################################################################################

/**
 * Calculates the threshold for sanity checks by min or max margin with two digit precision
 *
 * @param sqv value for sqv
 * @param margin min or max margin
 * @returns the threshold for sanity checks by min or max margin with two digit precision performed with big.js
 */
export function calculateThresholdForSanityChecks(
  sqv: number,
  margin: number,
  precision?: number
): number {
  // (sqv / (1 - margin))
  const result = new Big(sqv).div(new Big(1).minus(margin));

  return precision ? Number(result.toFixed(precision)) : result.toNumber();
}

/**
 * calculates the GPM value by sqv and finalPrice
 * @param finalPrice the finalPrice
 * @param sqv sqv value
 * @param precision the precision to round the result to
 * @returns returns the value of the calculated GPM  performed with big.js
 */
export function calculateGpmValue(
  finalPrice: number,
  sqv: number,
  precision?: number
): number {
  // ((finalPrice - sqvValue) / finalPrice) * 100
  const result = new Big(finalPrice)
    .minus(new Big(sqv))
    .div(new Big(finalPrice))
    .times(100);

  return precision ? Number(result.toFixed(precision)) : result.toNumber();
}

/**
 * subtracts two numbers
 * @param a number a
 * @param b number b
 * @param precision the precision to round the result to
 * @returns returns the value of a-b performed with big.js
 */
export function subtractTwoNumbers(
  a: number,
  b: number,
  precision?: number
): number {
  const result = new Big(a).minus(new Big(b));

  return precision ? Number(result.toFixed(precision)) : result.toNumber();
}

/**
 * subtracts multiple numbers
 * @param numbers array of numbers to subtract
 * @param precision the precision to round the result to
 * @returns returns the value of the subtraction of all numbers in the array performed with big.js
 */
export function subtractNumbers(numbers: number[], precision?: number): number {
  let result = new Big(numbers[0]);
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < numbers.length; i++) {
    result = result.minus(new Big(numbers[i]));
  }

  return precision ? Number(result.toFixed(precision)) : result.toNumber();
}

/**
 * adds two numbers
 * @param a number a
 * @param b number b
 * @param precision the precision to round the result to
 * @returns returns the value of a + b performed with big.js
 */
export function addTwoNumbers(
  a: number,
  b: number,
  precision?: number
): number {
  const result = new Big(a ?? 0).plus(new Big(b ?? 0));

  return precision ? Number(result.toFixed(precision)) : result.toNumber();
}

/**
 * adds multiple numbers
 * @param numbers array of numbers to add
 * @param precision precision to round the result to
 * @returns returns the value of the sum of all numbers in the array performed with big.js
 */
export function addNumbers(numbers: number[], precision?: number): number {
  let sum = 0;
  for (const number of numbers) {
    sum = addTwoNumbers(sum, number ?? 0);
  }

  return precision ? Number(sum.toFixed(precision)) : sum;
}

export function multiplyTwoNumbers(
  a: number,
  b: number,
  precision?: number
): number {
  const result = new Big(a).times(new Big(b));

  return precision ? Number(result.toFixed(precision)) : result.toNumber();
}

/**
 * multiplies multiple numbers
 * @param numbers array of numbers to multiply
 * @param precision the precision to round the result to
 * @returns returns the value of the product of all numbers in the array performed with big.js
 */
export function multiplyNumbers(numbers: number[], precision?: number): number {
  let product = 1;
  for (const number of numbers) {
    product = multiplyTwoNumbers(product, number);
  }

  return precision ? Number(product.toFixed(precision)) : product;
}

/**
 * divide two numbers
 * @param a number a
 * @param b number b
 * @param precision precision to round the result to
 * @returns returns the value of a / b performed with big.js
 */
export function divideTwoNumbers(
  a: number,
  b: number,
  precision?: number
): number {
  const result = new Big(a).div(new Big(b));

  return precision ? Number(result.toFixed(precision)) : result.toNumber();
}

/**
 * divides multiple numbers
 * @param numbers array of numbers to divide
 * @param precision the precision to round the result to
 * @returns returns the value of the division of all numbers in the array performed with big.js
 */
export function divideNumbers(numbers: number[], precision?: number): number {
  let quotient = new Big(numbers[0]);
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < numbers.length; i++) {
    quotient = quotient.div(new Big(numbers[i]));
  }

  return precision ? Number(quotient.toFixed(precision)) : quotient.toNumber();
}

// #######################################################################################
// ##################################### END #############################################
// ################### methods to avoid issues with floating point #######################
// ################### @link{https://floating-point-gui.de/basic/} #######################
// #######################################################################################
