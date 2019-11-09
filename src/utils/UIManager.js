import React, { Component } from 'react';
import getSymbolFromCurrency from 'currency-symbol-map';
import dateFormat from 'dateformat';
import { Icon, Form, Input, Tag, Upload, Checkbox } from 'antd';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { setupAxios, getAxios, addAxiosPreferences, getBaseUrl, getHeadersSetter, getRequestInterceptors } from './NetworkManager';

const assert = require('assert')
const parseNum = require('parse-num')

function formatNumber (number, opts) {
  opts = renameKeyShortcuts(Object.assign({}, {
    nanZero: true,
    locale: 'en-US',
    localeMatcher: 'best fit',
    useGrouping: true, // grouping separator determined by locale
    maximumFractionDigits: 15
    // OTHER
    // minimumIntegerDigits
    // minimumFractionDigits
    // maximumFractionDigits
    // minimumSignificantDigits
    // maximumSignificantDigits
  }, opts))

  number = parseNum(number)

  if (isNaN(number)) {
    if (opts.nanZero === false) return 'NaN'
    else number = 0
  }

  const nf = new Intl.NumberFormat([opts.locale], Object.assign({}, opts, { style: 'decimal' }))
  return nf.format(number)
}

function renameKeyShortcuts (opts) {
  Object.keys(opts).forEach((key) => {
    expandMin(opts, key)
    expandMax(opts, key)
  })

  Object.keys(opts).forEach((key) => addDigits(opts, key))

  return opts
}

function expandMin (opts, key) {
  expand(opts, key, 'min', 'minimum')
}
function expandMax (opts, key) {
  expand(opts, key, 'max', 'maximum')
}

function expand (opts, key, shorthand, full) {
  if (!key.includes(full) && key.startsWith(shorthand)) {
    replaceKey(opts, key, key.replace(shorthand, full))
  }
}

function addDigits (opts, key) {
  if (
    (key.startsWith('minimum') || key.startsWith('maximum')) &&
    !key.endsWith('Digits')
  ) {
    replaceKey(opts, key, key + 'Digits')
  }
}

function replaceKey (obj, oldKey, newKey) {
  obj[newKey] = obj[oldKey]
  delete obj[oldKey]
}

function formatCurrency (amount, opts) {
  opts = Object.assign({}, {
    format: '%v', // %s => symbol, %v => value, %c => code
    code: undefined,
    symbol: undefined,
    locale: 'en-US',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    nanZero: true
  }, opts)
  assert(opts.format.includes('%v'), 'Must have "%v" in `format` options.')

  amount = formatNumber(amount, opts)

  return opts.format.replace('%v', amount).replace('%s', opts.symbol).replace('%c', opts.code)
}

function capitalize(str, dep, t) {
  if (dep && dep.length > 0 && dep[0] === dep[0].toUpperCase()) {
    return '';
  }

  if (t) {
    return str;
  }

  // let strVal = '';
  let newStr = str.replace(/_/g, ' ');
  // newStr = newStr.split(' ');
  const cap = newStr.substring(0, 1).toUpperCase();
  const rest = newStr.substring(1, newStr.length);
  newStr = `${cap}${rest}`;


  return newStr;
}

export const formatMoney = (amount, currency, placeholder) => {
  const newPlaceholder = placeholder || '$0.00';
  let newAmount = amount;
  if (amount < 0) {
    newAmount = -amount;
  }
  const symbol = getSymbolFromCurrency(currency);
  const opts = {
    format: '%s%v',
    symbol: symbol,
  };
  if (amount === 0 || amount) {
    return formatCurrency(amount, opts);
    // return amount;
  }

  return newPlaceholder;
}

export const renderMoney = (amount, currency, placeholder) => {
  const newPlaceholder = placeholder || '$0.00';
  let newAmount = amount;
  if (amount < 0) {
    newAmount = -amount;
  }
  const symbol = getSymbolFromCurrency(currency);
  const opts = {
    format: '%s%v',
    symbol: symbol,
  };
  if (amount === 0 || amount) {
    return formatCurrency(amount, opts);
    // return amount;
  }

  return newPlaceholder;
}

export const formatDate = (date) => {
  if(date) {
    return dateFormat(date, 'dd mmm yyyy');
  }

  return null;
}

export const formatTime = (date) => {
  if(date) {
    return dateFormat(date, 'h:MM:ss TT');
  }

  return null;
}

export const renderDate = (date) => {
  if(date) {
    return dateFormat(date, 'dd mmm yyyy');
  }

  return null;
}

export const renderTime = (date) => {
  if(date) {
    return dateFormat(date, 'h:MM:ss TT');
  }

  return null;
}

export const getErrorDescription = (error, t) => {
  let message = '';

  if (t) {
    message = t('Something went wrong. Please try again later.');
    if (error && error.response) {
      if (error.response && error.response.data && error.response.data.errors
        && error.response.data.errors.base) {
        message = t(error.response.data.errors.base);
      }
    }
  } else {
    message = 'Something went wrong. Please try again later.';
    if (error && error.response) {
      if (error.response && error.response.data && error.response.data.errors
        && error.response.data.errors.base) {
        message = error.response.data.errors.base;
      }
    }
  }

  return message;
};

export const getFieldError = (error, field, t) => {
  if (t) {
    let message = null;
    const iErrors = [];
    if (error && error.response && error.response.data.errors && error.response.data.errors[field]) {
      message = '';
      const fieldError = error.response.data.errors[field];
      const iError = {
        field: field,
        messages: [],
      };
      if (typeof (fieldError) === 'string') {
        message = `${message} ${t(capitalize(field, fieldError, t))} ${t(fieldError)}`;
        iError.messages.push(fieldError);
      } else if (fieldError instanceof Array === false) {
        message = `${message} ${t(capitalize(field, fieldError.message, t))} ${t(fieldError.message)}`;
        iError.messages.push(fieldError.message);
      } else {
        for (let errorMessage of fieldError) {
          message = `${message} ${t(capitalize(field, errorMessage, t))} ${t(errorMessage)}`;
          iError.messages.push(errorMessage);
        }
      }
      if (iError.messages.length > 0) {
        iErrors.push(iError);
      }
    }

    if (message) {
      return {
        validateStatus: 'error',
        help: message,
        errors: iErrors,
      };
    }
  } else {
    let message = null;
    const iErrors = [];
    if (error && error.response && error.response.data.errors && error.response.data.errors[field]) {
      message = '';
      const fieldError = error.response.data.errors[field];
      const iError = {
        field: field,
        messages: [],
      };
      if (typeof (fieldError) === 'string') {
        message = `${message} ${capitalize(field, fieldError)} ${fieldError}`;
        iError.messages.push(fieldError);
      } else if (fieldError instanceof Array === false) {
        message = `${message} ${capitalize(field, fieldError.message)} ${fieldError.message}`;
        iError.messages.push(fieldError.message);
      } else {
        for (let errorMessage of fieldError) {
          message = `${message} ${capitalize(field, errorMessage)} ${errorMessage}`;
          iError.messages.push(errorMessage);
        }
      }
      if (iError.messages.length > 0) {
        iErrors.push(iError);
      }
    }

    if (message) {
      return {
        validateStatus: 'error',
        help: message,
        errors: iErrors,
      };
    }
  }

  return {};
};

export const getFieldsError = (error, fields, t) => {
  if (t) {
    let message = '';
    const iErrors = [];
    for(let field of fields) {
      if (error && error.response && error.response.data.errors && error.response.data.errors[field]) {
        const fieldError = error.response.data.errors[field];
        const iError = {
          field: field,
          messages: [],
        };
        if (typeof (fieldError) === 'string') {
          message = `${message} ${t(capitalize(field, fieldError, t))} ${t(fieldError)}`;
          iError.messages.push(fieldError);
        } else if (fieldError instanceof Array === false) {
          message = `${message} ${t(capitalize(field, fieldError.message, t))} ${t(fieldError.message)}`;
          iError.messages.push(fieldError.message);
        } else {
          for (let errorMessage of fieldError) {
            message = `${message} ${t(capitalize(field, errorMessage, t))} ${t(errorMessage)}`;
            iError.messages.push(errorMessage);
          }
        }
        if (iError.messages.length > 0) {
          iErrors.push(iError);
        }
      }
    };

    if (message.length > 0) {
      return {
        validateStatus: 'error',
        help: message,
        errors: iErrors,
      };
    }
  } else {
    let message = '';
    const iErrors = [];
    for(let field of fields) {
      if (error && error.response && error.response.data.errors && error.response.data.errors[field]) {
        const fieldError = error.response.data.errors[field];
        const iError = {
          field: field,
          messages: [],
        };
        if (typeof (fieldError) === 'string') {
          message = `${message} ${capitalize(field, fieldError)} ${fieldError}`;
          iError.messages.push(fieldError);
        } else if (fieldError instanceof Array === false) {
          message = `${message} ${capitalize(field, fieldError.message)} ${fieldError.message}`;
          iError.messages.push(fieldError.message);
        } else {
          for (let errorMessage of fieldError) {
            message = `${message} ${capitalize(field, errorMessage)} ${errorMessage}`;
            iError.messages.push(errorMessage);
          }
        }
        if (iError.messages.length > 0) {
          iErrors.push(iError);
        }
      }
    };

    if (message.length > 0) {
      return {
        validateStatus: 'error',
        help: message,
        errors: iErrors,
      };
    }
  }

  return {};
};

export const getNotificationDuration = () =>
  3;

export const getMessageDuration = () =>
  3;

export const formatImageUrl = (url, key) => {
  key = key || 'resources';

  if(url && url.length > 0) {
    if(url[0] == '/') {
      return `${getBaseUrl(key)}/${url}`;
    }
    else {
      return url;
    }
  }
};

export const formatInteger = (string) => {
  if (string) {
    return string.replace(/[^0-9\.]+/g,"");
  }

  return null;
};

export const formatBooleanSign = (value) => {
  if(value) {
    return (
      <Icon type="check" className="ant-success-icon" />
    );
  }

  return (
    <Icon type="close" className="ant-danger-icon" />
  );
};

export const renderBoolean = (value) => {
  if(value) {
    return (
      <Icon type="check" className="ant-success-icon" />
    );
  }

  return (
    <Icon type="close" className="ant-danger-icon" />
  );
};

export const renderImage = (url, className, key) => {
  key = key || 'resources';

  if(url && url.length > 0) {
    let src = null;

    if(url[0] == '/') {
      src = `${getBaseUrl(key)}/${url}`;
    }
    else {
      src = url;
    }

    return (
      <img src={src} className={className} />
    );
  }

  return null;
};

class RawText extends React.Component {
  render() {
    const { form, actioner, item, label, key2, required, initial, t } = this.props;

    let rules = [];
    if (required) {
      rules.push({ required: true, message: t('is_required', {
        field: label,
      }) });
    }

    return (
      <Form.Item {...getFieldError(actioner.error, key2, t)} label={label} hasFeedback>
        {form.getFieldDecorator(key2, {
          rules: rules,
          initialValue: initial || item[key2],
        })(
          <Input type="text" placeholder={label} />,
        )}
      </Form.Item>
    );
  }
}

const Text = translate('translations')(RawText);

export const renderTextField = (form, actioner, item, label, key, required, initial) => {
  return (
    <Text {...{ form, actioner, item, label, key2: key, required, initial }} />
  );
}

class RawTextField extends React.Component {
  render() {
    const { form, actioner, field, initial, required, t, type, scope, hideLabel, hideFeedback } = this.props;

    const rules = [];
    if (required) {
      rules.push({ required: true, message: t('is_required', {
        field: t(field),
      }) });
    }

    let fieldError = {};
    if (actioner) {
      fieldError = getFieldError(actioner.error, field, t);
    }

    let label = t(field);
    if (hideLabel) {
      label = null;
    }

    let hasFeedback = true;
    if (hideFeedback) {
      hasFeedback = false;
    }

    return (
      <Form.Item {...fieldError} label={label} hasFeedback={hasFeedback}>
        {form.getFieldDecorator((scope) ? `${scope}.${field}` : field, {
          rules: rules,
          initialValue: initial,
        })(
          <Input type={(type) ? type : 'text'} placeholder={t(field)} disabled={this.props.disabled} />,
        )}
      </Form.Item>
    );
  }
}

export const TextField = translate('translations')(RawTextField);

class RawTextAreaField extends React.Component {
  render() {
    const { form, actioner, field, initial, required, t, type, scope, hideLabel, hideFeedback } = this.props;

    const rules = [];
    if (required) {
      rules.push({ required: true, message: t('is_required', {
        field: t(field),
      }) });
    }

    let fieldError = {};
    if (actioner) {
      fieldError = getFieldError(actioner.error, field, t);
    }

    let label = t(field);
    if (hideLabel) {
      label = null;
    }

    let hasFeedback = true;
    if (hideFeedback) {
      hasFeedback = false;
    }

    return (
      <Form.Item {...fieldError} label={label} hasFeedback={hasFeedback}>
        {form.getFieldDecorator((scope) ? `${scope}.${field}` : field, {
          rules: rules,
          initialValue: initial,
        })(
          <Input.TextArea type={(type) ? type : 'text'} placeholder={t(field)} autosize={this.props.autosize} disabled={this.props.disabled} />,
        )}
      </Form.Item>
    );
  }
}

export const TextAreaField = translate('translations')(RawTextAreaField);

class RawNumeric extends React.Component {
  render() {
    const { form, actioner, field, initial, required, t, hideLabel, hideFeedback } = this.props;

    const rules = [];
    if (required) {
      rules.push({ required: true, message: t('is_required', {
        field: t(field),
      }) });
    }

    let fieldError = {};
    if (actioner) {
      fieldError = getFieldError(actioner.error, field, t);
    }

    let label = t(field);
    if (hideLabel) {
      label = null;
    }

    let hasFeedback = true;
    if (hideFeedback) {
      hasFeedback = false;
    }

    return (
      <Form.Item {...fieldError} label={label} hasFeedback={hasFeedback}>
        {form.getFieldDecorator(field, {
          rules: rules,
          initialValue: initial,
        })(
          <Input type="numeric" placeholder={t(field)} disabled={this.props.disabled} />,
        )}
      </Form.Item>
    );
  }
}

const Numeric = translate('translations')(RawNumeric);

class RawNumericField extends React.Component {
  render() {
    const { form, actioner, field, initial, required, t, scope, hideLabel, hideFeedback } = this.props;

    const rules = [];
    if (required) {
      rules.push({ required: true, message: t('is_required', {
        field: t(field),
      }) });
    }

    let fieldError = {};
    if (actioner) {
      fieldError = getFieldError(actioner.error, field, t);
    }

    let label = t(field);
    if (hideLabel) {
      label = null;
    }

    let hasFeedback = true;
    if (hideFeedback) {
      hasFeedback = false;
    }

    return (
      <Form.Item {...fieldError} label={label} hasFeedback={hasFeedback}>
        {form.getFieldDecorator((scope) ? `${scope}.${field}` : field, {
          rules: rules,
          initialValue: initial,
        })(
          <Input type="numeric" placeholder={t(field)} disabled={this.props.disabled} />,
        )}
      </Form.Item>
    );
  }
}

export const NumericField = translate('translations')(RawNumericField);

class RawCheckboxField extends React.Component {
  render() {
    const { form, actioner, field, initial, t, scope, hideLabel, hideFeedback } = this.props;

    let fieldError = {};
    if (actioner) {
      fieldError = getFieldError(actioner.error, field, t);
    }

    let label = t(field);
    if (hideLabel) {
      label = null;
    }

    let hasFeedback = true;
    if (hideFeedback) {
      hasFeedback = false;
    }

    return (
      <Form.Item {...fieldError} label={label} hasFeedback={hasFeedback}>
        {form.getFieldDecorator((scope) ? `${scope}.${field}` : field, {
          rules: [],
          initialValue: initial,
        })(
          <Checkbox defaultChecked={initial} />,
        )}
      </Form.Item>
    );
  }
}

export const CheckboxField = translate('translations')(RawCheckboxField);

export const renderNumericField = (form, actioner, item, key, label, required, initial) => {
  return (
    <Numeric {...{ form, actioner, item, label, key2: key, required, initial }} />
  );
}

export const renderObject = (value) => {
  if (value instanceof Array) {
    return value.join(', ');
  } else if (typeof(value) === 'boolean') {
    return formatBooleanSign(value);
  } else if (typeof(value) === 'object') {
    return JSON.stringify(value);
  }

  return value;
}

export class LinkTag extends React.Component {
  render() {
    const { link, color, tag } = this.props;

    if (!tag) {
      return null;
    }

    return (
      <Link
        to={link}
        target="_blank"
      >
        <Tag
          color={(color) ? color : "blue"}
        >
          {tag}
        </Tag>
      </Link>
    );
  }
}

export const massageField = (params, field) => {
  if (params && params[field] && params[field].key) {
    params[field] = params[field].key
  }

  return params;
}

class RawUploadField extends React.Component {
  uploadProps = (component, form, field) => {
    return {
      name: 'file',
      action: `${getBaseUrl('resources-api')}/attachments.json`,
      headers: getHeadersSetter('resources-api')(),
      data: {
        type: 'ImageAttachment',
      },
      accept: 'image/*',
      onChange: (info) => {
        const { uploading } = component.state;
        const file = info.file;

        if (file.status === 'uploading') {
          if (uploading.indexOf(file.uid) === -1) {
            uploading.push(file.uid);
          }
        } else if (file.status === 'done') {
          if (uploading.indexOf(file.uid) > -1) {
            uploading.splice(uploading.indexOf(file.uid), 1);
          }

          const attachmentId = file.response.attachment.id;
          const fieldsValue = {};
          fieldsValue[field] = attachmentId;
          form.setFieldsValue(fieldsValue);
        } else if (file.status === 'error') {
          if (uploading.indexOf(file.uid) > -1) {
            uploading.splice(uploading.indexOf(file.uid), 1);
          }
        }

        component.setState({
          uploading,
        }, () => {
          if (component.state.uploading.length === 0) {
            component.setState({
              isUploading: false,
            });
          } else {
            component.setState({
              isUploading: true,
            });
          }
        });
      },
    };
  }

  render() {
    const { form, actioner, field, required, t, component } = this.props;

    const rules = [];
    if (required) {
      rules.push({ required: true, message: t('is_required', {
        field: t(field),
      }) });
    }

    const uploadProps = this.uploadProps(component, form, field);

    return (
      <Form.Item {...getFieldError(actioner.error, field, t)} label={t(field)} hasFeedback>
        {
          form.getFieldDecorator(field, {
            rules: rules,
          })(
            <div />
          )
        }
        <Upload.Dragger {...uploadProps}>
          <div>
            {t('drag_and_drop_or_click_to_upload')}
          </div>
          <Icon type="upload" />
        </Upload.Dragger>
      </Form.Item>
    );
  }
}

export const UploadField = translate('translations')(RawUploadField);

class RawMoney extends React.Component {
  render() {
    const currency = this.props.currency || 'USD';
    let profitClassName = null;

    if (this.props.profit) {
      if (this.props.amount > 0) {
        profitClassName = "green-price";
      } else if (this.props.amount < 0) {
        profitClassName = "red-price";
      }
    }

    return (
      <div
        className={`price ${profitClassName}`}
      >
        {renderMoney(this.props.amount, currency)}
      </div>
    );
  }
}

export const Money = translate('translations')(RawMoney);
