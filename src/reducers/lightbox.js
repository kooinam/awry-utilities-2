export default (state = {
  isLightboxOpen: false,
  images: [],
  index: 0
}, action) => {
  switch(action.type) {
    case 'OPEN_LIGHTBOX':
      return Object.assign({}, state, {
        isLightboxOpen: true,
        images: action.payload.images,
        index: action.payload.index
      })
    case 'DISMISS_LIGHTBOX':
      return Object.assign({}, state, {
        isLightboxOpen: false
      })
    default:
      return state
  }
}
