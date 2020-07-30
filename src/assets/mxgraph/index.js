import mx from "mxgraph";
const mxgraph = require("mxgraph")({
  mxImageBasePath: "./mxgraph/src/images",
  mxBasePath: "./mxgraph/src"
});
// decode bug https://github.com/jgraph/mxgraph/issues/49
window.mxGraph = mxgraph.mxGraph;
window.mxGraphModel = mxgraph.mxGraphModel;
window.mxEditor = mxgraph.mxEditor;
window.mxGeometry = mxgraph.mxGeometry;
window.mxDefaultKeyHandler = mxgraph.mxDefaultKeyHandler;
window.mxDefaultPopupMenu = mxgraph.mxDefaultPopupMenu;
window.mxStylesheet = mxgraph.mxStylesheet;
window.mxDefaultToolbar = mxgraph.mxDefaultToolbar;

for (let i in mxgraph) {
  window[i] = mxgraph[i];
}

export default mxgraph;
