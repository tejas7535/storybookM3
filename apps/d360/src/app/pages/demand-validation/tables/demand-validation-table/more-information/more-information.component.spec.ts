import { MaterialListEntry } from '../../../../../feature/demand-validation/model';
import { Stub } from '../../../../../shared/test/stub.class';
import { MoreInformationComponent } from './more-information.component';

describe('MoreInformationComponent', () => {
  let component: MoreInformationComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MoreInformationComponent>({
      component: MoreInformationComponent,
      providers: [Stub.getMatDialogProvider()],
    });

    Stub.setInput('selectedMaterial', {} as MaterialListEntry);
    Stub.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('data initialization', () => {
    it('should initialize data array with correct values', () => {
      const mockMaterial: Partial<MaterialListEntry> = {
        materialNumber: '12345',
        materialDescription: 'Test Material',
        materialClassification: 'Classification A',
        portfolioStatus: 'active',
        portfolioStatusDate: '2023-01-01',
        packagingSize: '10x10',
      } as any;

      Stub.setInput('selectedMaterial', mockMaterial as MaterialListEntry);
      Stub.detectChanges();

      expect(component['data'].length).toBe(5);
      expect(component['data'][0].title).toBe(
        'validation_of_demand.more_information.material_and_text'
      );
      expect(component['data'][1].title).toBe(
        'validation_of_demand.more_information.classification'
      );
      expect(component['data'][2].title).toBe(
        'validation_of_demand.supply_concept.title'
      );
      expect(component['data'][3].title).toBe(
        'validation_of_demand.more_information.pfStatus.title'
      );
      expect(component['data'][4].title).toBe(
        'validation_of_demand.more_information.packaging_size'
      );
    });

    it('should display fallback values for undefined material properties', () => {
      const emptyMaterial = {} as MaterialListEntry;

      Stub.setInput('selectedMaterial', emptyMaterial);
      Stub.detectChanges();

      expect(component['data'][0].value).toContain('-');
      expect(component['data'][1].value).toContain('-');
      expect(component['data'][4].value).toContain('-');
    });
  });

  describe('supplyConcept', () => {
    it('should return default supply concept when stochasticType is not supported', () => {
      const mockMaterial: Partial<MaterialListEntry> = {
        stochasticType: 'UNSUPPORTED' as any,
      } as MaterialListEntry;

      Stub.setInput('selectedMaterial', mockMaterial);
      Stub.detectChanges();

      const result = component['supplyConcept']();
      expect(result).toBe('validation_of_demand.supply_concept.ELSE');
    });

    it('should return supply concept with safetyStockCustomer when available', () => {
      const mockMaterial: Partial<MaterialListEntry> = {
        stochasticType: 'C',
        fixHor: '2023-01-01',
        safetyStockCustomer: 10,
      } as MaterialListEntry;

      Stub.setInput('selectedMaterial', mockMaterial);
      Stub.detectChanges();

      const result = component['supplyConcept']();
      expect(result).toBe('validation_of_demand.supply_concept.C.csss');
    });

    it('should return supply concept with safetyStock when available and no safetyStockCustomer', () => {
      const mockMaterial: Partial<MaterialListEntry> = {
        stochasticType: 'E',
        fixHor: '2023-01-01',
        safetyStock: 5,
      } as MaterialListEntry;

      Stub.setInput('selectedMaterial', mockMaterial);
      Stub.detectChanges();

      const result = component['supplyConcept']();
      expect(result).toBe('validation_of_demand.supply_concept.E.ss');
    });

    it('should return root supply concept when no safety stock values are available', () => {
      const mockMaterial: Partial<MaterialListEntry> = {
        stochasticType: 'F',
        fixHor: '2023-01-01',
      } as MaterialListEntry;

      Stub.setInput('selectedMaterial', mockMaterial);
      Stub.detectChanges();

      const result = component['supplyConcept']();
      expect(result).toBe('validation_of_demand.supply_concept.F.rootString');
    });
  });

  describe('formatDate', () => {
    it('should return formatted date when portfolioStatusDate exists', () => {
      const mockMaterial: Partial<MaterialListEntry> = {
        portfolioStatusDate: '2023-01-01',
      } as MaterialListEntry;

      Stub.setInput('selectedMaterial', mockMaterial);
      Stub.detectChanges();

      jest
        .spyOn(component['translocoLocaleService'], 'localizeDate')
        .mockReturnValue('01/01/2023');

      const result = component['formatDate']();
      expect(result).toBe('01/01/2023');
      expect(
        component['translocoLocaleService'].localizeDate
      ).toHaveBeenCalled();
    });
  });

  describe('openDetails', () => {
    it('should open dialog with correct parameters', () => {
      const mockMaterial: Partial<MaterialListEntry> = {
        materialNumber: '12345',
      } as MaterialListEntry;

      Stub.setInput('selectedMaterial', mockMaterial);
      Stub.detectChanges();

      jest.spyOn(component['dialog'], 'open');

      component['openDetails']();

      expect(component['dialog'].open).toHaveBeenCalledWith(
        expect.any(Function),
        {
          data: mockMaterial,
          width: '1000px',
          panelClass: 'resizable',
        }
      );
    });
  });
});
