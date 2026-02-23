// Interview Page Logic
import './script.js';

window.chatInterface = function() {
    return {
        messages: [
            {
                id: Date.now(),
                sender: 'ai',
                text: "Hello Sarah, I'm the NexusAI interviewer. We'll be discussing your experience with React and modern frontend architectures today. Are you ready to begin?"
            }
        ],
        userInput: '',
        isTyping: false,
        isListening: false,
        currentInterviewId: null,

        init() {
            console.log('chatInterface init');
            this.$nextTick(() => {
                this.scrollToBottom();
            });

            document.addEventListener('voice-end', () => {
                this.isListening = false;
            });

            // Listen for model changes
            window.addEventListener('model-changed', (e) => {
                const badge = document.getElementById('model-badge');
                if (badge) {
                    badge.textContent = e.detail.modelName;
                }
            });

            // Initial badge update
            this.updateModelBadge();
        },

        updateModelBadge() {
            const badge = document.getElementById('model-badge');
            if (badge) {
                const model = localStorage.getItem('preferredModel') || 'openai/gpt-4o-mini';
                const modelName = model.split('/').pop();
                badge.textContent = modelName;
            }
        },

        getIcon(sender) {
            const iconName = sender === 'ai' ? 'cpu' : 'user';
            const iconColor = sender === 'ai' ? 'text-white' : 'text-slate-300';
            if (typeof feather !== 'undefined' && feather.icons[iconName]) {
                return feather.icons[iconName].toSvg({ class: `w-5 h-5 ${iconColor}` });
            }
            return '';
        },

        autoResize(el) {
            el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 128) + 'px';
        },

        scrollToBottom() {
            const container = document.getElementById('chat-messages');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        },

        toggleMic() {
            console.log('toggleMic');
            if (this.isListening) {
                NexusAI.Voice.stop();
                this.isListening = false;
            } else {
                const supported = NexusAI.Voice.init(
                    (transcript, isFinal) => {
                        this.userInput = transcript;
                    },
                    (err) => {
                        this.isListening = false;
                        console.error('Voice recognition error:', err);
                    }
                );

                if (supported) {
                    NexusAI.Voice.start();
                    this.isListening = true;
                } else {
                    alert('Speech recognition is not supported in your browser.');
                }
            }
        },

        async send() {
            const text = this.userInput.trim();
            if (!text || this.isTyping) return;

            this.messages.push({
                id: Date.now(),
                sender: 'user',
                text: text
            });

            this.userInput = '';
            this.$nextTick(() => {
                this.scrollToBottom();
                const textarea = document.getElementById('message-input');
                if (textarea) textarea.style.height = 'auto';
            });

            this.isTyping = true;
            this.$nextTick(() => this.scrollToBottom());

            const currentModel = localStorage.getItem('preferredModel') || "openai/gpt-4o-mini";

            try {
                const data = await NexusAI.API.ask(text, currentModel, this.currentInterviewId);

                if (data.interview_id) {
                    this.currentInterviewId = data.interview_id;
                }

                this.isTyping = false;
                this.messages.push({
                    id: Date.now(),
                    sender: 'ai',
                    text: data.answer
                });

                if (data.trust_score) {
                    const trustEl = document.getElementById('main-trust-score');
                    if (trustEl) trustEl.setAttribute('score', data.trust_score);
                }
                this.$nextTick(() => this.scrollToBottom());

            } catch (err) {
                this.isTyping = false;
                this.messages.push({
                    id: Date.now(),
                    sender: 'ai',
                    text: 'Sorry, I could not reach the server. Is the backend running?'
                });
                NexusAI.Utils.log(err.message, 'error');
                this.$nextTick(() => this.scrollToBottom());
            }
        },

        clear() {
            if (confirm('Are you sure you want to clear the chat history?')) {
                this.messages = [{
                    id: Date.now(),
                    sender: 'ai',
                    text: "Chat cleared. How can I help you?"
                }];
            }
        }
    };
};

window.endInterview = function() {
    if (confirm('End interview and generate final report?')) {
        window.location.href = 'dashboard.html';
    }
}
