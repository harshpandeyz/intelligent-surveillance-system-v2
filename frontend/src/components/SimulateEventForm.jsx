import { useRef, useState } from "react";
import axios from "axios";

export default function SimulateEventForm({ onSuccess }) {
  const API = import.meta.env.VITE_API_URL || "http://localhost:8153";
  const fileRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [cameraId, setCameraId] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  /* =========================
     FILE CHANGE
  ========================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreviewName(file.name);
    setMessage({ type: "", text: "" });
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage({
        type: "error",
        text: "Please choose an image or video file.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("camera_id", cameraId || "CAM-01");

      await axios.post(`${API}/classify_upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({
        type: "success",
        text: "Event uploaded and processed successfully.",
      });

      setSelectedFile(null);
      setPreviewName("");
      setCameraId("");

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);

      const status = error.response?.status;

      setMessage({
        type: "error",
        text:
          status === 401
            ? "Session expired. Please login again."
            : error.response?.data?.message ||
              error.response?.data?.error ||
              "Failed to process upload.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* INFO BOX */}
      <div
        style={{
          marginBottom: "18px",
          padding: "14px",
          borderRadius: "14px",
          background: "rgba(59,130,246,.08)",
          border: "1px solid rgba(59,130,246,.18)",
        }}
      >
        <p
          style={{
            color: "#cbd5e1",
            fontSize: "14px",
            lineHeight: "1.7",
          }}
        >
          Upload CCTV media to trigger AI classification and create a verified
          surveillance event.
        </p>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: "600",
            color:
              message.type === "success"
                ? "#d1fae5"
                : "#fecaca",
            background:
              message.type === "success"
                ? "rgba(16,185,129,.14)"
                : "rgba(239,68,68,.12)",
            border:
              message.type === "success"
                ? "1px solid rgba(16,185,129,.28)"
                : "1px solid rgba(239,68,68,.28)",
          }}
        >
          {message.text}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        {/* CAMERA ID */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#cbd5e1",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            Camera ID
          </label>

          <input
            type="text"
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value)}
            placeholder="e.g. CAM-01"
            style={{
              width: "100%",
              height: "46px",
              padding: "0 14px",
              borderRadius: "14px",
              background: "#0f172a",
              border: "1px solid rgba(148,163,184,.14)",
              color: "#fff",
            }}
          />
        </div>

        {/* FILE PICKER */}
        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#cbd5e1",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            Upload File
          </label>

          <label
            style={{
              display: "block",
              padding: "22px",
              borderRadius: "16px",
              border: "1.5px dashed rgba(148,163,184,.25)",
              background: "rgba(15,23,42,.72)",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div
              style={{
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              ⬆️
            </div>

            <div
              style={{
                color: "#f8fafc",
                fontWeight: "800",
                marginBottom: "6px",
              }}
            >
              Click to choose file
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              Images and videos supported
            </div>
          </label>

          {previewName && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px 12px",
                borderRadius: "12px",
                background: "rgba(16,185,129,.08)",
                border: "1px solid rgba(16,185,129,.18)",
                color: "#d1fae5",
                fontSize: "13px",
                wordBreak: "break-word",
              }}
            >
              Selected: {previewName}
            </div>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "14px",
            border: "none",
            background: loading
              ? "#334155"
              : "linear-gradient(135deg,#3b82f6,#2563eb)",
            color: "#fff",
            fontWeight: "800",
            fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Upload & Detect Event"}
        </button>
      </form>

      {/* FOOTNOTE */}
      <p
        style={{
          marginTop: "12px",
          color: "#94a3b8",
          fontSize: "12px",
          lineHeight: "1.7",
        }}
      >
        Files are sent securely to your backend AI engine for classification and
        event generation.
      </p>
    </div>
  );
}
