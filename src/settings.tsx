import { Link } from "react-router-dom";
import "./settings.css";

export default function Settings() {
  return (
    <div className="settings-div">
      <div className="head-div">
        <Link to="/user" className="to-user-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="to-user-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </Link>
        <h1>Einstellungen</h1>
      </div>
    </div>
  );
}
