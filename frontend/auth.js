// NexusAI Hire - Supabase Auth Integration

(function() {
    // These should be configured via environment variables in a production build
    // For now, we'll look for them in localStorage or use placeholders
    const config = {
        url: window.SUPABASE_URL || localStorage.getItem('NEXUS_SUPABASE_URL') || "",
        key: window.SUPABASE_KEY || localStorage.getItem('NEXUS_SUPABASE_KEY') || ""
    };

    // Initialize Supabase Client
    // We use window.supabase which is provided by the CDN script
    if (window.supabase && typeof window.supabase.createClient === 'function' && config.url && config.key) {
        window.supabaseClient = window.supabase.createClient(config.url, config.key);
    }

    const Auth = {
        getClient: () => window.supabaseClient,

        signUp: async (email, password) => {
            const client = Auth.getClient();
            if (!client) return { error: { message: "Supabase not configured" } };
            return await client.auth.signUp({ email, password });
        },

        signIn: async (email, password) => {
            const client = Auth.getClient();
            if (!client) return { error: { message: "Supabase not configured" } };
            return await client.auth.signInWithPassword({ email, password });
        },

        signOut: async () => {
            const client = Auth.getClient();
            if (!client) return;
            await client.auth.signOut();
            localStorage.removeItem('nexus_auth_token');
            window.location.href = 'index.html';
        },

        getSession: async () => {
            const client = Auth.getClient();
            if (!client) return { data: { session: null } };
            return await client.auth.getSession();
        },

        getUser: async () => {
            const client = Auth.getClient();
            if (!client) return { data: { user: null } };
            return await client.auth.getUser();
        },

        getToken: () => {
            return localStorage.getItem('nexus_auth_token');
        },

        isAuthenticated: () => {
            return !!localStorage.getItem('nexus_auth_token');
        },

        handleAuthStateChange: (event, session) => {
            if (session) {
                localStorage.setItem('nexus_auth_token', session.access_token);
                NexusAI.Utils.log('User signed in', 'success');
            } else {
                localStorage.removeItem('nexus_auth_token');
                NexusAI.Utils.log('User signed out', 'info');
            }
            document.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { event, session } }));
        }
    };

    // Export to global NexusAI namespace
    if (window.NexusAI) {
        window.NexusAI.Auth = Auth;
    } else {
        window.NexusAI = { Auth: Auth };
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', async () => {
        const client = Auth.getClient();
        if (client) {
            client.auth.onAuthStateChange((event, session) => {
                Auth.handleAuthStateChange(event, session);
            });

            // Initial session check
            const { data: { session } } = await client.auth.getSession();
            if (session) {
                Auth.handleAuthStateChange('INITIAL', session);
            }
        } else {
            console.warn("NexusAI: Supabase client not initialized. Check your URL and KEY.");
        }
    });
})();
