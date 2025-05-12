import { Component, input, InputSignal, viewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatMenu,
  MatMenuContent,
  MatMenuTrigger,
} from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'd360-menu-panel-button',
  imports: [
    MatTooltip,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatIconButton,
    MatMenuContent,
  ],
  templateUrl: './menu-panel-button.component.html',
})
export class MenuPanelButtonComponent {
  private readonly menuTrigger = viewChild<MatMenuTrigger>('menuTrigger');
  protected readonly icon: InputSignal<string> = input.required<string>();
  protected readonly tooltip: InputSignal<string> = input<string>();
  protected readonly disabled: InputSignal<boolean> = input<boolean>(false);
  protected readonly title: InputSignal<string> = input<string>(null);
  protected readonly subtitle: InputSignal<string> = input<string>(null);

  public closeMenu(): void {
    this.menuTrigger().closeMenu();
  }
}
