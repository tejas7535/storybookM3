import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

import { PageMetaStatus } from '@caeonline/dynamic-forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { PageBeforePipe } from './page-before.pipe';
import { PagesStepperComponent } from './pages-stepper.component';

describe('PagesStepperComponent', () => {
  let component: PagesStepperComponent;
  let spectator: Spectator<PagesStepperComponent>;

  const createComponent = createComponentFactory({
    component: PagesStepperComponent,
    imports: [MatButtonModule, MatStepperModule],
    declarations: [PagesStepperComponent, PageBeforePipe],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('hasNext should return true if there is another page', () => {
    component.activePageId = 'mockPageId1';
    component.pages = [
      {
        id: 'mockPageId1',
        visible: true,
      },
      {
        id: 'mockPageId2',
        visible: true,
      },
    ] as PageMetaStatus[];

    expect(component.hasNext).toBeTruthy();
  });

  test('hasResultNext should return true if the next page is the result page', () => {
    component.activePageId = 'mockPageId2';
    component.pages = [
      {
        id: 'mockPageId1',
        visible: true,
      },
      {
        id: 'mockPageId2',
        visible: true,
      },
      {
        id: 'PAGE_RESULT',
        visible: true,
      },
    ] as PageMetaStatus[];

    expect(component.hasResultNext).toBeTruthy();
  });

  test('hasPrev should return true if there are one or more page before', () => {
    component.activePageId = 'mockPageId2';
    component.pages = [
      {
        id: 'mockPageId1',
        visible: true,
      },
      {
        id: 'mockPageId2',
        visible: true,
      },
    ] as PageMetaStatus[];

    expect(component.hasPrev).toBeTruthy();
  });

  test('ngOnChanges filter down the pages to the parent ones', () => {
    component.pages = [
      {
        id: 'mockPageIdParent',
        visible: true,
        isParent: true,
      },
      {
        id: 'mockPageIdChildren',
        visible: true,
      },
    ] as PageMetaStatus[];

    component.ngOnChanges();
    expect(component.pages).toEqual([
      {
        id: 'mockPageIdParent',
        visible: true,
        isParent: true,
      },
    ]);
  });

  test('activate should emit a activePageChange', () => {
    const spy = jest.spyOn(component.activePageIdChange, 'emit');
    const mockPage = {
      selectedStep: { label: 'MOCK_PAGE_ID' },
    } as StepperSelectionEvent;

    component.activate(mockPage);
    expect(spy).toBeCalledTimes(1);
  });

  test('prev', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const spy = jest.spyOn(component, 'navigatePage');

    component.prev();
    expect(spy).toHaveBeenCalledWith(-1);
  });

  test('next', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const spy = jest.spyOn(component, 'navigatePage');

    component.next();
    expect(spy).toBeCalledWith(1);
  });

  test('navigatePage should emit activePageIdChange', () => {
    component.activePageId = 'mockPageId1';
    component.pages = [
      {
        id: 'mockPageId1',
        visible: true,
      },
      {
        id: 'mockPageId2',
        visible: true,
      },
    ] as PageMetaStatus[];
    const spy = jest.spyOn(component.activePageIdChange, 'emit');

    component['navigatePage'](1);
    expect(spy).toBeCalledTimes(1);
  });

  test('getVisiblePages should return an array of visble pages', () => {
    component.pages = [
      {
        id: 'mockPageId1',
        visible: true,
      },
      {
        id: 'mockPageId2',
        visible: false,
      },
    ] as PageMetaStatus[];

    expect(component['getVisiblePages']()).toEqual([
      {
        id: 'mockPageId1',
        visible: true,
      },
    ]);
  });
});
