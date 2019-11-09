import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'antd';
import uuidV4 from 'uuid/v4';

/*
  <DetailsContainer
    details={[{
      size: 'md',
      title: 'Email',
      value: this.props.user,
    }]}
  />
*/

class DetailsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderDetails = this.renderDetails.bind(this);
  }

  renderDetails = () => {
    const details = this.props.details.map((detail, index) => {
      const size = detail.size;
      let col = 12;
      let titleCol = 8;
      if (size === 'lg') {
        titleCol = 4;
        col = 24;
      }
      let editCol = 0;
      let editable = null
      if (detail.editable) {
        editCol = 2;
        editable = (
          <Col span={2} className="pull-right">
            <Button icon="edit" onClick={detail.editable} />
          </Col>
        );
      }
      let showCol = 0;
      let showable = null
      if (detail.showable) {
        showCol = 2;
        showable = (
          <Col span={2} className="pull-right">
            <Button icon="eye" onClick={detail.showable} />
          </Col>
        );
      }

      if (detail.title === null) {
        titleCol = 0;
      }

      if (detail.titleCol) {
        titleCol = detail.titleCol;
      }

      return (
        <Col lg={col} className="ant-details" key={index}>
          <Row>
            <Col span={titleCol} className="ant-details-title">
              {detail.title}
            </Col>
            <Col span={24 - titleCol - editCol - showCol} className="ant-details-value">
              {detail.value}
            </Col>
            {editable}
            {showable}
          </Row>
        </Col>
      );
    });

    return details;
  }

  render() {
    return (
      <Row className={`ant-details-container ${this.props.className}`}>
        {this.renderDetails()}
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(DetailsContainer);
