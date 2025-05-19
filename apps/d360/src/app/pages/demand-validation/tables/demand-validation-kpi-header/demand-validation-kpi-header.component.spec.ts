import { KpiBucketTypeEnum } from './../../../../feature/demand-validation/model';
import { Stub } from './../../../../shared/test/stub.class';
import {
  DemandValidationKpiHeaderComponent,
  ICustomHeaderParams,
} from './demand-validation-kpi-header.component';

describe('DemandValidationKpiHeaderComponent', () => {
  let component: DemandValidationKpiHeaderComponent;

  beforeEach(() => {
    component = Stub.get<DemandValidationKpiHeaderComponent>({
      component: DemandValidationKpiHeaderComponent,
    });

    component['params'] = {
      disableClick: false,
      onClickHeader: jest.fn(),
      kpiEntry: {
        fromDate: '2024-12-12',
        bucketType: KpiBucketTypeEnum.WEEK,
      },
    } as unknown as ICustomHeaderParams;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should initialize params', () => {
      const testParams = { test: 'params' } as unknown as ICustomHeaderParams;
      component.agInit(testParams);
      expect(component['params']).toEqual(testParams);
    });
  });

  describe('refresh', () => {
    it('should always return false', () => {
      const testParams = {} as ICustomHeaderParams;
      const result = component.refresh(testParams);
      expect(result).toBe(false);
    });
  });

  describe('getCalendarWeek', () => {
    it('should return calendar week in format ww', () => {
      const date = new Date('2024-01-15');
      const result = component['getCalendarWeek'](date);
      expect(result).toBe('03');
    });
  });

  describe('getWeekHeader', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'getCalendarWeek').mockReturnValue('42');
      jest.mock('@jsverse/transloco', () => ({
        translate: (key: string, params: any) => {
          if (
            key ===
            'validation_of_demand.planningTable.calendarWeekTableHeaderKw'
          ) {
            return `KW${params.calendar_week}`;
          }
          if (
            key ===
            'validation_of_demand.planningTable.calendarWeekTableHeaderPartWeek'
          ) {
            return `(${params.days} days)`;
          }

          return key;
        },
      }));
    });

    it('should return correct header for regular week', () => {
      const result = component['getWeekHeader'](
        '2024-05-15',
        KpiBucketTypeEnum.WEEK
      );
      expect(component['getCalendarWeek']).toHaveBeenCalled();
      expect(result).toContain(
        'validation_of_demand.planningTable.calendarWeekTableHeaderKw'
      );
      expect(result).not.toContain('days');
    });

    it('should return correct header for partial week', () => {
      const result = component['getWeekHeader'](
        '2024-05-15',
        KpiBucketTypeEnum.PARTIAL_WEEK
      );
      expect(component['getCalendarWeek']).toHaveBeenCalled();
      expect(result).toContain(
        'validation_of_demand.planningTable.calendarWeekTableHeaderKw validation_of_demand.planningTable.calendarWeekTableHeaderPartWeek'
      );
    });
  });

  describe('getDate', () => {
    beforeEach(() => {
      (component as any)['translocoLocaleService'] = {
        localizeDate: jest
          .fn()
          .mockImplementation((_date, _locale, options) => {
            if (options.month && !options.day) {
              return '12/2024';
            }

            return '15/12/2024';
          }),
        getLocale: jest.fn().mockReturnValue('en'),
      } as any;
    });

    it('should format date with month/year for MONTH bucket type', () => {
      const result = component['getDate'](
        '2024-12-15',
        KpiBucketTypeEnum.MONTH
      );
      expect(
        component['translocoLocaleService'].localizeDate
      ).toHaveBeenCalledWith('2024-12-15', 'en', {
        month: '2-digit',
        year: 'numeric',
      });
      expect(result).toBe('12/2024');
    });

    it('should format date with day/month/year for non-MONTH bucket types', () => {
      const result = component['getDate']('2024-12-15', KpiBucketTypeEnum.WEEK);
      expect(
        component['translocoLocaleService'].localizeDate
      ).toHaveBeenCalledWith('2024-12-15', 'en', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      expect(result).toBe('15/12/2024');
    });
  });

  describe('handleHeaderClick', () => {
    it('should call onClickHeader when disableClick is false', () => {
      component['params'].disableClick = false;

      component['handleHeaderClick']();

      expect(component['params'].onClickHeader).toHaveBeenCalledWith(
        component['params'].kpiEntry
      );
    });

    it('should not call onClickHeader when disableClick is true', () => {
      component['params'].disableClick = true;

      component['handleHeaderClick']();

      expect(component['params'].onClickHeader).not.toHaveBeenCalled();
    });
  });
});
