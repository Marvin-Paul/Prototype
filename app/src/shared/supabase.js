// Port of prototype/js/supabase-config.js
import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://nriqymkvilwfzuzsdxtl.supabase.co'
export const SUPABASE_ANON_KEY = 'sb_publishable_z87laaf0_0xqqDgrP55d4w_3RtVMKo7'

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
