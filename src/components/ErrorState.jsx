import errorIcon from "../assets/error-icon.svg";
import "./ErrorState.css";

export default function ErrorState({
  message = "Indholdet kunne ikke hentes. Prøv at genindlæse siden.",
}) {
  return (
    <div className="error-state" role="alert">
      <img
        className="error-state__icon"
        src={errorIcon}
        alt=""
        aria-hidden="true"
      />

      <h2>Der opstod en fejl</h2>
      <p>{message}</p>
    </div>
  );
}
