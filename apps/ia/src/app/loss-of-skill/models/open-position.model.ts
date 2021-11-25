import { Position } from '../../shared/models';

export interface OpenPosition extends Position {
  positionOpenDate: string;
  recruitmentExternal: boolean;
  recruitmentInternal: boolean;
}
