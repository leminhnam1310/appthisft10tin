"use client";

import { useEffect, useRef } from "react";

import Input from "./Input";
import Camera from "./Camera";
import World from "./World";

import ScoreManager from "./ScoreManager";

import Skybox from "./Skybox";
import Background from "./Background";
import Stars from "./Stars";
import Dust from "./Dust";
import Effects from "./Effects";

import Gravity from "./Gravity";
import Particle from "./Particle";

export default function GravityGame() {

  const canvasRef = useRef(null);

  useEffect(() => {

    //----------------------------------------
    // Canvas
    //----------------------------------------

    const canvas =
      canvasRef.current;

    const ctx =
      canvas.getContext("2d");

    //----------------------------------------
    // Resize
    //----------------------------------------

    function resize() {

      canvas.width =
        window.innerWidth;

      canvas.height =
        window.innerHeight;

      world.resize(
        canvas.width,
        canvas.height
      );

      skybox.resize(
        canvas.width,
        canvas.height
      );

      background.resize(
        canvas.width,
        canvas.height
      );

    }

    canvas.width =
      window.innerWidth;

    canvas.height =
      window.innerHeight;

    //----------------------------------------
    // Engine
    //----------------------------------------

    const world =
      new World(
        canvas.width,
        canvas.height
      );

    const camera =
      new Camera();

    const input =
      new Input(canvas);

    //----------------------------------------
    // Score
    //----------------------------------------

    const score =
      new ScoreManager();

    //----------------------------------------
    // Background
    //----------------------------------------

    const skybox =
      new Skybox(
        canvas.width,
        canvas.height
      );

    const background =
      new Background(
        canvas.width,
        canvas.height
      );

    const stars =
      new Stars(
        25000
      );

    const dust =
      new Dust(
        8000
      );

    const effects =
      new Effects();

    //----------------------------------------
    // Black Hole
    //----------------------------------------

    const gravity =
      new Gravity();

    gravity.setPosition(
      0,
      0
    );

    //----------------------------------------
    // Particles
    //----------------------------------------

    const particles = [];

    for (
      let i = 0;
      i < 1800;
      i++
    ) {

      particles.push(
        new Particle()
      );

    }

    //----------------------------------------
    // Events
    //----------------------------------------

    window.addEventListener(
      "resize",
      resize
    );

    //----------------------------------------
    // FPS
    //----------------------------------------

    let fps = 0;

    let frame = 0;

    let last =
      performance.now();

    //----------------------------------------
    // Loop
    //----------------------------------------

    let animationId;

    function loop() {

      animationId =
        requestAnimationFrame(loop);

      //----------------------------------
      // FPS
      //----------------------------------

      frame++;

      const now =
        performance.now();

      if (
        now - last >= 1000
      ) {

        fps = frame;

        frame = 0;

        last = now;

      }

      //----------------------------------
      // Mouse -> World
      //----------------------------------

      const mouseWorld =
        world.screenToWorld(

          input.mouse.x,

          input.mouse.y,

          camera

        );

      //----------------------------------
      // Move Black Hole
      //----------------------------------

      if (
        input.mouse.left
      ) {

        gravity.setPosition(

          mouseWorld.x,

          mouseWorld.y

        );

      }

      //----------------------------------
      // Camera
      //----------------------------------

      camera.follow(

        gravity.x,

        gravity.y

      );

      camera.update();
            //----------------------------------
      // Gravity
      //----------------------------------

      const wasActive = gravity.active;

if (

  input.mouse.left &&

  input.keys["Space"]

) {

  gravity.activate();

}
else {

  if (wasActive) {

    score.gameOver();

  }

  gravity.deactivate();

}

      //----------------------------------
      // Background Update
      //----------------------------------

      skybox.update();

      background.update();

      stars.update();

      dust.update();

      //----------------------------------
      // Score Reset
      //----------------------------------

      score.resetOrbitCount();

      //----------------------------------
      // Update Particles
      //----------------------------------

      for (const p of particles) {

        gravity.apply(p);

        p.update(
          world,
          camera
        );

        //--------------------------------
        // Orbit Detect
        //--------------------------------

        const dist = Math.hypot(

          p.x - gravity.x,

          p.y - gravity.y

        );

        if (

          gravity.active &&

          dist >

          gravity.eventRadius * 2 &&

          dist <

          gravity.radius * 0.4

        ) {

          score.addOrbit();

        }

      }

      //----------------------------------
      // Score Update
      //----------------------------------

      score.update(gravity.active);

      //----------------------------------
      // Effects
      //----------------------------------

      effects.update?.();

      //----------------------------------
      // Clear
      //----------------------------------

      ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

      );

      //----------------------------------
      // Draw Sky
      //----------------------------------

      skybox.draw(

        ctx,

        world,

        camera

      );

      //----------------------------------
      // Draw Background
      //----------------------------------

      background.draw(

        ctx,

        world,

        camera

      );

      //----------------------------------
      // Draw Stars
      //----------------------------------

      stars.draw(

        ctx,

        world,

        camera

      );

      //----------------------------------
      // Draw Dust
      //----------------------------------

      dust.draw(

        ctx,

        world,

        camera

      );

      //----------------------------------
      // Begin Post Effect
      //----------------------------------

      effects.begin(ctx);

      //----------------------------------
      // Draw Gravity
      //----------------------------------

      gravity.draw(

        ctx,

        world,

        camera

      );
            //----------------------------------
      // Draw Particles
      //----------------------------------

      for (const p of particles) {

        p.draw(
          ctx,
          world,
          camera
        );

      }

      //----------------------------------
      // End Post Effect
      //----------------------------------

      effects.end(ctx);

      //----------------------------------
      // Floating Scores
      //----------------------------------

      score.drawWorld(
        ctx,
        world,
        camera
      );

      //----------------------------------
      // Score HUD
      //----------------------------------

      score.drawHUD(ctx);

      //----------------------------------
      // Cursor
      //----------------------------------

      ctx.save();

      ctx.beginPath();

      ctx.arc(

        input.mouse.x,

        input.mouse.y,

        5,

        0,

        Math.PI * 2

      );

      ctx.fillStyle =
        "#7cc7ff";

      ctx.shadowBlur = 25;

      ctx.shadowColor =
        "#7cc7ff";

      ctx.fill();

      ctx.restore();

      //----------------------------------
      // Debug HUD
      //----------------------------------

      ctx.save();

      ctx.font =
        "14px monospace";

      ctx.fillStyle =
        "#ffffff";

      ctx.fillText(

        `FPS : ${fps}`,

        20,

        canvas.height - 95

      );

      ctx.fillText(

        `Particles : ${particles.length}`,

        20,

        canvas.height - 75

      );

      ctx.fillText(

        `Orbit : ${score.orbitCount}`,

        20,

        canvas.height - 55

      );

      ctx.fillText(

        `Camera : ${camera.x.toFixed(0)}, ${camera.y.toFixed(0)}`,

        20,

        canvas.height - 35

      );

      ctx.fillText(

        `[SPACE] Gravity`,

        20,

        canvas.height - 15

      );

      ctx.restore();

      //----------------------------------
      // Reset Input
      //----------------------------------

      input.update();

    }
        //----------------------------------------
    // Start
    //----------------------------------------

    loop();

    //----------------------------------------
    // Cleanup
    //----------------------------------------

    return () => {

      cancelAnimationFrame(
        animationId
      );

      input.destroy();

      window.removeEventListener(
        "resize",
        resize
      );

    };

  }, []);

  //----------------------------------------
  // Canvas
  //----------------------------------------

  return (

    <canvas

      ref={canvasRef}

      style={{

        display: "block",

        width: "100vw",

        height: "100vh",

        background: "#000",

        cursor: "none",

        userSelect: "none",

      }}

    />

  );

}