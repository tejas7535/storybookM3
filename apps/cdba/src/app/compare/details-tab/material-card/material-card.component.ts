import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';

import {
  getAdditionalInformation,
  getDimensionAndWeightDetails,
  getMaterialDesignation,
  getProductError,
} from '@cdba/compare/store';
import {
  AdditionalInformationDetails,
  DimensionAndWeightDetails,
} from '@cdba/shared/models';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cdba-material-card',
  templateUrl: './material-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialCardComponent implements OnInit {
  @Input() public index: number;

  public materialDesignation$: Observable<string>;
  public dimensionAndWeightDetails$: Observable<DimensionAndWeightDetails>;
  public additionalInformation$: Observable<AdditionalInformationDetails>;
  public errorMessage$: Observable<string>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.materialDesignation$ = this.store.select(
      getMaterialDesignation,
      this.index
    );

    this.dimensionAndWeightDetails$ = this.store.select(
      getDimensionAndWeightDetails,
      this.index
    );

    this.additionalInformation$ = this.store.select(
      getAdditionalInformation,
      this.index
    );

    this.errorMessage$ = this.store.select(getProductError, this.index);
  }
}
