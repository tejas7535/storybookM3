import {
  LubricantType,
  LubricationPoints,
  Optime,
  PowerSupply,
} from '../constants';
import { Grease } from './grease.model';

export interface RecommendationFormValue {
  lubricationPoints: LubricationPointsFormValue;
  lubricant: LubricantFormValue;
  application: ApplicationFormValue;
}

export interface LubricationPointsFormValue {
  lubricationPoints: LubricationPoints;
  lubricationInterval: string;
  lubricationQty: number;
  pipeLength: LSAInterval;
  optime: Optime;
}

export interface LubricantFormValue {
  lubricantType: LubricantType;
  grease: Grease;
}

export interface ApplicationFormValue {
  temperature: LSAInterval;
  battery: PowerSupply;
}

export interface LSAInterval {
  min: number;
  max: number;
  title: string;
}
