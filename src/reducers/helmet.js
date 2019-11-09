import _ from 'lodash';

export default (state = {
  key: _.uniqueId(),
  items: {},
}, action) => {
  switch (action.type) {
    case 'SETUP_HELMET':
      const keys = Object.keys(action.payload.items);
      for (let key of keys) {
        if (state.items[key] != action.payload.items[key]) {
          state.items[key] = action.payload.items[key]
        }
      }
      state.key = _.uniqueId();
      state.items = Object.assign({}, state.items);

      return state;
    default:
      return state;
  }
};
