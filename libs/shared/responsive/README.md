# WIP: Responsive Library

The `Responsive Library` provides a `BreakpointService`, which is based on Angular's `BreakpointObserver` and tells you, in which screen mode (mobile, tablet, desktop, portrait, landscape, ...) the application runs. With that information, you can show and hide widgets or enable/disable some functions.

## Angular Default Breakpoints

The `BreakpointObserver` is based on Angulars default breakpoints:

| breakpoint | mediaQuery                                             |
| ---------- | ------------------------------------------------------ |
| xs         | 'screen and (max-width: 599px)'                        |
| sm         | 'screen and (min-width: 600px and max-width: 959px)'   |
| md         | 'screen and (min-width: 960px and max-width: 1279px)'  |
| lg         | 'screen and (min-width: 1280px and max-width: 1919px)' |
| xl         | 'screen and (min-width: 1920px)'                       |
|            |                                                        |

## Using custom media queries

If the `BreakpointService` cannot serve your purpose, you can just inject the `BreakpointObserver` directly in your code and pass your custom query. See official [docs](https://material.angular.io/cdk/layout/overview).

`Injecting custom breakpoints` for Angular's `FlexLayoutModule` is a different story, which is described [here](https://github.com/angular/flex-layout/wiki/Breakpoints). Please use it with care in order to avoid incosistencies in your application.
