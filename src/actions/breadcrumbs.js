export const setupBreadcrumbIdentifiers = (breadcrumbIdentifiers) =>
  dispatch => {
    return dispatch({
      type: 'SETUP_BREADCRUMB_IDENTIFIERS',
      payload: {
        breadcrumbIdentifiers,
      },
    });
  }
