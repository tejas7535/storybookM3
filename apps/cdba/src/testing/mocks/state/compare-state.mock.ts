import { CompareState } from '@cdba/compare/store/reducers/compare.reducer';

import { BOM_MOCK, CALCULATIONS_MOCK, REFERENCE_TYPE_MOCK } from '../models';

export const COMPARE_STATE_MOCK: CompareState = {
  '0': {
    referenceType: {
      materialNumber: '0943578620000',
      plant: '0074',
      identificationHash:
        'pXk%2BO1VaSyYhxLnPpiEHcw21hsad6Zbln%2F%2BlkK71OOcdhTbV%2Fif2yv5a%2BYIfVKV3dJwMJoRF3DDvhzael0%2F%2FS1hl%2FbbpmzdZGUn4YUVsNguwXBbIEM9q%2FcI2zIoCbC6lx9wVOAC5FwOchyI3y6NWj5KGQDd2hu2CqLJwUf9G2MvVOryPqsmn5zb6fQYzqhifB%2FFtJdC77Zv%2FyydEmNlzog%3D%3D',
    },
    details: {
      loading: false,
      item: REFERENCE_TYPE_MOCK,
      errorMessage: undefined,
    },
    calculations: {
      loading: false,
      items: CALCULATIONS_MOCK,
      selected: CALCULATIONS_MOCK[3],
      selectedNodeId: '3',
      errorMessage: undefined,
    },
    billOfMaterial: {
      loading: true,
      items: BOM_MOCK,
      selected: BOM_MOCK[1],
      errorMessage: undefined,
    },
  },
  '1': {
    referenceType: {
      materialNumber: '0943572680000',
      plant: '0060',
      identificationHash:
        'pXk%2BO1VaSyYhxLnPpiEHcw21hsad6Zbln%2F%2BlkK71OOcdhTbV%2Fif2yv5a%2BYIfVKV3dJwMJoRF3DDvhzael0%2F%2FS1hl%2FbbpmzdZGUn4YUVsNguwXBbIEM9q%2FcI2zIoCbC6lx9wVOAC5FwOchyI3y6NWj5KGQDd2hu2CqLJwUf9G2MvVOryPqsmn5zb6fQYzqhifB%2FFtJdC77Zv%2FyydEmNlzog%3D%3D',
    },
    details: {
      loading: true,
      item: undefined,
      errorMessage: undefined,
    },
    calculations: {
      loading: true,
      items: undefined,
      selected: undefined,
      selectedNodeId: undefined,
      errorMessage: undefined,
    },
    billOfMaterial: {
      loading: true,
      items: undefined,
      selected: undefined,
      errorMessage: undefined,
    },
  },
  '2': {
    referenceType: {
      materialNumber: '0943482680000',
      plant: '0060',
      identificationHash:
        'pXk%2BO1VaSyYhxLnPpiEHcw21hsad6Zbln%2F%2BlkK71OOcdhTbV%2Fif2yv5a%2BYIfVKV3dJwMJoRF3DDvhzael0%2F%2FS1hl%2FbbpmzdZGUn4YUVsNguwXBbIEM9q%2FcI2zIoCbC6lx9wVOAC5FwOchyI3y6NWj5KGQDd2hu2CqLJwUf9G2MvVOryPqsmn5zb6fQYzqhifB%2FFtJdC77Zv%2FyydEmNlzog%3D%3D',
    },
    details: {
      loading: false,
      item: undefined,
      errorMessage: '404 - Not Found',
    },
    calculations: {
      loading: false,
      items: [],
      selected: undefined,
      selectedNodeId: undefined,
      errorMessage: 'Service unavailable',
    },
    billOfMaterial: {
      loading: false,
      items: [],
      selected: undefined,
      errorMessage: 'Service unavailable',
    },
  },
  '3': {
    referenceType: {
      materialNumber: '0943482680000',
      plant: '0076',
      identificationHash:
        'pXk%2BO1VaSyYhxLnPpiEHcw21hsad6Zbln%2F%2BlkK71OOcdhTbV%2Fif2yv5a%2BYIfVKV3dJwMJoRF3DDvhzael0%2F%2FS1hl%2FbbpmzdZGUn4YUVsNguwXBbIEM9q%2FcI2zIoCbC6lx9wVOAC5FwOchyI3y6NWj5KGQDd2hu2CqLJwUf9G2MvVOryPqsmn5zb6fQYzqhifB%2FFtJdC77Zv%2FyydEmNlzog%3D%3D',
    },
  },
};
