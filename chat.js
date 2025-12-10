// chat.js

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatStatus = document.getElementById('chat-status');

    // --- Configuration ---
    // !!! SECURITY WARNING !!!
    // NEVER expose your API key in client-side code for a production application.
    // Use a secure backend server (proxy) to handle the API call.
    const GEMINI_API_KEY = 'AIzaSyBqdj56xGrCjiNOMAG_bPO-ReLyOvR9OU4'; // *** REPLACE THIS WITH YOUR ACTUAL KEY ***
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;
    const SYSTEM_INSTRUCTION = "You are the MindCare AI Assistant. Your goal is to offer encouraging, non-diagnostic self-care tips, emotional guidance, and direct the user to the website's resources (guidance.html, resources.html, self-check.html). Keep your responses concise, compassionate, and focused on well-being and personal reflection.";

    // Conversation history to maintain context
    let history = []; 

    // --- UI Logic ---

    // Toggle chat window visibility
    function toggleChat(show) {
        const isHidden = chatWindow.classList.contains('hidden');
        if (show === undefined) {
            show = isHidden; // Toggle logic
        }

        if (show) {
            chatWindow.classList.remove('hidden');
            chatToggleBtn.setAttribute('aria-expanded', 'true');
            chatInput.focus();
        } else {
            chatWindow.classList.add('hidden');
            chatToggleBtn.setAttribute('aria-expanded', 'false');
        }
    }

    chatToggleBtn.addEventListener('click', () => toggleChat());
    chatCloseBtn.addEventListener('click', () => toggleChat(false));
    
    // Message rendering helper
    function createMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        // Scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- API Logic ---

    async function generateResponse(userMessage) {
        // Add user message to UI and history
        createMessage(userMessage, 'user');
        history.push({ role: "user", parts: [{ text: userMessage }] });

        // Add a temporary 'thinking' message from the bot
        const botThinking = document.createElement('div');
        botThinking.classList.add('message', 'bot-message');
        botThinking.textContent = '...'; 
        chatMessages.appendChild(botThinking);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Disable input while waiting for response
        chatInput.disabled = true;
        chatSendBtn.disabled = true;
        chatStatus.textContent = 'Assistant is typing...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    system_instruction: SYSTEM_INSTRUCTION, 
                    contents: history,
                    config: {
                         temperature: 0.7, 
                         maxOutputTokens: 500,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            
            let botText = "Sorry, I couldn't generate a response. Please try again or check the console for details.";

            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                    botText = candidate.content.parts[0].text;
                    // Add the bot's response to history
                    history.push({ role: "model", parts: [{ text: botText }] });
                } else if (candidate.finishReason === 'SAFETY') {
                    botText = "I can only offer general self-care advice and information about the resources on this site. Please rephrase your question or seek professional help for urgent matters.";
                }
            }
            
            // Remove 'thinking' message and display the actual response
            chatMessages.removeChild(botThinking);
            createMessage(botText, 'bot');

        } catch (error) {
            console.error("Chat API call failed:", error);
            // Remove 'thinking' message and display an error
            chatMessages.removeChild(botThinking);
            createMessage("I encountered an error connecting to the AI. Please check your API key and network connection.", 'bot');
            chatStatus.textContent = 'Error: Check console.';
        } finally {
            // Re-enable input
            chatInput.disabled = false;
            chatSendBtn.disabled = false;
            chatStatus.textContent = '';
            chatInput.value = '';
            chatInput.focus();
        }
    }

    // --- Event Handlers and Initialization ---
    function handleSend() {
        const message = chatInput.value.trim();
        if (message) {
            generateResponse(message);
        }
    }

    chatSendBtn.addEventListener('click', handleSend);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !chatInput.disabled) {
            e.preventDefault(); 
            handleSend();
        }
    });

    // Initial status update
    chatStatus.textContent = 'Ready to chat!';
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
});