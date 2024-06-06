import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  Host,
  Input,
  OnInit,
  Optional,
} from '@angular/core';

import { focusSelectedElement } from '../../util';
import { Co2ComponentComponent } from '../co2-component/co2-component.component';
import { ManufacturerSupplierComponent } from '../manufacturer-supplier/manufacturer-supplier.component';
import { MaterialStandardComponent } from '../material-standard/material-standard.component';

@Directive({ selector: '[macMaterialDialogBasePart]', standalone: true })
export class MaterialDialogBasePartDirective implements OnInit, AfterViewInit {
  @Input() column: string;

  private host:
    | Co2ComponentComponent
    | ManufacturerSupplierComponent
    | MaterialStandardComponent;

  public constructor(
    protected readonly cdRef: ChangeDetectorRef,
    @Host() @Optional() private readonly co2Host: Co2ComponentComponent,
    @Host()
    @Optional()
    private readonly supplierHost: ManufacturerSupplierComponent,
    @Host()
    @Optional()
    private readonly materialStandardHost: MaterialStandardComponent
  ) {}

  public ngOnInit(): void {
    switch (true) {
      case !!this.co2Host: {
        this.host = this.co2Host;
        break;
      }
      case !!this.supplierHost: {
        this.host = this.supplierHost;
        break;
      }
      case !!this.materialStandardHost: {
        this.host = this.materialStandardHost;
        break;
      }
      default: {
        break;
      }
    }
  }

  public ngAfterViewInit(): void {
    if (this.column) {
      setTimeout(
        () =>
          focusSelectedElement(
            this.host.dialogControlRefs,
            this.column,
            this.cdRef
          ),
        0
      );
    }
  }
}
