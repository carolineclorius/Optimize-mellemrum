import { useEffect, useState } from "react";
import { getRegistrations } from "../services/registrations";
import LoadingState from "../components/LoadingState";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRegistrations() {
      const data = await getRegistrations();
      setRegistrations(data);
      setRegistrationCount(data.length);
      setIsLoading(false);
    }

    loadRegistrations();
  }, []);

  if (isLoading) {
    return <LoadingState message="Indlæser tilmeldinger..." />;
  }

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        <div className="registration-list">
          <div className="registration-row registration-labels">
            <span>Navn</span>
            <span>Event</span>
            <span>Dato</span>
            <span>Status</span>
          </div>
          {registrations.map((registration) => (
            <div className="registration-row" key={registration.id}>
              <div>
                <strong>{registration.name}</strong>
                <small>{registration.email}</small>
              </div>
              <span>
                {registration.event?.title ?? registration.eventTitle}
              </span>
              <span>
                {new Date(
                  registration.event?.date ?? registration.eventDate,
                ).toLocaleDateString("da-DK")}
              </span>
              <span className="status">{registration.status}</span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
