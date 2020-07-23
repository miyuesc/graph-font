import mx from "../assets/mxgraph";

export const initMenuBar = (container, editor) => {
  const defaultToolbar = new mx.mxDefaultToolbar(container, editor);
  defaultToolbar.addItem("copy", `${process.env.BASE_URL}/static/images/copy.gif`, "copy");

  return defaultToolbar;
};
