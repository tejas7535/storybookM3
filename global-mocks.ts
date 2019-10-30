/* tslint:disable */
/* istanbul ignore file */

const mock = () => {
  let storage = {};

  return {
    getItem: key => (key in storage ? storage[key] : undefined),
    setItem: (key, value) => (storage[key] = value || ''),
    removeItem: key => delete storage[key],
    clear: () => (storage = {})
  };
};

Object.defineProperty(window, 'localStorage', {
  value: mock()
});

Object.defineProperty(window, 'sessionStorage', {
  value: mock()
});

Object.defineProperty(window, 'matchMedia', {
  value: () => {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    };
  }
});

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: _prop => {
      return '';
    }
  })
});
