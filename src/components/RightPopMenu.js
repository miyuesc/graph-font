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
    let submenu0 = menu.addItem("增删操作", null, null);
    menu.addItem(
      "添加节点",
      null,
      () => {
        console.log(evt);
        createNewNode(graph, evt.offsetX, evt.offsetY, "新节点");
      },
      submenu0
    );
    menu.addItem(
      "删除对象",
      null,
      () => {
        cell.removeFromParent(); //删除了此cell
        graph.refresh(cell);
      },
      submenu0
    );
    menu.addSeparator();
    menu.addItem("显示图形信息", null, () => {
      console.log(graph);
    });
    menu.addItem("复制图形", null, () => {
      try {
        console.log(editor.graph);
        // graph.setSelectionCells(editor.graph.duplicateCells());
        graph.addSelectionCells();
      } catch (e) {
        console.log(e);
      }
    });

    menu.addItem("从xml显示图形", null, () => {
      let req = mx.mxUtils.load("graph.xml");
      let root = req.getDocumentElement();
      let dec = new mx.mxCodec(root);
      dec.decode(root, graph.getModel());
      graph.getModel().endUpdate();
    });
  };
};

export const createNewNode = (graph, x, y, text) => {
  const parent = graph.getDefaultParent();
  return graph.insertVertex(parent, null, text, x, y, 80, 30);
};
