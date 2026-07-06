export default class Skybox {

  constructor(width, height) {

    this.width = width;
    this.height = height;

    this.time = 0;

    //--------------------------------
    // Nebula
    //--------------------------------

    this.nebulas = [];

    for (let i = 0; i < 10; i++) {

      this.nebulas.push({

        x: (Math.random() - 0.5) * 50000,
        y: (Math.random() - 0.5) * 50000,

        radius:
          700 +
          Math.random() * 1800,

        alpha:
          0.04 +
          Math.random() * 0.08,

        color: [

          "#7a4dff",
          "#ff5bcf",
          "#52b6ff",
          "#6b8cff",
          "#c96cff",

        ][
          Math.floor(Math.random() * 5)
        ],

      });

    }

    //--------------------------------
    // Galaxy
    //--------------------------------

    this.galaxies = [];

    for (let i = 0; i < 3; i++) {

      this.galaxies.push({

        x: (Math.random() - 0.5) * 40000,
        y: (Math.random() - 0.5) * 40000,

        radius:
          250 +
          Math.random() * 450,

        rotation:
          Math.random() * Math.PI * 2,

      });

    }

    //--------------------------------
    // Planets
    //--------------------------------

    this.planets = [];

    for (let i = 0; i < 6; i++) {

      this.planets.push({

        x: (Math.random() - 0.5) * 45000,
        y: (Math.random() - 0.5) * 45000,

        radius:
          80 +
          Math.random() * 220,

        color: [

          "#3949ff",
          "#7d5fff",
          "#6ec6ff",
          "#8d6e63",
          "#90caf9",

        ][
          Math.floor(Math.random() * 5)
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

    this.time += 0.002;

  }

  //--------------------------------

  draw(ctx, world, camera) {

    //--------------------------------
    // Base Gradient
    //--------------------------------

    const g = ctx.createLinearGradient(
      0,
      0,
      0,
      this.height
    );

    g.addColorStop(0, "#05081d");
    g.addColorStop(0.25, "#08112b");
    g.addColorStop(0.6, "#050814");
    g.addColorStop(1, "#010104");

    ctx.fillStyle = g;
    ctx.fillRect(
      0,
      0,
      this.width,
      this.height
    );

    //--------------------------------
    // Moving Nebula
    //--------------------------------

    this.nebulas.forEach((n) => {

      const p =
        world.worldToScreen(

          n.x,
          n.y,

          {

            x: camera.x * 0.12,
            y: camera.y * 0.12,

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
        0.4,
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
    // Spiral Galaxies
    //--------------------------------

    this.galaxies.forEach((g) => {

      const p =
        world.worldToScreen(

          g.x,
          g.y,

          {
            x: camera.x * 0.08,
            y: camera.y * 0.08,
          }

        );

      ctx.save();

      ctx.translate(
        p.x,
        p.y
      );

      ctx.rotate(
        g.rotation + this.time * 2
      );

      //----------------------------
      // Core
      //----------------------------

      const core =
        ctx.createRadialGradient(
          0,
          0,
          0,
          0,
          0,
          g.radius
        );

      core.addColorStop(
        0,
        "rgba(255,255,255,0.95)"
      );

      core.addColorStop(
        0.15,
        "rgba(255,240,180,0.9)"
      );

      core.addColorStop(
        0.4,
        "rgba(180,150,255,0.35)"
      );

      core.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = core;

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        g.radius,
        0,
        Math.PI * 2
      );

      ctx.fill();

      //----------------------------
      // Spiral Arms
      //----------------------------

      for (let arm = 0; arm < 4; arm++) {

        ctx.beginPath();

        for (let a = 0; a < 18; a++) {

          const angle =
            arm *
              Math.PI /
              2 +
            a * 0.35;

          const r =
            a *
            g.radius *
            0.06;

          const x =
            Math.cos(angle) * r;

          const y =
            Math.sin(angle) * r;

          if (a === 0)
            ctx.moveTo(x, y);
          else
            ctx.lineTo(x, y);

        }

        ctx.strokeStyle =
          "rgba(255,255,255,0.18)";

        ctx.lineWidth = 3;

        ctx.shadowBlur = 18;
        ctx.shadowColor = "#ffffff";

        ctx.stroke();

      }

      ctx.restore();

    });

    //--------------------------------
    // Planets
    //--------------------------------

    this.planets.forEach((planet) => {

      const p =
        world.worldToScreen(

          planet.x,
          planet.y,

          {

            x: camera.x * 0.05,
            y: camera.y * 0.05,

          }

        );

      const grad =
        ctx.createRadialGradient(

          p.x -
            planet.radius * 0.3,

          p.y -
            planet.radius * 0.3,

          5,

          p.x,
          p.y,

          planet.radius

        );

      grad.addColorStop(
        0,
        "#ffffff"
      );

      grad.addColorStop(
        0.2,
        planet.color
      );

      grad.addColorStop(
        1,
        "#050505"
      );

      ctx.save();

      ctx.shadowBlur = 80;
      ctx.shadowColor =
        planet.color;

      ctx.beginPath();

      ctx.fillStyle = grad;

      ctx.arc(

        p.x,
        p.y,

        planet.radius,

        0,

        Math.PI * 2

      );

      ctx.fill();

      ctx.restore();

    });

    //--------------------------------
    // Milky Way Band
    //--------------------------------

    ctx.save();

    ctx.translate(
      this.width / 2,
      this.height / 2
    );

    ctx.rotate(-0.6);

    const band =
      ctx.createLinearGradient(
        0,
        -250,
        0,
        250
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
      -2500,
      -180,
      5000,
      360
    );

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