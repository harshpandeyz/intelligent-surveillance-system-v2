import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "http://localhost:8153";

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===============================
     INPUT CHANGE
  =============================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (error) setError("");
  };

  /* ===============================
     LOGIN SUBMIT
     FIXED FOR FASTAPI 422
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      /* FastAPI login expects form-urlencoded */
      const params = new URLSearchParams();
      params.append("username", form.username);
      params.append("password", form.password);

      const res = await axios.post(`${API}/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token =
        res.data?.access_token ||
        res.data?.token ||
        res.data?.jwt ||
        "";

      if (token) {
        localStorage.setItem("token", token);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background:
          "linear-gradient(135deg,#050816 0%,#0f172a 45%,#111827 100%)",
      }}
    >
      {/* ================= LEFT SIDE ================= */}
      <div
        style={{
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* glow effects */}
        <div
          style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(59,130,246,.18)",
            top: "-80px",
            left: "-80px",
            filter: "blur(25px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background: "rgba(16,185,129,.12)",
            bottom: "-60px",
            right: "-60px",
            filter: "blur(25px)",
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background:
                "linear-gradient(135deg,#3b82f6,#2563eb)",
              display: "grid",
              placeItems: "center",
              fontSize: "30px",
              marginBottom: "22px",
              boxShadow: "0 18px 35px rgba(37,99,235,.25)",
            }}
          >
            📹
          </div>

          <h1
            style={{
              fontSize: "46px",
              lineHeight: "1.12",
              fontWeight: "900",
              color: "#f8fafc",
              marginBottom: "18px",
              maxWidth: "620px",
            }}
          >
            MOB SURVEILLANCE SYSTEM
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              lineHeight: "1.8",
              maxWidth: "560px",
            }}
          >
            Intelligent mobile surveillance platform with AI threat detection,
            secure monitoring, real-time camera feeds, and trusted evidence
            records.
          </p>

          <div
            style={{
              marginTop: "34px",
              display: "grid",
              gap: "14px",
              maxWidth: "520px",
            }}
          >
            {[
              "Real-time incident monitoring",
              "AI suspicious activity alerts",
              "Secure evidence management",
              "Centralized control dashboard",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#cbd5e1",
                  fontSize: "15px",
                }}
              >
                <span style={{ color: "#10b981" }}>●</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            background: "rgba(15,23,42,.72)",
            border: "1px solid rgba(148,163,184,.14)",
            borderRadius: "24px",
            padding: "36px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 25px 50px rgba(0,0,0,.35)",
          }}
        >
          <p
            style={{
              color: "#60a5fa",
              fontWeight: "800",
              marginBottom: "8px",
            }}
          >
            Welcome Back
          </p>

          <h2
            style={{
              color: "#f8fafc",
              fontSize: "32px",
              fontWeight: "900",
              marginBottom: "8px",
            }}
          >
            Sign In
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: "26px",
              fontSize: "14px",
            }}
          >
            Login to access the surveillance command dashboard.
          </p>

          {/* ERROR */}
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,.12)",
                border: "1px solid rgba(239,68,68,.28)",
                color: "#fecaca",
                padding: "12px 14px",
                borderRadius: "12px",
                marginBottom: "18px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#cbd5e1",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                Username
              </label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                autoComplete="username"
                style={{
                  width: "100%",
                  height: "50px",
                  padding: "0 14px",
                  borderRadius: "14px",
                  background: "#0f172a",
                  border: "1px solid rgba(148,163,184,.14)",
                  color: "#fff",
                  fontSize: "16px",
                }}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: "22px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#cbd5e1",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  height: "50px",
                  padding: "0 14px",
                  borderRadius: "14px",
                  background: "#0f172a",
                  border: "1px solid rgba(148,163,184,.14)",
                  color: "#fff",
                  fontSize: "16px",
                }}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "52px",
                borderRadius: "14px",
                border: "none",
                color: "#fff",
                fontWeight: "800",
                fontSize: "15px",
                background: loading
                  ? "#334155"
                  : "linear-gradient(135deg,#3b82f6,#2563eb)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          {/* SIGNUP */}
          <p
            style={{
              marginTop: "22px",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Don’t have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#60a5fa",
                fontWeight: "700",
              }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <style>{`
        @media (max-width: 980px){
          div[style*="grid-template-columns: 1fr 1fr"]{
            grid-template-columns:1fr !important;
          }
        }

        @media (max-width: 768px){
          h1{
            font-size:34px !important;
          }
        }

        @media (max-width: 520px){
          div[style*="padding: 36px"]{
            padding:24px !important;
          }
        }
      `}</style>
    </div>
  );
}
