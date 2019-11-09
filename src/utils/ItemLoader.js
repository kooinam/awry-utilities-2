import uuidV4 from 'uuid/v4';
import { message } from 'antd';

import { getMessageDuration } from './UIManager';
import { invalidateSSRItems } from '../actions/ssr';

// new ItemLoader({
//   component: this,
//   key: 'itemLoader',
//   axiosGetter: getAxios,
//   itemsName: 'item',
//   ItemKlass: Item,
//   errorMessage: 'Error',
// })

class ItemLoader extends Object {
  constructor(attributes) {
    const newAttributes = Object.assign({
      component: null,
      key: null,
      axiosGetter: null,
      itemName: null,
      ItemKlass: null,
      url: null,
      errorMessage: null,
      isError: false,
      errorStatus: null,
      isLoading: false,
      item: null,
      callback: null,
      ssrKey: null,
      isSSR: false,
      cache: false,
      scope: null,
    }, attributes);

    super(attributes);

    this.lastSearchId = 0;
    this.item = this.item || new this.ItemKlass();
    this.rotateUuid();
  }

  rotateUuid = () => {
    this.uuid = uuidV4();

    return this;
  }

  isFirstLoading = () => {
    return this.lastSearchId === 1 && this.isLoading;
  }


  setComponent = (setter, setterCallback) => {
    const component = this.component;
    if (component) {
      const itemLoader = component.state[this.key];
      itemLoader.rotateUuid();
      setter(itemLoader);
      const state = {};
      state[this.key] = itemLoader;
      component.setState(state, setterCallback);
    }
    else {
      setterCallback();
    }
  }

  loadItem = (params) => {
    if (this.ssrKey && this.component && this.component.props.SSRReducer && this.component.props.SSRReducer.ssrItems && this.component.props.SSRReducer.ssrItems[this.ssrKey] && (!this.component.props.SSRReducer.ssrItems[this.ssrKey].isServed || this.cache)) {
      return new Promise((resolve) => {
        const item = this.component.props.SSRReducer.ssrItems[this.ssrKey].value;
        this.setComponent((itemLoader) => {
          itemLoader.item = new this.ItemKlass(item);
          itemLoader.isSSR = true;
        }, () => {
          if (this.callback) {
            this.callback(item);
          }
          this.component.props.dispatch(invalidateSSRItems(this.ssrKey));
          resolve(item);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.lastSearchId += 1;
        const searchId = this.lastSearchId;

        this.setComponent((itemLoader) => {
          itemLoader.isLoading = true;
        }, () => {
          const axiosGetter = this.axiosGetter;
          axiosGetter().then((instance) => {
            params = params || {};
            params.scope = this.scope;
            params = {
              params,
            };

            return instance.get(this.url, params);
          }).then((response) => {
            if (searchId === this.lastSearchId) {
              const item = new this.ItemKlass(response.data[this.itemName]);
              this.setComponent((itemLoader) => {
                itemLoader.isLoading = false;
                itemLoader.isError = false;
                itemLoader.errorStatus = null;
                itemLoader.item = item;
                itemLoader.isSSR = false;
              }, () => {
                if(this.callback) {
                  this.callback(item, response.data);
                }
                resolve(item);
              });
            }
            else {
              reject();
            }
          }).catch((error) => {
            if (searchId === this.lastSearchId) {
              this.setComponent((itemLoader) => {
                itemLoader.isLoading = false;
                itemLoader.isError = true;
                itemLoader.isSSR = false;
                if (error && error.response) {
                  itemLoader.errorStatus = error.response.status;
                }
              }, () => {
                if(error && error.response) {
                  if(this.errorMessage) {
                    message.error(this.errorMessage, getMessageDuration());
                  }
                  if (this.errorMessageGetter) {
                    message.error(this.errorMessageGetter(error.response), getMessageDuration());
                  }
                }
                else {
                  console.log(error);
                }

                reject(error);
              });
            }
            else {
              reject();
            }
          });
        });
      });
    }
  }
}

export default ItemLoader;