import { fakeAsync, flush, tick } from '@angular/core/testing';

import { BehaviorSubject, of, throwError } from 'rxjs';

import { Stub } from '../../../../shared/test/stub.class';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { CommentsDataSourceService } from './comments-datasource.service';
import { CommentsModalComponent } from './comments-modal.component';

describe('CommentsModalComponent', () => {
  let component: CommentsModalComponent;
  let loadedSubject: BehaviorSubject<boolean>;
  let secondLoadNeededSubject: BehaviorSubject<boolean | null>;
  let secondLoadedSubject: BehaviorSubject<boolean | null>;
  let dataSourceMock: Partial<CommentsDataSourceService>;
  let originalLocaleServiceDescriptor: PropertyDescriptor | undefined;

  beforeAll(() => {
    originalLocaleServiceDescriptor = Object.getOwnPropertyDescriptor(
      ValidationHelper,
      'localeService'
    );
  });

  afterAll(() => {
    if (originalLocaleServiceDescriptor) {
      Object.defineProperty(
        ValidationHelper,
        'localeService',
        originalLocaleServiceDescriptor
      );
    }
  });

  beforeEach(() => {
    loadedSubject = new BehaviorSubject<boolean>(false);
    secondLoadNeededSubject = new BehaviorSubject<boolean | null>(null);
    secondLoadedSubject = new BehaviorSubject<boolean | null>(null);

    dataSourceMock = {
      loaded$: loadedSubject,
      secondLoadNeeded$: secondLoadNeededSubject,
      secondLoaded$: secondLoadedSubject,
      length: 5,
      refreshLastPage: jest.fn(),
    };

    ValidationHelper.localeService = {
      getLocale: () => 'en-US',
      localizeDate: () => '15.05.2023, 14:30',
      localizeNumber: String,
    } as any;

    jest.spyOn(Stub, 'initValidationHelper').mockImplementation(() => {});

    component = Stub.getForEffect<CommentsModalComponent>({
      component: CommentsModalComponent,
      providers: [
        Stub.getMatDialogDataProvider({ customerNumber: '12345' }),
        Stub.getSalesPlanningServiceProvider(),
        {
          provide: CommentsDataSourceService,
          useValue: dataSourceMock,
        },
      ],
    });

    jest.spyOn(Stub, 'initValidationHelper').mockRestore();
  });

  describe('initialization', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should have a form with a text control that is required', () => {
      expect(component['form']).toBeDefined();
      expect(component['form'].get('text')).toBeDefined();
      expect(component['form'].get('text').hasValidator).toBeTruthy();
    });

    it('should initialize with loading state as true', () => {
      expect(component['loading']()).toEqual(true);
    });

    it('should have maxLength property set to 500', () => {
      expect(component['maxLength']).toEqual(500);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should handle reload and scrolling to bottom correctly', fakeAsync(() => {
      (component as any)['viewport'] = { scrollTo: jest.fn() } as any;
      const scrollToSpy = (component as any)['viewport'].scrollTo;
      const scrollToBottomSpy = jest.spyOn(component as any, 'scrollToBottom');

      component['dataSource'].loaded$.next(false);
      component['dataSource'].secondLoadNeeded$.next(true);
      component['dataSource'].secondLoaded$.next(null);

      component.ngAfterViewInit();
      tick(100);
      tick(200);

      expect(scrollToBottomSpy).toHaveBeenCalledTimes(1);
      expect(scrollToSpy).toHaveBeenCalledTimes(2);

      component['dataSource'].secondLoadNeeded$.next(null);
      component['dataSource'].secondLoaded$.next(true);

      tick(100);
      tick(200);

      expect(scrollToBottomSpy).toHaveBeenCalledTimes(2);
      expect(scrollToSpy).toHaveBeenCalledTimes(4);
    }));
  });

  describe('getDate', () => {
    it('should format date correctly using ValidationHelper', () => {
      const testDate = new Date('2023-05-15T14:30:00');

      const result = component['getDate'](testDate);

      expect(result).toBe('15.05.2023, 14:30');
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should not call salesPlanningService when form is invalid', () => {
      const salesPlanningServiceSpy = jest.spyOn(
        component['salesPlanningService'],
        'postComment$'
      );

      component['onSubmit']();

      expect(salesPlanningServiceSpy).not.toHaveBeenCalled();
    });

    it('should show error snackbar when postComment$ fails', fakeAsync(() => {
      const error = new Error('API Error');
      const salesPlanningServiceSpy = jest
        .spyOn(component['salesPlanningService'], 'postComment$')
        .mockReturnValue(throwError(() => error));

      const snackbarServiceSpy = jest.spyOn(
        component['snackbarService'],
        'openSnackBar'
      );

      component['form'].setValue({ text: 'Test comment' });
      component['onSubmit']();
      flush();

      expect(component['form'].valid).toBe(true);
      expect(salesPlanningServiceSpy).toHaveBeenCalled();
      expect(snackbarServiceSpy).toHaveBeenCalledWith('error.save.failed');
    }));

    it('should call dataSource.refreshLastPage when postComment$ succeeds', fakeAsync(() => {
      const customerNumber = '12345';
      const commentText = 'Test comment';
      const dataSourceSpy = jest.spyOn(
        component['dataSource'],
        'refreshLastPage'
      );

      jest
        .spyOn(component['salesPlanningService'], 'postComment$')
        .mockReturnValue(of({}));

      Object.defineProperty(component['dataSource'], 'length', {
        get: jest.fn().mockReturnValue(1),
      });

      component['form'].setValue({ text: commentText });
      component['onSubmit']();
      flush();

      expect(
        component['salesPlanningService']['postComment$']
      ).toHaveBeenCalledWith({ text: commentText }, customerNumber);
      expect(dataSourceSpy).toHaveBeenCalledWith(2);
    }));

    it('should enforce required validator on text control', () => {
      const textControl = component['form'].get('text');

      expect(textControl.value).toBeNull();
      expect(textControl.valid).toBe(false);
      expect(textControl.errors).toHaveProperty('required');

      textControl.setValue('Test comment');

      expect(textControl.valid).toBe(true);
      expect(textControl.errors).toBeNull();
    });

    it('should reset form after successful submission', fakeAsync(() => {
      const formResetSpy = jest.spyOn(component['form'], 'reset');
      const setErrorsSpy = jest.spyOn(
        component['form'].get('text'),
        'setErrors'
      );

      jest
        .spyOn(component['salesPlanningService'], 'postComment$')
        .mockReturnValue(of({}));

      component['form'].setValue({ text: 'Test comment' });
      component['onSubmit']();
      flush();

      expect(formResetSpy).toHaveBeenCalled();
      expect(setErrorsSpy).toHaveBeenCalledWith(null);
    }));
  });

  describe('scrollToBottom', () => {
    it('should call viewport.scrollTo with bottom:0 twice with timeouts', fakeAsync(() => {
      const viewportMock = { scrollTo: jest.fn() };
      (component as any)['viewport'] = viewportMock;

      component['scrollToBottom']();

      expect(viewportMock.scrollTo).not.toHaveBeenCalled();

      tick(100);
      expect(viewportMock.scrollTo).toHaveBeenCalledWith({ bottom: 0 });
      expect(viewportMock.scrollTo).toHaveBeenCalledTimes(1);

      tick(100);
      expect(viewportMock.scrollTo).toHaveBeenCalledTimes(2);
      expect(viewportMock.scrollTo).toHaveBeenNthCalledWith(2, { bottom: 0 });
    }));
  });

  describe('scrollingNeeded$ subscription', () => {
    it('should call scrollToBottom when scrollingNeeded$ emits true', fakeAsync(() => {
      // Setup
      const scrollingNeededSubject = new BehaviorSubject<boolean>(false);
      (component as any)['dataSource'] = {
        ...dataSourceMock,
        scrollingNeeded$: scrollingNeededSubject,
      };

      const scrollToBottomSpy = jest.spyOn(component as any, 'scrollToBottom');
      (component as any)['viewport'] = { scrollTo: jest.fn() };

      component.ngAfterViewInit();

      expect(scrollToBottomSpy).not.toHaveBeenCalled();

      scrollingNeededSubject.next(true);

      expect(scrollToBottomSpy).toHaveBeenCalled();

      scrollToBottomSpy.mockClear();
      scrollingNeededSubject.next(false);
      expect(scrollToBottomSpy).not.toHaveBeenCalled();

      flush();
    }));
  });
});
