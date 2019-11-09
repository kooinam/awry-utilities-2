export default (state = {
  breadcrumbIdentifiers: {},
}, action) => {
  switch (action.type) {
    case 'SETUP_BREADCRUMB_IDENTIFIERS':
      const keys = Object.keys(action.payload.breadcrumbIdentifiers);
      for (let key of keys) {
        if (state.breadcrumbIdentifiers[key] != action.payload.breadcrumbIdentifiers[key]) {
          state.breadcrumbIdentifiers[key] = action.payload.breadcrumbIdentifiers[key];
        }
      }
      state.breadcrumbIdentifiers = Object.assign({}, state.breadcrumbIdentifiers);

      return Object.assign({}, state);
    default:
      return state;
  }
};
