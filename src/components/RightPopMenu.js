import mx from "../assets/mxgraph";

export const initPopMenu = (graph, editor, container) => {
  // 禁用浏览器右键
  mx.mxEvent.disableContextMenu(container);
  // 设置这个属性后节点之间才可以连接
  graph.setConnectable(true);
  // 开启区域选择
  new mx.mxRubberband(graph);
  // Configures automatic expand on mouseover
  graph.popupMenuHandler.autoExpand = true;
  // Installs context menu
  graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
    addPopupMenuHistoryItems(graph, editor, menu, cell, evt);
    addPopupMenuEditItems(graph, editor, menu, cell, evt);
    addPopupMenuUserDefine(graph, editor, menu, cell, evt);
  };
};

export const createNewNode = (graph, x, y, text) => {
  const parent = graph.getDefaultParent();
  return graph.insertVertex(parent, null, text, x, y, 80, 30);
};
// 历史记录操作
export const addPopupMenuHistoryItems = (graph, editor, menu, cell, evt) => {
  if (!graph.isSelectionEmpty()) return;
  // addMenuItem(menu, "undo", null, evt, null, editor);
};
// 选中元素操作
export const addPopupMenuEditItems = (graph, editor, menu, cell, evt) => {
  if (graph.isSelectionEmpty()) {
    menu.addItem("粘贴", null, () => {
      console.log(evt);
    });
  } else {
    menu.addItem("删除", null, () => {
      cell.removeFromParent(); //删除了此cell
      graph.refresh(cell);
    });
    menu.addSeparator();
    menu.addItem("copy", null, () => {
      console.log(evt);
    });
    menu.addItem("剪切", null, () => {
      console.log(evt);
    });
    menu.addSeparator();
    menu.addItem("复制并粘贴", null, () => {
      let cells = graph.getSelectionCells();
      if (cells && cells.length) {
        cells = graph.cloneCells(cells);
        let newCells = cells.map(o => {
          return { id: o.id, value: o.value + "_1" };
        });
        console.log(cells);
        console.log(mx.mxClipboard);
        mx.mxClipboard.setCells(newCells);
        mx.mxClipboard.paste(graph);
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
