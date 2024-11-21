import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoService } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'lsa-remote-change-info',
  templateUrl: './remote-change-info.component.html',
  standalone: true,
  imports: [SharedTranslocoModule, MatIconModule, MatTooltipModule],
})
export class RemoteChangeInfoComponent implements OnInit {
  @Input() original: string | number;
  @Input() new: string | number;

  infoString: string;

  constructor(private readonly transloco: TranslocoService) {}

  ngOnInit() {
    this.infoString = this.transloco.translate('inputs.remoteChanged', {
      original: this.original,
      new: this.new,
    });
  }
}
