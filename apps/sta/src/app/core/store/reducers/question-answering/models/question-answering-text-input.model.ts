import { Language } from '../../../../../shared/result/models/language.enum';

export interface QuestionAnsweringTextInput {
  text: string;
  question: string;
  textLang?: Language;
}
