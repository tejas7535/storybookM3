export class LocalStorageMock {
  public store: { [key: string]: string } = {};

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  setStore(store: { [key: string]: string }): void {
    this.store = store;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  clear(): void {
    this.store = {};
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  getItem(key: string): string {
    // eslint-disable-next-line unicorn/no-null
    return this.store[key] || null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  removeItem(key: string): void {
    delete this.store[key];
  }
}
