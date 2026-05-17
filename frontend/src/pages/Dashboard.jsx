import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LiveFeed from "../components/LiveFeed";
import SimulateEventForm from "../components/SimulateEventForm";
import EventList from "../components/EventList";

export default function Dashboard() {
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "http://localhost:8153";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    camera_id: "",
    event_type: "",
    start_date: "",
    end_date: "",
  });

  const token = localStorage.getItem("token");

  /* ===============================
     AUTH CHECK
  =============================== */
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  /* ===============================
     FETCH EVENTS
  =============================== */
  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      setEvents(Array.isArray(data) ? data : (data?.events ?? []));
    } catch (error) {
      console.error("Failed to fetch events:", error);

      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ===============================
     LOGOUT
  =============================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ===============================
     FILTER CHANGE
  =============================== */
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  /* ===============================
     FILTERED EVENTS
  =============================== */
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const cameraMatch = filters.camera_id
        ? String(event.camera_id || "")
            .toLowerCase()
            .includes(filters.camera_id.toLowerCase())
        : true;

      const typeMatch = filters.event_type
        ? String(event.event_type || "")
            .toLowerCase()
            .includes(filters.event_type.toLowerCase())
        : true;

      const eventDate = event.start_time
        ? new Date(event.start_time)
        : null;

      const startMatch = filters.start_date
        ? eventDate &&
          eventDate >= new Date(filters.start_date)
        : true;

      const endMatch = filters.end_date
        ? eventDate &&
          eventDate <= new Date(filters.end_date + "T23:59:59")
        : true;

      return cameraMatch && typeMatch && startMatch && endMatch;
    });
  }, [events, filters]);

  /* ===============================
     STATS
  =============================== */
  const stats = useMemo(() => {
    const highConfidence = events.filter(
      (e) => Number(e.confidence) >= 0.8
    ).length;

    const today = new Date().toDateString();

    const todayEvents = events.filter((e) => {
      if (!e.start_time) return false;
      return new Date(e.start_time).toDateString() === today;
    }).length;

    const uniqueCameras = new Set(
      events.map((e) => e.camera_id).filter(Boolean)
    ).size;

    return {
      total: events.length,
      highConfidence,
      todayEvents,
      uniqueCameras,
    };
  }, [events]);

  return (
    <div className="dashboard">
      {/* ================= HEADER ================= */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <div className="camera-icon">📹</div>

            <div>
              <h1>CCTV MOB SURVILLANCE SYSTEM</h1>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                  marginTop: "3px",
                }}
              >
                Security Monitoring Command Center
              </p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">
        {/* TOP HERO */}
        <section
          style={{
            marginBottom: "24px",
            padding: "26px",
            borderRadius: "22px",
            background:
              "linear-gradient(135deg, rgba(59,130,246,.18), rgba(16,185,129,.10))",
            border: "1px solid rgba(148,163,184,.12)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "10px",
              color: "#f8fafc",
            }}
          >
            Real-Time mob Surveillance Intelligence
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              maxWidth: "780px",
              lineHeight: "1.8",
            }}
          >
            Monitor suspicious mob activity, verify blockchain event records, and
            manage camera intelligence feeds from a single secure dashboard.
          </p>
        </section>

        {/* ================= STATS ================= */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              title: "Total Events",
              value: stats.total,
              icon: "📊",
            },
            {
              title: "Today",
              value: stats.todayEvents,
              icon: "📅",
            },
            {
              title: "High Confidence",
              value: stats.highConfidence,
              icon: "🎯",
            },
            {
              title: "Active Cameras",
              value: stats.uniqueCameras,
              icon: "📷",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="stats-card"
              style={{
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {item.title}
                </span>

                <span style={{ fontSize: "20px" }}>{item.icon}</span>
              </div>

              <h3
                style={{
                  fontSize: "30px",
                  fontWeight: "800",
                  color: "#f8fafc",
                }}
              >
                {item.value}
              </h3>
            </div>
          ))}
        </section>

        {/* ================= LIVE + FORM ================= */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.35fr 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            className="panel-card"
            style={{
              padding: "20px",
            }}
          >
            <div className="section-header">
              <span className="section-icon">📡</span>
              <h2>Live Camera Feed</h2>
            </div>

            <LiveFeed />
          </div>

          <div
            className="panel-card"
            style={{
              padding: "20px",
            }}
          >
            <div className="section-header">
              <span className="section-icon">⚡</span>
              <h2>Simulate Event</h2>
            </div>

            <SimulateEventForm onSuccess={fetchEvents} />
          </div>
        </section>

        {/* ================= FILTERS ================= */}
        <section className="filters-section">
          <div className="section-header">
            <span className="section-icon">🔎</span>
            <h2>Smart Filters</h2>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>Camera ID</label>
              <input
                className="filter-input"
                type="text"
                name="camera_id"
                placeholder="Search camera..."
                value={filters.camera_id}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Event Type</label>
              <input
                className="filter-input"
                type="text"
                name="event_type"
                placeholder="Search type..."
                value={filters.event_type}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Start Date</label>
              <input
                className="filter-input"
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>End Date</label>
              <input
                className="filter-input"
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </section>

        {/* ================= EVENTS ================= */}
        <section className="events-section">
          <div className="section-header">
            <span className="section-icon">🚨</span>
            <h2>Detected Events</h2>

            <span className="events-count">
              {filteredEvents.length} Records
            </span>
          </div>

          <EventList events={filteredEvents} loading={loading} />
        </section>
      </main>

      {/* MOBILE FIX */}
      <style>{`
        @media (max-width: 980px){
          section[style*="grid-template-columns: 1.35fr 1fr"]{
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
