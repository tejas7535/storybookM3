import { GestureConfig } from '@angular/material/core';

export class HammerConfig extends GestureConfig {
  overrides = {
    pan: {
      direction: 6
    },
    pinch: {
      enable: false
    },
    rotate: {
      enable: false
    }
  };
}
