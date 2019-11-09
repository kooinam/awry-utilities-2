/* @flow */

import uuidV4 from 'uuid/v4';

// new ModalParams({
//   component: this,
//   key: 'modalParams',
// })

class ModalParams extends Object {
  constructor(attributes) {
    const newAttributes = Object.assign({
      component: null,
      key: null,
      visible: false,
      doneCallback: null,
      modalKey: null,
    }, attributes);

    super(newAttributes);

    this.rotateUuid();
    this.rotateKey();
  }

  rotateUuid = () => {
    this.uuid = uuidV4();
  }

  rotateKey = () => {
    this.modalKey = uuidV4();
  }

  show = (doneCallback) => {
    const modalParams = this.component.state[this.key];
    modalParams.visible = true;
    modalParams.rotateUuid();
    modalParams.rotateKey();
    const state = {};
    state[this.key] = modalParams;
    this.component.setState(state);
    this.doneCallback = doneCallback;
  }

  dismiss = () => {
    const modalParams = this.component.state[this.key];
    modalParams.visible = false;
    modalParams.rotateUuid();
    const state = {};
    state[this.key] = modalParams;
    this.component.setState(state);
  }

  done = () => {
    const modalParams = this.component.state[this.key];
    modalParams.visible = false;
    modalParams.rotateUuid();
    const state = {};
    state[this.key] = modalParams;
    this.component.setState(state);
    if (this.doneCallback) {
      this.doneCallback();
    }
  }

  churn = () => {
    return {
      key: this.modalKey,
      modalParams: this,
      uuid: this.uuid,
    };
  }
}

export default ModalParams;
