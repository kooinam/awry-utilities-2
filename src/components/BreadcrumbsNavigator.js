/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Breadcrumb } from 'antd';
import { matchPath, Link } from 'react-router-dom';
import _ from 'lodash';
import { translate } from 'react-i18next';

import type { Reducer } from '../../types';
import { setupBreadcrumbs } from '../actions/breadcrumbs';

export const expandRoutes = (routes, parentRoute) => {
  const newRoutes = [];

  routes.forEach((route) => {
    const newRoute = Object.assign({}, route);
    if (parentRoute) {
      newRoute.parentRoute = parentRoute;
      if (parentRoute.path && parentRoute.path.length > 1) {
        newRoute.path = `${parentRoute.path}/${newRoute.path}`;
      }
      else {
        newRoute.path = `${parentRoute.path}${newRoute.path}`;
      }
    }
    newRoute.originalPath = newRoute.path;
    if (route.routes) {
      expandRoutes(newRoute.routes, newRoute).forEach((childRoute) => {
        newRoutes.push(childRoute);
      });
    }
    newRoutes.push(newRoute);
  });

  return newRoutes;
};

export const matchRoutes = (routes, pathname) => {
  let match = null;
  let matchedRoute = null;
  let matchedRoutes = [];

  let newRoutes = expandRoutes(routes, null);
  newRoutes.some((route) => {
    match = matchPath(pathname, route);
    if (match) {
      matchedRoute = route;
    }

    return match;
  });

  if (match && matchedRoute) {
    let tempRoute = matchedRoute;
    while (tempRoute) {
      let keys = Object.keys(match.params);
      for (let key of keys) {
        let re = new RegExp(`\:${key}`, "g");
        tempRoute.path = tempRoute.path.replace(re, match.params[key]);
      }
      matchedRoutes.push(tempRoute);
      tempRoute.match = match;
      tempRoute = tempRoute.parentRoute;
    }
  }

  return matchedRoutes.slice().reverse();
}

export const matchBreadcrumbs = (matchedRoutes, breadcrumbIdentifiers) => {
  const matchedBreadcrumbs = matchedRoutes.map((route) => {
    let breadcrumbName = (route.routeProps && route.routeProps.breadcrumbName)? route.routeProps.breadcrumbName : '';
    const keys = Object.keys(breadcrumbIdentifiers);
    for(const key of keys) {
      const re = new RegExp(`\%\{${key}\}`, "g");
      breadcrumbName = breadcrumbName.replace(re, `${breadcrumbIdentifiers[key]} ` || ' ');
    };

    const re = new RegExp(`\%\{[a-zA-Z0-9]*\}`, "g");
    breadcrumbName = breadcrumbName.replace(re, ' ');

    if (breadcrumbName.length > 0) {
      return {
        breadcrumbName,
        path: route.path,
      };
    }

    return null;
  }).filter((route) => {
    return route;
  });

  return matchedBreadcrumbs;
}

export const matchRouteParams = (matchedRoutes, key) => {
  const matchedRoute = matchedRoutes.slice().reverse().find(route =>
    route.match.params[key],
  );

  if (matchedRoute) {
    return matchedRoute.match.params[key];
  }
}

export const matchRouteProperty = (matchedRoutes, key) => {
  const matchedRoute = matchedRoutes.slice().reverse().find((route) => {
    return route.routeProps && route.routeProps[key] != undefined;
  });

  if (matchedRoute) {
    return matchedRoute.routeProps[key];
  }
}

class BreadcrumbsNavigator extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }


  render() {
    const { t } = this.props;

    const { matchedBreadcrumbs } = this.props;
    const breadcrumbItems = matchedBreadcrumbs.map((route, index) => {
      if (index < matchedBreadcrumbs.length - 1) {
        return (
          <Breadcrumb.Item key={_.uniqueId()}>
            <Link to={route.path}>
              {t(route.breadcrumbName)}
            </Link>
          </Breadcrumb.Item>
        )
      }
      else {
        return (
          <Breadcrumb.Item key={_.uniqueId()}>
            <b>
              {t(route.breadcrumbName)}
            </b>
          </Breadcrumb.Item>
        )
      }
    });

    return (
      <Breadcrumb className={`${this.props.className}`}>
        {breadcrumbItems}
      </Breadcrumb>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  ({}: Reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default translate('translations')(connector(BreadcrumbsNavigator));
