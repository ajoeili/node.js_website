let highestZ = 1;
let windowOffset = 0;

document.addEventListener("DOMContentLoaded", () => {
  initDesktop();
});

function initDesktop() {

  startDesktopPet();

  const icons = document.querySelectorAll(".icon");

  icons.forEach(icon => {

    icon.addEventListener("click", () => {

      icons.forEach(i => i.classList.remove("selected"));

      icon.classList.add("selected");

    });

  });

  document.getElementById("desktop").addEventListener("click", (e) => {

    if (!e.target.closest(".icon")) {

      document.querySelectorAll(".icon")
        .forEach(i => i.classList.remove("selected"));

    }

  });

  icons.forEach(icon => {

    icon.addEventListener("dblclick", () => {

      const app = icon.dataset.app;
      openWindow(app);

    });

    makeIconDraggable(icon);

  });

  const startButton = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");

  startButton.addEventListener("click", () => {

    if (startMenu.style.display === "block") {
      startMenu.style.display = "none";
    } else {
      startMenu.style.display = "block";
    }

  });

  document.addEventListener("click", (event) => {

    if (!event.target.closest("#start-button") &&
        !event.target.closest("#start-menu")) {

      startMenu.style.display = "none";

    }

  });

  document.querySelectorAll(".start-item").forEach(item => {

    item.addEventListener("click", () => {

      const topic = item.dataset.topic;

      if (topic) {
        openWindow(topic);
      }

    });

  });

  fetch("/api/visitors")
    .then(res => res.json())
    .then(data => {

      const counter = document.getElementById("visitor-counter");

      if (counter) {
        counter.textContent = "Visitors: " + String(data.count).padStart(6, "0");
      }

    });

}

function openWindow(app) {

  const windowsContainer = document.getElementById("windows");

  const windowElement = document.createElement("div");

  windowElement.className = "window app-window";

  windowElement.innerHTML = `
    <div class="title-bar">
      <div class="title-bar-text"></div>

      <div class="title-bar-controls">
        <button aria-label="Close"></button>
      </div>
    </div>

    <div class="window-body">
      ${getAppContent(app)}
    </div>
  `;

  windowElement.style.top = 120 + windowOffset + "px";
  windowElement.style.left = 200 + windowOffset + "px";

  windowOffset += 20;

  windowElement.style.zIndex = ++highestZ;

  windowElement.addEventListener("mousedown", () => {
    windowElement.style.zIndex = ++highestZ;
  });

  makeDraggable(windowElement);

  windowElement
    .querySelector("[aria-label='Close']")
    .onclick = () => windowElement.remove();

  windowsContainer.appendChild(windowElement);

    windowElement.querySelectorAll(".explorer-file").forEach(file => {

        file.addEventListener("dblclick", () => {

            const project = file.dataset.project;

            openWindow(project);

        });

    });

  // Load page content from HTML files
  const pageContent = windowElement.querySelector(".page-content");
  if (pageContent) {
    const pageName = pageContent.dataset.page;
    fetch(`/pages/${pageName}.html`)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const bodyContent = doc.body.innerHTML;
        pageContent.innerHTML = bodyContent;
      })
      .catch(error => {
        pageContent.innerHTML = "<p>Error loading page.</p>";
      });
  }



  if (app === "terminal") {
    initTerminal(windowElement);
  }

}

function getAppContent(app) {

if (app === "computer") {
    return `
        <div class="notepad">

            <div class="notepad-menu">
                File Edit Format View Help
            </div>

            <textarea class="notepad-text">

    Hi!

    This website was built
    for my Node.js class.

    Features so far:

    - Retro Windows 98 desktop
    - Draggable windows
    - Start menu
    - Terminal guestbook
    - Node.js backend
    - Little BMO desktop pet
    - Links to cool sites
    - Notes from class
    - Projects
    - Visitor counter
    - Old school buttons

    Future ideas:

    - Make the desktop pet speak
      and interact
    - Show real guestbook messages
      stored on the server
    - More interactive terminal
      commands
    - Maybe a minesweeper game?

                </textarea>

            </div>
        `;
    }

if (app === "notes") {
    return `
        <div class="explorer">

            <div class="explorer-header">
                Notes from Class
            </div>

            <div class="explorer-files">

                <div class="explorer-file" data-project="code_con">
                 <img src="/assets/icons/file.png" class="file-icon">
                    <span>Code Conventions</span>
                </div>

                <div class="explorer-file" data-project="var_data_func">
                     <img src="/assets/icons/file.png" class="file-icon">
                        <span>Variables, Datatypes and Functions</span>
                </div>

                <div class="explorer-file" data-project="rest_express">
                     <img src="/assets/icons/file.png" class="file-icon">
                        <span>REST API and Express</span>
                </div>

                <div class="explorer-file" data-project="tools_man_mod">
                     <img src="/assets/icons/file.png" class="file-icon">
                        <span>Build Tools, Package Managers and Modules</span>
                </div>

                <div class="explorer-file" data-project="cli_ser_dep">
                     <img src="/assets/icons/file.png" class="file-icon">
                        <span>Client-Server Model and Deployment</span>
                </div>

            </div>

        </div>
    `;
}

if (app === "code_con") {
    return `<div class="page-content" data-page="code-conv"></div>`;
}

if (app === "var_data_func") {
    return `<div class="page-content" data-page="var-data-func"></div>`;
}

if (app === "rest_express") {
    return `<div class="page-content" data-page="rest-express"></div>`;
}

if (app === "tools_man_mod") {
    return `<div class="page-content" data-page="tools-man-mod"></div>`;
}

if (app === "cli_ser_dep") {
    return `<div class="page-content" data-page="cli-ser-dep"></div>`;
}
  if (app === "guestbook") {
    return `
      <p>Open the terminal to sign the guestbook.</p>
    `;
  }

  if (app === "terminal") {
    return `
      <div class="terminal">

        <div id="terminal-output"></div>

        <div class="terminal-input-line">
          <span>C:\\></span>
          <input id="terminal-input" autocomplete="off">
        </div>

      </div>
    `;
  }

if (app === "links") {
  return `
    <div class="links-window">

      <p>Cool sites that inspire me:</p>

      <ul class="links-list">

        <li>▶
          <a href="https://www.wetlegband.com" target="_blank">
            wetlegband.com
          </a>
        </li>

        <li>▶
          <a href="https://www.hayleywilliams.net" target="_blank">
            hayleywilliams.net
          </a>
        </li>

        <li>▶
          <a href="https://www.nynnechristoffersen.com" target="_blank">
            nynnechristoffersen.com
          </a>
        </li>

        <li>▶
          <a href="https://localghost.dev/" target="_blank">
            localghost.dev
          </a>
        </li>

        <li>▶
          <a href="https://github.com/matt-auckland/retro-css" target="_blank">
            retro css
          </a>
        </li>

        <li>▶
          <a href="https://cyber.dabamos.de/88x31/index2.html" target="_blank">
            retro buttons
          </a>
        </li>

        <li>▶
          <a href="https://www.rw-designer.com/gallery?search=retro+windows+icons" target="_blank">
            retro windows icons
          </a>
        </li>

        <li>▶
          <a href="https://win98icons.alexmeub.com/" target="_blank">
            windows 98 icons
          </a>
        </li>

        <li>▶
          <a href="https://1dceffects.tumblr.com/" target="_blank">
            retro tumblr cursor scripts
          </a>
        </li>

      </ul>

    </div>
  `;
}

  return "<p>Application not found.</p>";

}

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

function startDesktopPet() {
  // TODO: Make the pet speak and interact
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
