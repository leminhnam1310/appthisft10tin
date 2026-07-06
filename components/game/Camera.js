export default class Camera {

  constructor() {

    //----------------------------------
    // Position
    //----------------------------------

    this.x = 0;
    this.y = 0;

    this.targetX = 0;
    this.targetY = 0;

    //----------------------------------
    // Smooth
    //----------------------------------

    this.smooth = 0.12;

    //----------------------------------
    // Zoom
    //----------------------------------

    this.zoom = 1;
    this.targetZoom = 1;

    this.minZoom = 0.4;
    this.maxZoom = 3;

    //----------------------------------
    // Shake
    //----------------------------------

    this.shakeTime = 0;
    this.shakePower = 0;

    this.offsetX = 0;
    this.offsetY = 0;

  }

  //----------------------------------
  // Follow
  //----------------------------------

  follow(x, y) {

    this.targetX = x;
    this.targetY = y;

  }

  //----------------------------------
  // Set
  //----------------------------------

  setPosition(x, y) {

    this.x = x;
    this.y = y;

    this.targetX = x;
    this.targetY = y;

  }

  //----------------------------------
  // Zoom
  //----------------------------------

  addZoom(amount) {

    this.targetZoom += amount;

    if (this.targetZoom < this.minZoom)
      this.targetZoom = this.minZoom;

    if (this.targetZoom > this.maxZoom)
      this.targetZoom = this.maxZoom;

  }

  //----------------------------------
  // Shake
  //----------------------------------

  shake(power = 12, time = 15) {

    this.shakePower = power;
    this.shakeTime = time;

  }

  //----------------------------------
  // Update
  //----------------------------------

  update() {

    //------------------------------
    // Position
    //------------------------------

    this.x +=
      (this.targetX - this.x) *
      this.smooth;

    this.y +=
      (this.targetY - this.y) *
      this.smooth;

    //------------------------------
    // Zoom
    //------------------------------

    this.zoom +=
      (this.targetZoom - this.zoom) *
      0.08;

    //------------------------------
    // Shake
    //------------------------------

    if (this.shakeTime > 0) {

      this.shakeTime--;

      this.offsetX =
        (Math.random() - 0.5) *
        this.shakePower;

      this.offsetY =
        (Math.random() - 0.5) *
        this.shakePower;

    } else {

      this.offsetX = 0;
      this.offsetY = 0;

    }

  }

  //----------------------------------
  // Begin Draw
  //----------------------------------

  begin(ctx, world) {

    ctx.save();

    ctx.translate(
      world.width / 2,
      world.height / 2
    );

    ctx.scale(
      this.zoom,
      this.zoom
    );

    ctx.translate(

      -this.x + this.offsetX,

      -this.y + this.offsetY

    );

  }

  //----------------------------------
  // End Draw
  //----------------------------------

  end(ctx) {

    ctx.restore();

  }

}