export default class Dust {
  constructor(count = 6000) {
    this.items = [];

    const size = 20000;

    for (let i = 0; i < count; i++) {
      this.items.push({
        x:
          (Math.random() - 0.5) *
          size,
        y:
          (Math.random() - 0.5) *
          size,
        r:
          Math.random() * 1.5 +
          0.3,
      });
    }
  }

  update() {}

  draw(ctx, world, camera) {
    ctx.fillStyle =
      "rgba(255,255,255,.08)";

    this.items.forEach((d) => {
      const p =
        world.worldToScreen(
          d.x,
          d.y,
          camera
        );

      if (
        p.x < 0 ||
        p.x > world.width ||
        p.y < 0 ||
        p.y > world.height
      )
        return;

      ctx.beginPath();
      ctx.arc(
        p.x,
        p.y,
        d.r,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  }
}