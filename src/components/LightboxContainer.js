import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import { formatImageUrl } from '../utils/UIManager';
import { dismissLightbox } from '../actions/lightbox';

class LightboxContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedImageIndex: 0,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!prevProps.isLightboxOpen && this.props.isLightboxOpen) {
      this.setState({
        selectedImageIndex: this.props.lightboxIndex,
      });
    }
  }

  render() {
    if (this.props.isLightboxOpen && this.state.selectedImageIndex < this.props.lightboxImages.length) {
      return (
        <Lightbox
          animationDuration={(this.props.lightboxImages.length == 1)? 0 : 300}
          mainSrc={formatImageUrl(this.props.lightboxImages[this.state.selectedImageIndex].url)}
          prevSrc={formatImageUrl(this.props.lightboxImages[(this.state.selectedImageIndex+this.props.lightboxImages.length-1)%this.props.lightboxImages.length].url)}
          nextSrc={formatImageUrl(this.props.lightboxImages[(this.state.selectedImageIndex+1)%this.props.lightboxImages.length].url)}
          onCloseRequest={
            () => {
              this.props.dispatch(dismissLightbox());
            }
          }
          onMovePrevRequest={
            () => {
              this.setState({
                selectedImageIndex: (this.state.selectedImageIndex+this.props.lightboxImages.length-1)%this.props.lightboxImages.length,
              });
            }
          }
          onMoveNextRequest={
            () => {
              this.setState({
                selectedImageIndex: (this.state.selectedImageIndex+1)%this.props.lightboxImages.length,
              });
            }
          }
        />
      );
    }
    else {
      return null;
    }
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  ({ LightboxReducer }: Reducer) => ({
    isLightboxOpen: LightboxReducer.isLightboxOpen,
    lightboxImages: LightboxReducer.images,
    lightboxIndex: LightboxReducer.index,
  }),
);
/* eslint-enable no-unused-vars */

export default connector(LightboxContainer);