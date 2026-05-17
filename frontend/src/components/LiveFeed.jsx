import { useEffect, useState } from "react";

export default function LiveFeed() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:8153";

  const [feedUrl, setFeedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    setFeedUrl(`${API}/live_feed?ts=${Date.now()}`);
  }, [API, refreshKey]);

  const handleLoaded = () => {
    setLoading(false);
    setIsOnline(true);
  };

  const handleError = () => {
    setLoading(false);
    setIsOnline(false);
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey(Date.now());
  };

  return (
    <div>
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: isOnline ? "#10b981" : "#ef4444",
              boxShadow: isOnline
                ? "0 0 12px rgba(16,185,129,.7)"
                : "0 0 12px rgba(239,68,68,.5)",
            }}
          />

          <span
            style={{
              color: "#cbd5e1",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {isOnline ? "Camera Stream Active" : "Feed Offline"}
          </span>
        </div>

        <button
          onClick={handleRefresh}
          style={{
            padding: "10px 14px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg,#3b82f6,#2563eb)",
            color: "#fff",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Refresh Feed
        </button>
      </div>

      {/* VIDEO FRAME */}
      <div
        style={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(148,163,184,.12)",
          background:
            "linear-gradient(135deg, rgba(15,23,42,.95), rgba(30,41,59,.95))",
          minHeight: "420px",
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              zIndex: 2,
              background: "rgba(2,6,23,.72)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div className="loading-spinner" />
              <p
                style={{
                  color: "#cbd5e1",
                  marginTop: "10px",
                  fontSize: "14px",
                }}
              >
                Connecting to live feed...
              </p>
            </div>
          </div>
        )}

        {/* FIXED BUG ONLY:
            Added key={feedUrl} so img reloads properly on refresh */}
        <img
          key={feedUrl}
          src={feedUrl}
          alt="Live CCTV Feed"
          onLoad={handleLoaded}
          onError={handleError}
          style={{
            width: "100%",
            height: "420px",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            background: "rgba(0,0,0,.55)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: ".4px",
          }}
        >
          LIVE
        </div>

        <div
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "rgba(0,0,0,.55)",
            color: "#e2e8f0",
            padding: "8px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {new Date().toLocaleTimeString()}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "14px",
            left: "14px",
            right: "14px",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,.55)",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          >
            Resolution: HD Stream
          </div>

          <div
            style={{
              background: "rgba(0,0,0,.55)",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          >
            Secure Endpoint
          </div>
        </div>
      </div>

      <p
        style={{
          marginTop: "12px",
          color: "#94a3b8",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >
        Live stream updates directly from your backend endpoint. If the camera
        disconnects, use refresh to reconnect instantly.
      </p>
    </div>
  );
}
