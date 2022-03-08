import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mac-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCardComponent implements OnInit {
  @Input() image: string;
  @Input() icon: string;
  @Input() title: string;
  @Input() description: string;
  @Input() link: string;
  @Input() learnMoreLink?: string;
  @Input() noAccessText? = 'No Access';

  @Input() disableImageHoverEffect? = false;
  @Input() external? = false;
  @Input() learnMoreExternal? = false;
  @Input() noAccess? = false;
  @Input() inverted? = false;

  hovered$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer
  ) {}

  public ngOnInit(): void {
    if (this.icon) {
      this.matIconRegistry.addSvgIcon(
        this.icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.icon)
      );
    }
  }
}
