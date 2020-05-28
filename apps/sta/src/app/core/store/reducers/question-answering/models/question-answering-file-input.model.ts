import { FileReplacement } from '../../../../../shared/result/models/file-replacement.model';
import { Language } from '../../../../../shared/result/models/language.enum';

export interface QuestionAnsweringFileInput {
  file: FileReplacement;
  question: string;
  textLang?: Language;
  textInput?: string;
}
