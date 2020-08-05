import mx from "../assets/mxgraph";
import { uuidGenerator } from "../utils/utils";

export const initKeyHandler = (editor, graph, vm) => {
  const keyHandler = new mx.mxKeyHandler(graph);
  if (!vm.undoManager) {
    vm.undoManager = new mx.mxUndoManager();
  }
  const listener = function(sender, evt) {
    vm.undoManager.undoableEditHappened(evt.getProperty("edit"));
  };
  graph.getModel().addListener(mx.mxEvent.UNDO, listener);
  graph.getView().addListener(mx.mxEvent.UNDO, listener);

  return keyHandler;
};

export const initKeymap = (keyHandler, editor, graph, vm) => {
  const undoManager = vm.undoManager;
  // 绑定delete删除
  keyHandler.bindKey(46, evt => {
    if (graph.isEnabled()) {
      graph.removeCells();
    }
  });
  // 绑定Ctrl+A全选
  keyHandler.bindControlKey(65, function(evt) {
    if (graph.isEnabled()) {
      graph.selectAll();
    }
  });
  // 绑定Ctrl+C复制节点
  keyHandler.bindControlKey(67, function(evt) {
    if (graph.isEnabled()) {
      let cells = graph.getSelectionCells();
      window.copyCells = [];
      if (cells && cells.length) {
        cells.forEach(function(cell, i) {
          cell.id = "";
          cell.value = (cell.value || "") + "_1";
          window.copyCells.push(cell);
        });
      }
    }
  });
  // 绑定Ctrl+Z撤销
  keyHandler.bindControlKey(90, function(evt) {
    if (graph.isEnabled()) {
      undoManager.undo();
    }
  });
  // 绑定Ctrl+Y重做
  keyHandler.bindControlKey(89, function(evt) {
    if (graph.isEnabled()) {
      undoManager.redo();
    }
  });
  // 绑定Ctrl+X重做
  keyHandler.bindControlKey(88, function(evt) {
    let cells = graph.getSelectionCells();
    window.copyCells = [];
    if (cells && cells.length) {
      cells.forEach(function(cell, i) {
        cell.id = uuidGenerator;
        cell.value = cell.value || "";
        window.copyCells.push(cell);
      });
    }
    graph.removeCells(cells);
  });
  // 绑定Ctrl+V重做
  keyHandler.bindControlKey(86, function(evt) {
    let newCells = [];
    // 修改 cells 中的元素属性
    window.copyCells.forEach(function(cell, i) {
      cell.id = uuidGenerator;
      cell.value = cell.value || "";
      newCells.push(cell);
    });
    mxClipboard.setCells(newCells);
    mxClipboard.paste(graph);
  });
};
