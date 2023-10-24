# Guided Quoting

Official Guided Quoting Frontend Application.

## Feature Toggle
You can make use of feature toggls to disable/enable certain features. 
The currently available features can be found in the running environment on `/feature-toggle-config`.

Important notes: 
- feature toggles *are disabled on Production* to be not able to switch on features manually (purpose is testing)
- the settings are saved in the `localStorage` of your browser -> features are disabled/enabled only for you within the used browser

### Create new Features
You can add/remove features to the feature toggles overview by modifying the interface [GqFeatureToggleConfig](./src/feature-config/default-config.ts). 
After that, the [DEFAULT_CONFIG](./src/feature-config/default-config.ts) needs to be updated accordingly. This `DEFAULT_CONFIG` is injected via the `app.module.ts`.


### Making use of Features

#### Via Directive
In order to hide a component dependent on a feature the following [FeatureToggleDirective](./src/app/shared/directives/feature-toggle/feature-toggle.directive.ts) can be use: `*featureToggle="'featureA'"`
This would hide the related element if `featureA` is disabled.

#### Via Service
You can also check the status of a feature within a component itself by making use of the [FeatureToggleConfigService](./src/app/shared/services/feature-toggle/feature-toggle-config.service.ts).
