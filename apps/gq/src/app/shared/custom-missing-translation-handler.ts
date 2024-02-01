import {
  HashMap,
  TranslocoMissingHandler,
  TranslocoMissingHandlerData,
} from '@ngneat/transloco';

export class CustomMissingTranslationHandler
  implements TranslocoMissingHandler
{
  /**
   * Custom Handler to handle missing translations of transloco
   * when the requested key is not found in the JsonFiles and a parameter named 'fallback'
   * is provided the fallback value is returned otherwise the key is returned
   *
   * @param key the key that has no translation in JsonFiles
   * @param _data the translocoObject
   * @param params the params object provided when translationFunction is called t('key',{<paramName>:<paramValue>})
   * @returns it either returns the fallback value or the key
   */
  handle(
    key: string,
    _data: TranslocoMissingHandlerData,
    params?: HashMap
  ): any {
    if (params && params['fallback']) {
      return params['fallback'];
    }

    return key;
  }
}
