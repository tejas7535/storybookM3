export const changeFavicon = (path: string) => {
  document.querySelector('#favicon').setAttribute('href', path);
};
