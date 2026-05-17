export default function EventCard({ event }) {
  const confidence = Number(event?.confidence ?? 0);
  const safeConfidence = Number.isFinite(confidence) ? confidence : 0;

  const getConfidenceLabel = () => {
    if (safeConfidence >= 0.8) return "high";
    if (safeConfidence >= 0.5) return "medium";
    return "low";
  };

  const formatConfidence = () => `${(safeConfidence * 100).toFixed(1)}%`;

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Invalid Date";
    return parsed.toLocaleString();
  };

  const shortenHash = (hash) => {
    if (!hash) return "N/A";
    const value = String(hash);
    return value.length > 20 ? `${value.slice(0, 20)}...` : value;
  };

  const getEventIcon = (type) => {
    const value = String(type || "").toLowerCase();

    if (
      value.includes("fight") ||
      value.includes("violence") ||
      value.includes("attack")
    ) {
      return "!";
    }

    if (
      value.includes("weapon") ||
      value.includes("gun") ||
      value.includes("knife")
    ) {
      return "W";
    }

    if (value.includes("fire") || value.includes("smoke")) return "F";

    if (value.includes("intrusion") || value.includes("trespass")) return "I";

    if (value.includes("theft") || value.includes("robbery")) return "T";

    if (value.includes("person") || value.includes("human")) return "P";

    return "E";
  };

  // enc_path is a server-side path and is not directly downloadable.
  const downloadUrl = null;

  return (
    <div className="event-card">
      <div className="event-header">
        <div>
          <div className="camera-info">
            <span>CAM</span>
            <span>
              Camera:{" "}
              <strong style={{ color: "#f8fafc" }}>
                {event?.camera_id || "N/A"}
              </strong>
            </span>
          </div>
        </div>

        <span className={`confidence-badge ${getConfidenceLabel()}`}>
          {formatConfidence()}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "22px" }}>{getEventIcon(event?.event_type)}</span>

        <div className="event-type">{event?.event_type || "N/A"}</div>
      </div>

      <div className="event-time">
        <span>Time</span>
        <span>{formatDate(event?.start_time || event?.created_at)}</span>
      </div>

      <div className="transaction-info">
        <span>Tx</span>
        <span className="tx-hash">{shortenHash(event?.tx_hash)}</span>
      </div>

      <div className="transaction-info">
        <span>Hash</span>
        <span className="tx-hash">{shortenHash(event?.hash)}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginTop: "12px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            padding: "10px",
            borderRadius: "12px",
            background: "rgba(148,163,184,.08)",
            border: "1px solid rgba(148,163,184,.10)",
          }}
        >
          <div
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              marginBottom: "4px",
            }}
          >
            Status
          </div>

          <div
            style={{
              color: "#10b981",
              fontWeight: "700",
              fontSize: "13px",
            }}
          >
            {event?.tx_hash && event.tx_hash !== "pending" ? "Verified" : "Pending"}
          </div>
        </div>

        <div
          style={{
            padding: "10px",
            borderRadius: "12px",
            background: "rgba(148,163,184,.08)",
            border: "1px solid rgba(148,163,184,.10)",
          }}
        >
          <div
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              marginBottom: "4px",
            }}
          >
            Confidence
          </div>

          <div
            style={{
              color: "#f8fafc",
              fontWeight: "700",
              fontSize: "13px",
            }}
          >
            {formatConfidence()}
          </div>
        </div>
      </div>

      {downloadUrl ? (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noreferrer"
          className="download-btn"
        >
          Download Evidence
        </a>
      ) : (
        <button
          disabled
          className="download-btn"
          style={{
            opacity: 0.6,
            cursor: "not-allowed",
          }}
        >
          Evidence Secured on Blockchain
        </button>
      )}
    </div>
  );
}
