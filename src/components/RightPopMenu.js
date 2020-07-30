import mx from "../assets/mxgraph";
import { uuidGenerator } from "../utils/utils";

export const initPopMenu = (graph, editor, container) => {
  // 禁用浏览器右键
  mx.mxEvent.disableContextMenu(container);
  // 设置这个属性后节点之间才可以连接
  graph.setConnectable(true);
  // 开启区域选择
  new mx.mxRubberband(graph);
  // Configures automatic expand on mouseover
  graph.popupMenuHandler.autoExpand = true;
  //
  window.copyCells = null;
  // Installs context menu
  graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
    addPopupMenuEditItems(graph, editor, menu, cell, evt);
    addPopupMenuUserDefine(graph, editor, menu, cell, evt);
  };
};
// 创建新节点
export const createNewNode = (graph, x, y, text) => {
  const parent = graph.getDefaultParent();
  return graph.insertVertex(parent, null, text, x, y, 80, 30);
};
// 选中元素操作
export const addPopupMenuEditItems = (graph, editor, menu, cell, evt) => {
  console.log(window.copyCells);
  let copyCells = window.copyCells;
  if (graph.isSelectionEmpty()) {
    if (copyCells && copyCells.length) {
      menu.addItem("粘贴", null, () => {
        let newCells = [];
        // 修改 cells 中的元素属性
        copyCells.forEach(function(cell, i) {
          cell.id = uuidGenerator;
          cell.value = cell.value || "";
          newCells.push(cell);
        });
        mxClipboard.setCells(newCells);
        mxClipboard.paste(graph);
      });
    }
  } else {
    menu.addItem("删除", null, () => {
      cell.removeFromParent(); //删除了此cell
      graph.refresh(cell);
    });
    menu.addSeparator();
    menu.addItem("复制", null, () => {
      let cells = graph.getSelectionCells();
      window.copyCells = [];
      if (cells && cells.length) {
        cells.forEach(function(cell, i) {
          cell.id = "";
          cell.value = (cell.value || "") + "_1";
          window.copyCells.push(cell);
        });
      }
    });
    menu.addItem("剪切", null, () => {
      let cells = graph.getSelectionCells();
      window.copyCells = [];
      if (cells && cells.length) {
        cells.forEach(function(cell, i) {
          cell.id = "";
          cell.value = (cell.value || "") + "_1";
          window.copyCells.push(cell);
        });
      }
      graph.removeCells(cells);
    });
    menu.addSeparator();
    menu.addItem("复制并粘贴", null, () => {
      let cells = graph.getSelectionCells();
      if (cells && cells.length) {
        cells = graph.cloneCells(cells);
        let newCells = [];
        // 修改 cells 中的元素属性
        cells.forEach(function(cell, i) {
          cell.id = uuidGenerator;
          cell.value = (cell.value || "") + "_1";
          newCells.push(cell);
        });
        mxClipboard.setCells(newCells);
        mxClipboard.paste(graph);
      }
    });
  }
};
// 元素样式操作
export const addPopupMenuStyleItems = (graph, editor, menu, cell, evt) => {};
// 元素分组和层级操作
export const addPopupMenuArrangeItems = (graph, editor, menu, cell, evt) => {};
// 选中元素复杂操作（超链接等）
export const addPopupMenuCellItems = (graph, editor, menu, cell, evt) => {};
// 自定义菜单
export const addPopupMenuUserDefine = (graph, editor, menu, cell, evt) => {
  menu.addItem("添加节点", null, () => {
    createNewNode(graph, evt.offsetX, evt.offsetY, "新节点");
  });
};
//
export const addMenuItem = (menu, key, parent, trigger, sprite, editor) => {
  console.log(editor);
  let action = editor.actions.get(key);

  if (action != null && (menu.showDisabled || action.isEnabled()) && action.visible) {
    let item = menu.addItem(
      action.label,
      null,
      function() {
        action.funct(trigger);
      },
      parent,
      sprite,
      action.isEnabled()
    );
    // Adds checkmark image
    if (action.toggleAction && action.isSelected()) {
      menu.addCheckmark(item, mx.mxEditor.checkmarkImage);
    }
    addShortcut(item, action);
    return item;
  }
  return null;
};
//
export const addShortcut = (item, action) => {
  if (action.shortcut != null) {
    let td = item.firstChild.nextSibling.nextSibling;
    let span = document.createElement("span");
    span.style.color = "gray";
    mx.mxUtils.write(span, action.shortcut);
    td.appendChild(span);
  }
};
