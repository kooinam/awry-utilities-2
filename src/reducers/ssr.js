import _ from 'lodash';

export default (state = {
  key: _.uniqueId(),
  ssrItems: {},
}, action) => {
  switch (action.type) {
    case 'SETUP_SSR_ITEMS':
      const keys = Object.keys(action.payload.ssrItems);
      for (let key of keys) {
        if (state.ssrItems[key] != action.payload.ssrItems[key]) {
          state.ssrItems[key] = action.payload.ssrItems[key]
        }
      }
      state.key = _.uniqueId();
      state.ssrItems = Object.assign({}, state.ssrItems);

      return state;
    case 'INVALIDATE_SSR_ITEMS':
      state.key = _.uniqueId();
      state.ssrItems[action.payload.key].isServed = true;
      state.ssrItems = Object.assign({}, state.ssrItems);

      return state;
    default:
      return state;
  }
};
