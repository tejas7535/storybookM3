import { QuestionAndAnswer } from './question-and-answer.model';
import { QuestionAnsweringTextInput } from './question-answering-text-input.model';

export class QuestionAndAnswerDataForText {
  constructor(
    public input: QuestionAnsweringTextInput,
    public conversation: QuestionAndAnswer[],
    public loading: boolean
  ) {}
}
