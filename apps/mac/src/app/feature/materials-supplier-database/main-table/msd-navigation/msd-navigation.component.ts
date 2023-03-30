/* eslint-disable max-lines */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { setNavigation } from '@mac/msd/store/actions/data';
import { DataFacade } from '@mac/msd/store/facades/data';

/* eslint-disable max-lines */
@Component({
  selector: 'mac-msd-navigation',
  templateUrl: './msd-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MsdNavigationComponent implements OnInit {
  @Input() expandMaterialClass: MaterialClass;

  public navigationLevels = [
    NavigationLevel.MATERIAL,
    NavigationLevel.SUPPLIER,
    NavigationLevel.STANDARD,
  ];

  public materialClasses$ = this.dataFacade.materialClassOptions$;
  public navigation$ = this.dataFacade.navigation$;
  public hasEditorRole$ = this.dataFacade.hasEditorRole$;

  public minimized = false;

  constructor(private readonly dataFacade: DataFacade) {}

  public ngOnInit(): void {
    this.dataFacade.dispatch(
      setNavigation({
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
      })
    );
  }

  public setActive(
    materialClass: MaterialClass,
    navigationLevel = NavigationLevel.MATERIAL
  ): void {
    this.dataFacade.dispatch(setNavigation({ materialClass, navigationLevel }));
  }

  public toggleSideBar() {
    this.minimized = !this.minimized;
  }

  public hasNavigationLevels(materialClass: MaterialClass): boolean {
    return materialClass !== MaterialClass.SAP_MATERIAL;
  }
}
