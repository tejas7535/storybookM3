# shared-utils-responsive

## How to Use

Install `@schaeffler/responsive` in your project and make use of it in your components like this:

```typescript
// any.component.ts

public isDesktop$: Observable<boolean>;

constructor(private readonly breakpointService: BreakpointService) {}


public ngOnInit(): void {
    // or access the other existing observables of the breakpoint service
    this.isDesktop$ = this.breakpointService.isDesktop();
}

```

## Running unit tests

Run `nx test shared-utils-responsive` to execute the unit tests.
