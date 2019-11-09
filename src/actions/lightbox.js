export const openLightbox = (images, index) => {
  return (dispatch) => {
    dispatch({
      type: 'OPEN_LIGHTBOX',
      payload: {
        images: images,
        index: index
      }
    })
  }
}

export const dismissLightbox = () => {
  return (dispatch) => {
    dispatch({
      type: 'DISMISS_LIGHTBOX'
    })
  }
}