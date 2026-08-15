// Supabase Configuration for Campus Mindspace
const SUPABASE_URL = 'https://mhzjrozlrkddpqdiruws.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_x5rabMxZ1Dy4C5-pBltZCA_yEXgGiM_';

if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Please ensure the CDN script is included in index.html');
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts
window.supabaseClient = supabaseClient;
