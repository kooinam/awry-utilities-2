import React, { Component } from 'react';
import { Form, Select, Spin } from 'antd';
import debounce from 'lodash.debounce'
import { getFieldsError } from './UIManager';
import { translate } from 'react-i18next';

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

class FilterSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.loadOptions = this.loadOptions.bind(this);
    this.handleSearchOptions = this.loadOptions.bind(this);

    this.handleSearchOptions = debounce(this.handleSearchOptions, 500);
  }

  loadOptions = (keyword) => {
    for(let filterField of this.props.filterFields) {
      this.props.tableParams.filter[filterField] = keyword;
    }
    const url = this.props.url;
    let params = {
      params: {
        q: this.props.tableParams.filter,
        per_page: this.props.tableParams.pagination.per_page,
        page: this.props.tableParams.pagination.current,
      }
    };

    this.props.tableParams.loadItems(url, params);
  }

  render() {
    const { t } = this.props;

    let initialValue = undefined;
    if (this.props.initialValue && this.props.initialValue[this.props.keyField]) {
      initialValue = {
        key: String(this.props.initialValue[this.props.keyField]),
        label: this.props.initialValue[this.props.labelField],
      };
    }
    let rules = [];
    if (this.props.required) {
      rules = [
        { required: true, message: t('is_required', {
          field: this.props.name,
        }) },
      ];
    }

    let select = (
      <Select
        style={{
          width: this.props.width
        }}
        allowClear={true}
        onFocus={
          () => {
            this.loadOptions('');
          }
        }
        showSearch
        labelInValue
        notFoundContent={
          this.props.tableParams.isLoading ? <Spin size="small" /> : t('item_not_found', {
            item: this.props.name,
          })
        }
        onSearch={this.handleSearchOptions}
        placeholder={t('please_select', {
          item: this.props.name,
        })}
        filterOption={false}
        disabled={this.props.disabled}
        onChange={this.props.handleChange}
        dropdownAlign={{
          offset: [0, 0],
        }}
      >
        {
          this.props.tableParams.items.map((item) => {
            return (
              <Select.Option key={String(item[this.props.keyField])}>
                {item[this.props.labelField]}
              </Select.Option>
            )
          })
        }
      </Select>
    );

    if (this.props.form) {
      return (
        <Form.Item {...getFieldsError(this.props.error, this.props.errorKeys)} label={!this.props.hideLabel && this.props.name}>
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

export default translate('translations')(FilterSelect);
