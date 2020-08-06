<template>
  <div class="home">
    <div class="graph-control-btns" ref="topControlBar"><el-button @click.stop="getXMlText">预览xml</el-button></div>
    <div class="graph-toolbar" ref="graphToolBar"></div>
    <div class="graph-container-box">
      <div class="graph-container" ref="graphContainer"></div>
    </div>
    <div id="outlineContainer"></div>
    <el-dialog :close-on-click-modal="false" :visible.sync="xmlVisible" append-to-body title="XML预览" top="auto" width="600">
      <pre>{{ mxXml }}</pre>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="editFormVisible" append-to-body title="XML预览" top="auto" width="600">
      <div ref="cellForm"></div>
    </el-dialog>
  </div>
</template>

<script>
import mx from "../assets/mxgraph";
// import hljs from "../assets/highlight/highlight";
import { formatXml } from "@/utils/formart";
import { initPopMenu } from "@/components/RightPopMenu";
import { initMenuBar } from "@/components/LeftMenuBar";
import { initControlBar } from "@/components/TopControlBar";
import { initKeyHandler, initKeymap } from "@/components/KeyHandler";
import { initDefaultConfig } from "@/components/DefaultConfig";
import Shape from "@/assets/mxgraph/Shape";

export default {
  name: "Home",
  data() {
    return {
      graph: null,
      model: null,
      codec: null,
      editor: null,
      defaultToolbar: null,
      keyHandler: null,
      toolbar: null,
      xmlVisible: false,
      editFormVisible: false,
      mxXml: ""
    };
  },
  mounted: function() {
    this.model = new mx.mxGraphModel();
    this.editor = new mx.mxEditor();
    this.graph = this.editor.graph;
    this.editor.setGraphContainer(this.$refs.graphContainer);

    new mxDivResizer(document.getElementById("outlineContainer"));
    new mxOutline(this.graph, document.getElementById("outlineContainer"));
    Shape.NoteShape();
    Shape.TextShape();

    // 得到默认的parent用于插入cell。这通常是root的第一个孩子。
    let parent = this.graph.getDefaultParent();

    // 图层双击事件
    this.graph.dblClick = (evt, cell) => {
      console.log(evt, cell);
      // 如果不是双击事件，编辑器会自动处理
      if (this.graph.isEnabled() && !mx.mxEvent.isConsumed(evt) && cell != null && this.graph.isCellEditable(cell)) {
        if (this.model.isEdge(cell) || !this.graph.isHtmlLabel(cell)) {
          this.graph.startEditingAtCell(cell);
        } else {
          let content = this.$refs.cellForm;
          content.innerHTML = this.graph.convertValueToString(cell);
          this.editFormVisible = true;
        }
      }
      // 禁用任何默认双击行为
      mxEvent.consume(evt);
    };

    // 左侧工具栏
    initMenuBar(this.$refs.graphToolBar, this.graph, this.editor);
    // 右键菜单
    initPopMenu(this.graph, this.editor, this.$refs.graphContainer, this);
    // 顶部菜单
    initControlBar(this.graph, this.editor, this.$refs.topControlBar);
    // 绑定快捷键
    this.keyHandler = initKeyHandler(this.editor, this.graph, this);
    initKeymap(this.keyHandler, this.editor, this.graph, this);
    // 初始化樣式
    initDefaultConfig(this.graph, this.editor);

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
      this.mxXml = formatXml(mx.mxUtils.getXml(new mx.mxCodec().encode(this.graph.getModel())));
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
.graph-container-box {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #555555;
}
.graph-container {
  /*background: url("../assets/styles/grid.gif");*/
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=");
  overflow: auto;
}
#outlineContainer {
  position: absolute;
  overflow: hidden;
  top: 36px;
  right: 0;
  width: 200px;
  height: 140px;
  background: transparent;
  border: 3px dashed #000;
  z-index: 999;
}
</style>
