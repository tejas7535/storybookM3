import { Language } from './language.enum';

export class TextInput {
  constructor(
    public text: string,
    public targetLang?: Language,
    public textLang?: Language
  ) {}
}
