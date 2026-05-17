import { Link } from "react-router-dom";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #050816 0%, #0f172a 45%, #111827 100%)",
        color: "#f8fafc",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* BACKGROUND GLOW */}
      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(59,130,246,.18)",
          top: "-100px",
          left: "-100px",
          filter: "blur(30px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "rgba(16,185,129,.12)",
          bottom: "-70px",
          right: "-70px",
          filter: "blur(30px)",
        }}
      />

      {/* NAVBAR */}
      <header
        style={{
          position: "relative",
          zIndex: 2,
          padding: "22px 32px",
          borderBottom: "1px solid rgba(148,163,184,.10)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                display: "grid",
                placeItems: "center",
                fontSize: "22px",
              }}
            >
              📹
            </div>

            <div>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                }}
              >
                CCTV AI Blockchain
              </h1>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                Smart Surveillance Platform
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              style={{
                padding: "11px 16px",
                borderRadius: "12px",
                background: "rgba(148,163,184,.08)",
                color: "#fff",
                fontWeight: "700",
              }}
            >
              Login
            </Link>

            <Link
              to="/dashboard"
              style={{
                padding: "11px 16px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg,#3b82f6,#2563eb)",
                color: "#fff",
                fontWeight: "700",
              }}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "70px 32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr .85fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div>
            <p
              style={{
                color: "#60a5fa",
                fontWeight: "800",
                letterSpacing: ".4px",
                marginBottom: "12px",
              }}
            >
              NEXT GENERATION SECURITY
            </p>

            <h2
              style={{
                fontSize: "54px",
                lineHeight: "1.12",
                fontWeight: "900",
                marginBottom: "18px",
              }}
            >
              AI Powered CCTV Monitoring with Blockchain Trust
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "18px",
                lineHeight: "1.8",
                maxWidth: "720px",
                marginBottom: "28px",
              }}
            >
              Detect suspicious events in real time, store tamper-proof records,
              and manage all surveillance operations through a modern command
              dashboard.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginBottom: "34px",
              }}
            >
              <Link
                to="/"
                style={{
                  padding: "14px 20px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg,#3b82f6,#2563eb)",
                  color: "#fff",
                  fontWeight: "800",
                }}
              >
                Get Started
              </Link>

              <Link
                to="/dashboard"
                style={{
                  padding: "14px 20px",
                  borderRadius: "14px",
                  border: "1px solid rgba(148,163,184,.18)",
                  color: "#fff",
                  fontWeight: "800",
                }}
              >
                Open Dashboard
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: "14px",
              }}
            >
              {[
                "Live Camera Feeds",
                "AI Threat Detection",
                "Blockchain Evidence Logs",
                "Enterprise Dashboard",
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    background: "rgba(15,23,42,.72)",
                    border: "1px solid rgba(148,163,184,.10)",
                    color: "#cbd5e1",
                    fontWeight: "600",
                  }}
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            style={{
              background: "rgba(15,23,42,.75)",
              border: "1px solid rgba(148,163,184,.10)",
              borderRadius: "24px",
              padding: "28px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 20px 45px rgba(0,0,0,.35)",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              {[
                {
                  title: "Threat Detection Accuracy",
                  value: "96.8%",
                  icon: "🎯",
                },
                {
                  title: "Connected Cameras",
                  value: "24",
                  icon: "📷",
                },
                {
                  title: "Daily Events Logged",
                  value: "1,284",
                  icon: "📊",
                },
                {
                  title: "Evidence Integrity",
                  value: "100%",
                  icon: "⛓️",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "18px",
                    borderRadius: "18px",
                    background: "rgba(30,41,59,.72)",
                    border: "1px solid rgba(148,163,184,.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: "13px",
                        marginBottom: "6px",
                      }}
                    >
                      {item.title}
                    </div>

                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "800",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>

                  <div style={{ fontSize: "24px" }}>
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE */}
      <style>{`
        @media (max-width: 980px){
          div[style*="grid-template-columns: 1.15fr .85fr"]{
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px){
          h2{
            font-size: 38px !important;
          }
        }

        @media (max-width: 520px){
          main{
            padding: 42px 18px !important;
          }
        }
      `}</style>
    </div>
  );
}