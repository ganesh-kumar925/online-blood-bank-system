/* =========================================================================
   AI CHATBOT WIDGET
   ========================================================================= */

(function initChatbot() {
    // 1. Inject CSS for chatbot specifically
    const style = document.createElement('style');
    style.textContent = `
        .cb-widget {
            position: fixed;
            bottom: 32px;
            right: 32px;
            z-index: 9999;
            font-family: var(--font-body);
        }
        .cb-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--gradient-red);
            border: none;
            color: white;
            box-shadow: 0 8px 24px rgba(232, 25, 44, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
            position: relative;
        }
        .cb-toggle:hover {
            transform: scale(1.05) translateY(-4px);
            box-shadow: 0 12px 30px rgba(232, 25, 44, 0.6);
        }
        /* Pulsing Ring Animation */
        .cb-toggle::before {
            content: '';
            position: absolute;
            top: -4px; left: -4px; right: -4px; bottom: -4px;
            border-radius: 50%;
            border: 2px solid var(--primary);
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            opacity: 0;
        }
        @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.8; }
            80% { transform: scale(1.3); opacity: 0; }
            100% { transform: scale(1.3); opacity: 0; }
        }
        .cb-toggle svg { width: 28px; height: 28px; }
        
        /* Chat Panel */
        .cb-panel {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 360px;
            height: 500px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius-xl);
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform-origin: bottom right;
            transform: scale(0.9);
            opacity: 0;
            pointer-events: none;
            transition: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cb-panel.open {
            transform: scale(1);
            opacity: 1;
            pointer-events: all;
        }

        /* Header */
        .cb-header {
            padding: 16px 20px;
            background: var(--bg-surface);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .cb-header-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .cb-avatar {
            width: 40px;
            height: 40px;
            background: rgba(42, 42, 56, 0.4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            position: relative;
        }
        /* Online dot */
        .cb-avatar::after {
            content: '';
            position: absolute;
            bottom: 0; right: 0;
            width: 10px; height: 10px;
            background: var(--success);
            border: 2px solid var(--bg-surface);
            border-radius: 50%;
        }
        .cb-title {
            color: var(--text-primary);
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 1rem;
            line-height: 1.2;
        }
        .cb-status {
            color: var(--success);
            font-size: 0.75rem;
            font-weight: 500;
        }
        .cb-close {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 4px;
            transition: var(--transition);
        }
        .cb-close:hover { color: var(--text-primary); }

        /* Body & Messages */
        .cb-body {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .cb-msg {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 0.9rem;
            line-height: 1.5;
            animation: fadeIn 0.3s ease;
        }
        .cb-msg.bot {
            background: var(--bg-surface);
            color: var(--text-secondary);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }
        .cb-msg.bot strong { color: var(--text-primary); }
        .cb-msg.user {
            background: var(--gradient-red);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        /* Typo indicator */
        .cb-typing {
            display: flex;
            gap: 4px;
            padding: 16px 20px;
            background: var(--bg-surface);
            align-self: flex-start;
            border-radius: 16px;
            border-bottom-left-radius: 4px;
        }
        .cb-dot {
            width: 6px; height: 6px;
            background: var(--text-muted);
            border-radius: 50%;
            animation: cb-bounce 1.4s infinite ease-in-out both;
        }
        .cb-dot:nth-child(1) { animation-delay: -0.32s; }
        .cb-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes cb-bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        /* Input Area */
        .cb-input-area {
            padding: 16px;
            background: var(--bg-surface);
            border-top: 1px solid var(--border);
            display: flex;
            gap: 12px;
        }
        .cb-input {
            flex: 1;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius-pill);
            padding: 10px 16px;
            color: var(--text-primary);
            font-family: var(--font-body);
            font-size: 0.9rem;
            outline: none;
            transition: var(--transition);
        }
        .cb-input:focus {
            border-color: var(--primary);
        }
        .cb-send {
            width: 42px; height: 42px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--transition);
        }
        .cb-send:hover { background: var(--primary-hover); }

        /* Chips */
        .cb-chips {
            display: flex;
            gap: 8px;
            padding: 0 20px 16px 20px;
            overflow-x: auto;
            scrollbar-width: none;
        }
        .cb-chips::-webkit-scrollbar { display: none; }
        .cb-chip {
            background: rgba(192, 21, 42, 0.15);
            color: var(--primary-hover);
            border: 1px solid rgba(192, 21, 42, 0.3);
            padding: 6px 12px;
            border-radius: var(--radius-pill);
            font-size: 0.8rem;
            white-space: nowrap;
            cursor: pointer;
            transition: var(--transition);
        }
        .cb-chip:hover {
            background: var(--primary);
            color: white;
        }

        @media (max-width: 480px) {
            .cb-panel {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                width: 100%; height: 100%;
                border-radius: 0;
                transform-origin: center;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Build DOM inside target div or append to body
    const root = document.getElementById('chatbot-widget') || document.createElement('div');
    if (!root.id) {
        root.id = 'chatbot-widget';
        document.body.appendChild(root);
    }
    root.className = 'cb-widget';

    root.innerHTML = `
        <div class="cb-panel" id="cbPanel">
            <div class="cb-header">
                <div class="cb-header-info">
                    <div class="cb-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16m8-9v6m-3-3h6"/></svg>
                    </div>
                    <div>
                        <div class="cb-title">Life Drop Assistant</div>
                        <div class="cb-status">Online</div>
                    </div>
                </div>
                <button class="cb-close" onclick="toggleChatbot()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="cb-body" id="cbBody"></div>
            <div class="cb-chips" id="cbChips"></div>
            <div class="cb-input-area">
                <input type="text" class="cb-input" id="cbInput" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendChatMsg()">
                <button class="cb-send" onclick="sendChatMsg()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
            </div>
        </div>
        <button class="cb-toggle" onclick="toggleChatbot()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
        </button>
    `;

    // 3. Logic
    const qs = ['Is O+ available in Mumbai?', 'How do I register?', 'I need blood urgently'];
    const cbChips = document.getElementById('cbChips');
    qs.forEach(q => {
        const c = document.createElement('div');
        c.className = 'cb-chip';
        c.textContent = q;
        c.onclick = () => { document.getElementById('cbInput').value = q; sendChatMsg(); };
        cbChips.appendChild(c);
    });

    window.toggleChatbot = function() {
        const p = document.getElementById('cbPanel');
        p.classList.toggle('open');
        if (p.classList.contains('open') && document.querySelectorAll('.cb-msg').length === 0) {
            appendSysMsg('👋 Hi! I can check live blood inventory or help you register. How can I help?');
        }
    }

    window.sendChatMsg = async function() {
        const inp = document.getElementById('cbInput');
        const text = inp.value.trim();
        if (!text) return;

        appendUserMsg(text);
        inp.value = '';

        const typingId = showTyping();
        
        try {
            const res = await fetch('/api/chatbot/message', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            
            document.getElementById(typingId).remove();
            
            // Render markdown bold to robust HTML
            let finalHtml = data.reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            appendSysMsg(finalHtml);

        } catch (err) {
            document.getElementById(typingId).remove();
            appendSysMsg('Connection error. Please try calling 104 if this is an emergency.');
        }
    }

    function appendUserMsg(text) {
        const b = document.getElementById('cbBody');
        const d = document.createElement('div');
        d.className = 'cb-msg user';
        d.textContent = text;
        b.appendChild(d);
        b.scrollTop = b.scrollHeight;
    }

    function appendSysMsg(html) {
        const b = document.getElementById('cbBody');
        const d = document.createElement('div');
        d.className = 'cb-msg bot';
        d.innerHTML = html;
        b.appendChild(d);
        b.scrollTop = b.scrollHeight;
    }

    function showTyping() {
        const id = 'typing-' + Date.now();
        const b = document.getElementById('cbBody');
        const d = document.createElement('div');
        d.className = 'cb-typing';
        d.id = id;
        d.innerHTML = `<div class="cb-dot"></div><div class="cb-dot"></div><div class="cb-dot"></div>`;
        b.appendChild(d);
        b.scrollTop = b.scrollHeight;
        return id;
    }
})();
