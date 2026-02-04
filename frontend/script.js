// NexusAI Hire - Shared JavaScript

// Utility Functions
const Utils = {
    // Format time duration from seconds to MM:SS
    formatDuration: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    // Format date to relative time
    timeAgo: (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "Just now";
    },

    // Debounce function for search inputs
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Generate random trust score for demo purposes
    generateTrustScore: () => {
        return Math.floor(Math.random() * (100 - 70) + 70);
    },

    // Store and retrieve from localStorage with expiration
    setWithExpiry: (key, value, ttl) => {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl,
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    getWithExpiry: (key) => {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        const item = JSON.parse(itemStr);
        const now = new Date();
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }
};

// API Simulation (would connect to real FastAPI backend)
const API = {
    // Simulate interview session creation
    createInterview: async (candidateData) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            id: 'int_' + Math.random().toString(36).substr(2, 9),
            status: 'created',
            url: `/interview.html?id=${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString()
        };
    },

    // Simulate LLM response
    getLLMResponse: async (message, model = 'gpt-4o-mini') => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const responses = [
            "That's an interesting approach. Can you elaborate on the time complexity?",
            "How would you handle edge cases in this scenario?",
            "Could you optimize this solution for better space complexity?",
            "What trade-offs did you consider when choosing this data structure?",
            "Let's move on to system design. How would you architect a scalable solution?"
        ];
        
        return {
            response: responses[Math.floor(Math.random() * responses.length)],
            model: model,
            tokens: Math.floor(Math.random() * 100) + 50,
            trust_score: Utils.generateTrustScore()
        };
    },

    // Simulate proctoring check
    checkProctoring: async (sessionId) => {
        const events = ['tab_switch', 'multiple_faces', 'noise_detected', 'looking_away'];
        const randomEvent = Math.random() > 0.8 ? events[Math.floor(Math.random() * events.length)] : null;
        
        return {
            session_id: sessionId,
            timestamp: new Date().toISOString(),
            event: randomEvent,
            severity: randomEvent ? ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] : null,
            trust_impact: randomEvent ? Math.floor(Math.random() * 10) : 0
        };
    }
};

// Theme Management
const ThemeManager = {
    init: () => {
        // Check for saved theme preference or default to dark
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
        } else {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    },

    toggle: () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    
    // Initialize Feather Icons if not already done
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Export for use in other scripts
window.NexusAI = {
    Utils,
    API,
    ThemeManager
};
