export interface Role {
  /**
   * Set the text of the role title
   */
  title: string;

  /**
   * Set the text of the rights related to the role
   */
  rights: string;

  /**
   * Set true if the rights should be marked as missing
   */
  rightsMissing?: boolean;
}
