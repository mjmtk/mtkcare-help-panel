import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file contains:\n' +
    'NEXT_PUBLIC_SUPABASE_URL=your-url\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side admin operations (API routes)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = serviceRoleKey 
  ? createClient(supabaseUrl, serviceRoleKey)
  : null