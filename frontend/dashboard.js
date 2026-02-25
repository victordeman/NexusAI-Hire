// frontend/dashboard.js - Dashboard specific logic
import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', async () => {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) return;

    initModelPerformanceChart();
    initActivityFeed();
    initLiveStats();
    loadRealInterviews();
});

async function checkAdminAccess() {
    if (!window.NexusAI || !window.NexusAI.Auth || !window.NexusAI.Auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }

    try {
        const response = await fetch('/api/v1/profile/me', {
            headers: {
                'Authorization': `Bearer ${window.NexusAI.Auth.getToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        
        const profile = await response.json();
        
        if (!profile || !profile.is_admin) {
            alert('Access Denied: Only administrators can view the dashboard.');
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Auth check failed', error);
        window.location.href = 'index.html';
        return false;
    }
}

async function loadRealInterviews() {
    if (window.NexusAI && window.NexusAI.Auth && window.NexusAI.Auth.isAuthenticated()) {
        try {
            const interviews = await window.NexusAI.API.listInterviews();
            updateDashboardStats(interviews);
        } catch (error) {
            console.error('Failed to load real interviews', error);
        }
    }
}

function updateDashboardStats(interviews) {
    if (!interviews || interviews.length === 0) return;

    // Update Completed Interviews count
    const completedEl = document.querySelectorAll('.text-2xl.font-bold.text-white')[1];
    if (completedEl) {
        completedEl.textContent = interviews.length;
    }

    // Update Average Trust Score
    const trustAvgEl = document.querySelectorAll('.text-2xl.font-bold.text-white')[3];
    if (trustAvgEl) {
        const avg = interviews.reduce((sum, int) => sum + (int.trust_score || 0), 0) / interviews.length;
        trustAvgEl.textContent = avg.toFixed(1);
    }
}

function initModelPerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['GPT-4o', 'Gemini 1.5 Pro', 'Llama 3', 'Claude 3.5'],
            datasets: [{
                data: [45, 25, 15, 15],
                backgroundColor: [
                    '#6366f1', // primary-500
                    '#10b981', // secondary-500
                    '#f59e0b', // orange-500
                    '#8b5cf6'  // purple-500
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12 }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

const activities = [
    { user: 'Sarah Chen', action: 'started interview', time: 'Just now', type: 'start' },
    { user: 'System', action: 'generated trust report for David Park', time: '2m ago', type: 'info' },
    { user: 'Marcus Johnson', action: 'completed technical round', time: '5m ago', type: 'success' },
    { user: 'GPT-4o', action: 'switched to high-precision mode', time: '12m ago', type: 'system' }
];

function addActivity(activity) {
    const feed = document.getElementById('activity-feed');
    if (!feed) return;

    const item = document.createElement('div');
    item.className = 'flex gap-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 animate-fade-in';
    
    const colorClass = activity.type === 'start' ? 'bg-primary-500' : 
                     activity.type === 'success' ? 'bg-secondary-500' :
                     activity.type === 'system' ? 'bg-purple-500' : 'bg-slate-500';

    item.innerHTML = `
        <div class="w-2 h-2 mt-2 rounded-full ${colorClass}"></div>
        <div>
            <p class="text-sm text-slate-200">${activity.user} <span class="text-slate-400">${activity.action}</span></p>
            <p class="text-xs text-slate-500 mt-1">${activity.time}</p>
        </div>
    `;
    feed.prepend(item);
    if (feed.children.length > 10) feed.lastElementChild.remove();
}

function initActivityFeed() {
    // Simulate initial activities
    activities.forEach((act, i) => {
        setTimeout(() => addActivity(act), i * 500);
    });

    // Simulate new activities every 20 seconds
    setInterval(() => {
        const users = ['Lisa Wang', 'James Miller', 'System', 'Claude 3.5'];
        const actions = ['started interview', 'submitted feedback', 'updated model preference', 'completed assessment'];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        addActivity({
            user: randomUser,
            action: randomAction,
            time: 'Just now',
            type: Math.random() > 0.5 ? 'start' : 'info'
        });
    }, 20000);
}

function initLiveStats() {
    // Update stats randomly to feel "live"
    setInterval(() => {
        const activeCandidates = document.querySelector('.text-2xl.font-bold.text-white');
        if (activeCandidates) {
            const current = parseInt(activeCandidates.textContent);
            if (!isNaN(current)) {
                const change = Math.random() > 0.5 ? 1 : -1;
                activeCandidates.textContent = Math.max(0, current + change);
            }
        }
    }, 10000);
}
