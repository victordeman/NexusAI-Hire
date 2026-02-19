class NexusNavbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .navbar {
                    height: 64px;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                    z-index: 40;
                }
                .left-section {
                    display: flex;
                    align-items: center;
                    gap: 32px;
                }
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                }
                .logo-icon {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #6366f1 0%, #10b981 100%);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .logo-text {
                    font-weight: 700;
                    font-size: 1.25rem;
                    color: white;
                }
                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .nav-link {
                    color: #94a3b8;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    padding: 8px 16px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .nav-link:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }
                .nav-link.active {
                    color: white;
                    background: rgba(99, 102, 241, 0.1);
                }
                .actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .icon-btn {
                    position: relative;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: color 0.2s;
                    background: none;
                    border: none;
                }
                .icon-btn:hover {
                    color: white;
                }
                .profile {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding-left: 16px;
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                }
                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    object-fit: cover;
                }
                @media (max-width: 1024px) {
                    .nav-links, .user-info {
                        display: none;
                    }
                }
            </style>
            <div class="navbar">
                <div class="left-section">
                    <a href="index.html" class="logo">
                        <div class="logo-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        </div>
                        <span class="logo-text">NexusAI</span>
                    </a>

                    <nav class="nav-links">
                        <a href="dashboard.html" class="nav-link">Dashboard</a>
                        <a href="interview.html" class="nav-link">Interviews</a>
                        <a href="#" class="nav-link">Candidates</a>
                        <a href="#" class="nav-link">Analytics</a>
                    </nav>
                </div>
                
                <div class="actions">
                    <button class="icon-btn" onclick="NexusAI.ThemeManager.toggle()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    </button>

                    <div class="profile">
                        <img src="https://static.photos/people/32x32/5" alt="Profile" class="avatar">
                    </div>
                </div>
            </div>
        `;

        // Highlight active link
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const links = this.shadowRoot.querySelectorAll('.nav-link');
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
}

customElements.define('nexus-navbar', NexusNavbar);
