// frontend/components/model-selector.js
class NexusModelSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .container {
                    position: relative;
                }
                select {
                    appearance: none;
                    background: rgba(51, 65, 85, 0.6);
                    border: 1px solid rgba(99, 102, 241, 0.4);
                    border-radius: 8px;
                    color: white;
                    padding: 8px 32px 8px 12px;
                    font-size: 14px;
                    width: 220px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                select:hover {
                    background: rgba(51, 65, 85, 0.8);
                    border-color: #818cf8;
                }
                select:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
                }
                .icon {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    color: #94a3b8;
                }
            </style>
            
            <div class="container">
                <select id="model-select">
                    <option value="openai/gpt-4o-mini">GPT-4o-mini (fast & cheap)</option>
                    <option value="openai/gpt-4o">GPT-4o</option>
                    <option value="google/gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="ollama/llama3">Llama 3 (local)</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                </select>
                <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        `;
    }

    setupEventListeners() {
        const select = this.shadowRoot.querySelector('#model-select');
        
        // Restore previously selected model
        const savedModel = localStorage.getItem('preferredModel');
        if (savedModel) {
            select.value = savedModel;
        }

        select.addEventListener('change', (e) => {
            const model = e.target.value;
            localStorage.setItem('preferredModel', model);
            
            // Notify the page (interview.html / dashboard.html can listen)
            this.dispatchEvent(new CustomEvent('model-changed', {
                detail: { model },
                bubbles: true,
                composed: true
            }));
            
            console.log('Model changed to:', model);
        });
    }
}

customElements.define('nexus-model-selector', NexusModelSelector);
