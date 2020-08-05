import mx from "../assets/mxgraph";

export const initControlBar = (graph, editor, container) => {
  const createButton = function(label, id, fun) {
    // container.appendChild(mxUtils.button(label, fun));
    let node = document.createElement("div");
    node.classList.add("control-button");
    node.id = id;
    node.innerText = label;
    node.addEventListener("click", fun);
    container.appendChild(node);
  };
  const buttons = [
    {
      label: "放大视图",
      id: "zoom-in",
      fun: function(graph) {
        return function(evt) {
          graph.zoomTo(graph.getView().getScale() + 0.1); //graph提供了很多的不同方法的API
          document.getElementById("zoom-proportion").innerText = graph.getView().getScale();
        };
      }
    },
    {
      label: "缩小视图",
      id: "zoom-out",
      fun: function(graph) {
        return function(evt) {
          graph.zoomTo(graph.getView().getScale() - 0.1); //graph提供了很多的不同方法的API
          document.getElementById("zoom-proportion").innerText = graph.getView().getScale();
        };
      }
    },
    {
      label: "还原",
      id: "actual-size",
      fun: function() {
        return function(evt) {
          editor.execute("actualSize");
          document.getElementById("zoom-proportion").innerText = graph.getView().getScale();
        };
      }
    },
    {
      label: "选择所有",
      id: "select-all",
      fun: function(graph) {
        return function(evt) {
          graph.selectAll(); //graph提供了很多的不同方法的API
        };
      }
    },
    {
      label: "取消选择",
      id: "unselect",
      fun: function(graph) {
        return function(evt) {
          graph.removeSelectionCells(graph.getSelectionCells());
        };
      }
    },
    {
      label: "删除",
      id: "delete",
      fun: function(graph) {
        return function(evt) {
          let cells = graph.getSelectionCells();
          graph.removeCells(cells);
        };
      }
    },
    {
      label: "分组所选",
      id: "group-cells",
      fun: (graph, editor, cell) => {
        return function(evt) {
          editor.execute("group");
        };
      }
    },
    {
      label: "取消分组",
      id: "ungroup-cells",
      fun: (graph, editor, cell) => {
        return function(evt) {
          if (editor.graph.getSelectionCell() !== null) {
            editor.execute("ungroup", cell);
          }
        };
      }
    },
    {
      label: "预览",
      id: "preview",
      fun: (graph, editor, cell) => {
        return function(evt) {
          editor.execute("show");
        };
      }
    }
  ];

  //循环添加所有设置好功能的按钮
  (function() {
    for (let i = 0; i < buttons.length; i++) {
      createButton(buttons[i].label, buttons[i].id, buttons[i].fun(graph, editor));
      if (buttons[i].id === "zoom-in") {
        let node = document.createElement("div");
        node.classList.add("zoom-proportion");
        node.id = "zoom-proportion";
        node.innerText = graph.getView().getScale();
        container.appendChild(node);
      }
    }
  })();
};
