import mx from "../assets/mxgraph";
import { uuidGenerator } from "@/utils/utils";
import ClassImg from "@/assets/icons/Class.png";
import ClassImg2 from "@/assets/icons/Class2.png";
import NoteImg from "@/assets/icons/Note.png";

let defaultWidth = 32;
let defaultHeight = 30;
let thumbPadding = document.documentMode >= 5 ? 2 : 3;
let thumbWidth = 32;
let thumbHeight = 30;
let thumbBorder = 1;

// 文字块
const field = new mx.mxCell(
  "+ field: type",
  new mx.mxGeometry(0, 0, 100, 26),
  "text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;"
);
field.vertex = true;
// 分割线
let divider = new mx.mxCell(
  "",
  new mx.mxGeometry(0, 0, 40, 8),
  "line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;"
);
divider.vertex = true;
// Class Entity type 1
let classCentityCell = new mx.mxCell(
  "Classname",
  new mx.mxGeometry(0, 0, 140, 110),
  "swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;"
);
classCentityCell.vertex = true;
classCentityCell.insert(field.clone());
classCentityCell.insert(field.clone());
classCentityCell.insert(field.clone());

// Class Entity type 2
let classCentityCell2 = new mxCell(
  "Classname",
  new mxGeometry(0, 0, 160, 90),
  "swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;"
);
classCentityCell2.vertex = true;
classCentityCell2.insert(field.clone());
classCentityCell2.insert(divider.clone());
classCentityCell2.insert(cloneCell(field, "+ method(type): type"));

function cloneCell(cell, value) {
  let clone = cell.clone();
  if (value != null) {
    clone.value = value;
  }
  return clone;
}

function addClickHandler(elt, ds, cells, editor, graph) {
  // let graph = editor.graph;
  let oldMouseDown = ds.mouseDown;
  let oldMouseMove = ds.mouseMove;
  let oldMouseUp = ds.mouseUp;
  let tol = graph.tolerance;
  let first = null;
  let sb = mx;

  ds.mouseDown = function(evt) {
    oldMouseDown.apply(this, arguments);
    first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));

    if (this.dragElement != null) {
      this.dragElement.style.display = "none";
      mxUtils.setOpacity(elt, 50);
    }
  };

  ds.mouseMove = function(evt) {
    if (
      this.dragElement != null &&
      this.dragElement.style.display == "none" &&
      first != null &&
      (Math.abs(first.x - mxEvent.getClientX(evt)) > tol || Math.abs(first.y - mxEvent.getClientY(evt)) > tol)
    ) {
      this.dragElement.style.display = "";
      mxUtils.setOpacity(elt, 100);
    }

    oldMouseMove.apply(this, arguments);
  };

  ds.mouseUp = function(evt) {
    try {
      if (!mxEvent.isPopupTrigger(evt) && this.currentGraph == null && this.dragElement != null && this.dragElement.style.display == "none") {
        sb.itemClicked(cells, ds, evt, elt);
      }

      oldMouseUp.apply(ds, arguments);
      mxUtils.setOpacity(elt, 100);
      first = null;

      // Blocks tooltips on this element after single click
      sb.currentElt = elt;
    } catch (e) {
      ds.reset();
      console.error(e);
    }
  };
}

// 初始化工作条元素
function addVertex(graph, cell, w, h, title) {
  let elt = document.createElement("a");
  elt.className = "geItem";
  elt.style.overflow = "hidden";
  let border = mx.mxClient.IS_QUIRKS ? 8 + 2 * thumbPadding : 2 * thumbBorder;
  elt.style.width = thumbWidth + border + "px";
  elt.style.height = thumbHeight + border + "px";
  elt.style.padding = thumbPadding + "px";
  elt.setAttribute("title", title);

  let node = null;
  // For supporting HTML labels in IE9 standards mode the container is cloned instead
  if (graph.dialect === mxConstants.DIALECT_SVG && !mxClient.NO_FO && graph.view.getCanvas().ownerSVGElement !== null) {
    node = graph.view.getCanvas().ownerSVGElement.cloneNode(true);
  }
  // LATER: Check if deep clone can be used for quirks if container in DOM
  else {
    node = graph.container.cloneNode(false);
    node.innerHTML = graph.container.innerHTML;
    // Workaround for clipping in older IE versions
    if (mxClient.IS_QUIRKS || document.documentMode === 8) {
      node.firstChild.style.overflow = "visible";
    }
  }

  node.style.position = "relative";
  node.style.overflow = "hidden";
  node.style.left = thumbBorder + "px";
  node.style.top = thumbBorder + "px";
  node.style.width = cell.geometry.width + "px";
  node.style.height = cell.geometry.height + "px";
  node.style.visibility = "";
  node.style.minWidth = "";
  node.style.minHeight = "";

  elt.appendChild(node);
  container.appendChild(elt);
}

export const initMenuBar = (container, graph, editor) => {
  const toolbar = new mx.mxToolbar(container);
  toolbar.enabled = false;
  let letdefaultStyle = { width: 32, height: 24 };

  addVertex(ClassImg, letdefaultStyle.width, letdefaultStyle.height, "");
  addVertex(ClassImg2, letdefaultStyle.width, letdefaultStyle.height, "shape=ellipse");
  addVertex(NoteImg, letdefaultStyle.width, letdefaultStyle.height, "shape=rhombus");
  // addVertex(cylinderImg, letdefaultStyle.width, letdefaultStyle.height, "shape=terminator;");
  // addVertex(
  //   triangleImg,
  //   letdefaultStyle.height,
  //   letdefaultStyle.height,
  //   'shape=triangle'
  // )
  // addVertex(
  //   cylinderImg,
  //   letdefaultStyle.height,
  //   letdefaultStyle.height,
  //   'shape=cylinder'
  // )
  // addVertex(
  //   actorImg,
  //   letdefaultStyle.height,
  //   letdefaultStyle.height,
  //   'shape=actor'
  // )
  // toolbar.addLine();
  // toolbar 初始化完毕

  // 添加工作条元素
  function addVertex(icon, w, h, style) {
    let vertex = new mxCell("请输入文本", new mxGeometry(0, 0, w, h), style);
    vertex.setVertex(true);
    addToolbarItem(graph, toolbar, vertex, icon);
  }
  // 绑定工作条元素事件
  function addToolbarItem(graph, toolbar, prototype, image) {
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    let funct = function(graph, evt, cell) {
      graph.stopEditing(false);

      let pt = graph.getPointForEvent(evt);
      let vertex = graph.getModel().cloneCell(prototype);
      vertex.geometry.x = pt.x;
      vertex.geometry.y = pt.y;

      // 对新增的节点id给定uuid
      let cells = graph.importCells([vertex], 0, 0, cell);
      cells.forEach(function(item, i) {
        item.id = uuidGenerator();
      });
      graph.setSelectionCells(cells);
    };

    // Creates the image which is used as the drag icon (preview)
    let img = toolbar.addMode(null, image, funct);
    mxUtils.makeDraggable(img, graph, funct);
  }

  // addVertex(graph, classCentityCell, defaultWidth, defaultHeight, "Class");
  // addVertex(graph, classCentityCell2, defaultWidth, defaultHeight, "Class 2");

  return toolbar;
};
