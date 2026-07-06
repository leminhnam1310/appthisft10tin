  "use client";

  import { useRef, useState } from "react";
  import { gsap } from "gsap";
  import "@/app/paper.css";

  export default function PaperGame() {
    const paperRef = useRef(null);

    const [text, setText] = useState("");
    const [scene, setScene] = useState("write"); 
    // write | choose | anim

    const [effect, setEffect] = useState("");

    // ================= ENTER WRITE → CHOOSE =================
    const goChoose = () => {
      if (!text.trim()) {
        alert("Hãy viết điều bạn muốn trước.");
        return;
      }

      setScene("choose");
    };

    // ================= RESET GAME =================
    const reset = () => {
      setText("");
      setEffect("");
      setScene("write");

      gsap.set(paperRef.current, {
        clearProps: "all",
      });
    };

    // ================= RUN ANIMATION =================
    const runAnimation = (type) => {
      setEffect(type);
      setScene("anim");

      const el = paperRef.current;

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(reset, 1500);
        },
      });

      switch (type) {
        case "burn":
          tl.to(el, { duration: 2, opacity: 0, scale: 0.8, rotation: -6 });
          break;

        case "blow":
          tl.to(el, { duration: 2, x: 800, y: -300, opacity: 0 });
          break;

        case "tear":
          tl.to(el, { x: -10, repeat: 5, yoyo: true, duration: 0.1 })
            .to(el, { opacity: 0, y: 200 });
          break;

        case "water":
          tl.to(el, { y: 300, opacity: 0.2 });
          break;

        case "balloon":
          tl.to(el, { y: -700, opacity: 0 });
          break;
      }
    };

    return (
      <div className="paper-game">

        <h1 className="title">🕊️ Buông bỏ</h1>

        {/* ================= WRITE SCENE ================= */}
        {scene === "write" && (
          <div className="write-scene">

            <div className="paper-sheet" ref={paperRef}>
              <textarea
                className="paper-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Viết điều mà bạn muốn ..."
              />
            </div>

            <button className="next-btn" onClick={goChoose}>
              ✨ Tiếp tục
            </button>
          </div>
        )}

        {/* ================= CHOOSE SCENE ================= */}
        {scene === "choose" && (
          <div className="choose-scene">

            <h2>Chọn cách buông bỏ</h2>

            <div className="button-grid">
              <button onClick={() => runAnimation("burn")}>🔥 Đốt</button>
              <button onClick={() => runAnimation("blow")}>🌬️ Thổi</button>
              <button onClick={() => runAnimation("tear")}>✂️ Xé</button>
              <button onClick={() => runAnimation("water")}>💧 Nước</button>
              <button onClick={() => runAnimation("balloon")}>🎈 Bóng</button>
            </div>

          </div>
        )}

        {/* ================= ANIMATION SCENE ================= */}
        {scene === "anim" && (
          <div className="anim-scene">

            <div className="paper-sheet anim" ref={paperRef}>
              <div className="paper-preview">{text}</div>
            </div>

          </div>
        )}

      </div>
    );
  }