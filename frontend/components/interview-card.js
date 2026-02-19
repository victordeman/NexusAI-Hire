class NexusInterviewCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const name = this.getAttribute('name') || 'Unknown';
        const role = this.getAttribute('role') || 'Candidate';
        const status = this.getAttribute('status') || 'live';
        const model = this.getAttribute('model') || 'GPT-4o';
        const trustScore = this.getAttribute('trust-score') || '0';
        const duration = this.getAttribute('duration') || '00:00';
        const avatarType = this.getAttribute('avatar') || 'people';
        const avatarId = Math.floor(Math.random() * 10) + 1;
        const avatarUrl = `https://static.photos/${avatarType}/40x40/${avatarId}`;

        const statusClass = `status-${status}`;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-bottom: 1rem;
                }
                .card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1rem;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.3s ease;
                }
                .card:hover {
                    background: rgba(30, 41, 59, 0.6);
                    border-color: rgba(99, 102, 241, 0.2);
                    transform: translateX(4px);
                }
                .info-section {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .avatar {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 0.75rem;
                    object-cover: cover;
                }
                .details h4 {
                    margin: 0;
                    color: white;
                    font-size: 1rem;
                }
                .details p {
                    margin: 0;
                    color: #94a3b8;
                    font-size: 0.875rem;
                }
                .meta-section {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                .status-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }
                .status-live {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                .status-paused {
                    background: rgba(245, 158, 11, 0.1);
                    color: #f59e0b;
                    border: 1px solid rgba(245, 158, 11, 0.2);
                }
                .status-completed {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }
                .model-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                .model-name {
                    font-size: 0.75rem;
                    color: #94a3b8;
                }
                .duration {
                    font-size: 0.875rem;
                    color: white;
                    font-weight: 500;
                }
                @media (max-width: 640px) {
                    .meta-section {
                        gap: 1rem;
                    }
                    .hide-mobile {
                        display: none;
                    }
                }
            </style>
            <div class="card">
                <div class="info-section">
                    <img src="${avatarUrl}" class="avatar" alt="${name}">
                    <div class="details">
                        <h4>${name}</h4>
                        <p>${role}</p>
                    </div>
                </div>
                <div class="meta-section">
                    <div class="model-info hide-mobile">
                        <span class="model-name">${model}</span>
                        <span class="duration">${duration}</span>
                    </div>
                    <div class="status-badge ${statusClass}">${status}</div>
                    <nexus-trust-score score="${trustScore}"></nexus-trust-score>
                </div>
            </div>
        `;

        // Ensure trust-score component is loaded or it won't render inside shadow DOM if not defined yet
        // But since they are both defined as custom elements, it should work if the script is loaded.
    }
}

customElements.define('nexus-interview-card', NexusInterviewCard);
