/* =========================================================
   GLOBAL STATE
   ---------------------------------------------------------
   Keeps track of window layering and cascade position.
   ========================================================= */

let highestZ = 1;
let windowOffset = 0;


/* =========================================================
   APPLICATION STARTUP
   ---------------------------------------------------------
   Wait until the DOM is loaded before initializing
   the desktop environment.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initDesktop();
});


/* =========================================================
   DESKTOP INITIALIZATION
   ---------------------------------------------------------
   Sets up icons, start menu, visitor counter and
   desktop interactions.
   ========================================================= */

function initDesktop() {

  startDesktopPet();

  /* ---------- Desktop icon selection ---------- */

  const icons = document.querySelectorAll(".icon");

  icons.forEach(icon => {

    icon.addEventListener("click", () => {

      icons.forEach(i => i.classList.remove("selected"));
      icon.classList.add("selected");

    });

  });

  /* ---------- Clicking empty desktop clears selection ---------- */

  document.getElementById("desktop").addEventListener("click", (e) => {

    if (!e.target.closest(".icon")) {
      document.querySelectorAll(".icon")
        .forEach(i => i.classList.remove("selected"));
    }

  });

  /* ---------- Icon double click (open app) ---------- */

  icons.forEach(icon => {

    icon.addEventListener("dblclick", () => {

      const app = icon.dataset.app;
      openWindow(app);

    });

    makeIconDraggable(icon);

  });

  /* ---------- Start menu ---------- */

  const startButton = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");

  startButton.addEventListener("click", () => {

    startMenu.style.display =
      startMenu.style.display === "block" ? "none" : "block";

  });

  document.addEventListener("click", (event) => {

    if (!event.target.closest("#start-button") &&
        !event.target.closest("#start-menu")) {

      startMenu.style.display = "none";

    }

  });

  /* ---------- Start menu items ---------- */

  document.querySelectorAll(".start-item").forEach(item => {

    item.addEventListener("click", () => {

      const topic = item.dataset.topic;

      if (topic) {
        openWindow(topic);
      }

    });

  });

  /* ---------- Visitor counter ---------- */

  fetch("/api/visitors")
    .then(res => res.json())
    .then(data => {

      const counter = document.getElementById("visitor-counter");

      if (counter) {
        counter.textContent =
          "Visitors: " + String(data.count).padStart(6, "0");
      }

    });

}


/* =========================================================
   WINDOW MANAGEMENT
   ---------------------------------------------------------
   Creates new windows, handles layering and cascading.
   ========================================================= */

function openWindow(app) {

  const windowsContainer = document.getElementById("windows");
  const windowElement = document.createElement("div");

  windowElement.className = "window app-window";

  windowElement.innerHTML = `
    <div class="title-bar">
      <div class="title-bar-text">${app}</div>

      <div class="title-bar-controls">
        <button aria-label="Close"></button>
      </div>
    </div>

    <div class="window-body">
      ${getAppContent(app)}
    </div>
  `;

  /* ---------- Window cascade positioning ---------- */

  windowElement.style.top = 120 + windowOffset + "px";
  windowElement.style.left = 200 + windowOffset + "px";
  windowOffset += 20;

  /* ---------- Window stacking ---------- */

  windowElement.style.zIndex = ++highestZ;

  windowElement.addEventListener("mousedown", () => {
    windowElement.style.zIndex = ++highestZ;
  });

  makeDraggable(windowElement);

  /* ---------- Close button ---------- */

  windowElement
    .querySelector("[aria-label='Close']")
    .onclick = () => windowElement.remove();

  windowsContainer.appendChild(windowElement);

  /* ---------- Explorer file double click ---------- */

  windowElement.querySelectorAll(".explorer-file").forEach(file => {

    file.addEventListener("dblclick", () => {

      const project = file.dataset.project;
      openWindow(project);

    });

  });

  /* ---------- Terminal initialization ---------- */

  if (app === "terminal") {
    initTerminal(windowElement);
  }

}


/* =========================================================
   WINDOW CONTENT ROUTER
   ---------------------------------------------------------
   Returns HTML content for each "application".
   ========================================================= */

function getAppContent(app) {

  /* ---------- About window ---------- */

  if (app === "about") {
    return ` ... `;
  }

  /* ---------- Projects explorer ---------- */

  if (app === "projects") {
    return ` ... `;
  }

  /* ---------- Individual project pages ---------- */

  if (app === "project_guestbook") { return ` ... `; }
  if (app === "project_routing") { return ` ... `; }
  if (app === "project_middleware") { return ` ... `; }

  /* ---------- Guestbook ---------- */

  if (app === "guestbook") {
    return `<p>Open the terminal to sign the guestbook.</p>`;
  }

  /* ---------- Terminal ---------- */

  if (app === "terminal") {
    return ` ... `;
  }

  /* ---------- Links ---------- */

  if (app === "links") {
    return ` ... `;
  }

  return "<p>Application not found.</p>";
}


/* =========================================================
   WINDOW DRAGGING
   ========================================================= */

function makeDraggable(windowElement) {

  const titleBar = windowElement.querySelector(".title-bar");

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titleBar.addEventListener("mousedown", (e) => {

    isDragging = true;

    offsetX = e.clientX - windowElement.offsetLeft;
    offsetY = e.clientY - windowElement.offsetTop;

  });

  document.addEventListener("mousemove", (e) => {

    if (!isDragging) return;

    windowElement.style.left = (e.clientX - offsetX) + "px";
    windowElement.style.top = (e.clientY - offsetY) + "px";

  });

  document.addEventListener("mouseup", () => {

    isDragging = false;

  });

}


/* =========================================================
   ICON DRAGGING
   ========================================================= */

function makeIconDraggable(icon) {

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  icon.addEventListener("mousedown", (e) => {

    if (e.button !== 0) return;

    isDragging = true;

    offsetX = e.clientX - icon.offsetLeft;
    offsetY = e.clientY - icon.offsetTop;

    e.preventDefault();

  });

  document.addEventListener("mousemove", (e) => {

    if (!isDragging) return;

    icon.style.left = (e.clientX - offsetX) + "px";
    icon.style.top = (e.clientY - offsetY) + "px";

  });

  document.addEventListener("mouseup", () => {

    isDragging = false;

  });

}


/* =========================================================
   TERMINAL SYSTEM
   ========================================================= */

function initTerminal(windowElement) {

  const input = windowElement.querySelector("#terminal-input");
  const output = windowElement.querySelector("#terminal-output");

  input.focus();

  input.addEventListener("keydown", (e) => {

    if (e.key !== "Enter") return;

    const command = input.value.trim();

    printLine(output, "C:\\> " + command);

    handleCommand(command, output);

    input.value = "";

  });

}

function printLine(output, text) {

  const line = document.createElement("div");
  line.textContent = text;

  output.appendChild(line);

  output.scrollTop = output.scrollHeight;

}

function handleCommand(cmd, output) {

  if (cmd === "help") {

    printLine(output, "Commands:");
    printLine(output, "help");
    printLine(output, "guestbook");
    printLine(output, "sign");
    printLine(output, "read");

    return;

  }

  if (cmd === "guestbook") {

    printLine(output, "Guestbook commands:");
    printLine(output, "sign  - leave message");
    printLine(output, "read  - read messages");

    return;

  }

  if (cmd === "sign") {

    printLine(output, "Feature coming soon!");
    return;

  }

  if (cmd === "read") {

    printLine(output, "Guestbook empty.");
    return;

  }

  printLine(output, "Unknown command");

}


/* =========================================================
   DESKTOP PET
   ========================================================= */

function startDesktopPet() {

  const pet = document.getElementById("desktop-pet");
  const desktop = document.getElementById("desktop");

  if (!pet) return;

  setInterval(() => {

    const maxX = desktop.clientWidth - 60;
    const maxY = desktop.clientHeight - 120;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    pet.style.left = x + "px";
    pet.style.top = y + "px";

  }, 4000);

}