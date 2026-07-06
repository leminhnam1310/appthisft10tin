export default class Gravity {

  constructor() {

    //--------------------------------
    // State
    //--------------------------------

    this.active = false;

    //--------------------------------
    // Position
    //--------------------------------

    this.x = 0;
    this.y = 0;

    //--------------------------------
    // Gravity Settings
    //--------------------------------

    // phạm vi hút
    this.radius = 420;

    // event horizon
    this.eventRadius = 26;

    // lực hút
    this.power = 1.55;

    // lực xoáy
    this.spin = 0.42;

    // vùng giảm tốc
    this.dragRadius = 70;

    //--------------------------------
    // Animation
    //--------------------------------

    this.rotation = 0;

    this.diskRotation = 0;

    this.diskRotation2 = 0;

    this.glowPulse = 0;

    this.lensRotation = 0;

    //--------------------------------
    // Shockwave
    //--------------------------------

    this.shockwave = false;

    this.shockRadius = 0;

    this.maxShockRadius = 650;

    this.shockSpeed = 18;

    this.shockPower = 12;

    //--------------------------------
    // Plasma Streams
    //--------------------------------

    this.streams = [];

    for (let i = 0; i < 60; i++) {

      this.streams.push({

        angle: Math.random() * Math.PI * 2,

        radius:
          this.eventRadius +
          10 +
          Math.random() * 70,

        speed:
          0.004 +
          Math.random() * 0.02,

        size:
          1 +
          Math.random() * 3,

        alpha:
          0.2 +
          Math.random() * 0.6,

        color:
          Math.random() > 0.5
            ? "#8fd8ff"
            : "#6ea8ff"

      });

    }

  }

  //--------------------------------
  // Position
  //--------------------------------

  setPosition(x, y) {

    this.x = x;
    this.y = y;

  }

  //--------------------------------
  // Activate
  //--------------------------------

  activate() {

    this.active = true;

  }

  //--------------------------------
  // Deactivate
  //--------------------------------

  deactivate() {

    if (this.active) {

      this.triggerShockwave();

    }

    this.active = false;

  }

  //--------------------------------
  // Shockwave
  //--------------------------------

  triggerShockwave() {

    this.shockwave = true;

    this.shockRadius = 0;

  }

  //--------------------------------
  // Update
  //--------------------------------

  update() {

    //--------------------------------
    // Rotation
    //--------------------------------

    this.rotation += 0.018;

    this.diskRotation += 0.006;

    this.diskRotation2 -= 0.0035;

    this.lensRotation += 0.0015;

    //--------------------------------
    // Glow Pulse
    //--------------------------------

    this.glowPulse += 0.05;

    //--------------------------------
    // Plasma Motion
    //--------------------------------

    for (const s of this.streams) {

      s.angle += s.speed;

      s.radius +=
        Math.sin(
          this.glowPulse +
          s.angle
        ) * 0.12;

    }

    //--------------------------------
    // Shockwave
    //--------------------------------

    if (this.shockwave) {

      this.shockRadius += this.shockSpeed;

      if (

        this.shockRadius >=

        this.maxShockRadius

      ) {

        this.shockwave = false;

      }

    }

  }
    //--------------------------------
  // Apply Gravity
  //--------------------------------

  apply(p) {

    //--------------------------------
    // Gravity
    //--------------------------------

    if (this.active) {

      const dx = this.x - p.x;
      const dy = this.y - p.y;

      const dist = Math.hypot(dx, dy);

      if (dist > 1 && dist < this.radius) {

        //--------------------------------
        // Direction
        //--------------------------------

        const nx = dx / dist;
        const ny = dy / dist;

        //--------------------------------
        // Gravity Curve
        //--------------------------------

        const t =
          1 - dist / this.radius;

        // Lực hút tăng dần khi gần tâm
        const pull =
          this.power *
          (
            0.08 +
            Math.pow(t, 0.75) * 1.25
          );

        //--------------------------------
        // Pull
        //--------------------------------

        p.vx += nx * pull;
        p.vy += ny * pull;

        //--------------------------------
        // Orbit
        //--------------------------------

        // gần tâm thì xoáy mạnh hơn
        const orbit =
          pull *
          (
            1.5 +
            t * 5
          );

        p.vx +=
          -ny * orbit;

        p.vy +=
           nx * orbit;

        //--------------------------------
        // Stable Orbit
        //--------------------------------

        if (
          dist > 60 &&
          dist < 190
        ) {

          const keep =
            (190 - dist) / 130;

          p.vx +=
            -ny *
            keep *
            0.12;

          p.vy +=
             nx *
             keep *
             0.12;

        }

        //--------------------------------
        // Inner Cushion
        //--------------------------------

        // Không cho rơi vào tâm
        if (
          dist <
          this.eventRadius * 2.5
        ) {

          const repel =
            (
              1 -
              dist /
              (
                this.eventRadius * 2.5
              )
            ) * 0.9;

          p.vx -=
            nx * repel;

          p.vy -=
            ny * repel;

        }

        //--------------------------------
        // Orbit Lock
        //--------------------------------

        // Càng gần tâm càng khóa quỹ đạo
        if (
          dist <
          this.eventRadius * 2.2
        ) {

          p.vx *= 0.985;
          p.vy *= 0.985;

          const orbitBoost = 0.45;

          p.vx +=
            -ny *
            orbitBoost;

          p.vy +=
             nx *
             orbitBoost;

        }

        //--------------------------------
        // Drag
        //--------------------------------

        if (
          dist <
          this.dragRadius
        ) {

          p.vx *= 0.996;
          p.vy *= 0.996;

        }

        //--------------------------------
        // Speed Limit
        //--------------------------------

        const speed =
          Math.hypot(
            p.vx,
            p.vy
          );

        const maxSpeed = 8;

        if (
          speed >
          maxSpeed
        ) {

          p.vx =
            p.vx /
            speed *
            maxSpeed;

          p.vy =
            p.vy /
            speed *
            maxSpeed;

        }

      }

    }

    //--------------------------------
    // Shockwave
    //--------------------------------

    if (this.shockwave) {

      const dx =
        p.x - this.x;

      const dy =
        p.y - this.y;

      const dist =
        Math.hypot(dx, dy);

      if (

        dist >

        this.shockRadius - 18 &&

        dist <

        this.shockRadius + 18

      ) {

        const nx =
          dx / dist;

        const ny =
          dy / dist;

        p.vx +=
          nx *
          this.shockPower;

        p.vy +=
          ny *
          this.shockPower;

      }

    }

  }
    //--------------------------------
  // Draw
  //--------------------------------

  draw(ctx, world, camera) {

    this.update();

    const pos =
      world.worldToScreen(
        this.x,
        this.y,
        camera
      );

    //--------------------------------
    // Shockwave
    //--------------------------------

    if (this.shockwave) {

      ctx.save();

      ctx.beginPath();

      ctx.arc(
        pos.x,
        pos.y,
        this.shockRadius,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        `rgba(
120,
190,
255,
${
1 -
this.shockRadius /
this.maxShockRadius
}
)`;

      ctx.lineWidth = 3;

      ctx.shadowBlur = 35;
      ctx.shadowColor = "#7cc7ff";

      ctx.stroke();

      ctx.restore();

    }

    //--------------------------------
    // Outer Glow
    //--------------------------------

    ctx.save();

    const outerGlow =
      ctx.createRadialGradient(
        pos.x,
        pos.y,
        0,
        pos.x,
        pos.y,
        170
      );

    outerGlow.addColorStop(
      0,
      "rgba(80,180,255,0.20)"
    );

    outerGlow.addColorStop(
      0.45,
      "rgba(50,130,255,0.08)"
    );

    outerGlow.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle = outerGlow;

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y,
      170,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

    //--------------------------------
    // Accretion Disk
    //--------------------------------

    if (this.active) {

      ctx.save();

      ctx.translate(
        pos.x,
        pos.y
      );

      ctx.rotate(
        this.rotation
      );

      for (
        let i = 0;
        i < 14;
        i++
      ) {

        const r =
          42 +
          i * 7;

        const alpha =
          0.24 -
          i * 0.012;

        ctx.beginPath();

        ctx.strokeStyle =
          `rgba(
120,
210,
255,
${alpha}
)`;

        ctx.lineWidth =
          2 +
          Math.sin(
            this.rotation * 4 +
            i
          ) * 0.35;

        ctx.shadowBlur =
          18 +
          i;

        ctx.shadowColor =
          "#6fd7ff";

        ctx.ellipse(
          0,
          0,
          r,
          r * 0.58,
          i * 0.22,
          0,
          Math.PI * 2
        );

        ctx.stroke();

      }

      ctx.restore();

    }

    //--------------------------------
    // Plasma Streams
    //--------------------------------

    if (this.active) {

      ctx.save();

      ctx.translate(
        pos.x,
        pos.y
      );

      ctx.rotate(
        -this.rotation * 1.8
      );

      for (
        let i = 0;
        i < 10;
        i++
      ) {

        const a =
          i *
          Math.PI /
          5;

        const len =
          70 +
          Math.sin(
            this.rotation * 3 +
            i
          ) * 18;

        ctx.beginPath();

        ctx.moveTo(

          Math.cos(a) * 28,

          Math.sin(a) * 16

        );

        ctx.lineTo(

          Math.cos(a) * len,

          Math.sin(a) *
            len *
            0.45

        );

        ctx.strokeStyle =
          "rgba(120,220,255,.16)";

        ctx.lineWidth = 2;

        ctx.shadowBlur = 18;
        ctx.shadowColor = "#7cc7ff";

        ctx.stroke();

      }

      ctx.restore();

    }
        //--------------------------------
    // Gravitational Lensing
    //--------------------------------

    ctx.save();

    const lens =
      ctx.createRadialGradient(
        pos.x,
        pos.y,
        this.eventRadius * 0.8,
        pos.x,
        pos.y,
        this.eventRadius * 5
      );

    lens.addColorStop(
      0,
      "rgba(255,255,255,0)"
    );

    lens.addColorStop(
      0.35,
      "rgba(120,200,255,0.05)"
    );

    lens.addColorStop(
      0.6,
      "rgba(180,230,255,0.12)"
    );

    lens.addColorStop(
      1,
      "rgba(255,255,255,0)"
    );

    ctx.fillStyle = lens;

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y,
      this.eventRadius * 5,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

    //--------------------------------
    // Photon Ring
    //--------------------------------

    ctx.save();

    const pulse =
      0.75 +
      Math.sin(
        this.glowPulse * 2
      ) * 0.25;

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y,
      this.eventRadius + 4,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle =
      `rgba(
190,
240,
255,
${0.7 * pulse}
)`;

    ctx.lineWidth = 2.2;

    ctx.shadowBlur = 45;

    ctx.shadowColor =
      "#9ee7ff";

    ctx.stroke();

    ctx.restore();

    //--------------------------------
    // Secondary Photon Ring
    //--------------------------------

    ctx.save();

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y,
      this.eventRadius + 8,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle =
      "rgba(120,180,255,.25)";

    ctx.lineWidth = 1.2;

    ctx.shadowBlur = 25;

    ctx.shadowColor =
      "#7cc7ff";

    ctx.stroke();

    ctx.restore();

    //--------------------------------
    // Event Horizon
    //--------------------------------

    ctx.save();

    const horizon =
      ctx.createRadialGradient(

        pos.x,
        pos.y,
        0,

        pos.x,
        pos.y,

        this.eventRadius

      );

    horizon.addColorStop(
      0,
      "#000000"
    );

    horizon.addColorStop(
      0.7,
      "#030303"
    );

    horizon.addColorStop(
      1,
      "#101010"
    );

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y,
      this.eventRadius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      horizon;

    ctx.shadowBlur =
      80 +
      Math.sin(
        this.glowPulse
      ) * 8;

    ctx.shadowColor =
      "#55bfff";

    ctx.fill();

    ctx.restore();

    //--------------------------------
    // Core Bloom
    //--------------------------------

    ctx.save();

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y,
      8,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      "#bff6ff";

    ctx.shadowBlur =
      55 +
      Math.sin(
        this.glowPulse * 3
      ) * 10;

    ctx.shadowColor =
      "#8fd8ff";

    ctx.fill();

    ctx.restore();

    //--------------------------------
    // Tiny Core
    //--------------------------------

    ctx.save();

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y,
      2.5,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      "#ffffff";

    ctx.shadowBlur = 18;

    ctx.shadowColor =
      "#ffffff";

    ctx.fill();

    ctx.restore();

  }

}