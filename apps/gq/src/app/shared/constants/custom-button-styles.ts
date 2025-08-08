// when the default hover/active colors shall differ from preset the color needs to disabled.
// otherwise both colors would overlay each other.
export const rippleButtonOverrides = `
:host
 .noRippleHover {
        --mat-text-button-state-layer-color: none;
      }
`;

export const buttonHoverActiveStyle = `

@use '@angular/material' as mat;
@use 'sass:map';
@import 'libs/shared/ui/styles/src/lib/scss/schaeffler-colors';

@function hex-to-rgba($color, $opacity) {
  $red: red($color);
  $green: green($color);
  $blue: blue($color);

  @return rgba($red, $green, $blue, $opacity);
}

$neutral: map-get(map-get($schaeffler-palette-m3, neutral), 40);

.warning-with-opacity:hover {
  background-color: hex-to-rgba($warning, 0.08);
}
.warning-with-opacity:active {
  background-color: hex-to-rgba($warning, 0.12);
}
  
.neutral-with-opacity:hover {
  background-color: hex-to-rgba($neutral, 0.08);
}
.neutral-with-opacity:active {
  background-color: hex-to-rgba($neutral, 0.12);
}

.error-with-opacity:hover {
  background-color: hex-to-rgba($error, 0.08);
}
.error-with-opacity:active {
  background-color: hex-to-rgba($error, 0.12);
}
`;
