import React, { Component } from 'react';
import { Card, Spin } from 'antd';

import Fade from './Fade';

class LoaderContent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const duration = this.props.duration || 0.5;
    const { inanimate, firstLoading, loading, noTextCenter, isSSR } = this.props;

    let content = this.props.children;

    if (this.props.isError) {
      content = (this.props.errorContent) ? this.props.errorContent : (
        <div className={`${(noTextCenter) ? '' : 'text-center'} ant-error help-text`}>
          Something went wrong. Click&nbsp;
          <a onClick={this.props.onRetry}>
            here
          </a>
          &nbsp;to try again.
        </div>
      );
    }

    if (this.props.errors) {
      if (this.props.errors.errorStatus) {
        if (this.props.errors.contents && this.props.errors.contents[this.props.errors.errorStatus]) {
          content = this.props.errors.contents[this.props.errors.errorStatus];
        } else {
          if (this.props.errors.errorStatus === 403) {
            content = (
              <div className={`${(noTextCenter) ? '' : 'text-center'} ant-error help-text`}>
                Sorry, you are not authorized to view this...
              </div>
            );
          } else if (this.props.errors.errorStatus === 404) {
            content = this.props.notFoundContent || (
              <div className={`${(noTextCenter) ? '' : 'text-center'} ant-error help-text`}>
                Sorry, resource not found...
              </div>
            );
          } else {
            content = (
              <div className={`${(noTextCenter) ? '' : 'text-center'} ant-error help-text`}>
                Something went wrong. Click&nbsp;
                <a onClick={this.props.onRetry}>
                  here
                </a>
                &nbsp;to try again.
              </div>
            );
          }
        }
      }
    }

    if (!inanimate && typeof(window) != 'undefined') {
      content = (
        <Fade
          duration={duration}
        >
          {content}
        </Fade>
      );
    }

    return (
      <Card loading={firstLoading || (!isSSR && typeof (window) === 'undefined')} className={`ant-loader-card ${this.props.className}`}>
        <Spin spinning={(!firstLoading && loading) == true}>
          {content}
        </Spin>
      </Card>
    );
  }
}

export default LoaderContent;
