import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getBearingLoading } from '../../../core/store';
import { BearingState } from '../../../core/store/reducers/bearing/bearing.reducer';
import { BearingMetadata } from '../../../core/store/reducers/bearing/models';

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

  selectedTab = 0;

  loading$: Observable<boolean>;

  public constructor(
    private readonly store: Store<BearingState>,
    private change: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading$ = this.store.pipe(select(getBearingLoading));
  }

  handleSelectedTabChange(event: number): void {
    this.selectedTab = event;
    this.change.markForCheck();
  }

  getBearingMeta(property: string): string {
    return (this.mainBearing && (this.mainBearing as any)[property]) || 'n/a';
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
