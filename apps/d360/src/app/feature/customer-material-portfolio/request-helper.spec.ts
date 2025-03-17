import { CMPData } from './cmp-modal-types';
import { dataToCMPWriteRequest } from './request-helper';

describe('dataToCMPWriteRequest', () => {
  it('should throw an error if portfolioStatus is missing', () => {
    const data: CMPData = {
      customerNumber: '123',
      materialNumber: '456',
      portfolioStatus: null,
      demandCharacteristic: 'demand1',
      autoSwitchDate: new Date(),
      repDate: new Date(),
      successorMaterial: '789',
      demandPlanAdoption: 'ADD',
      materialDescription: '',
    };

    expect(() => dataToCMPWriteRequest(data)).toThrow('error.unknown');
  });

  it('should return a valid CMPWriteRequest object', () => {
    const data: CMPData = {
      customerNumber: '123',
      materialNumber: '456',
      portfolioStatus: 'PI',
      demandCharacteristic: 'demand1',
      autoSwitchDate: new Date('2023-01-01'),
      repDate: new Date('2023-02-01'),
      successorMaterial: '789',
      demandPlanAdoption: 'ADD',
      materialDescription: '',
    };

    const result = dataToCMPWriteRequest(data);

    expect(result).toEqual({
      customerNumber: '123',
      materialNumber: '456',
      portfolioStatus: 'PI',
      demandCharacteristic: null,
      autoSwitchDate: '2023-01-01',
      repDate: '2023-02-01',
      successorMaterial: '789',
      demandPlanAdoption: 'ADD',
    });
  });

  it('should handle null dates correctly', () => {
    const data: CMPData = {
      customerNumber: '123',
      materialNumber: '456',
      portfolioStatus: 'PI',
      demandCharacteristic: 'demand1',
      autoSwitchDate: null,
      repDate: null,
      successorMaterial: '789',
      demandPlanAdoption: 'DELETE',
      materialDescription: '',
    };

    const result = dataToCMPWriteRequest(data);

    expect(result).toEqual({
      customerNumber: '123',
      materialNumber: '456',
      portfolioStatus: 'PI',
      demandCharacteristic: null,
      autoSwitchDate: null,
      repDate: null,
      successorMaterial: '789',
      demandPlanAdoption: 'DELETE',
    });
  });

  it('should handle empty strings for demandCharacteristic correctly', () => {
    const data: CMPData = {
      customerNumber: '123',
      materialNumber: '456',
      portfolioStatus: 'IA',
      demandCharacteristic: '',
      autoSwitchDate: new Date('2023-01-01'),
      repDate: new Date('2023-02-01'),
      successorMaterial: '789',
      demandPlanAdoption: 'DELETE',
      materialDescription: '',
    };

    const result = dataToCMPWriteRequest(data);

    expect(result).toEqual({
      customerNumber: '123',
      materialNumber: '456',
      portfolioStatus: 'IA',
      demandCharacteristic: null,
      autoSwitchDate: '2023-01-01',
      repDate: '2023-02-01',
      successorMaterial: '789',
      demandPlanAdoption: 'DELETE',
    });
  });

  it('should handle invalid demandCharacteristic correctly', () => {
    const data: CMPData = {
      customerNumber: '123',
      materialNumber: '456',
      portfolioStatus: 'SE',
      demandCharacteristic: 'invalid',
      autoSwitchDate: new Date('2023-01-01'),
      repDate: new Date('2023-02-01'),
      successorMaterial: '789',
      demandPlanAdoption: 'COPY',
      materialDescription: '',
    };

    const result = dataToCMPWriteRequest(data);

    expect(result).toEqual({
      customerNumber: '123',
      materialNumber: '456',
      portfolioStatus: 'SE',
      demandCharacteristic: null,
      autoSwitchDate: '2023-01-01',
      repDate: '2023-02-01',
      successorMaterial: '789',
      demandPlanAdoption: 'COPY',
    });
  });
});
