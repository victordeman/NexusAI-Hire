// frontend/components/sidebar.js
class NexusSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isCollapsed = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        feather.replace(); // Initialize feather icons after render
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    height: 100%;
                }
                .sidebar {
                    height: 100vh;
                    width: 280px;
                    background: rgba(15, 23, 42, 0.9);
                    backdrop-filter: blur(12px);
                    border-right: 1px solid rgba(255, 255, 255, 0.08);
                    transition: width 0.3s ease;
                    position: relative;
                    overflow-y: auto;
                    color: #e2e8f0;
                }
                .sidebar.collapsed {
                    width: 72px;
                }
                .header {
                    padding: 20px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }
                .logo-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #4f46e5 0%, #10b981 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .logo-text {
                    font-weight: 700;
                    font-size: 1.4rem;
                    background: linear-gradient(to right, #818cf8, #34d399);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .nav {
                    padding: 16px 0;
                }
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 20px;
                    color: #94a3b8;
                    text-decoration: none;
                    transition: all 0.2s;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .nav-item:hover {
                    background: rgba(51, 65, 85, 0.5);
                    color: white;
                }
                .nav-item.active {
                    background: rgba(79, 70, 229, 0.15);
                    color: #c7d2fe;
                    border-left: 3px solid #6366f1;
                }
                .nav-item i {
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                }
                .toggle-btn {
                    position: absolute;
                    bottom: 20px;
                    left: 16px;
                    width: 40px;
                    height: 40px;
                    background: rgba(51, 65, 85, 0.6);
                    border: none;
                    border-radius: 10px;
                    color: #94a3b8;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .toggle-btn:hover {
                    background: rgba(99, 102, 241, 0.3);
                    color: white;
                }
                .collapsed .logo-text,
                .collapsed .nav-item span {
                    display: none;
                }
                .collapsed .header {
                    justify-content: center;
                }
                .collapsed .toggle-btn {
                    left: 16px;
                }
                @media (max-width: 1024px) {
                    .sidebar {
                        width: 72px;
                    }
                    .sidebar .logo-text,
                    .sidebar .nav-item span {
                        display: none;
                    }
                    .sidebar .header {
                        justify-content: center;
                    }
                }
            </style>

            <aside class="sidebar" id="sidebar">
                <div class="header">
                    <div class="logo-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                    </div>
                    <span class="logo-text">NexusAI</span>
                </div>

                <nav class="nav">
                    <div class="nav-item active" data-page="dashboard">
                        <i data-feather="layout"></i>
                        <span>Dashboard</span>
                    </div>
                    <div class="nav-item" data-page="interviews">
                        <i data-feather="video"></i>
                        <span>Interviews</span>
                    </div>
                    <div class="nav-item" data-page="candidates">
                        <i data-feather="users"></i>
                        <span>Candidates</span>
                    </div>
                    <div class="nav-item" data-page="analytics">
                        <i data-feather="bar-chart-2"></i>
                        <span>Analytics</span>
                    </div>
                    <div class="nav-item" data-page="settings">
                        <i data-feather="settings"></i>
                        <span>Settings</span>
                    </div>
                </nav>

                <button class="toggle-btn" id="toggle-sidebar" title="Toggle Sidebar">
                    <i data-feather="chevrons-left"></i>
                </button>
            </aside>
        `;
    }

    setupEventListeners() {
        const sidebar = this.shadowRoot.querySelector('#sidebar');
        const toggleBtn = this.shadowRoot.querySelector('#toggle-sidebar');
        const icon = toggleBtn.querySelector('i');

        toggleBtn.addEventListener('click', () => {
            this.isCollapsed = !this.isCollapsed;
            sidebar.classList.toggle('collapsed', this.isCollapsed);
            
            // Rotate icon direction
            icon.setAttribute('data-feather', this.isCollapsed ? 'chevrons-right' : 'chevrons-left');
            feather.replace();
            
            // Optional: dispatch event so main content can adjust margin
            this.dispatchEvent(new CustomEvent('sidebar-toggle', {
                detail: { collapsed: this.isCollapsed },
                bubbles: true,
                composed: true
            }));
        });

        // Optional: highlight active item based on current page (basic version)
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const items = this.shadowRoot.querySelectorAll('.nav-item');
        items.forEach(item => {
            const page = item.getAttribute('data-page');
            if ((page === 'dashboard' && currentPath.includes('dashboard')) ||
                (page === 'interviews' && currentPath.includes('interview'))) {
                item.classList.add('active');
            }
        });
    }
}

customElements.define('nexus-sidebar', NexusSidebar);
