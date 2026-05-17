import EventCard from "./EventCard";

export default function EventList({ events = [], loading = false }) {
  /* ===============================
     LOADING STATE
  =============================== */
  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />

        <p
          style={{
            color: "#e2e8f0",
            fontWeight: "700",
            marginBottom: "6px",
          }}
        >
          Fetching surveillance records...
        </p>

        <small
          style={{
            color: "#94a3b8",
          }}
        >
          Syncing latest blockchain verified events
        </small>
      </div>
    );
  }

  /* ===============================
     EMPTY STATE
  =============================== */
  if (!events || events.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>

        <p>No events found</p>

        <small>
          No suspicious activity matches your current filters.
        </small>
      </div>
    );
  }

  /* ===============================
     SORT EVENTS (LATEST FIRST)
  =============================== */
  const sortedEvents = [...events].sort((a, b) => {
    const first = a?.start_time
      ? new Date(a.start_time).getTime()
      : 0;

    const second = b?.start_time
      ? new Date(b.start_time).getTime()
      : 0;

    return second - first;
  });

  /* ===============================
     RENDER LIST
  =============================== */
  return (
    <div>
      {/* TOP INFO BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "18px",
          padding: "12px 14px",
          borderRadius: "14px",
          background: "rgba(59,130,246,.08)",
          border: "1px solid rgba(59,130,246,.14)",
        }}
      >
        <div
          style={{
            color: "#cbd5e1",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Showing <span style={{ color: "#fff" }}>{sortedEvents.length}</span>{" "}
          event records
        </div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          Latest incidents displayed first
        </div>
      </div>

      {/* GRID */}
      <div className="events-grid">
        {sortedEvents.map((event, index) => (
          <EventCard
            key={
              event?.id ||
              event?._id ||
              event?.tx_hash ||
              `${event?.camera_id}-${index}`
            }
            event={event}
          />
        ))}
      </div>
    </div>
  );
}