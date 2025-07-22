var runtime = document.createElement('script');
runtime.src = 'http://localhost:8000/runtime.js';
document.head.appendChild(runtime);

var polyfills = document.createElement('script');
polyfills.src = 'http://localhost:8000/polyfills.js';
document.head.appendChild(polyfills);

var main = document.createElement('script');
main.src = 'http://localhost:8000/main.js';
document.head.appendChild(main);

var vendor = document.createElement('script');
vendor.src = 'http://localhost:8000/vendor.js';
document.head.appendChild(vendor);

var styles = document.createElement('link');
styles.rel = 'stylesheet';
styles.href = 'http://localhost:8000/styles.css';
styles.media = 'all';
styles.onload = () => (this.media = 'all');
document.getElementsByTagName('head')[0].appendChild(styles);
