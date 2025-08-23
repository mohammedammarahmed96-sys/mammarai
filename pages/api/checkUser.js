// pages/api/checkUser.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use service role key here
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  try {
    const { data, error } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", email);

    if (error) return res.status(400).json({ error: error.message });

    if (data && data.length > 0) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
