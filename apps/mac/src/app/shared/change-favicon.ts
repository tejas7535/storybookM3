export const changeFavicon = (path: string, title?: string) => {
  document.querySelector('#favicon').setAttribute('href', path);
  if (title) {
    document.title = title;
  }
};
