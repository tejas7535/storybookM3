import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import { QuotationDetailsSimulatedKpi } from '@gq/shared/services/rest/calculation/model/quotation-details-simulated-kpi.interface';
import { QuotationDetailsSimulationKpiData } from '@gq/shared/services/rest/calculation/model/quotation-details-simulation-kpi-data.interface';
import { QuotationSimulatedKpiRequest } from '@gq/shared/services/rest/calculation/model/quotation-simulated-kpi-request.interface';
import { withCache } from '@ngneat/cashew';

import { QuotationKpiRequest } from './model/quotation-kpi-request.interface';

@Injectable({
  providedIn: 'root',
})
export class CalculationService {
  private readonly PATH_CALCULATION = 'calculation';
  private readonly PATH_QUOTATION_DETAILS_KPI = 'quotation-details-kpi';
  private readonly PATH_QUOTATION_DETAILS_SIMULATED_KPI =
    'quotation-details-simulated-kpi';

  private readonly http: HttpClient = inject(HttpClient);

  public getQuotationKpiCalculation(
    requestBody: QuotationKpiRequest
  ): Observable<QuotationDetailsSummaryKpi> {
    return this.http.post<QuotationDetailsSummaryKpi>(
      `${ApiVersion.V1}/${this.PATH_CALCULATION}/${this.PATH_QUOTATION_DETAILS_KPI}`,
      requestBody,
      {
        context: withCache({
          key: this.requestBodyToHashCode(requestBody),
        }),
      }
    );
  }

  public getQuotationSimulationKpiCalculations(
    requestBody: QuotationSimulatedKpiRequest
  ) {
    return this.http.post<QuotationDetailsSimulatedKpi>(
      `${ApiVersion.V1}/${this.PATH_CALCULATION}/${this.PATH_QUOTATION_DETAILS_SIMULATED_KPI}`,
      requestBody,
      {
        context: withCache({
          key: this.requestBodyToHashCode(requestBody),
        }),
      }
    );
  }

  private requestBodyToHashCode<T>(requestBody: T): string {
    // https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
    const convertedRequestBody = JSON.stringify(requestBody);

    // eslint-disable-next-line no-bitwise
    return [...convertedRequestBody]
      .reduce(
        (hash, char) => char.codePointAt(0) + (hash << 6) + (hash << 16) - hash,
        0
      )
      .toString();
  }

  public createRequestForKpiSimulation(
    simulationData: QuotationDetailsSimulationKpiData
  ): QuotationSimulatedKpiRequest {
    return {
      simulatedField: simulationData.simulatedField,
      simulatedValue: simulationData.simulatedValue,
      priceSourceOption: simulationData.priceSourceOption,
      detailKpiList: simulationData.selectedQuotationDetails.map((detail) => ({
        gqPositionId: detail.gqPositionId,
        priceSource: detail.priceSource,
        sapPriceCondition: detail.sapPriceCondition,
        leadingSapConditionType: detail.leadingSapConditionType,
        orderQuantity: detail.orderQuantity,
        price: detail.price,
        recommendedPrice: detail.recommendedPrice,
        targetPrice: detail.targetPrice,
        strategicPrice: detail.strategicPrice,
        relocationCost: detail.relocationCost,
        sapPrice: detail.sapPrice,
        sapGrossPrice: detail.sapGrossPrice,
        lastCustomerPrice: detail.lastCustomerPrice,
        gpc: detail.gpc,
        sqv: detail.sqv,
        sapPriceUnit: detail.sapPriceUnit,
        priceUnit: detail.material.priceUnit,
      })),
    };
  }
}
