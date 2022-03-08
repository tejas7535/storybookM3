import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';

import { OverviewCardComponent } from './overview-card.component';

describe('OverviewCardComponent', () => {
  let component: OverviewCardComponent;
  let spectator: Spectator<OverviewCardComponent>;

  const createComponent = createComponentFactory({
    component: OverviewCardComponent,
    imports: [
      MatCardModule,
      MatIconModule,
      MatButtonModule,
      ReactiveComponentModule,
      RouterTestingModule,
    ],
    providers: [
      {
        provide: MatIconRegistry,
        useValue: {
          addSvgIcon: jest.fn(),
        },
      },
      {
        provide: DomSanitizer,
        useValue: {
          bypassSecurityTrustResourceUrl: jest.fn(() => 'sanitizedUrl'),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should do nothing if icon is not defined', () => {
      component.icon = undefined;

      component.ngOnInit();

      expect(component['matIconRegistry'].addSvgIcon).not.toHaveBeenCalled();
      expect(
        component['domSanitizer'].bypassSecurityTrustResourceUrl
      ).not.toHaveBeenCalled();
    });

    it('should register the svg icon', () => {
      component.icon = 'some icon url';

      component.ngOnInit();

      expect(component['matIconRegistry'].addSvgIcon).toHaveBeenCalledWith(
        'some icon url',
        'sanitizedUrl'
      );
      expect(
        component['domSanitizer'].bypassSecurityTrustResourceUrl
      ).toHaveBeenCalledWith('some icon url');
    });
  });
});
