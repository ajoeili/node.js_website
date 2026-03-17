let highestZ = 1;
let windowOffset = 0;

document.addEventListener("DOMContentLoaded", () => {
  initDesktop();
});



/* INITIATE DESKTOP */

function initDesktop() {

  startDesktopPet();

  const icons = document.querySelectorAll(".icon");

    const spacingX = 100;
    const spacingY = 100;
    const startX = 20;
    const startY = 20;

    const taskbarHeight = 40;
    const usableHeight = window.innerHeight - taskbarHeight;

    const iconsPerColumn = Math.floor(usableHeight / spacingY);

    icons.forEach((icon, i) => {
      const col = Math.floor(i / iconsPerColumn);
      const row = i % iconsPerColumn;

      icon.style.left = startX + col * spacingX + "px";
      icon.style.top = startY + row * spacingY + "px";
    });

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

/* WINDOW MANAGEMENT */

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

        if (pageName === "guestbook") {
            loadGuestbookMessages(pageContent);
        }

      })
      .catch(error => {
        pageContent.innerHTML = "<p>Error loading page.</p>";
      });
  }



  if (app === "terminal") {
    initTerminal(windowElement);
  }

}

/* APPLICATION CONTENT */

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
    - Projects folder
    - Visitor counter
    - Old school buttons and icons

    Future ideas:

    - Detailed project pages with code snippets and explanations
    - Make the desktop pet speak
      and interact
    - Better mobile responsiveness
    - Serious refactoring and code cleanup
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

                <div class="explorer-file" data-project="code_conventions">
                 <img src="/assets/icons/file.png" class="file-icon">
                    <span>Code Conventions</span>
                </div>

                <div class="explorer-file" data-project="variables_datatypes_functions">
                     <img src="/assets/icons/file.png" class="file-icon">
                        <span>Variables, Datatypes and Functions</span>
                </div>

                <div class="explorer-file" data-project="rest_api_express">
                     <img src="/assets/icons/file.png" class="file-icon">
                        <span>REST API and Express</span>
                </div>

                <div class="explorer-file" data-project="tools_managers_modules">
                     <img src="/assets/icons/file.png" class="file-icon">
                        <span>Build Tools, Package Managers and Modules</span>
                </div>

                <div class="explorer-file" data-project="client_server_deployment">
                     <img src="/assets/icons/file.png" class="file-icon">
                        <span>Client-Server Model and Deployment</span>
                </div>

            </div>

        </div>
    `;
}

if (app === "code_conventions") {
    return `<div class="page-content" data-page="code-conventions"></div>`;
}

if (app === "variables_datatypes_functions") {
    return `<div class="page-content" data-page="variables-datatypes-functions"></div>`;
}

if (app === "rest_api_express") {
    return `<div class="page-content" data-page="rest-api-express"></div>`;
}

if (app === "tools_managers_modules") {
    return `<div class="page-content" data-page="tools-managers-modules"></div>`;
}

if (app === "client_server_deployment") {
    return `<div class="page-content" data-page="client-server-deployment"></div>`;
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

if (app === "guestbook") {
    return `<div class="page-content" data-page="guestbook"></div>`;
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

/* DRAGGABLE WINDOWS AND ICONS */

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

/* Icons should be draggable too, but without the title bar constraint */

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

/* TERMINAL APPLICATION */

function initTerminal(windowElement) {

  const input = windowElement.querySelector("#terminal-input");
  const output = windowElement.querySelector("#terminal-output");

  input.focus();

  printLine(output, "Leave a message in the guestbook ~");
  printLine(output, "");
  printLine(output, "Sign - write your message");
  printLine(output, "Read - open the guestbook");
  printLine(output, "");


  input.addEventListener("keydown", (e) => {

    if (e.key !== "Enter") return;

    const command = input.value.trim();

    printLine(output, "C:\\> " + command);

    handleCommand(command, output);

    input.value = "";

  });

}

/* Helper function to print a line of text in the terminal output */

function printLine(output, text) {

  const line = document.createElement("div");
  line.textContent = text;

  output.appendChild(line);

  output.scrollTop = output.scrollHeight;

}

let guestbookState = null;
let guestbookName = "";


/* Handle terminal commands related to the guestbook */

function handleCommand(cmd, output) {

  if(guestbookState === "name") {

    guestbookName = cmd;
    guestbookState = "message";

    printLine(output, "Enter your message:");
    return;
  }

  if (guestbookState === "message") {

    const message = cmd;

    fetch("/api/guestbook", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        name: guestbookName,
        message: message
        })
    })
        .then(res => res.json())
        .then(() => {
            printLine(output, "Message added! Thank you.");
            printLine(output, "--------------------------------");
        });

    guestbookState = null;
    guestbookName = "";

    return;
  }

  if (cmd === "help") {

    printLine(output, "Commands:");
    printLine(output, "help");
    printLine(output, "sign");
    printLine(output, "read");

    return;
  }

  if (cmd === "sign") {

    guestbookState = "name";
    printLine(output, "Enter your name:");
    return;
  }

  if (cmd === "read") {
    window.open("/guestbook");
    return;
  }

  printLine(output, "Unknown command");
}


/* Load guestbook messages from the server and display them in the guestbook window */

function loadGuestbookMessages(container) {

    const list = container.querySelector("#guestbook-messages");

    fetch("/api/guestbook")
        .then(res => res.json())
        .then(messages => {

            if (messages.length === 0) {
                list.innerHTML = "<p>No messages yet.</p>";
                return;
            }

            list.innerHTML = "";

            messages.forEach(entry => {

                const div = document.createElement("div");

                div.innerHTML = `
                    <p>
                        <strong>${entry.name}</strong>
                        <small>(${entry.timestamp})</small><br>
                        ${entry.message}
                    </p>
                    <hr>
                `;

                list.appendChild(div);

            });

        });

}


/* DESKTOP PET */

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
