import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getBearingLoading } from '../../../core/store';
import { BearingMetadata } from '../../../core/store/reducers/bearing/models';
import { TAB_TYPE } from './tabtype.enum';

interface BearingProperties {
  name: string;
  property: string;
  unit?: string;
}

@Component({
  selector: 'goldwind-cm-equipment',
  templateUrl: './cm-equipment.component.html',
  styleUrls: ['./cm-equipment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CmEquipmentComponent implements OnInit {
  @Input() mainBearing: BearingMetadata;

  bearingProperties: BearingProperties[] = [
    { name: 'description', property: 'description' },
    { name: 'name', property: 'name' },
    { name: 'manufacturer', property: 'manufacturer' },
    { name: 'type', property: 'type' },
    { name: 'locationLatitude', property: 'locationLatitude' },
    { name: 'locationLongitude', property: 'locationLongitude' },
  ];
  selectedTab: TAB_TYPE = TAB_TYPE.META;
  loading$: Observable<boolean>;

  public constructor(
    private readonly store: Store,
    private readonly change: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(getBearingLoading);
  }

  handleSelectedTabChange(event: MatTabChangeEvent): void {
    this.selectedTab = event.tab.textLabel as TAB_TYPE;
    this.change.markForCheck();
  }

  getBearingMeta(property: string): string {
    return (this.mainBearing && (this.mainBearing as any)[property]) || 'n/a';
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
