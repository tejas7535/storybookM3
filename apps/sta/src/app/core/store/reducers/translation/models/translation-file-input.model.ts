import { FileReplacement } from '../../../../../shared/result/models/file-replacement.model';
import { Language } from '../../../../../shared/result/models/language.enum';

export interface TranslationFileInput {
  file: FileReplacement;
  targetLang?: Language;
  textLang?: Language;
}
