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
    },

    // Logger utility
    log: (msg, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const colors = {
            info: '#6366f1',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        console.log(
            `%c[NexusAI ${timestamp}] %c${msg}`, 
            `color: ${colors[type] || colors.info}; font-weight: bold`, 
            'color: inherit'
        );
    }
};

// API Integration
const API = {
    // Real API call to get LLM response
    ask: async (question, model, interviewId = null) => {
        try {
            Utils.log(`Sending question to ${model || 'default model'}...`);
            
            const headers = { 'Content-Type': 'application/json' };
            const token = NexusAI.Auth.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/v1/ask', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    interview_id: interviewId,
                    question: question,
                    model: model
                })
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            Utils.log('Received response from API', 'success');
            return data;
        } catch (error) {
            Utils.log(`API Error: ${error.message}`, 'error');
            throw error;
        }
    },

    // Fetch interviews from backend
    listInterviews: async () => {
        try {
            const headers = {};
            const token = NexusAI.Auth.getToken();
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/v1/interviews', { headers });
            if (!response.ok) throw new Error('Failed to fetch interviews');
            return await response.json();
        } catch (error) {
            Utils.log(`API Error: ${error.message}`, 'error');
            return [];
        }
    },

    getInterview: async (id) => {
        try {
            const headers = {};
            const token = NexusAI.Auth.getToken();
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`/api/v1/interviews/${id}`, { headers });
            if (!response.ok) throw new Error('Failed to fetch interview');
            return await response.json();
        } catch (error) {
            Utils.log(`API Error: ${error.message}`, 'error');
            throw error;
        }
    },

    // Simulate interview session creation
    createInterview: async (candidateData) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            id: 'int_' + Math.random().toString(36).substr(2, 9),
            status: 'created',
            url: `/interview.html?id=${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString()
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

// UI Components & Utilities
const UI = {
    Chat: {
        renderMessage: (containerId, text, sender) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            const div = document.createElement('div');
            div.className = `flex gap-4 ${sender === 'user' ? 'flex-row-reverse' : ''} max-w-3xl ${sender === 'user' ? 'ml-auto' : ''} animate-fade-in`;
            
            const iconName = sender === 'ai' ? 'cpu' : 'user';
            const iconBg = sender === 'ai' ? 'bg-primary-600' : 'bg-slate-700';
            const iconColor = sender === 'ai' ? 'text-white' : 'text-slate-300';

            // Safe icon injection
            let iconHtml = `<i data-feather="${iconName}"></i>`;
            if (typeof feather !== 'undefined' && feather.icons[iconName]) {
                iconHtml = feather.icons[iconName].toSvg({ class: `w-5 h-5 ${iconColor}` });
            }

            // Safe message text injection (XSS prevention)
            const messageDiv = document.createElement('div');
            messageDiv.className = `${sender === 'ai' ? 'message-ai' : 'message-user'} p-4 rounded-2xl text-slate-200`;
            messageDiv.textContent = text;

            div.innerHTML = `
                <div class="w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0">
                    ${iconHtml}
                </div>
            `;
            div.appendChild(messageDiv);
            
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        },

        showTypingIndicator: (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            const div = document.createElement('div');
            div.id = 'typing-indicator';
            div.className = 'flex gap-4 max-w-3xl animate-fade-in';

            // Safe icon injection
            let iconHtml = `<i data-feather="cpu"></i>`;
            if (typeof feather !== 'undefined' && feather.icons['cpu']) {
                iconHtml = feather.icons['cpu'].toSvg({ class: 'w-5 h-5 text-white' });
            }

            div.innerHTML = `
                <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                    ${iconHtml}
                </div>
                <div class="message-ai p-4 rounded-2xl text-slate-200 flex items-center gap-1">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        },

        removeTypingIndicator: () => {
            const el = document.getElementById('typing-indicator');
            if (el) el.remove();
        }
    },

    Forms: {
        handleDemoRequest: (emailInputSelector, submitBtnSelector, modalSelector) => {
            const emailInput = document.querySelector(emailInputSelector);
            const btn = document.querySelector(submitBtnSelector);
            const modal = document.querySelector(modalSelector);
            
            if (!emailInput || !btn) return;

            const email = emailInput.value;
            if (email && email.includes('@')) {
                const originalText = btn.innerText;
                btn.innerText = 'Request Sent!';
                btn.classList.remove('bg-primary-600');
                btn.classList.add('bg-secondary-600');
                btn.disabled = true;
                
                Utils.log(`Demo request submitted for: ${email}`, 'success');

                setTimeout(() => {
                    if (modal) modal.classList.add('hidden');
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.classList.remove('bg-secondary-600');
                        btn.classList.add('bg-primary-600');
                        btn.disabled = false;
                        emailInput.value = '';
                    }, 500);
                }, 1500);
            } else {
                alert('Please enter a valid work email.');
                Utils.log('Invalid email for demo request', 'warning');
            }
        }
    }
};

// Theme Management
const ThemeManager = {
    init: () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } else if (systemPrefersDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            // Default to dark as per project aesthetic, but could be light
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    },

    toggle: () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            Utils.log('Theme switched to light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            Utils.log('Theme switched to dark');
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
    
    Utils.log('System initialized', 'success');
});

// Export for use in other scripts
window.NexusAI = {
    Utils,
    API,
    UI,
    ThemeManager
};
