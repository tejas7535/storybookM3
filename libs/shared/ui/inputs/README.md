# frontend@schaeffler Inputs Documentation

UI library to provide components for custom search and select controls according to the design guidelines.

## Usage



### Using the shared option type

This lib provides UI components under separate entrypoints. The general entrypoints provides shared resources commonly used in the components.


```ts
import { StringOption } from '@schaeffler/inputs';

const options: StringOption[] = [
    {
        id: '1',
        title: 'full option',
        removable: true,
        tooltip: 'option tooltip',
        tooltipDelay: 1000,
    },
    {
        id: 1,
        title: 'minimum option',
    }
]

...
})
```

### API

#### StringOption

| Name           | Type             |Description                                                                                                      |
| ---------------| -----------------|-----------------------------------------------------------------------------------------------------------------|
| id             | string \| number | the id of the option                                                                                            |
| title          | string           | the title of the option                                                                                         |
| removable      | boolean          | (optional) Whether the option can be removed from the select control                                            |
| tooltip        | string           | (optional) the tooltip an option should display on hover                                                        |
| tooltipDelay   | number           | (optional) the delay the tooltip should have before showing in ms                                               |
| data           | any              | (optional) additional data to append to an option                                                               |

### Using the UI components

- see [search UI component](search/src/lib/README.md)
- see [select UI component](select/src/lib/README.md)

## Development

### Run Tests

#### Lint

```shell
$ nx lint shared-ui-inputs
```

#### Unit Tests

```shell
$ nx test shared-ui-inputs
```
