import React, { Component } from 'react';
import { connect } from 'react-redux';

import BaseRouteComponent from './BaseRouteComponent';

/*
  <TabContainer
    onMount={this.handleMount}
  />
*/

class TabContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    if (this.props.onMount) {
      this.props.onMount(this);
    }
  }

  render() {
    return (
      <BaseRouteComponent {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(TabContainer);
