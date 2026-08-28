import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getEventById } from "../services/events";
import { createRegistration } from "../services/registrations";
import successIcon from "../assets/success-icon.svg";
import errorIcon from "../assets/error-icon.svg";
import warningIcon from "../assets/warning-icon.svg";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getEventById(eventId);
        setEvent(data);
      } catch {
        setLoadError("Eventet kunne ikke hentes. Prøv at genindlæse siden.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();
    setErrorMessage("");
    setValidationMessage("");

    if (!name.trim() && !email.trim()) {
      setValidationMessage("Udfyld både navn og e-mail.");
      return;
    }

    if (!name.trim()) {
      setValidationMessage("Udfyld dit navn.");
      return;
    }

    if (!email.trim()) {
      setValidationMessage("Udfyld din e-mail.");
      return;
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      setValidationMessage("Indtast en gyldig e-mailadresse.");
      return;
    }

    try {
      await createRegistration({
        name: name,
        email: email,
        status: "Ny",
        eventId: event.id,
      });
      setSuccessMessage("Tilmeldingen er gennemført.");
      setName("");
      setEmail("");
    } catch {
      setErrorMessage("Tilmeldingen mislykkedes. Prøv igen.");
    }
  }

  if (isLoading) {
    return <LoadingState message="Indlæser event..." />;
  }

  if (loadError) {
    return <ErrorState message={loadError} />;
  }

  if (!event) {
    return <ErrorState message="Eventet blev ikke fundet." />;
  }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={event.image} alt="" />
          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>
            <h1>{event.title}</h1>
            <p className="lead">{event.summary}</p>
            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venueName}
                  <br />
                  {event.venueAddress}, {event.venuePostalCode}{" "}
                  {event.venueCity}
                  {event.venueWebsite && (
                    <>
                      <br />
                      <a href={event.venueWebsite}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>
              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>
            <p>{event.description}</p>
          </div>
        </section>

        <section
          className={`signup-panel ${successMessage ? "signup-panel--success" : ""}`}
        >
          {successMessage ? (
            <div
              className="registration-success"
              role="status"
              aria-live="polite"
            >
              <img
                className="registration-success__icon"
                src={successIcon}
                alt=""
                aria-hidden="true"
              />

              <h2>Din plads er reserveret</h2>
              <p className="registration-success__event">{event.title}</p>
            </div>
          ) : (
            <>
              <div>
                <p className="eyebrow dark">Tilmelding</p>
                <h2>Reserver din plads</h2>
                <p>
                  Udfyld formularen, så sender vi din tilmelding til arrangøren.
                </p>
              </div>
              <form onSubmit={handleSubmit} noValidate>
                {validationMessage && (
                  <div className="registration-warning" role="alert">
                    <img
                      className="registration-warning__icon"
                      src={warningIcon}
                      alt=""
                      aria-hidden="true"
                    />

                    <p>{validationMessage}</p>
                  </div>
                )}

                {errorMessage && (
                  <div className="registration-error" role="alert">
                    <img
                      className="registration-error__icon"
                      src={errorIcon}
                      alt=""
                      aria-hidden="true"
                    />

                    <p>{errorMessage}</p>
                  </div>
                )}
                <label>
                  Navn
                  <input
                    type="text"
                    value={name}
                    onChange={(inputEvent) => setName(inputEvent.target.value)}
                    required
                  />
                </label>
                <label>
                  E-mail
                  <input
                    type="email"
                    value={email}
                    onChange={(inputEvent) => setEmail(inputEvent.target.value)}
                    placeholder="dig@example.com"
                    required
                  />
                </label>
                <button type="submit">Tilmeld mig</button>
              </form>
            </>
          )}
        </section>
      </main>
    </>
  );
}
