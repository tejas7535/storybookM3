import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { Alert, AlertCategory, OpenFunction } from './model';

export const mockAlertResult: Alert[] = [
  {
    open: false,
    priority: false,
    alertPriority: 1,
    deactivated: false,
    customerNumber: '1',
    customerName: 'first customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.ACIADP,
    keyAccount: 'gkam1',
  },
  {
    open: false,
    priority: false,
    alertPriority: 1,
    deactivated: false,
    customerNumber: '1',
    customerName: 'first customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.NPOSDP,
    keyAccount: 'gkam1',
  },
  {
    open: false,
    priority: false,
    alertPriority: 2,
    deactivated: false,
    customerNumber: '2',
    customerName: 'second customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.CFSUAO,
    keyAccount: 'gkam2',
  },
];

export const largeMockAlertResult: Alert[] = [
  {
    open: false,
    priority: false,
    alertPriority: 1,
    deactivated: false,
    customerNumber: '1',
    customerName: 'first customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.ACIADP,
  },
  {
    open: false,
    priority: false,
    alertPriority: 1,
    deactivated: false,
    customerNumber: '1',
    customerName: 'first customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.NPOSDP,
  },
  {
    open: false,
    priority: false,
    alertPriority: 2,
    deactivated: false,
    customerNumber: '2',
    customerName: 'second customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.CFSUAO,
  },
  {
    open: false,
    priority: false,
    alertPriority: 1,
    deactivated: false,
    customerNumber: '3',
    customerName: 'third customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.CFSUAO,
  },
  {
    open: false,
    priority: false,
    alertPriority: 1,
    deactivated: false,
    customerNumber: '3',
    customerName: 'third customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.CFSUAO,
  },
  {
    open: false,
    priority: false,
    alertPriority: 1,
    deactivated: false,
    customerNumber: '3',
    customerName: 'third customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.CFSUAO,
  },
  {
    open: false,
    priority: false,
    alertPriority: 2,
    deactivated: false,
    customerNumber: '3',
    customerName: 'third customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.NPOSDP,
  },
  {
    open: false,
    priority: false,
    alertPriority: 3,
    deactivated: false,
    customerNumber: '3',
    customerName: 'third customer',
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.ACIADP,
  },
];

const mockSingleAlert = (identifier: number): Alert => ({
  open: false,
  priority: false,
  alertPriority: 3,
  deactivated: false,
  customerNumber: `${identifier}`,
  customerName: `customer ${identifier}`,
  openFunction: OpenFunction.Validation_Of_Demand,
  type: AlertCategory.ACIADP,
});

export const mockAlertArray = (count: number): Alert[] =>
  [...Array.from({ length: count }).keys()].map((index) =>
    mockSingleAlert(index)
  );

export const aciadpOption = {
  id: AlertCategory.ACIADP,
  text: 'Basiskombination Inaktiv gesetzt',
};

export const cfpraoOption = {
  id: AlertCategory.CFPRAO,
  text: 'Prüfe Validated Forecast, Ersetzung rückgängig gemacht',
};

export const alertTypeOptionMocks: SelectableValue[] = [
  cfpraoOption,
  aciadpOption,
];
