export const setupSSRItems = (ssrItems) =>
  dispatch => {
    return dispatch({
      type: 'SETUP_SSR_ITEMS',
      payload: {
        ssrItems,
      },
    });
  }

export const invalidateSSRItems = (key) => {
  return (dispatch) => {
    return dispatch({
      type: 'INVALIDATE_SSR_ITEMS',
      payload: {
        key,
      }
    });
  };
}

