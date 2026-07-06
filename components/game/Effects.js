export default class Effects {
  constructor() {}

  begin(ctx) {
    ctx.save();
  }

  end(ctx) {
    ctx.restore();
  }
}