export interface IndentationResponse {
  depth: number;
  edge_distance: number;
  indentation_distance: number;
  width: number;
  minimum_thickness: number;

  hardness_concave_cylinder_0?: number;
  hardness_concave_cylinder_45?: number;
  hardness_concave_sphere?: number;
  hardness_convex_cylinder?: number;
  hardness_convex_cylinder_0?: number;
  hardness_convex_cylinder_45?: number;
  hardness_convex_sphere?: number;

  test_force?: number;
  force_diameter_index?: number;
  indenter_ratio?: number;
  error?: string;
}
