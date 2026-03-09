const titles = [
  "(•‿•) compiling…",
  "don't worry babe :: it's cached ♡",
  "actually my first deploy ✧",
  "spiralling into version_control ∞",
  "I surrender(); ~",
  "intersectional arrays[] ♡",
  "(｡╯︵╰｡) 404",
  "cringe but open source ♡",
  "hyperfocused hypertext"
  "everything already exists ::",
  "404 motivation not found",
  "ping reality ~ ~ ~",
  "git blame past_me ;_;",
  "runtime confusion //",
  "¯\\_(ツ)_/¯",
  "::: webbing the knit",
  "undefined but thriving ~",
  "vibe code feels ✧",
  "works on my machine™",
  "recursion but emotional ↻",
  "I ❤︎ HTML",
  "♡ ⌨ ♡",
  "world wide whatever ~",
  "compile 𝓹𝓵𝒆𝓪𝓼𝒆 ´ヽ⌒★",
  "loading since 1992 …",
  "soft error ♡",
  "console.log('hi?') ~",
  "internet archaeologist ⛏",
  "it's not a bug :: it's legacy",
  "powered by HTML <3",
  "deploy and disappear ~",
  "ฅ^>⩊<^ ฅ",
  "my type is loosely typed̷",
  "small web energy ✧",
  "async but emotionally synchronous",
  "not delivered …",
  "cache me outside ~",
  "holding space in RAM ♡",
  "♥╣[-_-]╠♥",
  "npm run chaos >",
  "const vibes = require('good') ✧",
  "promise me nothing ❤︎",
  "stack trace therapy ;_;",
  "linking things together ↔",
  "the logs remember ::",
  "infinite scroll thoughts ∞",
  "໒・ﻌ・७ await snacks",
  "DIY the web ✧",
  "process still running",
  "~ browsing softly ~"
];

let index = 0;

setInterval(() => {
  document.title = titles[index];
  index = (index + 1) % titles.length;
}, 2000);