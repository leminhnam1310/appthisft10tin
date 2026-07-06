"use client";

import Link from "next/link";

const games = [
  {
    id: 1,
    title: "Buông bỏ",
    emoji: "🕊️",
    desc: "Viết điều khiến bạn mệt mỏi rồi buông bỏ nó.",
    href: "/games/paper",
    color: "linear-gradient(135deg,#FFF7E8,#FFE6C7)",
  },
  {
    id: 2,
    title: "Gravity Painter",
    emoji: "🌌",
    desc: "Điều khiển lực hấp dẫn trong không gian thư giãn.",
    href: "/games/gravity",
    color: "linear-gradient(135deg,#0B1023,#1D3557)",
  },
  {
    id: 3,
    title: "Bubble Pop",
    emoji: "🫧",
    desc: "Bấm bong bóng để giải tỏa căng thẳng.",
    href: "/games/bubble",
    color: "linear-gradient(135deg,#DDF8FF,#C9F2FF)",
  },
];

export default function EntertainmentPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#FFF7FB 0%,#F8FAFF 50%,#F4F7FF 100%)",
        padding: "60px 40px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        <h1
          style={{
            fontSize: 50,
            marginBottom: 15,
            color: "#222",
          }}
        >
          🌸 Relax Arcade
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: 18,
          }}
        >
          Chọn một trò chơi để thư giãn
        </p>

        <input
          placeholder="🔍 Tìm trò chơi..."
          style={{
            marginTop: 25,
            width: 350,
            maxWidth: "90%",
            padding: 14,
            borderRadius: 30,
            border: "none",
            outline: "none",
            fontSize: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          }}
        />
      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: 35,
          maxWidth: 1200,
          margin: "auto",
        }}
      >
        {games.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: game.color,
                height: 360,
                borderRadius: 28,
                overflow: "hidden",
                boxShadow:
                  "0 25px 50px rgba(0,0,0,.12)",
                transition: ".35s",
                cursor: "pointer",
                position: "relative",
                padding: 30,
                color:
                  game.id === 2 ? "#fff" : "#222",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-10px) scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0px)";
              }}
            >
              {/* ICON */}

              <div
                style={{
                  fontSize: 70,
                  marginBottom: 25,
                }}
              >
                {game.emoji}
              </div>

              {/* TITLE */}

              <h2
                style={{
                  fontSize: 30,
                  marginBottom: 15,
                }}
              >
                {game.title}
              </h2>

              {/* DESC */}

              <p
                style={{
                  opacity: 0.85,
                  lineHeight: 1.6,
                  minHeight: 70,
                }}
              >
                {game.desc}
              </p>

              {/* BUTTON */}

              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: 30,
                  right: 30,
                }}
              >
                <div
                  style={{
                    background:
                      game.id === 2
                        ? "rgba(255,255,255,.15)"
                        : "#fff",
                    color:
                      game.id === 2
                        ? "#fff"
                        : "#222",
                    textAlign: "center",
                    padding: "14px",
                    borderRadius: 16,
                    fontWeight: 700,
                    backdropFilter: "blur(20px)",
                  }}
                >
                  ▶ Chơi ngay
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* FOOTER */}

      <div
        style={{
          marginTop: 80,
          textAlign: "center",
          color: "#888",
          fontSize: 18,
        }}
      >
        🌿 Take a deep breath • Relax • Smile
      </div>
    </main>
  );
}