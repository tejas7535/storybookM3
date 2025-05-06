import { LanguageFontMappings } from './font-resolver.service';

export const MOCK_FONT_CONFIGS = [
  {
    fontName: 'Noto',
    fontStyle: 'Regular',
    fileName: 'NotoRegular.ttf',
  },
  {
    fontName: 'Noto',
    fontStyle: 'Bold',
    fileName: 'NotoBold.ttf',
  },
];

export const MOCK_LANGUAGE_MAPPING: LanguageFontMappings = {
  de: {
    fontName: 'DE',
    fontStyle: 'Bold',
    fileName: 'de.ttf',
  },
  en: {
    fontName: 'En',
    fontStyle: 'Bold',
    fileName: 'en.ttf',
  },
};
