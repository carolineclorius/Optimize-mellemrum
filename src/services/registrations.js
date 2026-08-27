import { SUPABASE_URL, supabaseHeaders } from "./supabase";

export async function getRegistrations() {
  const response = await fetch(
    `${SUPABASE_URL}/registrations?order=createdAt.desc`,
    {
      headers: supabaseHeaders,
    },
  );

  return response.json();
}

export async function createRegistration(registration) {
  await fetch(`${SUPABASE_URL}/registrations`, {
    method: "POST",
    headers: supabaseHeaders,
    body: JSON.stringify(registration),
  });
}
