import { SUPABASE_URL, supabaseHeaders } from "./supabase";

export async function getRegistrations() {
  const response = await fetch(
    `${SUPABASE_URL}/registrations?select=*,event:events(title,date,venueName)&order=createdAt.desc`,
    {
      headers: supabaseHeaders,
    },
  );

  if (!response.ok) {
    throw new Error("Tilmeldingerne kunne ikke hentes");
  }

  return response.json();
}

export async function registrationExists(email, eventId) {
  const params = new URLSearchParams({
    select: "id",
    email: `ilike.${email.trim()}`,
    eventId: `eq.${eventId}`,
    limit: "1",
  });

  const response = await fetch(
    `${SUPABASE_URL}/registrations?${params.toString()}`,
    {
      headers: supabaseHeaders,
    },
  );

  if (!response.ok) {
    throw new Error("Tilmeldingen kunne ikke kontrolleres");
  }

  const data = await response.json();

  return data.length > 0;
}

export async function createRegistration(registration) {
  const response = await fetch(`${SUPABASE_URL}/registrations`, {
    method: "POST",
    headers: supabaseHeaders,
    body: JSON.stringify(registration),
  });

  if (!response.ok) {
    throw new Error("Tilmeldingen kunne ikke gemmes");
  }
}
