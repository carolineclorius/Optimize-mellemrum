import { SUPABASE_URL, supabaseHeaders } from "./supabase";

export async function getRegistrations() {
  const response = await fetch(
    `${SUPABASE_URL}/registrations?select=*,event:events(title,date,venueName)&order=createdAt.desc`,
    {
      headers: supabaseHeaders,
    },
  );

  return response.json();
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
