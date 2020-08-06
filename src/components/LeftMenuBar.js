import mx from "../assets/mxgraph";
import { uuidGenerator } from "@/utils/utils";
import ClassImg from "@/assets/icons/Class.png";
import ClassImg2 from "@/assets/icons/Class2.png";
import NoteImg from "@/assets/icons/Note.png";

let defaultWidth = 160;
let defaultHeight = 30;
let blockWidth = 160;
let blockHeight = 26;
let dividerWidth = 160;
let dividerHeight = 3;

// 文字块
const field = new mx.mxCell(
  "+ field: type",
  new mx.mxGeometry(0, 0, blockWidth, blockHeight),
  "shape=text;align=left;spacingLeft=4;spacingRight=4;overflow=hidden;verticalAlign=middle;"
);
field.vertex = true;
// 分割线
let divider = new mx.mxCell(
  "",
  new mx.mxGeometry(0, 0, dividerWidth, dividerHeight),
  "shape=line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;"
);
divider.vertex = true;

// Class Entity type 1
let classCentityCell = new mx.mxCell(
  "Classname",
  new mx.mxGeometry(0, 0, defaultWidth, 110),
  "shape=swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;"
);
classCentityCell.vertex = true;
classCentityCell.insert(field.clone());
// classCentityCell.insert(field.clone());
// classCentityCell.insert(field.clone());

// Class Entity type 2
let classCentityCell2 = new mxCell(
  "Classname",
  new mx.mxGeometry(0, 0, defaultWidth, 90),
  "shape=swimlane;fontStyle=1;align=center;verticalAlign=middle;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;"
);
classCentityCell2.vertex = true;
classCentityCell2.insert(field.clone());
classCentityCell2.insert(divider.clone());
classCentityCell2.insert(cloneCell(field, "+ method(type): type"));

let note = new mxCell(
  "Note",
  new mx.mxGeometry(0, 0, 160, 60),
  "shape=note;whiteSpace=wrap;html=1;size=14;verticalAlign=top;align=left;spacing=6;fillColor=#ffffff"
);
note.vertex = true;

function cloneCell(cell, value) {
  let clone = cell.clone();
  if (value != null) {
    clone.value = value;
  }
  return clone;
}

export const initMenuBar = (container, graph, editor) => {
  const toolbar = new mx.mxToolbar(container);
  toolbar.enabled = false;
  let letdefaultStyle = { width: 32, height: 24 };

  const components = {
    classCentityCell: {
      image: ClassImg,
      name: "Class",
      vertex: classCentityCell,
      width: 160,
      height: 110,
      style: ""
    },
    classCentityCell2: {
      image: ClassImg2,
      name: "Class 2",
      vertex: classCentityCell2,
      width: 160,
      height: 90,
      style: ""
    },
    note: {
      image: NoteImg,
      name: "Note",
      vertex: note,
      width: 160,
      height: 60,
      style: ""
    }
  };

  // 添加工作条元素
  function addVertex(component) {
    if (component.vertex) {
      addToolbarItem(graph, toolbar, component);
    } else {
      let vertex = new mxCell("请输入文本", new mxGeometry(0, 0, 160, 40), "");
      vertex.setVertex(true);
      addToolbarItem(graph, toolbar, vertex, "");
    }
  }
  // 绑定工作条元素事件
  function addToolbarItem(graph, toolbar, component) {
    let funct = function(graph, evt, target, x, y) {
      let cells = graph.importCells([component.vertex], x, y, target);
      if (cells != null && cells > 0) {
        graph.scrollCellToVisible(cells[0]);
        graph.setSelectionCells(cells);
      }
    };
    // 创建用来拖动的侧边栏图标
    let img = document.createElement("img");
    img.setAttribute("src", component.image);
    img.style.width = "48px";
    img.style.height = "48px";
    img.title = "Drag this to the diagram to create a new vertex";

    container.appendChild(img);

    let dragElt = document.createElement("div");
    dragElt.style.border = "dashed black 1px";
    dragElt.style.width = component.width + "px";
    dragElt.style.height = component.height + "px";

    // 创建的图像，它被用作拖动图标（预览）
    let ds = mxUtils.makeDraggable(img, graph, funct, dragElt, 0, 0, true, true);
    ds.setGuidesEnabled(true);
  }

  for (let i in components) {
    addVertex(components[i]);
  }

  toolbar.addLine();
  // toolbar 初始化完毕

  return toolbar;
};
