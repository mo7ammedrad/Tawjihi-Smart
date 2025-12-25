//component
import { H2 } from "../typography";

const VideoResources = ({ resources = [] }) => {
  if (!resources.length) return null;

  return (
    <div style={{ padding: "1rem", marginTop: "1rem" }}>
      <H2>موارد الفيديو 📂</H2>
      <ul style={{ paddingRight: "1rem" }}>
        {resources.map((res, idx) => (
          <li key={idx} style={{ marginBottom: "0.5rem" }}>
            <a
              href={res.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1d4ed8",
                textDecoration: "underline",
                fontSize: "1rem",
              }}
            >
              {res.name || `المورد ${idx + 1}`}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoResources;
