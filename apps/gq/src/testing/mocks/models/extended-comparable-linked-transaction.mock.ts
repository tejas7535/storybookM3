import { ExtendedComparableLinkedTransaction } from '../../../app/core/store/reducers/extended-comparable-linked-transactions/models/extended-comparable-linked-transaction';
import { SalesIndication } from '../../../app/core/store/reducers/transactions/models/sales-indication.enum';
import { AbcClassification } from '../../../app/shared/models/customer';

export const EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK: ExtendedComparableLinkedTransaction =
  {
    inputMaterialDescription: 'Input-VSA200414-N-VSP-ZT#N',
    inputMaterialNumber: '016706374000002',
    inputQuantity: 1,
    itemId: 60,
    keyAccount: 'Other Customers',
    sector: 'V260',
    subKeyAccount: 'subkey Other Customers',
    subSector: 'E-motors (</= 3kW)',

    identifier: 213,
    customerName: 'customerName',
    customerId: 'customerId',
    country: 'DE',
    materialDescription: 'VSA200414-N-VSP-ZT#N',
    price: 10,
    profitMargin: 0.532_423_4,
    quantity: 100,
    salesIndication: SalesIndication.INVOICE,
    year: '2020',
    abcClassification: AbcClassification.A,
    region: 'EU',
    sectorManagement: 'PT',
    competitor: 'competitor',
    relativeCompetitorPrice: 'relative competitor price',
  };
