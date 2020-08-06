import mx from "@/assets/mxgraph";

export const initDefaultConfig = (graph, editor) => {
  graph.setHtmlLabels(false);
  // 开启可以拖拽建立关系
  graph.setConnectable(true);
  // 开启方块上的文字编辑功能
  graph.setCellsEditable(true);
  // 选择基本元素开启
  graph.setEnabled(true);
  //开启提示
  graph.setTooltips(true);
  // 禁止连接线晃动
  graph.setAllowDanglingEdges(false);
  // 连接预览
  graph.connectionHandler.getConnectImage = function(state) {
    return new mxImage(state.style[mxConstants.STYLE_IMAGE], 16, 16);
  };
  // 显示中心端口图标
  graph.connectionHandler.targetConnectImage = true;
  // 默认按钮触发缩放程度
  graph.zoomFactor = 0.1;
  // 所有细胞是否可折叠
  graph.isCellFoldable = () => false;
  // 组件提示框
  graph.getTooltipForCell = cell => {
    let label = graph.convertValueToString(cell);
    return `<div class="cell-tooltip">Tooltip for ${label}<br/>X: ${cell.geometry.x} Y: ${cell.geometry.y}</div>`;
  };

  // 启用对齐线帮助定位
  mx.mxGraphHandler.prototype.guidesEnabled = true;
  // 显示终点
  mx.mxEdgeHandler.prototype.snapToTerminals = true;
  mx.mxGraphHandler.prototype.useGuidesForEvent = function(me) {
    return !mxEvent.isAltDown(me.getEvent());
  };
  // Defines the guides to be red (default)
  mx.mxConstants.GUIDE_COLOR = "#FF0000";
  // Defines the guides to be 1 pixel (default)
  mx.mxConstants.GUIDE_STROKEWIDTH = 1;
  // 矩形选框
  new mxRubberband(graph);

  // 设置默认组
  // groupBorderSize 设置图形和它的子元素的边距。
  let group = new mx.mxCell("Group", new mx.mxGeometry(), "group");
  group.setVertex(true);
  group.setConnectable(false);
  editor.defaultGroup = group;
  editor.groupBorderSize = 20;

  const groupStyle = new Object();
  groupStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
  groupStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  groupStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  groupStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
  groupStyle[mxConstants.STYLE_FILLCOLOR] = "#FF9103";
  groupStyle[mxConstants.STYLE_GRADIENTCOLOR] = "#F8C48B";
  groupStyle[mxConstants.STYLE_STROKECOLOR] = "#E86A00";
  groupStyle[mxConstants.STYLE_FONTCOLOR] = "#000000";
  groupStyle[mxConstants.STYLE_ROUNDED] = true;
  groupStyle[mxConstants.STYLE_OPACITY] = "80";
  groupStyle[mxConstants.STYLE_STARTSIZE] = "30";
  groupStyle[mxConstants.STYLE_FONTSIZE] = "16";
  groupStyle[mxConstants.STYLE_FONTSTYLE] = 1;
  groupStyle[mxConstants.STYLE_WHITE_SPACE] = "wrap";
  graph.getStylesheet().putCellStyle("group", groupStyle);

  const noteStyle = new Object();
  noteStyle[mxConstants.STYLE_WHITE_SPACE] = "wrap";
  graph.getStylesheet().putCellStyle("text", noteStyle);

  // 淡出了启动后，屏幕的UI已经被加载
  let splash = document.getElementById("splash");
  if (splash != null) {
    try {
      mxEvent.release(splash);
      mxEffects.fadeOut(splash, 100, true);
    } catch (e) {
      // 工具库不可用（不加载库）
      splash.parentNode.removeChild(splash);
    }
  }
};
