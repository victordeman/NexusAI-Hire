// frontend/components/interview-card.js
class NexusInterviewCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['name', 'role', 'status', 'model', 'trust-score', 'duration', 'avatar'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const name = this.getAttribute('name') || 'Unknown';
        const role = this.getAttribute('role') || 'Candidate';
        const status = this.getAttribute('status') || 'pending';
        const model = this.getAttribute('model') || 'GPT-4o';
        const trustScore = this.getAttribute('trust-score') || '0';
        const duration = this.getAttribute('duration') || '00:00';
        const avatar = this.getAttribute('avatar') || '1';

        // Map avatar names to static photo URLs if they aren't numbers
        const avatarUrl = isNaN(avatar) 
            ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            : `https://static.photos/people/40x40/${avatar}`;

        const statusClass = `status-${status}`;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                .card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    transition: all 0.3s ease;
                }
                .card:hover {
                    background: rgba(30, 41, 59, 0.6);
                    border-color: rgba(99, 102, 241, 0.3);
                    transform: translateY(-2px);
                }
                .info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                }
                .avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px;
                    object-cover: cover;
                }
                .details h4 {
                    margin: 0;
                    color: white;
                    font-size: 1rem;
                    font-weight: 600;
                }
                .details p {
                    margin: 2px 0 0;
                    color: #94a3b8;
                    font-size: 0.8125rem;
                }
                .meta {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }
                .badge {
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }
                .status-live {
                    background: rgba(239, 68, 68, 0.1);
                    color: #f87171;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                .status-paused {
                    background: rgba(245, 158, 11, 0.1);
                    color: #fbbf24;
                    border: 1px solid rgba(245, 158, 11, 0.2);
                }
                .status-completed {
                    background: rgba(16, 185, 129, 0.1);
                    color: #34d399;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }
                .model-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    min-width: 100px;
                }
                .model-name {
                    color: #cbd5e1;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                .duration {
                    color: #64748b;
                    font-size: 0.6875rem;
                    margin-top: 2px;
                }
                .score-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-width: 60px;
                    justify-content: flex-end;
                }
                .score-value {
                    font-weight: 700;
                    color: #10b981;
                }
                @media (max-width: 640px) {
                    .meta { gap: 12px; }
                    .hide-mobile { display: none; }
                }
            </style>
            
            <div class="card">
                <div class="info">
                    <img src="${avatarUrl}" alt="${name}" class="avatar">
                    <div class="details">
                        <h4>${name}</h4>
                        <p>${role}</p>
                    </div>
                </div>
                
                <div class="meta">
                    <div class="badge ${statusClass}">${status}</div>
                    
                    <div class="model-info hide-mobile">
                        <span class="model-name">${model}</span>
                        <span class="duration">${duration}</span>
                    </div>
                    
                    <div class="score-container">
                        <span class="score-value">${trustScore}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('nexus-interview-card', NexusInterviewCard);
