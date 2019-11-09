export const setupHelmet = (items) =>
  dispatch => {
    return dispatch({
      type: 'SETUP_HELMET',
      payload: {
        items,
      },
    });
  }

