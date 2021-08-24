import { MatSidenavModule } from '@angular/material/sidenav';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let spectator: Spectator<SidebarComponent>;

  const createComponent = createComponentFactory({
    component: SidebarComponent,
    declarations: [SidebarComponent],
    imports: [MatSidenavModule, provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#toggle', () => {
    it('should call sidebar toggle', () => {
      component['sidenav'].toggle = jest.fn();

      component.toggle();

      expect(component['sidenav'].toggle).toHaveBeenCalled();
    });
  });
});
