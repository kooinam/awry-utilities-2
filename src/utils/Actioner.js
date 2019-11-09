import uuidV4 from 'uuid/v4'
import { message } from 'antd';
import { getMessageDuration } from './UIManager';

// new Actioner({
//   component: this,
//   key: 'actioner',
//   axiosGetter: getAxios,
//   method: 'post',
//   itemName: 'item',
//   ItemKlass: Item,
//   /* eslint-disable no-unused-vars */
//   successMessageGetter: item =>
//     'Success',
//   errorMessageGetter: error =>
//     'Error',
//   /* eslint-enable no-unused-vars */
// })

class Actioner extends Object {
  constructor(attributes) {
    const newAttributes = Object.assign({
      component: null,
      key: null,
      axiosGetter: null,
      method: null,
      itemName: null,
      ItemKlass: null,
      successMessageGetter: null,
      successCallback: null,
      errorMessageGetter: null,
      errorCallback: null,
      isLoading: false,
      error: {},
    }, attributes);

    super(newAttributes);

    this.rotateUuid();
  }

  rotateUuid = () => {
    this.uuid = uuidV4();
    return this;
  }

  do = (url, params, key) => {
    const component = this.component;
    const actioner = component.state[this.key];
    actioner.isLoading = true;
    this.rotateUuid();
    const state = {};
    state[this.key] = actioner;
    component.setState(state, () => {
      const axiosGetter = this.axiosGetter;
      axiosGetter().then((instance) => {
        if (this.method === 'get') {
          return instance.get(url, params);
        } else if (this.method === 'post') {
          return instance.post(url, params);
        } else if (this.method === 'delete') {
          return instance.delete(url, params);
        } else if (this.method === 'patch') {
          return instance.patch(url, params);
        }

        return null;
      }).then((response) => {
        const actioner2 = component.state[this.key];
        actioner2.isLoading = false;
        actioner2.error = null;
        this.rotateUuid();
        const state2 = {};
        state2[this.key] = actioner2;
        let item = null;

        if (this.ItemKlass && this.itemName) {
          item = new this.ItemKlass(response.data[this.itemName]);
        }

        if (this.successMessageGetter && this.successMessageGetter(item, key)) {
          message.success(this.successMessageGetter(item, key), getMessageDuration());
        }

        component.setState(state2, () => {
          if (this.successCallback) {
            this.successCallback(item, key);
          }
        });
      }).catch((error) => {
        const actioner2 = component.state[this.key];
        actioner2.isLoading = false;
        actioner2.error = error;
        this.rotateUuid();
        const state2 = {};
        state2[this.key] = actioner2;
        component.setState(state2, () => {
          if (this.errorCallback) {
            this.errorCallback(error, key);
          }
        });
        if (error && error.response) {
          if (this.errorMessageGetter && this.errorMessageGetter(error, key)) {
            message.error(this.errorMessageGetter(error, key), getMessageDuration());
          }
        } else {
          console.log('error', error);
        }
      });
    });
  }
}

export default Actioner;
