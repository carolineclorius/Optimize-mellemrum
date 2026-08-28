import { SUPABASE_URL, supabaseHeaders } from "./supabase";

export async function getEvents() {
  const response = await fetch(`${SUPABASE_URL}/events?order=date.asc`, {
    headers: supabaseHeaders,
  });

  if (!response.ok) {
    throw new Error("Events kunne ikke hentes");
  }

  return response.json();
}

export async function getEventById(eventId) {
  const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}`, {
    headers: supabaseHeaders,
  });

  if (!response.ok) {
    throw new Error("Eventet kunne ikke hentes");
  }

  const data = await response.json();

  return data[0];
}
