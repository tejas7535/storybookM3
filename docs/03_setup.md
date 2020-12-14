## Project Setup

### Create a new application

- Run `npx nx workspace-generator new-app`
- Follow the setup guide
- The app will be generated for you with our workspace defaults

### Further Adaptions

Configuration:

- If you want to apply more complex configuration scenarios, please get in touch with us first in order to discuss your needs.

Styles:

- Import common styles from the `@schaeffler/styles` package with `@import 'libs/shared/ui/styles/src/<package>';` to your app's `styles.scss`. Be cautious: Only import what you need, in order to keep the bundle size small.
- Add `@import 'https://fonts.googleapis.com/icon?family=Material+Icons';` to your app's `styles.scss` to support Material Icons
