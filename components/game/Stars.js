export default class Stars {

  constructor(count = 25000) {

    this.count = count;

    this.layers = [
      [],
      [],
      [],
      []
    ];

    //--------------------------------
    // Generate Stars
    //--------------------------------

    const worldSize = 100000;

    for (let i = 0; i < this.count; i++) {

      const layer =
        Math.floor(Math.random() * 4);

      const size =
        layer === 0
          ? 0.5 + Math.random() * 0.7
          : layer === 1
          ? 0.8 + Math.random() * 1.2
          : layer === 2
          ? 1.3 + Math.random() * 1.6
          : 2 + Math.random() * 2.5;

      const colors = [
        "#ffffff",
        "#ffe082",
        "#9fd7ff",
        "#ffd6ff",
        "#b8c6ff",
      ];

      this.layers[layer].push({

        x:
          (Math.random() - 0.5) *
          worldSize,

        y:
          (Math.random() - 0.5) *
          worldSize,

        radius: size,

        alpha:
          0.25 +
          Math.random() * 0.75,

        twinkle:
          Math.random() * 6,

        speed:
          0.003 +
          Math.random() * 0.01,

        glow:
          size * 8,

        color:
          colors[
            Math.floor(
              Math.random() *
              colors.length
            )
          ]

      });

    }

    this.time = 0;

  }

  //--------------------------------

  update() {

    this.time += 0.01;

  }

  //--------------------------------

  draw(ctx, world, camera) {

    const parallax = [
      0.04,
      0.08,
      0.14,
      0.22,
    ];

    for (
      let layer = 0;
      layer < this.layers.length;
      layer++
    ) {

      const stars =
        this.layers[layer];

      const factor =
        parallax[layer];

      for (
        let i = 0;
        i < stars.length;
        i++
      ) {

        const s = stars[i];

        const p =
          world.worldToScreen(

            s.x,
            s.y,

            {

              x:
                camera.x *
                factor,

              y:
                camera.y *
                factor,

            }

          );

        if (

          p.x < -20 ||

          p.x >

          world.width + 20 ||

          p.y < -20 ||

          p.y >

          world.height + 20

        ) {

          continue;

        }

        const alpha =

          s.alpha *

          (

            0.75 +

            Math.sin(

              this.time *

              s.speed *

              100 +

              s.twinkle

            ) *

            0.25

          );

        ctx.save();

        ctx.shadowBlur =
          s.glow;

        ctx.shadowColor =
          s.color;

        ctx.beginPath();

        ctx.fillStyle =
          this.hexToRGBA(
            s.color,
            alpha
          );

        ctx.arc(

          p.x,

          p.y,

          s.radius,

          0,

          Math.PI * 2

        );

        ctx.fill();
                //--------------------------------
        // Bright Giant Star
        //--------------------------------

        if (s.radius > 2.3) {

          ctx.beginPath();

          ctx.fillStyle =
            this.hexToRGBA(
              "#ffffff",
              alpha * 0.25
            );

          ctx.arc(
            p.x,
            p.y,
            s.radius * 3,
            0,
            Math.PI * 2
          );

          ctx.fill();

          //--------------------------------
          // Sparkle
          //--------------------------------

          ctx.strokeStyle =
            this.hexToRGBA(
              "#ffffff",
              alpha * 0.6
            );

          ctx.lineWidth = 1;

          ctx.beginPath();

          ctx.moveTo(
            p.x - s.radius * 5,
            p.y
          );

          ctx.lineTo(
            p.x + s.radius * 5,
            p.y
          );

          ctx.moveTo(
            p.x,
            p.y - s.radius * 5
          );

          ctx.lineTo(
            p.x,
            p.y + s.radius * 5
          );

          ctx.stroke();

        }

        //--------------------------------
        // Rare Flash
        //--------------------------------

        if (
          Math.sin(
            this.time * 2 +
            s.twinkle * 8
          ) > 0.995
        ) {

          ctx.beginPath();

          ctx.fillStyle =
            this.hexToRGBA(
              "#ffffff",
              0.9
            );

          ctx.arc(
            p.x,
            p.y,
            s.radius * 5,
            0,
            Math.PI * 2
          );

          ctx.fill();

        }

        ctx.restore();

      }

    }

  }

  //--------------------------------
  // HEX → RGBA
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