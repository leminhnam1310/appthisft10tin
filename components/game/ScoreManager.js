export default class ScoreManager {

  constructor() {

    //--------------------------------
    // Score
    //--------------------------------

    this.score = 0;

    this.best =
      Number(
        localStorage.getItem(
          "gravity_best_score"
        )
      ) || 0;

    //--------------------------------
    // Combo
    //--------------------------------

    this.combo = 1;

    this.comboTimer = 0;

    this.comboDuration = 180;

    //--------------------------------
    // Orbit
    //--------------------------------

    this.orbitCount = 0;

    //--------------------------------
    // Tick
    //--------------------------------

    this.tick = 0;

    this.scoreInterval = 30;

    //--------------------------------
    // Popup
    //--------------------------------

    this.popups = [];

  }

  //--------------------------------
  // Orbit
  //--------------------------------

  resetOrbitCount() {

    this.orbitCount = 0;

  }

  addOrbit() {

    this.orbitCount++;

  }

  //--------------------------------
  // Add Score
  //--------------------------------

  add(amount, x = 0, y = 0) {

    if (amount <= 0)
      return;

    const gain =
      Math.round(
        amount *
        this.combo
      );

    this.score += gain;

    if (
      this.score >
      this.best
    ) {

      this.best =
        this.score;

      localStorage.setItem(

        "gravity_best_score",

        this.best

      );

    }

    //--------------------------------
    // Combo
    //--------------------------------

    this.combo += 0.05;

    if (
      this.combo > 8
    ) {

      this.combo = 8;

    }

    this.comboTimer =
      this.comboDuration;

    //--------------------------------
    // Popup
    //--------------------------------

    this.popups.push({

      x,

      y,

      value: gain,

      alpha: 1,

      vy: -0.45,

      scale: 1,

    });

  }

  //--------------------------------
  // Update
  //--------------------------------

  update(active) {

    //--------------------------------
    // Gravity OFF
    //--------------------------------

    if (!active) {

      this.tick = 0;

      this.comboTimer = 0;

      this.combo *= 0.992;

      if (
        this.combo < 1
      ) {

        this.combo = 1;

      }

    }

    //--------------------------------
    // Gravity ON
    //--------------------------------

    else {

      this.tick++;

      if (

        this.tick >=
        this.scoreInterval

      ) {

        this.tick = 0;

        if (

          this.orbitCount > 0

        ) {

          this.add(
            this.orbitCount
          );

        }

      }

      if (

        this.comboTimer > 0

      ) {

        this.comboTimer--;

      }

    }

    //--------------------------------
    // Popup Update
    //--------------------------------

    for (const p of this.popups) {

      p.y += p.vy;

      p.alpha -= 0.015;

      p.scale += 0.01;

    }

    this.popups =
      this.popups.filter(

        p => p.alpha > 0

      );

  }
    //--------------------------------
  // Draw Floating Score
  //--------------------------------

  drawWorld(ctx, world, camera) {

    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 18px monospace";

    for (const p of this.popups) {

      const pos =
        world.worldToScreen(
          p.x,
          p.y,
          camera
        );

      ctx.globalAlpha =
        p.alpha;

      ctx.save();

      ctx.translate(
        pos.x,
        pos.y
      );

      ctx.scale(
        p.scale,
        p.scale
      );

      ctx.fillStyle =
        "#ffe85a";

      ctx.shadowBlur = 25;
      ctx.shadowColor =
        "#ffe85a";

      ctx.fillText(

        "+" + p.value,

        0,

        0

      );

      ctx.restore();

    }

    ctx.restore();

  }

  //--------------------------------
  // HUD
  //--------------------------------

  drawHUD(ctx) {

    ctx.save();

    //----------------------------
    // Panel
    //----------------------------

    ctx.fillStyle =
      "rgba(10,15,22,.65)";

    ctx.strokeStyle =
      "rgba(120,220,255,.35)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.roundRect(
      15,
      15,
      300,
      145,
      12
    );

    ctx.fill();

    ctx.stroke();

    //----------------------------
    // Score
    //----------------------------

    ctx.font =
      "bold 30px Orbitron, monospace";

    ctx.fillStyle =
      "#ffffff";

    ctx.shadowBlur = 18;
    ctx.shadowColor =
      "#7cc7ff";

    ctx.fillText(

      this.score,

      30,

      48

    );

    ctx.shadowBlur = 0;

    //----------------------------
    // Best
    //----------------------------

    ctx.font =
      "16px monospace";

    ctx.fillStyle =
      "#7fd9ff";

    ctx.fillText(

      `BEST : ${this.best}`,

      30,

      74

    );

    //----------------------------
    // Combo
    //----------------------------

    ctx.fillStyle =
      "#ffd85a";

    ctx.fillText(

      `COMBO : x${this.combo.toFixed(1)}`,

      30,

      98

    );

    //----------------------------
    // Orbit
    //----------------------------

    ctx.fillStyle =
      "#8ffff4";

    ctx.fillText(

      `ORBIT : ${this.orbitCount}`,

      30,

      122

    );
    //----------------------------
    // Orbit Progress
    //----------------------------

    const percent =
      Math.min(
        this.orbitCount / 40,
        1
      );

    ctx.fillStyle =
      "rgba(255,255,255,.12)";

    ctx.fillRect(
      30,
      132,
      250,
      10
    );

    const gradient =
      ctx.createLinearGradient(
        30,
        0,
        280,
        0
      );

    gradient.addColorStop(
      0,
      "#4aa8ff"
    );

    gradient.addColorStop(
      0.5,
      "#68e3ff"
    );

    gradient.addColorStop(
      1,
      "#9dfff5"
    );

    ctx.fillStyle =
      gradient;

    ctx.fillRect(
      30,
      132,
      250 * percent,
      10
    );

    ctx.restore();

  }
  gameOver() {

  this.score = 0;

  this.combo = 1;

  this.comboTimer = 0;

  this.orbitCount = 0;

  this.tick = 0;

  this.popups = [];

}

}