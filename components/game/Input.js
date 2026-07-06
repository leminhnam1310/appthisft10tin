export default class Input {
  constructor(canvas) {
    this.canvas = canvas;

    //------------------------
    // Keyboard
    //------------------------

    this.keys = {};

    //------------------------
    // Mouse
    //------------------------

    this.mouse = {
      x: 0,
      y: 0,

      left: false,
      middle: false,
      right: false,

      clicked: false,

      wheel: 0,
    };

    //------------------------
    // Bind
    //------------------------

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onWheel = this.onWheel.bind(this);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    //------------------------
    // Events
    //------------------------

    window.addEventListener(
      "mousemove",
      this.onMouseMove
    );

    window.addEventListener(
      "mousedown",
      this.onMouseDown
    );

    window.addEventListener(
      "mouseup",
      this.onMouseUp
    );

    canvas.addEventListener(
      "contextmenu",
      this.onContextMenu
    );

    canvas.addEventListener(
      "wheel",
      this.onWheel,
      { passive: false }
    );

    window.addEventListener(
      "keydown",
      this.onKeyDown
    );

    window.addEventListener(
      "keyup",
      this.onKeyUp
    );
  }

  //----------------------------------
  // Mouse
  //----------------------------------

  onMouseMove(e) {
    const rect =
      this.canvas.getBoundingClientRect();

    this.mouse.x =
      e.clientX - rect.left;

    this.mouse.y =
      e.clientY - rect.top;
  }

  onMouseDown(e) {
    switch (e.button) {
      case 0:
        this.mouse.left = true;
        this.mouse.clicked = true;
        break;

      case 1:
        this.mouse.middle = true;
        break;

      case 2:
        this.mouse.right = true;
        break;
    }
  }

  onMouseUp(e) {
    switch (e.button) {
      case 0:
        this.mouse.left = false;
        break;

      case 1:
        this.mouse.middle = false;
        break;

      case 2:
        this.mouse.right = false;
        break;
    }
  }

  onContextMenu(e) {
    e.preventDefault();
  }

  //----------------------------------
  // Wheel
  //----------------------------------

  onWheel(e) {
    e.preventDefault();

    this.mouse.wheel = Math.sign(
      e.deltaY
    );
  }

  //----------------------------------
  // Keyboard
  //----------------------------------

  onKeyDown(e) {
    if (
      e.code === "Space" ||
      e.code.startsWith("Arrow")
    ) {
      e.preventDefault();
    }

    this.keys[e.code] = true;
  }

  onKeyUp(e) {
    this.keys[e.code] = false;
  }

  //----------------------------------
  // Update (call every frame)
  //----------------------------------

  update() {
    this.mouse.clicked = false;
    this.mouse.wheel = 0;
  }

  //----------------------------------
  // Destroy
  //----------------------------------

  destroy() {
    window.removeEventListener(
      "mousemove",
      this.onMouseMove
    );

    window.removeEventListener(
      "mousedown",
      this.onMouseDown
    );

    window.removeEventListener(
      "mouseup",
      this.onMouseUp
    );

    this.canvas.removeEventListener(
      "contextmenu",
      this.onContextMenu
    );

    this.canvas.removeEventListener(
      "wheel",
      this.onWheel
    );

    window.removeEventListener(
      "keydown",
      this.onKeyDown
    );

    window.removeEventListener(
      "keyup",
      this.onKeyUp
    );
  }
}