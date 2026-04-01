import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.https://tkpatolybraskbedknjc.supabase.co,
    process.env.sb_publishable_hrQmBCRFxI0YhyCkk7SOzA_1BvyFC9U
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `https://centro-educacional-de-itaborai/dashboard.html`,
    },
  })

  if (error) return res.status(400).json({ error: error.message })

  res.redirect(data.url)
}
