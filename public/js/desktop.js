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

  windowElement.innerHTML = 
    <div class="title-bar">
      <div class="title-bar-text">${app}</div>

      <div class="title-bar-controls">
        <button aria-label="Close"></button>
      </div>
    </div>

    <div class="window-body">
      ${getAppContent(app)}
    </div>
  ;

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


  if (app === "terminal") {
    initTerminal(windowElement);
  }

}

function getAppContent(app) {

if (app === "about") {
    return 
        <div class="notepad">

            <div class="notepad-menu">
                File Edit Format View Help
            </div>

            <textarea class="notepad-text">

    About.txt

    Hi!

    This website was built
    for my Node.js class.

    Features so far:

    - Retro Windows 98 desktop
    - Draggable windows
    - Start menu
    - Terminal guestbook
    - Node.js backend

    Future ideas:

    - Visitor counter
    - File explorer for projects
    - More terminal commands

                </textarea>

            </div>
        ;
    }

if (app === "projects") {
    return 
        <div class="explorer">

            <div class="explorer-header">
                📁 Projects
            </div>

            <div class="explorer-files">

                <div class="explorer-file" data-project="project_guestbook">
                 <img src="/assets/icons/file.png" class="file-icon">
                    <span>guestbook-api</span>
                </div>

                <div class="explorer-file" data-project="project_routing">
                     <img src="/assets/icons/file.png" class="file-icon">
                        <span>express-routing</span>
                </div>

                <div class="explorer-file" data-project="project_middleware">
                     <img src="/assets/icons/file.png" class="file-icon">
                        <span>middleware-demo</span>
                </div>

            </div>

        </div>
    ;
}

if (app === "project_guestbook") {
    return 
        <h3>Guestbook API</h3>
        <p>
        A simple Node.js + Express API where visitors
        can leave messages through the terminal.
        </p>
    ;
}

if (app === "project_routing") {
    return 
        <h3>Express Routing</h3>
        <p>
        Demonstrates how routes work in Express
        using GET and POST requests.
        </p>
    ;
}

if (app === "project_middleware") {
    return 
        <h3>Middleware Demo</h3>
        <p>
        Example showing how Express middleware
        processes requests before reaching routes.
        </p>
    ;
}

  if (app === "guestbook") {
    return 
      <p>Open the terminal to sign the guestbook.</p>
    ;
  }

  if (app === "terminal") {
    return 
      <div class="terminal">

        <div id="terminal-output"></div>

        <div class="terminal-input-line">
          <span>C:\\></span>
          <input id="terminal-input" autocomplete="off">
        </div>

      </div>
    ;
  }

  if (app === "computer") {
      return 
          <div class="explorer">

              <div class="explorer-header">
                  My Computer
              </div>

              <div class="explorer-files">

                  <div class="explorer-file">
                      <img src="/assets/icons/Folder.ico" class="file-icon">
                      <span>Skills</span>
                  </div>

                  <div class="explorer-file">
                      <img src="/assets/icons/Folder.ico" class="file-icon">
                      <span>Node.js Topics</span>
                  </div>

                  <div class="explorer-file">
                      <img src="/assets/icons/Folder.ico" class="file-icon">
                      <span>Projects</span>
                  </div>

              </div>

          </div>
      ;
  }

  if (app === "skills") {
      return 
          <h3>Skills</h3>
          <ul>
              <li>HTML</li>
              <li>CSS</li>
              <li>JavaScript</li>
              <li>Node.js</li>
              <li>Express</li>
          </ul>
      ;
  }

  if (app === "node_topics") {
      return 
          <h3>Node.js Topics</h3>
          <ul>
              <li>Express servers</li>
              <li>Routing</li>
              <li>Middleware</li>
              <li>APIs</li>
              <li>JSON data storage</li>
          </ul>
      ;
  }

if (app === "links") {
  return 
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
  ;
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
