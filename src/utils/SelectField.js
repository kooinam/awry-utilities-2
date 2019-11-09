import React, { Component } from 'react';
import { Form, Select, Spin } from 'antd';
import debounce from 'lodash.debounce'
import { getFieldsError } from './UIManager';
import { translate } from 'react-i18next';
import _ from 'lodash';

/*
  <FilterSelect
    tableParams={this.state.tableParams}
    filterFields={['name_cont']}
    url={'/items.json'}
    initialValue={this.props.item.key}
    keyField='id'
    labelField='name'
    required={false}
    name={'Key'}
    form={this.props.form}
    formKey="key_id"
    error={this.state.actioner.error}
    errorKeys={['key_id']}
  />
*/

class SelectField extends Component {
  constructor(props) {
    super(props);

    const { tableParamsGetter } = this.props;

    this.state = {
      tableParams: (tableParamsGetter) ? tableParamsGetter(this) : null,
    };

    this.loadOptions = this.loadOptions.bind(this);
    this.handleSearchOptions = this.loadOptions.bind(this);

    this.handleSearchOptions = debounce(this.handleSearchOptions, 500);
  }

  loadOptions = (keyword) => {
    if (!this.state.tableParams) {
      return;
    }

    for(let filterField of [this.props.labelField]) {
      this.state.tableParams.filter[filterField] = keyword;
    }

    this.state.tableParams.loadItems();
  }

  render() {
    const { t } = this.props;

    let initialValue = this.props.initialValue;
    if (!initialValue && this.props.initial && this.props.initial[this.props.keyField]) {
      initialValue = {
        key: String(this.props.initial[this.props.keyField]),
        label: this.props.initial[this.props.labelField],
      };
    }
    let rules = [];
    if (this.props.required) {
      rules = [
        { required: true, message: t('is_required', {
          field: t(this.props.field),
        }) },
      ];
    }
    if (this.props.rules) {
      _.each(this.props.rules, (rule) => {
        rules.push(rule);
      });
    }

    let items = [];

    if (this.state.tableParams) {
      _.each(this.state.tableParams.items, (item) => {
        items.push(item);
      });
    }
    if (this.props.items) {
      _.each(this.props.items, (item) => {
        items.push(item);
      });
    }

    let notFoundContent = (this.state.tableParams && this.state.tableParams.isLoading) ? (
      <Spin size="small" />
    ) : t('item_not_found', {
      item: t(this.props.field),
    });

    if (this.props.hideNotFound) {
      notFoundContent = null;
    }

    let select = (
      <Select
        style={{
          width: this.props.width
        }}
        allowClear
        onFocus={
          () => {
            this.loadOptions('');
          }
        }
        showSearch
        labelInValue
        notFoundContent={notFoundContent}
        onSearch={this.handleSearchOptions}
        placeholder={t('please_select', {
          item: t(this.props.field),
        })}
        filterOption={false}
        disabled={this.props.disabled}
        onChange={this.props.handleChange}
        dropdownAlign={{
          offset: [0, 0],
        }}
        mode={(this.props.mode) ? this.props.mode : 'default'}
      >
        {
          items.map((item) => {
            return (
              <Select.Option key={String(item[this.props.keyField])}>
                {item[this.props.labelField]}
              </Select.Option>
            )
          })
        }
      </Select>
    );

    let fieldError = {};
    if (this.props.actioner) {
      fieldError = getFieldsError(this.props.actioner.error, [this.props.field], t);
    }

    let label = t(this.props.field);
    if (this.props.hideLabel) {
      label = null;
    }

    let hasFeedback = true;
    if (this.props.hideFeedback) {
      hasFeedback = false;
    }

    if (this.props.form) {
      return (
        <Form.Item {...fieldError} label={label} hasFeedback={hasFeedback}>
          {
            this.props.form.getFieldDecorator(this.props.field, {
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

export default translate('translations')(SelectField);
