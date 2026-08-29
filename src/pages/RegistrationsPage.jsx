import { useEffect, useState } from "react";
import { getRegistrations } from "../services/registrations";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRegistrations() {
      try {
        const data = await getRegistrations();
        setRegistrations(data);
        setRegistrationCount(data.length);
      } catch {
        setErrorMessage(
          "Tilmeldingerne kunne ikke hentes. Prøv at genindlæse siden.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadRegistrations();
  }, []);

  if (isLoading) {
    return <LoadingState message="Indlæser tilmeldinger..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        <div
          className="registration-list"
          role="table"
          aria-label="Oversigt over tilmeldinger"
        >
          <div className="registration-row registration-labels" role="row">
            <span role="columnheader">Navn</span>
            <span role="columnheader">Event</span>
            <span role="columnheader">Dato</span>
            <span role="columnheader">Status</span>
          </div>
          {registrations.map((registration) => (
            <div className="registration-row" role="row" key={registration.id}>
              <div role="cell">
                <strong>{registration.name}</strong>
                <small>{registration.email}</small>
              </div>
              <span role="cell">
                {registration.event?.title ?? registration.eventTitle}
              </span>
              <span role="cell">
                {new Date(
                  registration.event?.date ?? registration.eventDate,
                ).toLocaleDateString("da-DK")}
              </span>
              <span className="status" role="cell">
                {registration.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
