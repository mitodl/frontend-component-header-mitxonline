import React, { useContext } from 'react';
import Responsive from 'react-responsive';
import { injectIntl, intlShape } from '@edx/frontend-i18n';
import { sendTrackEvent } from '@edx/frontend-analytics';
import { App, AppContext, APP_CONFIG_LOADED } from '@edx/frontend-base';

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

import LogoSVG from './logo.svg';

import messages from './SiteHeader.messages';

App.ensureConfig([
  'LMS_BASE_URL',
  'LOGOUT_URL',
  'LOGIN_URL',
  'MARKETING_SITE_BASE_URL',
  'ORDER_HISTORY_URL',
], 'Header component');

App.subscribe(APP_CONFIG_LOADED, () => {
  App.mergeConfig({
    MINIMAL_HEADER: !!process.env.MINIMAL_HEADER,
  }, 'Header additional config');
});

function SiteHeader({ intl }) {
  const { authenticatedUser, config } = useContext(AppContext);

  const mainMenu = [
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(messages['header.links.courses']),
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/dashboard/programs`,
      content: intl.formatMessage(messages['header.links.programs']),
    },
    {
      type: 'item',
      href: `${config.MARKETING_SITE_BASE_URL}/course`,
      content: intl.formatMessage(messages['header.links.content.search']),
      onClick: () => {
        sendTrackEvent(
          'edx.bi.dashboard.find_courses_button.clicked',
          { category: 'header', label: 'header' },
        );
      },
    },
  ];

  const dashboardMenuItem = {
    type: 'item',
    href: `${config.LMS_BASE_URL}/dashboard`,
    content: intl.formatMessage(messages['header.user.menu.dashboard']),
  };

  const logoutMenuItem = {
    type: 'item',
    href: config.LOGOUT_URL,
    content: intl.formatMessage(messages['header.user.menu.logout']),
  };

  let userMenu = [
    dashboardMenuItem,
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/u/${authenticatedUser.username}`,
      content: intl.formatMessage(messages['header.user.menu.profile']),
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/account/settings`,
      content: intl.formatMessage(messages['header.user.menu.account.settings']),
    },
    {
      type: 'item',
      href: config.ORDER_HISTORY_URL,
      content: intl.formatMessage(messages['header.user.menu.order.history']),
    },
    logoutMenuItem,
  ];

  if (App.config.MINIMAL_HEADER) {
    userMenu = [
      dashboardMenuItem,
      logoutMenuItem,
    ];
  }

  const loggedOutItems = [
    {
      type: 'item',
      href: config.LOGIN_URL,
      content: intl.formatMessage(messages['header.user.menu.login']),
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/register`,
      content: intl.formatMessage(messages['header.user.menu.register']),
    },
  ];

  const props = {
    logo: LogoSVG,
    logoAltText: 'edX',
    siteName: 'edX',
    logoDestination: App.config.MINIMAL_HEADER ? null : `${config.LMS_BASE_URL}/dashboard`,
    loggedIn: !!authenticatedUser.username,
    username: authenticatedUser.username,
    avatar: authenticatedUser.avatar,
    mainMenu: App.config.MINIMAL_HEADER ? [] : mainMenu,
    userMenu,
    loggedOutItems,
  };

  return (
    <React.Fragment>
      <Responsive maxWidth={768}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopHeader {...props} />
      </Responsive>
    </React.Fragment>
  );
}

SiteHeader.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SiteHeader);
