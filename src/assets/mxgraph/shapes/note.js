export const NoteShape = () => {
  function mxNote(background, border, whiteSpace, clipped, overflow, labelPadding, textDirection) {
    mxCylinder.call(this);
    this.background = background;
    this.border = border;
    this.whiteSpace = whiteSpace != null ? whiteSpace : "warp";
    this.warp = whiteSpace != null ? whiteSpace : "warp";
    this.clipped = clipped != null ? clipped : true;
    this.overflow = overflow != null ? overflow : "visible";
    this.labelPadding = labelPadding != null ? labelPadding : 0;
    this.textDirection = textDirection;
  }
  mxUtils.extend(mxNote, mxCylinder);
  mxNote.prototype.size = 30;
  mxNote.prototype.darkOpacity = 0;
  mxNote.prototype.paintVertexShape = function(c, x, y, w, h) {
    let s = Math.max(0, Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, "size", this.size)))));
    let op = Math.max(-1, Math.min(1, parseFloat(mxUtils.getValue(this.style, "darkOpacity", this.darkOpacity))));
    c.translate(x, y);
    c.begin();
    c.moveTo(0, 0);
    c.lineTo(w - s, 0);
    c.lineTo(w, s);
    c.lineTo(w, h);
    c.lineTo(0, h);
    c.lineTo(0, 0);
    c.close();
    c.end();
    c.fillAndStroke();
    if (!this.outline) {
      c.setShadow(false);
      if (op !== 0) {
        c.setFillAlpha(Math.abs(op));
        c.setFillColor(op < 0 ? "#FFFFFF" : "#000000");
        c.begin();
        c.moveTo(w - s, 0);
        c.lineTo(w - s, s);
        c.lineTo(w, s);
        c.close();
        c.fill();
      }
      c.begin();
      c.moveTo(w - s, 0);
      c.lineTo(w - s, s);
      c.lineTo(w, s);
      c.end();
      c.stroke();
    }
  };
  mxCellRenderer.registerShape("note", mxNote);
};
