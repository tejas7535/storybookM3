export const changeFavicon = (path: string) => {
  document.getElementById('favicon').setAttribute('href', path);
};
