class NexusFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const year = new Date().getFullYear();
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #020617;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    color: #94a3b8;
                    font-family: 'Inter', sans-serif;
                }
                .footer {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 64px 24px 32px;
                }
                .grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 48px;
                    margin-bottom: 48px;
                }
                .brand {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 700;
                    font-size: 1.5rem;
                    color: white;
                    text-decoration: none;
                }
                .logo-icon {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #4f46e5 0%, #10b981 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .description {
                    line-height: 1.6;
                    font-size: 0.9375rem;
                }
                .heading {
                    color: white;
                    font-weight: 600;
                    margin-bottom: 20px;
                    font-size: 1rem;
                }
                .links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .link {
                    color: #94a3b8;
                    text-decoration: none;
                    font-size: 0.875rem;
                    transition: color 0.2s;
                }
                .link:hover {
                    color: white;
                }
                .socials {
                    display: flex;
                    gap: 16px;
                    margin-top: 24px;
                }
                .social-icon {
                    color: #94a3b8;
                    transition: color 0.2s;
                }
                .social-icon:hover {
                    color: white;
                }
                .bottom {
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    padding-top: 32px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.875rem;
                }
                @media (max-width: 768px) {
                    .grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 32px;
                    }
                    .brand {
                        grid-column: span 2;
                    }
                    .bottom {
                        flex-direction: column;
                        gap: 16px;
                        text-align: center;
                    }
                }
                @media (max-width: 480px) {
                    .grid {
                        grid-template-columns: 1fr;
                    }
                    .brand {
                        grid-column: span 1;
                    }
                }
            </style>

            <footer class="footer">
                <div class="grid">
                    <div class="brand">
                        <a href="index.html" class="logo">
                            <div class="logo-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                            </div>
                            <span>NexusAI</span>
                        </a>
                        <p class="description">
                            The next generation AI-powered interview platform.
                            Automate your technical screening process with adaptive
                            intelligence and real-time behavioral analysis.
                        </p>
                        <div class="socials">
                            <a href="#" class="social-icon" aria-label="Twitter">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </a>
                            <a href="#" class="social-icon" aria-label="GitHub">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            </a>
                            <a href="#" class="social-icon" aria-label="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <div class="heading">Product</div>
                        <ul class="links">
                            <li><a href="#" class="link">Features</a></li>
                            <li><a href="#" class="link">Pricing</a></li>
                            <li><a href="#" class="link">API</a></li>
                            <li><a href="#" class="link">Models</a></li>
                        </ul>
                    </div>

                    <div>
                        <div class="heading">Company</div>
                        <ul class="links">
                            <li><a href="#" class="link">About Us</a></li>
                            <li><a href="#" class="link">Careers</a></li>
                            <li><a href="#" class="link">Blog</a></li>
                            <li><a href="#" class="link">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <div class="heading">Legal</div>
                        <ul class="links">
                            <li><a href="#" class="link">Privacy Policy</a></li>
                            <li><a href="#" class="link">Terms of Service</a></li>
                            <li><a href="#" class="link">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div class="bottom">
                    <div>&copy; ${year} NexusAI Hire. All rights reserved.</div>
                    <div style="display: flex; gap: 24px;">
                        <span>Built with AI for AI.</span>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('nexus-footer', NexusFooter);
