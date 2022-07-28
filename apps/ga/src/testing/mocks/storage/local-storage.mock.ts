export class LocalStorageMock {
  public store: { [key: string]: string } = {};

  setStore(store: { [key: string]: string }): void {
    this.store = store;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string {
    // eslint-disable-next-line unicorn/no-null
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}
