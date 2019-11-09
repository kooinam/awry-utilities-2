import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { getFieldsError } from './UIManager';

/*
  <SimpleSelect
    items={[{
      key: 'item_1',
      label: 'Item 1',
    }, {
      key: 'item_2',
      label: 'Item 2',
    }]}
    initialValue={{
      key: 'item_1',
      label: 'Item 1',
    }}
    required={false}
    name={'Key'}
    form={this.props.form}
    formKey="key_id"
    error={this.state.actioner.error}
    errorKeys={['key_id']}
    showLabel={true}
  />
*/

class SimpleSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let initialValue = undefined;
    if (this.props.initialValue) {
      initialValue = this.props.initialValue;
    }
    let rules = [];
    if (this.props.required) {
      rules = [
        {
          // validator: (rule, value, callback) => {
          //   if (!value || !value.key) {
          //     callback(`${this.props.name} is required`);
          //   }
          //   callback();
          // },
          required: true,
          message: `${this.props.name} is required`,
        }
      ];
    }

    let select = (
      <Select
        style={{
          width: this.props.width
        }}
        labelInValue
        placeholder={`Select a ${this.props.name}`}
        disabled={this.props.disabled}
        dropdownAlign={{
          offset: [0, 0],
        }}
        {...this.props}
      >
        {
          this.props.items.map((item) => {
            return (
              <Select.Option key={item.key}>
                {item.label}
              </Select.Option>
            )
          })
        }
      </Select>
    );

    let label = this.props.name;
    if (!this.props.showLabel) {
      label = null;
    }
    if (this.props.form) {
      return (
        <Form.Item {...getFieldsError(this.props.error, this.props.errorKeys)} label={label}>
          {
            this.props.form.getFieldDecorator(this.props.formKey, {
              initialValue: initialValue,
              rules: rules
            })(select)
          }
        </Form.Item>
      );
    }
    else {
      return select;
    }
  }
}

export default SimpleSelect;
