// Supabase Configuration for Campus Mindspace
const SUPABASE_URL = 'https://nriqymkvilwfzuzsdxtl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_z87laaf0_0xqqDgrP55d4w_3RtVMKo7';

if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Please ensure the CDN script is included in index.html');
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts
window.supabaseClient = supabaseClient;
