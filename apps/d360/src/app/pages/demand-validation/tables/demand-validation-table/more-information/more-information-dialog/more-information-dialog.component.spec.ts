import { Stub } from './../../../../../../shared/test/stub.class';
import { MoreInformationDialogComponent } from './more-information-dialog.component';

describe('MoreInformationDialogComponent', () => {
  let component: MoreInformationDialogComponent;

  beforeEach(() => {
    component = Stub.get<MoreInformationDialogComponent>({
      component: MoreInformationDialogComponent,
      providers: [Stub.getMatDialogDataProvider({})],
    });
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('map', () => {
    it('should return the correct value for currentRLTSchaeffler', () => {
      const key = 'currentRLTSchaeffler';
      component['material'][key] = 'testValue';
      component['material']['transitTimeBetweenProdPlantAndDistributionPlant'] =
        2;

      const result = component['map'](key);

      expect(result.value).toEqual('testValue (2)');
    });

    it('should return the correct value for demandCharacteristic', () => {
      const key = 'demandCharacteristic';
      component['material'][key] = 'someDemandCharacteristic';

      const result = component['map'](key);

      expect(result.value).toEqual(
        'validation_of_demand.more_information.dialog.demandCharacteristics.someDemandCharacteristic'
      );
    });

    it('should return the correct value for sectorManagement', () => {
      const key = 'sectorManagement';
      component['material'][key] = 'testSectorManagement';
      component['material']['sectorManagementText'] =
        'testSectorManagementText';

      const result = component['map'](key);

      expect(result.value).toEqual(
        'testSectorManagement - testSectorManagementText'
      );
    });

    it('should return default value for other keys', () => {
      const key = 'materialNumber';
      component['material'][key] = 'ABC123';

      const result = component['map'](key);

      expect(result.value).toEqual('ABC123');
      expect(result.text).toEqual(
        'validation_of_demand.more_information.dialog.entries.materialNumber'
      );
    });

    it('should handle undefined values for currentRLTSchaeffler and transitTime', () => {
      const key = 'currentRLTSchaeffler';
      component['material'][key] = undefined;
      component['material']['transitTimeBetweenProdPlantAndDistributionPlant'] =
        undefined;

      const result = component['map'](key);

      expect(result.value).toEqual('- (0)');
    });

    it('should handle undefined values for demandCharacteristic', () => {
      const key = 'demandCharacteristic';
      component['material'][key] = undefined;

      const result = component['map'](key);

      expect(result.value).toEqual('-');
    });

    it('should handle undefined values for sectorManagement and sectorManagementText', () => {
      const key = 'sectorManagement';
      component['material'][key] = undefined;
      component['material']['sectorManagementText'] = undefined;

      const result = component['map'](key);

      expect(result.value).toEqual('- - -');
    });

    it('should handle undefined values for default case', () => {
      const key = 'materialDescription';
      component['material'][key] = undefined;

      const result = component['map'](key);

      expect(result.value).toEqual('-');
    });
  });

  describe('computed properties', () => {
    it('should correctly compute title from material number and description', () => {
      component['material']['materialNumber'] = 'MAT123';
      component['material']['materialDescription'] = 'Sample Material';

      expect(component['title']()).toEqual('MAT123 | Sample Material');
    });

    it('should handle missing values in title computation', () => {
      component['material']['materialNumber'] = 'MAT123';
      component['material']['materialDescription'] = undefined as any;

      expect(component['title']()).toEqual('MAT123 | ');
    });

    it('should correctly compute items structure', () => {
      component['material']['materialNumber'] = 'MAT123';
      const expectedLength = 2; // Material and Customer tabs

      const result = component['items']();

      expect(result).toBeDefined();
      expect(result.length).toEqual(expectedLength);
      expect(result[0].title).toEqual(
        'validation_of_demand.more_information.dialog.tabs.material'
      );
      expect(result[1].title).toEqual(
        'validation_of_demand.more_information.dialog.tabs.customer'
      );
    });

    it('should include correct number of boxes in material tab', () => {
      const result = component['items']();

      expect(result[0].items.length).toEqual(2); // Two boxes for material data
      expect(result[0].items[0].title).toEqual(
        'validation_of_demand.more_information.dialog.boxes.generalMaterialInformation'
      );
      expect(result[0].items[1].title).toEqual(
        'validation_of_demand.more_information.dialog.boxes.supplyChain'
      );
    });

    it('should include correct number of boxes in customer tab', () => {
      const result = component['items']();

      expect(result[1].items.length).toEqual(2); // Two boxes for customer data
      expect(result[1].items[0].title).toEqual(
        'validation_of_demand.more_information.dialog.boxes.generalCustomerInformation'
      );
      expect(result[1].items[1].title).toEqual(
        'validation_of_demand.more_information.dialog.boxes.contact'
      );
    });

    it('should map all material box left properties correctly', () => {
      component['material']['materialNumber'] = 'MAT123';

      const result = component['items']();

      expect(result[0].items[0].items.length).toEqual(
        component['materialBoxLeft'].length
      );
      result[0].items[0].items.forEach((item: any, index: number) => {
        expect(item.text).toContain(component['materialBoxLeft'][index]);
      });
    });

    it('should map all customer box properties correctly', () => {
      component['material']['materialNumber'] = 'CUST123';

      const result = component['items']();

      expect(result[1].items[0].items.length).toEqual(
        component['customerBoxLeft'].length
      );
      expect(result[1].items[1].items.length).toEqual(
        component['customerBoxRight'].length
      );
    });
  });

  describe('property arrays', () => {
    it('should contain all expected materialBoxLeft properties', () => {
      expect(component['materialBoxLeft']).toContain('materialNumber');
      expect(component['materialBoxLeft']).toContain('materialDescription');
      expect(component['materialBoxLeft']).toContain('demandCharacteristic');
      expect(component['materialBoxLeft'].length).toEqual(15); // Update this if properties change
    });

    it('should contain all expected materialBoxRight properties', () => {
      expect(component['materialBoxRight']).toContain('productionPlant');
      expect(component['materialBoxRight']).toContain('currentRLTSchaeffler');
      expect(component['materialBoxRight']).toContain('dispoGroup');
      expect(component['materialBoxRight'].length).toEqual(9); // Update this if properties change
    });

    it('should contain all expected customerBoxLeft properties', () => {
      expect(component['customerBoxLeft']).toContain('customerNumber');
      expect(component['customerBoxLeft']).toContain('customerName');
      expect(component['customerBoxLeft']).toContain('subKeyAccountName');
      expect(component['customerBoxLeft'].length).toEqual(15); // Update this if properties change
    });

    it('should contain all expected customerBoxRight properties', () => {
      expect(component['customerBoxRight']).toContain('accountOwner');
      expect(component['customerBoxRight']).toContain('internalSales');
      expect(component['customerBoxRight']).toContain('kam');
      expect(component['customerBoxRight'].length).toEqual(5); // Update this if properties change
    });
  });
});
