import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import { Link } from 'react-router-dom';
import scrollToElement from 'scroll-to-element';

/*
  <CustomPagination
    key={this.state.tableParams.uuid}
    tableParams={this.state.tableParams}
    loadItems={this.loadItems}
    urlGetter={null}
    anchor={null}
  />
*/

class CustomPagination extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleChangePagination = this.handleChangePagination.bind(this);
    this.renderPaginationPage = this.renderPaginationPage.bind(this);
  }

  handleChangePagination = (page, pageSize) => {
    const tableParams = this.props.tableParams;
    tableParams.pagination.current = page;
    tableParams.pagination.per_page = pageSize
    tableParams.rotateUuid();
    this.props.loadItems();

    if (this.props.anchor && document.getElementById(this.props.anchor)) {
      scrollToElement(document.getElementById(this.props.anchor), {
        offset: 0,
        ease: 'out-circ',
        duration: 500,
      });
    }
  }

  renderPaginationPage = (page, type) => {
    const to = {
      search: `?page=${page}`,
      pathname: this.props.urlGetter(page),
    };

    if (type === 'next') {
      return (
        <Link to={to} className="ant-pagination-item-link">
        </Link>
      );
    }
    else if (type === 'prev') {
      return (
        <Link to={to} className="ant-pagination-item-link">
        </Link>
      );
    }
    else if (type === 'page') {
      return (
        <Link to={to} className="page-inner">
          {page}
        </Link>
      );
    }

    return (
      <Link to={to} className="page-inner" />
    );
  }

  render() {
    const pagination = (
      <Pagination
        className={`ant-pagination ${(this.props.urlGetter) ? 'ant-custom-pagination' : 'asd'}`}
        itemRender= {this.props.urlGetter ? this.renderPaginationPage : undefined}
        current={this.props.tableParams.pagination.current}
        total={this.props.tableParams.pagination.total}
        defaultPageSize={this.props.tableParams.pagination.per_page}
        onChange={this.handleChangePagination}
        showSizeChanger={!this.props.hideSizeChanger}
        onShowSizeChange={this.handleChangePagination}
      />
    );

    return (
      <div>
        {pagination}
        <div className="pagination-helper">
          {this.props.tableParams.pagination.total} items
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(CustomPagination);
