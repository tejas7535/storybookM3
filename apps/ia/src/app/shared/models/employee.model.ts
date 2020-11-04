export class Employee {
  public constructor(
    public accountNumber: string,
    public parentAccountNumber: string,
    public organization: string,
    public name: string,
    public level: number,
    public subEmployees: number,
    public totalSubEmployees: number
  ) {}
}
