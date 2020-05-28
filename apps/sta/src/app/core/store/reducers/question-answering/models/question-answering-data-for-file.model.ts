import { QuestionAndAnswer } from './question-and-answer.model';
import { QuestionAnsweringFileInput } from './question-answering-file-input.model';

export class QuestionAndAnswerDataForFile {
  constructor(
    public input: QuestionAnsweringFileInput,
    public conversation: QuestionAndAnswer[],
    public loading: boolean,
    public success: boolean
  ) {}
}
