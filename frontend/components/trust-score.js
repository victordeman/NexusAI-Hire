// frontend/components/trust-score.js
class NexusTrustScore extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['score'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const score = parseInt(this.getAttribute('score') || '0');
        const color = score >= 90 ? '#10b981' : score >= 80 ? '#f59e0b' : '#ef4444';

        // Circular progress calculation
        const radius = 18;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                .container {
                    position: relative;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                svg {
                    transform: rotate(-90deg);
                }
                circle {
                    fill: none;
                    stroke-width: 3;
                }
                .bg {
                    stroke: rgba(255, 255, 255, 0.05);
                }
                .progress {
                    stroke: ${color};
                    stroke-dasharray: ${circumference};
                    stroke-dashoffset: ${offset};
                    stroke-linecap: round;
                    transition: stroke-dashoffset 0.5s ease;
                }
                .text {
                    position: absolute;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: ${color};
                }
            </style>
            <div class="container">
                <svg width="44" height="44">
                    <circle class="bg" cx="22" cy="22" r="${radius}"></circle>
                    <circle class="progress" cx="22" cy="22" r="${radius}"></circle>
                </svg>
                <span class="text">${score}</span>
            </div>
        `;
    }
}

customElements.define('nexus-trust-score', NexusTrustScore);
