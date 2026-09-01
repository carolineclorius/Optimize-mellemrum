import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { getEvents } from "../services/events";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function HomePage() {
  const { state } = useLocation();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (state?.scrollToEvents && !isLoading) {
      const eventsSection = document.getElementById("events");

      eventsSection?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    }
  }, [state, isLoading]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch {
        setErrorMessage("Events kunne ikke hentes. Prøv at genindlæse siden.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  const categories = [
    "Alle",
    ...new Set(events.map((event) => event.category)),
  ];

  const filteredEvents = events.filter((event) => {
    const searchText =
      `${event.title} ${event.summary} ${event.venueName}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  function formatEventDate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return (
    <>
      <header className="hero">
        <p className="eyebrow">Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className="hero-copy">
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og
          tilmeld dig på få minutter.
        </p>
        <a className="hero-link" href="#events">
          Se kommende events ↓
        </a>
      </header>

      <main>
        <section className="section-heading" id="events">
          <div>
            <p className="eyebrow dark">Det sker</p>
            <h2 id="events-title">Kommende events</h2>
          </div>
          <p>Kuraterede oplevelser i byen – fra små scener til store idéer.</p>
        </section>

        <section className="filters" aria-label="Filtrér events">
          <label>
            Søg
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Søg efter titel eller sted"
            />
          </label>
          <label>
            Kategori
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>

        {isLoading ? (
          <LoadingState message="Indlæser events..." />
        ) : errorMessage ? (
          <ErrorState message={errorMessage} />
        ) : (
          <section className="event-grid" aria-labelledby="events-title">
            {filteredEvents.map((event, index) => (
              <Link
                className="event-card-link"
                to={`/events/${event.id}`}
                key={event.id}
                aria-label={`Læs mere om ${event.title}`}
              >
                <article className="event-card">
                  <img
                    src={event.image}
                    alt=""
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                  <div className="event-card-content">
                    <p className="event-category">{event.category}</p>
                    <h3>{event.title}</h3>
                    <p>{event.summary}</p>
                    <div className="event-meta">
                      <span>{formatEventDate(event.date)}</span>
                      <span>{event.venueName}</span>
                    </div>
                    <span className="card-link">Læs mere</span>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
