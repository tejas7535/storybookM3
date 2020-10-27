# shared-utils-http

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test shared-utils-http` to execute the unit tests.

## Preconditions

- This lib depends on `@schaeffer/snackbar` which also needs to be installed. Take a look at its installation guide before you proceed here.  
- `HttpClientModule` needs to be imported in your project since this lib relies on that.

## Usage


1. Import this module
    ```
        import { HttpModule } from '@schaeffler/http';

        ...
        imports: [
            HttpModule.forRoot({ environment })
        ]
        ...
    ```
2. Add the variable `baseUrl` to your `environment` (e.g. with value `localhost:8000/api/v1`)
3. Make use of the `DataService` in your REST services like
    ```
        import { DataService } from '@schaeffler/http';

        ...
        public constructor(
            private readonly dataService: DataService
        ) {}
        ...

        public getAllApples(): Observable<Apple[]> {
            return this.dataService
            .getAll<AppleResponse>("apples") // GET http://localhost:8000/api/v1/apples
            .pipe(map((response) => response.items));
        }
    ```



**Optional**:  
If you want to make use of the `HttpErrorInterceptor` which logs http errors and show an error notification toast, you have to add it under your `providers` list of your module:  
```
    import { HttpErrorInterceptor } from '@schaeffler/http';
    import { HTTP_INTERCEPTORS } from '@angular/common/http';

    ...
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
        },
    ]
    ...   
```

