/* @flow */

import uuidV4 from 'uuid/v4';

// new Draggable({
//   component: this,
//   tableParamsKey: 'tableParams',
//   actionerKey: 'sortActioner',
//   urlGetter: (item) => {
//     return `/taxonomies/${item.id}.json`;
//   },
//   paramsGetter: (item, dragedItem) => {
//     return {
//       taxonomy: {
//         position: dragedItem.position,
//       },
//     };
//   },
//   keyGetter: (item) => {
//     return {
//       id: item.id,
//       name: item.name,
//     };
//   },
// })

class Draggable extends Object {
  constructor(attributes) {
    const newAttributes = Object.assign({
      component: null,
      tableParamsKey: null,
      sortActioner: null,
      urlGetter: null,
      dragIndex: null,
    }, attributes);

    super(newAttributes);

    this.rotateUuid();
  }

  rotateUuid = () => {
    this.uuid = uuidV4();
  }

  getClosestSelector = (el, selector, rootNode) => {
    rootNode = rootNode || document.body;
    const matchesSelector = el.matches || el.webkitMatchesSelector
          || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      const flagRoot = el === rootNode;
      if (flagRoot || matchesSelector.call(el, selector)) {
        if (flagRoot) {
          el = null;
        }
        break;
      }
      el = el.parentElement;
    }
    return el;
  };

  onMouseDown = (e) => {
    const target = this.getTrNode(e.target);
    if (target) {
      target.setAttribute('draggable', true);
      target.ondragstart = this.onDragStart;
      target.ondragend = this.onDragEnd;
    }
  }


  onDragStart = (e) => {
    const target = this.getTrNode(e.target);
    if (target) {
      e.dataTransfer.setData('Text', '');
      e.dataTransfer.effectAllowed = 'move';
      target.parentElement.ondragenter = this.onDragEnter;
      target.parentElement.ondragover = function (ev) {
        ev.preventDefault();
        return true;
      };
      const dragIndex = target.rowIndex - 1;
      this.dragIndex = dragIndex
    }
  }

  changeRowIndex = () => {
    const dragIndex = this.dragIndex;
    const dragedIndex = this.dragedIndex;
    if (dragIndex >= 0 && dragIndex !== dragedIndex) {
      const component = this.component;
      const tableParams = component.state[this.tableParamsKey];
      tableParams.isLoading = true;
      component.setState({
        tableParams,
      }, () => {
        const item = tableParams.items[dragIndex];
        const dragedItem = tableParams.items[dragedIndex];
        const actioner = component.state[this.actionerKey];

        actioner.do(this.urlGetter(item), this.paramsGetter(item, dragedItem), this.keyGetter(item));
      });
    }
  }

  onDragEnd = (e) => {
    const target = this.getTrNode(e.target);
    if (target) {
      target.setAttribute('draggable', false);
      target.ondragstart = null;
      target.ondragend = null;
      target.parentElement.ondragenter = null;
      target.parentElement.ondragover = null;
      this.changeRowIndex();
    }
  }

  onDragEnter = (e) => {
    const target = this.getTrNode(e.target);

    this.dragedIndex = target ? (target.rowIndex - 1) : -1;
  }

  getTrNode = (target) => {
    return this.getClosestSelector(target, 'tr', this.component.dragContainer.tableNode);
  }
}

export default Draggable;
