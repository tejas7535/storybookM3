export function openInNewTabByUrl(url: string): void {
  window.open(url);
}

export function openInNewWindowByUrl(url: string): void {
  window.open(url, '_blank', 'location=no,toolbar=yes');
}
