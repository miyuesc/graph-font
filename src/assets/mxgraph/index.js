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
mxgraph.mxGraph.prototype.zoomToCenter = function(margin) {
  var bounds = this.getGraphBounds();
  margin = margin || 10;
  this.container.style.overflow = "hidden";
  this.view.setTranslate(-bounds.x - (bounds.width - this.container.clientWidth) / 2, -bounds.y - (bounds.height - this.container.clientHeight) / 2);
  while (bounds.width + margin * 2 > this.container.clientWidth || bounds.height + margin * 2 > this.container.clientHeight) {
    this.zoomOut();
    bounds = this.getGraphBounds();
  }
  this.container.style.overflow = "auto";
};

export default mxgraph;
