import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input, Select, DatePicker } from 'antd';
import { translate } from 'react-i18next';

import FilterSelect from '../utils/FilterSelect';

/*
  <FiltersContainer
    filters={[{
      size: 'sm',
      name: 'Username',
      field: 'username',
    }]}
    onSearch={this.handleSearch}
  />
*/

class FiltersContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderFilters = this.renderFilters.bind(this);
    this.renderSorting = this.renderSorting.bind(this);
  }

  renderFilters = () => {
    const filters = this.props.filters.map((filter) => {
      const size = filter.size;
      let col = 6;
      if (size === 'md') {
        col = 8;
      } else if (size === 'lg') {
        col = 12;
      }

      if (filter.type === 'number') {
        return (
          <Col md={col} key={filter.key || filter.field} className={'ant-filter'}>
            <label htmlFor={filter.field}>
              {filter.name}:
            </label>
            <Input
              type="number"
              onChange={(event) => {
                this.props.onSearch(`${filter.field}_eq`, event.target.value);
              }}
              placeholder={filter.name}
            />
          </Col>
        );
      } else if (filter.type === 'checkbox') {
        return (
          <Col md={col} key={filter.key || filter.field} className={'ant-filter'}>
            <label htmlFor={filter.field}>
              {filter.name}:
            </label>
            <Input
              type="checkbox"
              onChange={(event) => {
                this.props.onSearch(`${filter.field}`, event.target.checked);
              }}
              placeholder={filter.name}
              defaultChecked={filter.defaultChecked}
            />
          </Col>
        );
      } else if (filter.type === 'select') {
        return (
          <Col md={col} key={filter.key || filter.field} className={'ant-filter'}>
            <label htmlFor={filter.field}>
              {filter.name}:
            </label>
            <br />
            <Select
              allowClear
              labelInValue
              defaultValue={filter.default}
              onChange={(option) => {
                if (option) {
                  this.props.onSearch(`${filter.field}`, option.key);
                } else {
                  this.props.onSearch(`${filter.field}`, '');
                }
              }}
            >
              {
                filter.filters.map((item) => {
                  return (
                    <Select.Option key={item.key}>
                      {item.label}
                    </Select.Option>
                  )
                })
              }
            </Select>
          </Col>
        );
      } else if (filter.type === 'custom_select') {
        return (
          <Col md={col} key={filter.key || filter.field} className={'ant-filter'}>
            <label htmlFor={filter.field}>
              {filter.name}:
            </label>
            <br />
            <FilterSelect
              tableParams={filter.tableParams}
              filterFields={[filter.filterField]}
              keyField='id'
              labelField={filter.labelField}
              name={filter.name}
              handleChange={(option) => {
                if (option) {
                  this.props.onSearch(`${filter.field}`, option.key);
                } else {
                  this.props.onSearch(`${filter.field}`, '');
                }
              }}
            />
          </Col>
        );
      } else if (filter.type === 'date') {
        return (
          <Col md={col} key={filter.key || filter.field} className={'ant-filter'}>
            <label htmlFor={filter.field}>
              {filter.name}:
            </label>
            <br />
            <DatePicker
              onChange={
                (date, dateString) => {
                  this.props.onSearch(`${filter.field}`, dateString);
                }
              }
              defaultValue={filter.default}
            />
          </Col>
        );
      }

      return (
        <Col md={col} key={filter.key || filter.field} className={'ant-filter'}>
          <label htmlFor={filter.field}>
            {filter.name}:
          </label>
          <Input
            onChange={(event) => {
              if (filter.exact) {
                this.props.onSearch(`${filter.field}`, event.target.value);
              } else {
                this.props.onSearch(`${filter.field}_cont`, event.target.value);
              }
            }}
            placeholder={filter.name}
          />
        </Col>
      );
    });

    return filters;
  }

  renderSorting = () => {
    const { t } = this.props;

    if (this.props.sorting && this.props.sorting.length > 0)
    return (
      <Row className={'ant-sorting'}>
        <Col md={6}>
          <label htmlFor="sorting">
            {t('sorting')}:
          </label>
          <Select
            labelInValue
            defaultValue={(this.props.selectedSort) ? this.props.selectedSort : this.props.sorting[0]}
            onChange={(option) => {
              this.props.onSearch('s', [option.key]);
            }}
          >
            {
              this.props.sorting.map((item) => {
                return (
                  <Select.Option key={item.key}>
                    {item.label}
                  </Select.Option>
                )
              })
            }
          </Select>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <Row>
        <Col md={24}>
          <Row className="ant-filters">
            {this.renderFilters()}
          </Row>
          {this.renderSorting()}
        </Col>
        <Col md={24}>
          <hr className="ant-hr" />
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default translate('translations')(connect(mapStateToProps)(FiltersContainer));
