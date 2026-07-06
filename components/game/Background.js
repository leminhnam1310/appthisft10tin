export default class Background {

  constructor(width, height) {

    this.width = width;
    this.height = height;

    this.time = 0;

    //--------------------------------
    // Nebula Clouds
    //--------------------------------

    this.nebulas = [];

    const colors = [
      "#7a4dff",
      "#ff5bcf",
      "#52b6ff",
      "#7fd0ff",
      "#9f6bff",
    ];

    for (let i = 0; i < 14; i++) {

      this.nebulas.push({

        x: (Math.random() - 0.5) * 45000,
        y: (Math.random() - 0.5) * 45000,

        radius:
          700 +
          Math.random() * 1600,

        alpha:
          0.03 +
          Math.random() * 0.07,

        color:
          colors[
            Math.floor(
              Math.random() *
              colors.length
            )
          ],

      });

    }

  }

  //--------------------------------

  resize(width, height) {

    this.width = width;
    this.height = height;

  }

  //--------------------------------

  update() {

    this.time += 0.003;

  }

  //--------------------------------

  draw(ctx, world, camera) {

    //--------------------------------
    // Deep Space Gradient
    //--------------------------------

    const g =
      ctx.createRadialGradient(

        this.width / 2,
        this.height / 2,
        0,

        this.width / 2,
        this.height / 2,

        Math.max(
          this.width,
          this.height
        )

      );

    g.addColorStop(0, "#071325");
    g.addColorStop(0.25, "#050a18");
    g.addColorStop(0.55, "#02050f");
    g.addColorStop(0.85, "#010205");
    g.addColorStop(1, "#000000");

    ctx.fillStyle = g;

    ctx.fillRect(
      0,
      0,
      this.width,
      this.height
    );

    //--------------------------------
    // Milky Way Band
    //--------------------------------

    ctx.save();

    ctx.translate(
      this.width / 2,
      this.height / 2
    );

    ctx.rotate(-0.55);

    const band =
      ctx.createLinearGradient(
        0,
        -260,
        0,
        260
      );

    band.addColorStop(
      0,
      "rgba(255,255,255,0)"
    );

    band.addColorStop(
      0.5,
      "rgba(255,255,255,0.05)"
    );

    band.addColorStop(
      1,
      "rgba(255,255,255,0)"
    );

    ctx.fillStyle = band;

    ctx.fillRect(
      -5000,
      -180,
      10000,
      360
    );

    ctx.restore();

    //--------------------------------
    // Nebula
    //--------------------------------

    this.nebulas.forEach((n) => {

      const p =
        world.worldToScreen(

          n.x,
          n.y,

          {

            x: camera.x * 0.08,
            y: camera.y * 0.08,

          }

        );

      const grad =
        ctx.createRadialGradient(

          p.x,
          p.y,
          0,

          p.x,
          p.y,

          n.radius

        );

      grad.addColorStop(
        0,
        this.hexToRGBA(
          n.color,
          n.alpha
        )
      );

      grad.addColorStop(
        0.35,
        this.hexToRGBA(
          n.color,
          n.alpha * 0.4
        )
      );

      grad.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = grad;

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        n.radius,
        0,
        Math.PI * 2
      );

      ctx.fill();

    });

    //--------------------------------
    // Tiny Dust
    //--------------------------------

    ctx.save();

    for (let i = 0; i < 120; i++) {

      const x =
        (i * 137.5 +
          this.time * 200) %
        this.width;

      const y =
        (i * 89.3) %
        this.height;

      ctx.beginPath();

      ctx.fillStyle =
        "rgba(255,255,255,0.02)";

      ctx.arc(
        x,
        y,
        2 + (i % 3),
        0,
        Math.PI * 2
      );

      ctx.fill();

    }

    ctx.restore();

  }

  //--------------------------------

  hexToRGBA(hex, alpha) {

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