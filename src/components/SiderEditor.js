import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Form, Input, Table } from 'antd';
import { Link } from 'react-router-dom';

import { getFieldError } from '../utils/UIManager';
import TableParams from '../utils/TableParams';
import Actioner from '../utils/Actioner';
import ErrorContainer from './ErrorContainer';
import { formatDate, formatTime } from '../utils/UIManager';
import CustomPagination from './CustomPagination';

/*
  <SiderEditor
    item={this.props.user}
    formParams={
      {
        url: `/users/${this.props.user.username}.json`,
        axiosGetter: () => getAxios('membership-admin'),
        method: 'patch',
        itemName: 'user',
        ItemKlass: User,
        successMessageGetter: user =>
          `User ${user.email} updated successfully`,
        successCallback: (user) => {
          this.props.dispatch(push(`/admin/users/${user.username}`));
          this.props.dispatch(closeRightSider());
          this.props.loadItem();
        },
        errorMessageGetter: () =>
          `Failed to update User ${this.props.user.username}`,
      }
    }
    logParams={
      {
        axiosGetter: () => getAxios('log-admin'),
        url: '/logs.json',
        type: 'Member',
        id: this.props.user.id,
        fieldNames,
      }
    }
    formInputsGetter={
      (item, form, actioner) => {
        return commonUserFormInputs(item, form, actioner, fieldNames);
      }
    }
    formParamsParser={
      (attributes) => {
        return {
          user: attributes,
        };
      }
    }
  />
*/

class SiderEditor extends Component {
  constructor(props) {
    super(props);

    const { formParams, logParams } = this.props;
    const actioner = (formParams) ? new Actioner({
      component: this,
      key: 'actioner',
      axiosGetter: formParams.axiosGetter,
      method: formParams.method,
      itemName: formParams.itemName,
      ItemKlass: formParams.ItemKlass,
      successMessageGetter: formParams.successMessageGetter,
      successCallback: formParams.successCallback,
      errorMessageGetter: formParams.errorMessageGetter,
    }) : null;

    logParams.fieldNames = (logParams.fieldNames || []).map((field) => {
      return `${field}=`;
    });

    logParams.dataFields = (logParams.dataFields || []).map((field) => {
      return `${field}`;
    });

    this.state = {
      actioner: actioner,
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: logParams.axiosGetter,
        itemsName: 'logs',
        ItemKlass: Object,
        url: logParams.url,
        filter: {
          s: ['created_at DESC'],
        },
        paramsGetter: tableParams => {
          return {
            params: {
              q: tableParams.filter,
              per_page: tableParams.pagination.per_page,
              page: tableParams.pagination.current,
              log_type: logParams.type,
              log_id: logParams.id,
              field_names: logParams.fieldNames,
              data_fields: logParams.dataFields,
            },
          };
        },
      }),
    };

    this.renderItems = this.renderItems.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadItems = this.state.tableParams.loadItems.bind(this);
  }

  componentDidMount = () => {
    this.loadItems();
  }

  renderItems = () => {
    if (this.state.tableParams.isError) {
      return (
        <ErrorContainer
          key={this.state.tableParams.uuid}
          spinning={this.state.tableParams.isLoading}
          onRetry={this.loadItems}
        />
      );
    }

    const columns = [{
      className: 'ant-td-center ant-td-padding-sm',
      width: '20%',
      title: 'Time',
      key: 'created_at',
      render: (value, record) => {
        return (
          <Link to={`/mat/logs/${record.id}`} target="_blank">
            {formatDate(record.created_at)}
            <br />
            <small>
              {formatTime(record.created_at)}
            </small>
          </Link>
        );
      },
    }, {
      className: 'ant-td-padding-sm',
      width: '20%',
      title: 'Done by',
      key: 'actioner',
      render: (value, record) => {
        if (!record.is_system) {
          return (
            <Link to={`/mat/users/${record.actioner_username}`} target="_blank">
              {record.actioner_username}
            </Link>
          );
        } else {
          return (
            <div>
              System
            </div>
          );
        }
      },
    }, {
      className: 'ant-td-padding-sm',
      width: '30%',
      title: (this.props.data) ? 'Data' : 'Changes',
      key: 'log',
      render: (value, record) => {
        const logChanges = Object.keys(record.log_changes).map((key) => {
          return (
            <Row key={key} className="ant-space-row">
              <Col span={12}>
                <span className="ant-label ant-label-block">
                  {key}
                </span>
              </Col>
              <Col span={12}>
                <span className="ant-texter-sm">
                  {record.log_changes[key]}
                </span>
              </Col>
            </Row>
          );
        });

        const logData = Object.keys(record.log_data).map((key) => {
          return (
            <Row key={key} className="ant-space-row">
              <Col span={12}>
                <span className="ant-label ant-label-block">
                  {key}
                </span>
              </Col>
              <Col span={12}>
                <span className="ant-texter-sm">
                  {record.log_data[key]}
                </span>
              </Col>
            </Row>
          );
        });

        return (
          <div>
            {(this.props.data) ? logData : logChanges}
          </div>
        );
      },
    }, {
      className: 'ant-td-padding-sm',
      width: '30%',
      title: 'Remarks',
      key: 'remark',
      render: (value, record) => {
        return (
          <div className="ant-texter">
            {record.remarks}
          </div>
        );
      },
    }];

    const locale = {
      emptyText: 'No Log found',
    };

    return (
      <Table
        columns={columns}
        dataSource={this.state.tableParams.items}
        bordered
        locale={locale}
        pagination={false}
        rowKey="id"
        loading={this.state.tableParams.isLoading}
      />
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = (this.props.form.getFieldsValue());
      const params = (this.props.formParamsParser) ? this.props.formParamsParser(attributes) : attributes;
      params.log_remarks = attributes.log_remarks;

      this.state.actioner.do(this.props.formParams.url, params);

      return true;
    });
  }

  render() {
    const { actioner } = this.state;
    const { form, formInputsGetter, item } = this.props;

    let formInputs = null;
    if (formInputsGetter) {
      formInputs = formInputsGetter(item, form, actioner);
    }

    const formComponent = (this.state.actioner) ? (
      <Col md={24}>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col md={24}>
              <Form.Item {...getFieldError(actioner.error, 'log_remarks')} label="Remarks" hasFeedback>
                {form.getFieldDecorator('log_remarks', {
                  rules: [
                    { required: true, message: 'Remarks is required' },
                  ],
                  initialValue: null,
                })(
                  <Input type="textarea" placeholder="Remarks" rows={4} />,
                )}
              </Form.Item>
            </Col>
          </Row>
          {formInputs}
          <Row>
            <Col md={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={this.state.actioner.isLoading}>
                  {this.props.formParams.confirmText || 'Update'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    ) : null;

    return (
      <Row className={`ant-sider-editor ${this.props.className}`}>
        {formComponent}
        <Col md={24}>
          <Row className={'ant-content'} style={{ marginLeft: 0, marginRight: 0 }}>
            <Col md={24}>
              {this.renderItems()}
            </Col>
          </Row>
          <Row>
            <Col md={24} className={'pull-right'}>
              <CustomPagination
                key={this.state.tableParams.uuid}
                tableParams={this.state.tableParams}
                loadItems={this.loadItems}
                anchor="listing"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Form.create()(SiderEditor));
