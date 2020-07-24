<template>
  <div class="home">
    <div class="control-btns">
      <el-button @click="getXMlText" size="small" type="primary">查看XML</el-button>
    </div>
    <div class="graph-toolbar" ref="graphToolBar"></div>
    <div class="graph-container" ref="graphContainer"></div>
    <el-dialog :close-on-click-modal="false" :visible.sync="xmlVisible" append-to-body title="XML预览" top="auto" width="600">
      <pre>{{ mxXml }}</pre>
    </el-dialog>
  </div>
</template>

<script>
import mx from "../assets/mxgraph";
// import hljs from "../assets/highlight/highlight";
import { formatXml } from "../utils/formart";
import { initPopMenu } from "../components/RightPopMenu";
import { initMenuBar } from "../components/LeftMenuBar";

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
    console.log(mx);

    this.model = new mx.mxGraphModel();
    this.graph = new mx.mxGraph(this.$refs.graphContainer, this.model);
    this.editor = new mx.mxEditor();

    this.graph.setHtmlLabels(true);
    // 开启可以拖拽建立关系
    this.graph.setConnectable(true);
    // 开启方块上的文字编辑功能
    this.graph.setCellsEditable(false);
    // 启用对齐线帮助定位
    mx.mxGraphHandler.prototype.guidesEnabled = true;
    // 选择基本元素开启
    this.graph.setEnabled(true);
    //开启提示
    this.graph.setTooltips(true);

    // 得到默认的parent用于插入cell。这通常是root的第一个孩子。
    let parent = this.graph.getDefaultParent();
    this.graph.isCellFoldable = () => false;

    // 左侧工具栏
    this.defaultToolbar = initMenuBar(this.$refs.graphToolBar, this.editor);
    // 右键菜单
    initPopMenu(this.graph, this.editor, this.$refs.graphContainer);

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
  grid-template-columns: 360px auto;
  grid-template-rows: 48px auto;
  width: 100vw;
  height: 80vh;
}
.control-btns {
  grid-column-start: 1;
  grid-column-end: 3;
}
.graph-container {
  background: url("../../public/static/images/grid.gif");
  position: relative;
}
</style>
