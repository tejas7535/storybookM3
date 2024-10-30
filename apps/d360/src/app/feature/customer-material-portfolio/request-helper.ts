import { translate } from '@jsverse/transloco';
import { formatISO } from 'date-fns';

import { demandCharacteristics } from '../material-customer/model';
import { CMPData } from './cmp-modal-types';
import { CMPWriteRequest } from './model';

export function dataToCMPWriteRequest(cmpData: CMPData): CMPWriteRequest {
  if (!cmpData.portfolioStatus) {
    throw new Error(translate('error.unknown', {}));
  }

  const autoSwitchDate = cmpData.autoSwitchDate; // TODO check if this is still necessary, cause startDate can't be a string anymore...
  // typeof cmpData.autoSwitchDate == 'string'
  //   ? parseDate(cmpData.autoSwitchDate)
  //   : cmpData.autoSwitchDate;

  const repDate = cmpData.repDate; // TODO check if this is still necessary, cause startDate can't be a string anymore...
  // typeof cmpData.repDate == 'string' ? parseDate(cmpData.repDate) : cmpData.repDate;

  // Somtimes SAP sends us empty strings, we want to send null to the backend if that happens
  const demandChar =
    cmpData.demandCharacteristic &&
    demandCharacteristics.includes(cmpData.demandCharacteristic)
      ? cmpData.demandCharacteristic
      : null;

  return {
    customerNumber: cmpData.customerNumber,
    materialNumber: cmpData.materialNumber,
    portfolioStatus: cmpData.portfolioStatus,
    demandCharacteristic: demandChar,
    autoSwitchDate: autoSwitchDate
      ? formatISO(autoSwitchDate, {
          representation: 'date',
        })
      : null,
    repDate: repDate
      ? formatISO(repDate, {
          representation: 'date',
        })
      : null,
    successorMaterial: cmpData.successorMaterial,
    demandPlanAdoption: cmpData.demandPlanAdoption,
  };
}
