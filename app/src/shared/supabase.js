// Port of prototype/js/supabase-config.js
import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://mhzjrozlrkddpqdiruws.supabase.co'
export const SUPABASE_ANON_KEY = 'sb_publishable_x5rabMxZ1Dy4C5-pBltZCA_yEXgGiM_'

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
