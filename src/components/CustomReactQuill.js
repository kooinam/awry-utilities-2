import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Upload, Button, Icon } from 'antd';
import uuidV4 from 'uuid/v4';

import { getBaseUrl, getHeadersSetter } from '../utils/NetworkManager';
import { formatImageUrl } from '../utils/UIManager';
import { toolbarEmoji } from './module-toolbar-emoji';
import './scss/base.css';

class CustomReactQuill extends React.Component {
  constructor(props) {
    super(props)

    this.state = {};

    this.imageHandler = this.imageHandler.bind(this);
    this.attachQuillRefs = this.attachQuillRefs.bind(this);

    if (document) {
      const Quill = require('quill');
      const Parchment = Quill.import('parchment')

      class IndentAttributor extends Parchment.Attributor.Style {
        add (node, value) {
          value = parseInt(value)
          if (value % 10 === 1) {
            value = (value - 1) + 20;
          }
          if (value % 10 === 9) {
            value = (value + 1) - 20;
          }
          if (value === 0) {
            this.remove(node)
            return true
          } else {
            return super.add(node, `${value}px`)
          }
        }
      }
      let IndentStyle = new IndentAttributor('indent', 'text-indent', {
        scope: Parchment.Scope.BLOCK,
        whitelist: Array(20).fill().map((e,i)=>`${(i+1) * 20}px`),
      })
      Quill.register(IndentStyle, true);

      class PaddingAttributor extends Parchment.Attributor.Style {
        add (node, value) {
          value = parseInt(value)
          if (value % 10 === 1) {
            value = (value - 1) + 30;
          }
          if (value % 10 === 9) {
            value = (value + 1) - 30;
          }
          if (value === 0) {
            this.remove(node)
            return true
          } else {
            return super.add(node, `${value}px`)
          }
        }

        canAdd(node, value) {
          return super.canAdd(node, value) || super.canAdd(node, parseInt(value));
        }

        value(node) {
          return parseInt(super.value(node)) || undefined;  // Don't return NaN
        }
      }
      let PaddingStyle = new PaddingAttributor('padding', 'padding-left', {
        scope: Parchment.Scope.BLOCK,
        whitelist: Array(20).fill().map((e,i)=>`${(i+1) * 30}px`),
      })
      Quill.register(PaddingStyle, true);

      this.quill = require('react-quill');
      const imageResize = require('quill-image-resize-module');
      this.quill.Quill.register('modules/ImageResize', imageResize.default);
      this.quill.Quill.register('modules/toolbar_emoji', toolbarEmoji);
      this.quill.Quill.register(this.quill.Quill.import('attributors/style/align'), true);

      var Size = Quill.import('attributors/style/size');
      Size.whitelist = ['8pt', '10pt', '11pt', '12pt', '14pt', '18pt', '24pt', '32pt'];
      Quill.register(Size, true);

      var Font = new Parchment.Attributor.Style('font', 'font-family', {
        scope: Parchment.Scope.INLINE,
        whitelist: ["andale mono, monospace", "arial, helvetica, sans-serif", "arial black, sans-serif", "book antiqua, palatino, serif", "comic sans ms, sans-serif", "courier new, courier, monospace", "georgia, palatino, serif", "helvetica, arial, sans-serif", "impact, sans-serif", "symbol", "tahoma, arial, helvetica, sans-serif", "terminal, monaco, monospace", "times new roman, times, serif", "trebuchet ms, geneva, sans-serif", "verdana, geneva, sans-serif", "webdings", "wingdings"],
      });
      Quill.register(Font, true);

      var icons = Quill.import('ui/icons');
      icons['padding'] = icons['indent'];

      this.handlers = {
        image: this.imageHandler,
        emoji: () => {},
        padding: function(value) {
          let range = this.quill.getSelection();
          let formats = this.quill.getFormat(range);
          let indent = parseInt(formats.indent || 0);
          if (value === '+1' || value === '-1') {
            let modifier = (value === '+1') ? 1 : -1;
            if (formats.direction === 'rtl') modifier *= -1;
            this.quill.format('padding', indent + modifier, Quill.sources.USER);
          }
        },
      };
    }

    let { container } = this.props;
    container = container || [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
    ];
    this.modules = {
      ImageResize: {
          // See optional "config" below
      },
      toolbar: {
        container: container,
        handlers: this.handlers,
      },
      toolbar_emoji: true,
    };
    this.attachmentId = uuidV4();
  }

  componentDidMount () {
    this.attachQuillRefs()
  }

  componentDidUpdate () {
    this.attachQuillRefs()
  }

  attachQuillRefs = () => {
    // Ensure React-Quill reference is available:
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    // Skip if Quill reference is defined:
    if (this.quillRef != null) return;

    const quillRef = this.reactQuillRef.getEditor();
    if (quillRef != null) this.quillRef = quillRef;
  }

  imageHandler = (image) => {
    document.getElementById(`attachment-${this.attachmentId}`).click();
  }

  render() {
    let { urlName, type } = this.props;
    urlName = urlName || 'url';

    const ReactQuill = this.quill;

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image',
    ]

    const uploadProps = {
      name: 'file',
      action: `${getBaseUrl(this.props.axiosName)}/attachments`,
      headers: getHeadersSetter(this.props.axiosName)(),
      accept: 'image/*',
      onChange: (info) => {
        if (info.file.status === 'done') {
          // this.setState({
          //   attachmentUrl: info.file.response.attachment.url
          // })
          var range = this.quillRef.getSelection();
          let position = range ? range.index : 0;
          this.quillRef.clipboard.dangerouslyPasteHTML(position, `<img src='${formatImageUrl(info.file.response.attachment[urlName])}' />`);
        }
      }
    };

    if (type) {
      uploadProps['data'] = {
        type: type,
      };
    }

    return (
      <div>
        <ReactQuill
          ref={
            (el) => {
              this.reactQuillRef = el;
            }
          }
          defaultValue={this.props.default}
          onChange={this.props.onChange}
          theme="snow"
          modules={this.modules}
          formates={formats}
          readOnly={this.props.disabled}
        />
        <Upload { ...uploadProps } style={{display: 'none'}}>
          <Button id={`attachment-${this.attachmentId}`}>
            <Icon type="upload" />
          </Button>
        </Upload>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(CustomReactQuill);
