const moreBtn = document.getElementById("moreBtn");
const moreMenu = document.getElementById("moreMenu");
const themeBtn = document.getElementById("themeBtn");
const plusBtn = document.getElementById("plusBtn");
const plusMenu = document.getElementById("plusMenu");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

moreBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  moreMenu.classList.toggle("show");
  plusMenu.classList.remove("show");
});

plusBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  plusMenu.classList.toggle("show");
  moreMenu.classList.remove("show");
});

document.addEventListener("click", () => {
  moreMenu.classList.remove("show");
  plusMenu.classList.remove("show");
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("light") ? "☀" : "☾";
});

userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = userInput.scrollHeight + "px";
});

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";
  userInput.style.height = "auto";

  addTyping();

  setTimeout(() => {
    removeTyping();
    addMessage("Siap, saya XINN AI. Saya bisa bantu coding, bikin website, debug error, dan ide bisnis.", "ai");
  }, 800);
});

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `msg ${type}`;

  if (type === "user") {
    msg.innerHTML = `
      <div class="bubble user-bubble">
        ${escapeHTML(text)}
        <small>Baru saja ✓✓</small>
      </div>
    `;
  } else {
    msg.innerHTML = `
      <div class="avatar logo">X</div>
      <div class="bubble ai-bubble">
        <p>${escapeHTML(text)}</p>
        <small>Baru saja</small>
      </div>
    `;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addTyping() {
  const typing = document.createElement("div");
  typing.className = "msg ai";
  typing.id = "typing";
  typing.innerHTML = `
    <div class="avatar logo">X</div>
    <div class="bubble ai-bubble">
      <p>XINN AI sedang mengetik...</p>
    </div>
  `;
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function escapeHTML(text) {
  return text.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
    }
