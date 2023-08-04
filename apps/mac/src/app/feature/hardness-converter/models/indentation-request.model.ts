import { IndentationMaterial } from './indentation-material.model';

export interface IndentationRequest {
  value: number;
  diameter?: number;
  load?: number;
  thickness?: number;
  material?: IndentationMaterial;
}
