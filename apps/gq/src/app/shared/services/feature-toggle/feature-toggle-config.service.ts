import { Inject, Injectable } from '@angular/core';

import { EnvironmentEnum } from '../../models/environment.enum';
import { FEATURE_TOGGLE_CONFIG_LOCAL_STORAGE_KEY } from './feature-toggle-config-localstorage-key.injection-token';
import { FEATURE_TOGGLE_DEFAULT_CONFIG } from './feature-toggle-default-config.injection-token';

/**
 * Handles a feature toggle configuration.
 * Default configuration is delivered via `FEATURE_TOGGLE_DEFAULT_CONFIG` injection Token. Standard Default configuration is
 * `{ '*': true }` which means that all features are configured to be `enabled`
 *
 * If not in productive mode configuration is saved in localstorage. Changes items were not be overridden, but cumulated
 *
 * @usageNotes
 * *Configuration is expected to have 1 level* such as JSON:
 *
 * ```JSON
 * {
 *   "featureOne": true,
 *   "featureTwo": false
 * }
 * ```
 *
 *
 * or if interface is provided:
 * ```typescript
 * export interface AnInterface {
 *   featureOne: boolean;
 *   featureTwo: boolean;
 * }
 * ```
 *
 * @usageNotes
 * In order to use a custom configuration for feature toggles make sure a default configuration is provided.
 * ### Example for initializing the custom configuration
 *
 * Initially call method `initializeLocalStorage`. This will cumulate the data from the custom configuration and the existing localStorage depending on given environment key.
 * The config can be reached by localStorage key that is provided via injection token `FEATURE_TOGGLE_CONFIG_LOCAL_STORAGE_KEY`, default value would be `config`
 *
 * Service provides fields:
 * `isProduction` --> return `true` if the default config is used, `false` if customConfig is used. DefaultConfig is used if custom configuration could not be found
 *
 * Config --> returns the complete entry set of config
 *
 * Service provides functions
 * `initializeLocalStorage` --> initializes the localStorage and cumulates the data (saved values were not overridden)
 *
 * `saveConfigToLocalStorage` --> saves a config to a localStorage when custom configuration is used
 *
 * `isEnabled` --> returns the value of requested feature `true`or `false`
 *
 */
@Injectable({
  providedIn: 'root',
})
export class FeatureToggleConfigService {
  constructor(
    @Inject(FEATURE_TOGGLE_DEFAULT_CONFIG) private readonly defaultConfig: any,
    @Inject(FEATURE_TOGGLE_CONFIG_LOCAL_STORAGE_KEY)
    private readonly featureToggleLocalstorageKey: string
  ) {
    this._config = this.defaultConfig;
  }

  /**
   * returns the true or false value if environment is production
   */
  public get isProduction(): boolean {
    return this._isProd;
  }

  /**
   * returns the entry set of configured features
   */
  public get Config(): any {
    return this._config;
  }

  private _isProd = true;
  private _config: any;

  /**
   * Initializes the localStorage.
   * Productive Environment do not were not supposed to toggle features.
   * Update the localstorage and cumulates the data
   *
   * @param environment environment context, service is currently running
   */
  initializeLocalStorage(environment: EnvironmentEnum): void {
    if (environment === EnvironmentEnum.prod) {
      this._isProd = true;
      localStorage.removeItem(this.featureToggleLocalstorageKey);
    } else {
      this._isProd = false;
      this.updateLocalStorage(this.defaultConfig);
    }
  }

  /**
   * Save changed config to localstorage if not on prod
   *
   * @param config changed config to get saved
   */
  saveConfigToLocalStorage(config: any): void {
    if (!this.isProduction) {
      localStorage.setItem(
        this.featureToggleLocalstorageKey,
        JSON.stringify(config)
      );

      this._config = config;
    }
  }

  /**
   * checks if the given feature name is configured to be enabled
   *
   * @param name name of the feature to check
   */
  isEnabled(name: string) {
    if (this.Config['*']) {
      return true;
    }

    return this.Config[name];
  }
  /**
   * Cumulate local storage data. Values were not overridden.
   * Outdated fields will be removed and new fields will be added.
   *
   * @param fileConfig data loaded from assets/config
   */
  private updateLocalStorage(fileConfig: any): void {
    let localConfig: any = localStorage.getItem(
      this.featureToggleLocalstorageKey
    );
    if (localConfig) {
      localConfig = JSON.parse(localConfig);

      for (const [key] of Object.entries(localConfig)) {
        // eslint-disable-next-line no-prototype-builtins
        if (!fileConfig.hasOwnProperty(key)) {
          delete localConfig[key];
        }
      }

      for (const [key, value] of Object.entries(fileConfig)) {
        // eslint-disable-next-line no-prototype-builtins
        if (!localConfig.hasOwnProperty(key)) {
          localConfig[key] = value;
        }
      }

      localStorage.setItem(
        this.featureToggleLocalstorageKey,
        JSON.stringify(localConfig)
      );

      this._config = localConfig;
    } else {
      localStorage.setItem(
        this.featureToggleLocalstorageKey,
        JSON.stringify(this.defaultConfig)
      );
      this._config = this.defaultConfig;
    }
  }
}
