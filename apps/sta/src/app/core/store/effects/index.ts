import { ClassificationEffects } from './drei-d-master/drei-d-master.effects';
import { QuestionAnsweringEffects } from './question-answering/question-answering.effects';
import { TaggingEffects } from './tagging/tagging.effects';
import { TranslationEffects } from './translation/translation.effects';

export const effects = [
  TaggingEffects,
  TranslationEffects,
  QuestionAnsweringEffects,
  ClassificationEffects,
];
