import { testExpandedBanner, testPrimaryBanner } from '../support/banner.po';
import {
  testForbidden,
  testPageNotFound,
  testUnsupportedViewport,
} from '../support/empty-states.po';
import {
  testHeaderWithBurgerMenu,
  testHeaderWithUserMenu,
} from '../support/header.po';
import { testSidebar } from '../support/sidebar.po';
import {
  testErrorToast,
  testInformationToast,
  testSuccessToast,
  testWarningToast,
} from '../support/snackbar.po';

describe('Mobile View', () => {
  beforeEach(() => cy.viewport('iphone-6'));

  context('Banner', () => {
    it('should show banner', () => {
      testPrimaryBanner();
    });

    it('should show full text', () => {
      testExpandedBanner();
    });
  });

  context('Empty States', () => {
    context('Forbidden', () => {
      it('should show forbidden empty state', () => {
        testForbidden();
      });
    });

    context('Not Found', () => {
      it('should show not found empty state', () => {
        testPageNotFound();
      });
    });

    context('Unsupported Viewport', () => {
      it('should show unsupported viewport empty state', () => {
        testUnsupportedViewport();
      });
    });
  });

  context('Header', () => {
    it('should have burger menu', () => {
      testHeaderWithBurgerMenu();
    });

    it('should have user menu', () => {
      testHeaderWithUserMenu(true);
    });
  });

  context('Sidebar', () => {
    it('should have two nav items', () => {
      testSidebar(true);
    });
  });

  context('Snackbar', () => {
    it('should display a success toast on button click', () => {
      testSuccessToast();
    });

    it('should display a information toast on button click', () => {
      testInformationToast();
    });

    it('should display a warning toast on button click', () => {
      testWarningToast();
    });

    it('should display a error toast on button click', () => {
      testErrorToast();
    });
  });
});
