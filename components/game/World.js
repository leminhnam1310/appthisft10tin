export default class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    // Kích thước map (world)
    this.size = 100000;
  }

  //----------------------------------
  // Resize
  //----------------------------------

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  //----------------------------------
  // Screen -> World
  //----------------------------------

  screenToWorld(screenX, screenY, camera) {
    return {
      x: camera.x + screenX - this.width / 2,
      y: camera.y + screenY - this.height / 2,
    };
  }

  //----------------------------------
  // World -> Screen
  //----------------------------------

  worldToScreen(worldX, worldY, camera) {
    return {
      x: worldX - camera.x + this.width / 2,
      y: worldY - camera.y + this.height / 2,
    };
  }

  //----------------------------------
  // Infinite Wrap
  //----------------------------------

  wrap(obj) {
    const limit = this.size / 2;

    if (obj.x > limit) obj.x = -limit;
    else if (obj.x < -limit) obj.x = limit;

    if (obj.y > limit) obj.y = -limit;
    else if (obj.y < -limit) obj.y = limit;
  }

  //----------------------------------
  // Visible
  //----------------------------------

  isVisible(a, b, c, d) {
    let x, y, radius, camera;

    // object version
    if (typeof a === "object") {
      x = a.x;
      y = a.y;
      radius = c ?? 0;
      camera = b;
    } else {
      x = a;
      y = b;
      radius = c ?? 0;
      camera = d;
    }

    const p = this.worldToScreen(x, y, camera);

    return (
      p.x >= -radius &&
      p.x <= this.width + radius &&
      p.y >= -radius &&
      p.y <= this.height + radius
    );
  }

  //----------------------------------
  // Distance
  //----------------------------------

  distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  //----------------------------------
  // Angle
  //----------------------------------

  angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }

  //----------------------------------
  // Random Position
  //----------------------------------

  randomPosition() {
    const half = this.size / 2;

    return {
      x: (Math.random() - 0.5) * this.size,
      y: (Math.random() - 0.5) * this.size,
    };
  }

  //----------------------------------
  // Clamp
  //----------------------------------  

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}