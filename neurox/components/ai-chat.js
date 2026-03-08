function getBotReply(text) {
  const msg = text.toLowerCase();
  if (msg.includes("anxious") || msg.includes("stress")) {
    return "Let's take a 60-second breathing reset: inhale for 4, hold 4, exhale 6. You've got this.";
  }
  if (msg.includes("focus") || msg.includes("distract")) {
    return "Try a focus reset: choose one tiny task, set a 5-minute timer, and remove one distraction.";
  }
  if (msg.includes("tired") || msg.includes("overwhelm")) {
    return "It's okay to pause. Drink water, stretch, and take a gentle break before continuing.";
  }
  return "You're doing your best today. Small steps count—would you like a breathing or focus suggestion next?";
}

export function renderChat(container) {
  container.innerHTML = `
    <h2>AI Support Chat (Simulated)</h2>
    <p>A simple supportive assistant with rule-based guidance.</p>
    <div id="chat-box" class="chat-box"></div>
    <div class="input-row">
      <input id="chat-input" type="text" placeholder="Share how you're feeling..." />
      <button id="send-chat" class="btn primary">Send</button>
    </div>
  `;

  const chatBox = container.querySelector("#chat-box");
  const input = container.querySelector("#chat-input");

  const addMessage = (who, text) => {
    const node = document.createElement("div");
    node.className = `message ${who}`;
    node.textContent = `${who === "user" ? "You" : "NeuroX AI"}: ${text}`;
    chatBox.appendChild(node);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  container.querySelector("#send-chat").addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    addMessage("user", text);
    addMessage("bot", getBotReply(text));
    input.value = "";
  });
}
