export default class Particle {
  constructor() {
    this.reset();
  }

  //--------------------------------
  // RESET
  //--------------------------------

  reset() {

    //------------------------------
    // Spawn quanh gốc world
    //------------------------------

    const spawnRange = 9000;

    this.x =
      (Math.random() - 0.5) *
      spawnRange;

    this.y =
      (Math.random() - 0.5) *
      spawnRange;

    //------------------------------
    // Velocity
    //------------------------------

    this.vx =
      (Math.random() - 0.5) *
      1.5;

    this.vy =
      (Math.random() - 0.5) *
      1.5;

    //------------------------------
    // Size
    //------------------------------

    this.radius =
      1.2 +
      Math.random() * 4;

    //------------------------------
    // Mass
    //------------------------------

    this.mass =
      this.radius * 0.8 + 0.5;

    //------------------------------
    // Alpha
    //------------------------------

    this.alpha =
      0.45 +
      Math.random() * 0.55;

    //------------------------------
    // Color
    //------------------------------

    const colors = [

      "#ffffff",
      "#8ec5ff",
      "#ffd966",
      "#c084fc",
      "#ff8acb",
      "#6ee7ff",
      "#a7f3d0"

    ];

    this.color =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];

    //------------------------------
    // Glow
    //------------------------------

    this.glow =
      this.radius *
      (8 + Math.random() * 4);

    //------------------------------
    // Twinkle
    //------------------------------

    this.twinkle =
      Math.random() *
      Math.PI *
      2;

    this.twinkleSpeed =
      0.01 +
      Math.random() * 0.025;

    //------------------------------
    // Trail
    //------------------------------

    this.trail = [];

    this.maxTrail = 24;
    //--------------------------------
// Orbit State
//--------------------------------

this.orbited = false;

  }

  //--------------------------------
  // UPDATE
  //--------------------------------

  update(world, camera) {

    //--------------------------
    // Friction
    //--------------------------

    this.vx *= 0.997;
    this.vy *= 0.997;

    //--------------------------
    // Speed Limit
    //--------------------------

    const maxSpeed = 10;

    const speed =
      Math.hypot(
        this.vx,
        this.vy
      );

    if (speed > maxSpeed) {

      this.vx =
        this.vx /
        speed *
        maxSpeed;

      this.vy =
        this.vy /
        speed *
        maxSpeed;

    }

    //--------------------------
    // Move
    //--------------------------

    this.x += this.vx;
    this.y += this.vy;

    //--------------------------
    // Trail
    //--------------------------

    this.trail.push({

      x: this.x,
      y: this.y,

    });

    if (
      this.trail.length >
      this.maxTrail
    ) {

      this.trail.shift();

    }

    //--------------------------
    // Twinkle
    //--------------------------

    this.twinkle +=
      this.twinkleSpeed;

    //--------------------------
    // Infinite Streaming
    //--------------------------

    const STREAM_DISTANCE = 4500;

    const dx =
      this.x -
      camera.x;

    const dy =
      this.y -
      camera.y;

    if (

      Math.abs(dx) >
        STREAM_DISTANCE ||

      Math.abs(dy) >
        STREAM_DISTANCE

    ) {

      const angle =
        Math.random() *
        Math.PI *
        2;

      const distance =

        STREAM_DISTANCE *

        (

          0.85 +

          Math.random() *

          0.3

        );

      this.x =

        camera.x +

        Math.cos(angle) *

        distance;

      this.y =

        camera.y +

        Math.sin(angle) *

        distance;

      //----------------------
      // Random Velocity
      //----------------------

      this.vx =
        (Math.random() - 0.5) *
        1.5;

      this.vy =
        (Math.random() - 0.5) *
        1.5;

      //----------------------
      // Clear Trail
      //----------------------

      this.trail.length = 0;

//--------------------------------
// Reset Orbit State
//--------------------------------

this.orbited = false;

    }

  }

  //--------------------------------
  // DRAW
  //--------------------------------

  draw(ctx, world, camera) {

    if (

      !world.isVisible(
        this,
        camera,
        120
      )

    ) {

      return;

    }

    const p =
      world.worldToScreen(
        this.x,
        this.y,
        camera
      );

    const alpha =

      this.alpha *

      (

        0.75 +

        Math.sin(
          this.twinkle
        ) *

        0.25

      );

    //--------------------------
    // Trail
    //--------------------------

    for (

      let i = 0;

      i < this.trail.length;

      i++

    ) {

      const t =
        world.worldToScreen(

          this.trail[i].x,

          this.trail[i].y,

          camera

        );

      const k =
        i /
        this.trail.length;

      ctx.beginPath();

      ctx.fillStyle =
        this.hexToRGBA(
          this.color,
          k * 0.45
        );

      ctx.arc(

        t.x,

        t.y,

        this.radius * k,

        0,

        Math.PI * 2

      );

      ctx.fill();

    }

    //--------------------------
    // Halo
    //--------------------------

    ctx.save();

    ctx.beginPath();

    ctx.fillStyle =
      this.hexToRGBA(
        this.color,
        alpha * 0.15
      );

    ctx.arc(

      p.x,

      p.y,

      this.radius * 3.5,

      0,

      Math.PI * 2

    );

    ctx.fill();

    ctx.restore();

    // ===== PHẦN 2/2 TIẾP TỪ ĐÂY =====
        //--------------------------
    // Main Glow
    //--------------------------

    ctx.save();

    ctx.shadowBlur =
      this.glow;

    ctx.shadowColor =
      this.color;

    ctx.beginPath();

    ctx.fillStyle =
      this.hexToRGBA(
        this.color,
        alpha
      );

    ctx.arc(
      p.x,
      p.y,
      this.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

    //--------------------------
    // Bright Core
    //--------------------------

    ctx.save();

    ctx.beginPath();

    ctx.fillStyle =
      "rgba(255,255,255,0.9)";

    ctx.arc(
      p.x,
      p.y,
      this.radius * 0.35,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

    //--------------------------
    // Cross Star
    //--------------------------

    if (this.radius > 2.8) {

      ctx.save();

      ctx.strokeStyle =
        this.hexToRGBA(
          "#ffffff",
          alpha * 0.45
        );

      ctx.lineWidth = 1;

      ctx.shadowBlur =
        this.glow;

      ctx.shadowColor =
        "#ffffff";

      ctx.beginPath();

      ctx.moveTo(
        p.x -
          this.radius * 3,
        p.y
      );

      ctx.lineTo(
        p.x +
          this.radius * 3,
        p.y
      );

      ctx.moveTo(
        p.x,
        p.y -
          this.radius * 3
      );

      ctx.lineTo(
        p.x,
        p.y +
          this.radius * 3
      );

      ctx.stroke();

      ctx.restore();

    }

  }

  //--------------------------------
  // HEX -> RGBA
  //--------------------------------

  hexToRGBA(
    hex,
    alpha
  ) {

    const r = parseInt(
      hex.slice(1, 3),
      16
    );

    const g = parseInt(
      hex.slice(3, 5),
      16
    );

    const b = parseInt(
      hex.slice(5, 7),
      16
    );

    return `rgba(${r},${g},${b},${alpha})`;

  }

}