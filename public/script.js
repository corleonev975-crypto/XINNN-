const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const form = document.getElementById("chatForm");
const input = document.getElementById("input");
const messagesEl = document.getElementById("messages");
const newChat = document.getElementById("newChat");

let messages = JSON.parse(localStorage.getItem("xinn-ai-messages") || "[]");
let firstSend = messages.length === 0;

renderSaved();

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light");
  body.classList.toggle("dark");
  themeToggle.textContent = body.classList.contains("light") ? "⚙" : "☾";
});

newChat.addEventListener("click", () => {
  localStorage.removeItem("xinn-ai-messages");
  messages = [];
  location.reload();
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 120) + "px";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  if (firstSend) {
    messagesEl.innerHTML = "";
    firstSend = false;
  }

  addMessage("user", text);
  messages.push({ role: "user", content: text });
  saveMessages();
  input.value = "";
  input.style.height = "auto";

  showTyping();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    const data = await res.json();
    removeTyping();

    const reply = data.reply || data.error || "Maaf, API belum tersambung.";
    addMessage("ai", reply);
    messages.push({ role: "assistant", content: reply });
    saveMessages();
  } catch (err) {
    removeTyping();
    addMessage("ai", "API belum jalan. Pastikan project dijalankan lewat server dan GROQ_API_KEY sudah diisi.");
  }
});

document.querySelectorAll(".chips button").forEach(btn => {
  btn.addEventListener("click", () => {
    input.value = btn.textContent.replace(/^[^a-zA-Z]+/, "").trim();
    input.focus();
  });
});

function addMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${role === "user" ? "user" : "ai"}`;

  if (role === "user") {
    msg.innerHTML = `<div class="bubble">${escapeHtml(text)} <span class="time">${getTime()} ✓✓</span></div>`;
  } else {
    msg.innerHTML = `<div class="avatar orb">X</div><div class="answer-card">${formatText(text)}</div>`;
  }

  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "msg ai typing";
  typing.id = "typing";
  typing.innerHTML = `<div class="avatar orb">X</div><div class="answer-card"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  messagesEl.appendChild(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function saveMessages() {
  localStorage.setItem("xinn-ai-messages", JSON.stringify(messages.slice(-20)));
}

function renderSaved() {
  if (!messages.length) return;
  messagesEl.innerHTML = "";
  firstSend = false;
  messages.forEach(m => addMessage(m.role === "assistant" ? "ai" : "user", m.content));
}

function formatText(text) {
  let safe = escapeHtml(text);
  safe = safe.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><button class="copy">□</button><small>code</small><code>${code.trim()}</code></pre>`);
  safe = safe.replace(/\n/g, "<br>");
  return safe;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
}

function getTime() {
  const d = new Date();
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");
}
