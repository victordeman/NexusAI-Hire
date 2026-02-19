class NexusFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                footer {
                    background: #020617;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 48px 24px;
                    color: #94a3b8;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 40px;
                    margin: 0 auto;
                }
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 700;
                    font-size: 1.25rem;
                    color: white;
                    margin-bottom: 16px;
                }
                .logo-icon {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #4f46e5 0%, #10b981 100%);
                    border-radius: 8px;
                }
                h4 {
                    color: white;
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 20px;
                }
                ul {
                    list-style: none;
                    padding: 0;
                }
                li {
                    margin-bottom: 12px;
                }
                a {
                    color: #94a3b8;
                    text-decoration: none;
                    font-size: 0.875rem;
                    transition: color 0.2s;
                }
                a:hover {
                    color: white;
                }
                .bottom {
                    max-width: 1200px;
                    margin: 48px auto 0;
                    padding-top: 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                }
            </style>
            <footer>
                <div class="container">
                    <div>
                        <div class="logo">
                            <div class="logo-icon"></div>
                            <span>NexusAI</span>
                        </div>
                        <p style="font-size: 0.875rem; line-height: 1.6;">
                            Revolutionizing the hiring process with AI-powered adaptive interviews and real-time behavioral insights.
                        </p>
                    </div>
                    <div>
                        <h4>Platform</h4>
                        <ul>
                            <li><a href="dashboard.html">Dashboard</a></li>
                            <li><a href="interview.html">Demo Interview</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">Integrations</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Documentation</a></li>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Status</a></li>
                        </ul>
                    </div>
                </div>
                <div class="bottom">
                    <span>© 2024 NexusAI Hire. All rights reserved.</span>
                    <div style="display: flex; gap: 16px;">
                        <a href="#">Twitter</a>
                        <a href="#">LinkedIn</a>
                        <a href="#">GitHub</a>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('nexus-footer', NexusFooter);
