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

  const groupedRegistrations = registrations.reduce((groups, registration) => {
    const eventId = registration.eventId;

    if (!groups[eventId]) {
      groups[eventId] = [];
    }

    groups[eventId].push(registration);

    return groups;
  }, {});

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
        <div className="registration-groups">
          {Object.entries(groupedRegistrations).map(
            ([eventId, eventRegistrations]) => {
              const event = eventRegistrations[0].event;

              return (
                <section className="registration-group" key={eventId}>
                  <div className="registration-group-header">
                    <h2>{event?.title ?? eventRegistrations[0].eventTitle}</h2>

                    <div className="registration-group-info">
                      <p>
                        {new Date(
                          event?.date ?? eventRegistrations[0].eventDate,
                        ).toLocaleDateString("da-DK")}
                      </p>

                      <p>{event?.venueName}</p>

                      <p className="registration-count">
                        {eventRegistrations.length}{" "}
                        {eventRegistrations.length === 1
                          ? "tilmeldt"
                          : "tilmeldte"}
                      </p>
                    </div>
                  </div>
                  <div
                    className="registration-list"
                    role="table"
                    aria-label="Oversigt over tilmeldinger"
                  >
                    <div
                      className="registration-row registration-labels"
                      role="row"
                    >
                      <span role="columnheader">Navn</span>
                      <span role="columnheader">Email</span>
                      <span role="columnheader">Status</span>
                    </div>
                    {eventRegistrations.map((registration) => (
                      <div
                        className="registration-row"
                        role="row"
                        key={registration.id}
                      >
                        <span role="cell">{registration.name}</span>

                        <span role="cell">{registration.email}</span>

                        <span className="status" role="cell">
                          {registration.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              );
            },
          )}
        </div>
      </main>
    </>
  );
}
