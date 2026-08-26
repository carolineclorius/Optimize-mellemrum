import { SUPABASE_URL, supabaseHeaders } from "./supabase";

export async function getEvents() {
  const response = await fetch(`${SUPABASE_URL}/events?order=date.asc`, {
    headers: supabaseHeaders,
  });

  return response.json();
}

export async function getEventById(eventId) {
  const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}`, {
    headers: supabaseHeaders,
  });

  const data = await response.json();

  return data[0];
}
