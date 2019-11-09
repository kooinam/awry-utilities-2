import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { translate } from 'react-i18next';

/*
  <ErrorContainer
    key={this.state.tableParams.uuid}
    onRetry={this.loadItems}
    spinning={this.state.tableParams.isLoading}
  />
*/

class ErrorContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t } = this.props;

    return (
      <Spin spinning={this.props.spinning} className={`${this.props.className}`}>
        {
          (this.props.children) ? this.props.children : (
            <div className={`ant-error ${(!this.props.noTextCenter) ? 'text-center' : ''}`}>
              Something went wrong. Click&nbsp;
              <a
                onClick={this.props.onRetry}
              >
                here
              </a>
              &nbsp;to try again.
            </div>
          )
        }
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default translate('translations')(connect(mapStateToProps)(ErrorContainer));
