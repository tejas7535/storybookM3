import { FooterLink } from './footer-link.model';

describe('FooterLink', () => {
  const link = 'link';
  const title = 'title';
  let footerLink: FooterLink;

  it('should have default value for external', () => {
    footerLink = new FooterLink(link, title);

    expect(footerLink.external).toBe(false);
  });

  it('should override default value for external', () => {
    footerLink = new FooterLink(link, title, true);

    expect(footerLink.external).toBe(true);
  });
});
