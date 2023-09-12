/* eslint-disable max-lines */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { setNavigation } from '@mac/msd/store/actions/data';
import { DataFacade } from '@mac/msd/store/facades/data';

import { ActiveNavigationLevel } from '../../models';
import { MsdAgGridStateService } from '../../services';

/* eslint-disable max-lines */
@Component({
  selector: 'mac-msd-navigation',
  templateUrl: './msd-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MsdNavigationComponent implements OnInit, OnChanges {
  @Input() activeNavigationLevel: ActiveNavigationLevel;

  public navigationLevels = [
    NavigationLevel.MATERIAL,
    NavigationLevel.SUPPLIER,
    NavigationLevel.STANDARD,
  ];

  public materialClasses$ = this.dataFacade.materialClassOptions$;
  public navigation$ = this.dataFacade.navigation$;
  public hasEditorRole$ = this.dataFacade.hasEditorRole$;

  public minimized = false;

  constructor(
    private readonly dataFacade: DataFacade,
    private readonly msdAgGridStateService: MsdAgGridStateService
  ) {}

  public ngOnInit(): void {
    if (!this.activeNavigationLevel) {
      this.activeNavigationLevel =
        this.msdAgGridStateService.getLastActiveNavigationLevel();
    }

    this.dataFacade.dispatch(
      setNavigation({
        ...this.activeNavigationLevel,
      })
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeNavigationLevel && this.activeNavigationLevel) {
      this.dataFacade.dispatch(
        setNavigation({
          ...this.activeNavigationLevel,
        })
      );
      this.msdAgGridStateService.storeActiveNavigationLevel({
        ...this.activeNavigationLevel,
      });
    }
  }

  public setActive(
    materialClass: MaterialClass,
    navigationLevel = NavigationLevel.MATERIAL
  ): void {
    this.dataFacade.dispatch(setNavigation({ materialClass, navigationLevel }));
    this.msdAgGridStateService.storeActiveNavigationLevel({
      materialClass,
      navigationLevel,
    });
  }

  public toggleSideBar() {
    this.minimized = !this.minimized;
  }

  public hasNavigationLevels(materialClass: MaterialClass): boolean {
    return materialClass !== MaterialClass.SAP_MATERIAL;
  }
}
