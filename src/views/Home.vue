<template>
  <div class="home">
    <div class="graph-control-btns" ref="topControlBar"></div>
    <div class="graph-toolbar" ref="graphToolBar"></div>
    <div class="graph-container" ref="graphContainer"></div>
    <el-dialog :close-on-click-modal="false" :visible.sync="xmlVisible" append-to-body title="XML预览" top="auto" width="600">
      <pre>{{ mxXml }}</pre>
    </el-dialog>
    <div id="outlineContainer"></div>
  </div>
</template>

<script>
import mx from "../assets/mxgraph";
// import hljs from "../assets/highlight/highlight";
import { formatXml } from "../utils/formart";
import { initPopMenu } from "../components/RightPopMenu";
import { initMenuBar } from "../components/LeftMenuBar";
import { initControlBar } from "../components/TopControlBar";
import { initKeyHanler } from "../components/KeyHandler";

export default {
  name: "Home",
  data() {
    return {
      graph: null,
      model: null,
      codec: null,
      editor: null,
      defaultToolbar: null,
      toolbar: null,
      xmlVisible: false,
      mxXml: ""
    };
  },
  mounted() {
    this.model = new mx.mxGraphModel();
    this.graph = new mx.mxGraph(this.$refs.graphContainer, this.model);
    this.editor = new mx.mxEditor();

    this.graph.setHtmlLabels(true);
    // 开启可以拖拽建立关系
    this.graph.setConnectable(true);
    // 开启方块上的文字编辑功能
    this.graph.setCellsEditable(false);
    // 选择基本元素开启
    this.graph.setEnabled(true);
    //开启提示
    this.graph.setTooltips(true);

    this.graph.zoomFactor = 0.1;

    // 启用对齐线帮助定位
    mx.mxGraphHandler.prototype.guidesEnabled = true;
    mx.mxGraphHandler.prototype.useGuidesForEvent = function(me) {
      return !mxEvent.isAltDown(me.getEvent());
    };

    // Defines the guides to be red (default)
    mx.mxConstants.GUIDE_COLOR = "#FF0000";

    // Defines the guides to be 1 pixel (default)
    mx.mxConstants.GUIDE_STROKEWIDTH = 1;

    // Enables snapping waypoints to terminals
    mx.mxEdgeHandler.prototype.snapToTerminals = true;

    new mxRubberband(this.graph);

    new mxDivResizer(document.getElementById("outlineContainer"));
    new mxOutline(this.graph, document.getElementById("outlineContainer"));

    // 得到默认的parent用于插入cell。这通常是root的第一个孩子。
    let parent = this.graph.getDefaultParent();
    this.graph.isCellFoldable = () => false;

    // 左侧工具栏
    initMenuBar(this.$refs.graphToolBar, this.graph, this.editor);
    // 右键菜单
    initPopMenu(this.graph, this.editor, this.$refs.graphContainer);
    // 顶部菜单
    initControlBar(this.graph, this.editor, this.$refs.topControlBar);
    // 绑定关键字
    initKeyHanler(this.editor, this.graph, this);

    // 开始事务
    this.model.beginUpdate();

    try {
      let v1 = this.graph.insertVertex(parent, null, "Hello", 20, 20, 80, 30);
      let v2 = this.graph.insertVertex(parent, null, "World", 200, 20, 80, 30);
      let v3 = this.graph.insertVertex(parent, null, "!", 100, 80, 80, 30);
      this.graph.insertEdge(parent, null, "", v1, v2);
      this.graph.insertEdge(parent, null, "", v2, v3);
    } finally {
      // 提交事务
      this.model.endUpdate();
    }
  },
  methods: {
    getXMlText() {
      let str = formatXml(mx.mxUtils.getXml(new mx.mxCodec().encode(this.graph.getModel())));
      // this.mxXml = hljs.highlightAuto(str).value;
      this.mxXml = str;
      this.xmlVisible = true;
    }
  },
  beforeDestroy() {
    // this.model.endUpdate();
  }
};
</script>
<style lang="scss">
@import "../assets/styles/right-menu.scss";
.home {
  display: grid;
  grid-template-columns: 360px auto 360px;
  grid-template-rows: 48px auto;
  width: 100vw;
  height: 80vh;
}
.graph-control-btns {
  grid-column-start: 1;
  grid-column-end: 4;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  .zoom-proportion {
    line-height: 24px;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    background: #eeeeee;
    padding: 0 16px;
    font-size: 14px;
  }
  .control-button {
    box-sizing: border-box;
    padding: 6px 12px;
    margin: 0 4px;
    border-radius: 4px;
    line-height: 16px;
    transition: all ease 0.2s;
    &:hover {
      background: #eeeeee;
      cursor: pointer;
    }
  }
}
.graph-container {
  /*background: url("../assets/styles/grid.gif");*/
  position: relative;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=");
}
#outlineContainer {
  position: absolute;
  overflow: hidden;
  top: 36px;
  right: 0;
  width: 200px;
  height: 140px;
  background: transparent;
  border-style: solid;
  border-color: black;
  z-index: 999;
}
</style>
