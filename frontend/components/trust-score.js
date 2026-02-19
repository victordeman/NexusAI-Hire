class NexusTrustScore extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['score'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'score' && oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const score = parseInt(this.getAttribute('score') || '0');
        const radius = 28;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;

        let color = '#10b981'; // Default green
        if (score < 70) color = '#ef4444'; // Red
        else if (score < 85) color = '#f59e0b'; // Orange

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                .trust-score-ring {
                    position: relative;
                    width: 64px;
                    height: 64px;
                    display: flex;
                    items-center: center;
                    justify-content: center;
                }
                svg {
                    transform: rotate(-90deg);
                    width: 64px;
                    height: 64px;
                }
                circle {
                    fill: none;
                    stroke-width: 4;
                }
                .bg {
                    stroke: #1e293b;
                }
                .progress {
                    stroke: ${color};
                    stroke-linecap: round;
                    transition: stroke-dashoffset 0.5s ease;
                    stroke-dasharray: ${circumference};
                    stroke-dashoffset: ${offset};
                }
                .trust-score-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: white;
                }
            </style>
            <div class="trust-score-ring">
                <svg>
                    <circle class="bg" cx="32" cy="32" r="${radius}"></circle>
                    <circle class="progress" cx="32" cy="32" r="${radius}"></circle>
                </svg>
                <div class="trust-score-text">${score}</div>
            </div>
        `;
    }
}

customElements.define('nexus-trust-score', NexusTrustScore);
