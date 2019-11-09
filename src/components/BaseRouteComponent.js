import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { matchRouteParams } from './BreadcrumbsNavigator';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

class BaseRouteComponent extends Component {
  render() {
    const { match, matchedRoutes, onMount, routes } = this.props;
    let url = '';
    if (match) {
      if (match.url && match.url.length > 1) {
        url = `${match.url}/`;
      }
      else {
        url = match.url;
      }
    }

    const routeWithSubRoutes = (route) => {
      let key = `${url}${route.path}`

      const matchedRoute = matchedRoutes.find((r) => {
        return r.originalPath === key;
      });

      if (matchedRoute) {
        key = matchedRoute.path;
      }

      return (
        <Route
          key={key}
          exact={route.exact || false}
          path={`${url}${route.path}`}
          render={childProps => (
            // Pass the sub-routes down to keep nesting
            <route.component { ...this.props } {...childProps} routes={route.routes || []} routeProps={route.routeProps} onMount={onMount} matchedRoutes={matchedRoutes}  />
          )}
        />
      );
    }

    return (
      <Switch location={this.props.location}>
        {routes.map(route => routeWithSubRoutes(route))}
      </Switch>
    );
  }
};

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (state) => {
    return {
      location: state.router.location,
    };
  }
);
/* eslint-enable no-unused-vars */

export default connector(BaseRouteComponent);