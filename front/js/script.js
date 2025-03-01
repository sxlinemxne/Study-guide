document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // Проверяем, какая тема сохранена
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'white') {
      root.style.setProperty('--bg-color', '#f6f6f6');
      root.style.setProperty('--font-color', 'black');
  } else if (savedTheme === 'black') {
      root.style.setProperty('--bg-color', '#232323');
      root.style.setProperty('--font-color', 'white');
  }
});

var leftElements = document.querySelectorAll(".left");
var rightElements = document.querySelectorAll(".right");
var subscribeFormElement = document.querySelectorAll(".subscribe-form");
if (
  leftElements.length > 0 &&
  rightElements.length > 0 &&
  subscribeFormElement.length > 0
) {
  window.sr = ScrollReveal({
    distance: "60px",
    duration: 800,
    delay: 200,
    reset: false,
  });

  sr.reveal(".left", { delay: 150, origin: "right" });
  sr.reveal(".right", { delay: 150, origin: "left" });
  sr.reveal(".subscribe-form", { delay: 200, origin: "bottom" });
}

var header = document.querySelector("header");
var sidebar = document.querySelector(".nav-panel");
var footer = document.querySelector("footer");

if (header && sidebar && footer) {
  var ticking = false;

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        var headerHeight = header.getBoundingClientRect().bottom;
        var footerTop = footer.getBoundingClientRect().top;
        var windowHeight = window.innerHeight;

        if (headerHeight >= 0) {
          sidebar.style.top = headerHeight + "px";
        } else {
          sidebar.style.top = "0px";
        }

        if (footerTop < windowHeight) {
          var overlap = windowHeight - footerTop;
          sidebar.style.bottom = overlap + "px";
        } else {
          sidebar.style.bottom = "0px";
        }

        var content = document.querySelector('.nav-panel-content');
        if (headerHeight > 0) {
          content.style.position = "sticky";
          content.style.top = headerHeight + "px";
        } else {
          content.style.position = "sticky";
          content.style.top = "0px";
        }

        ticking = false;
      });

      ticking = true;
    }
  });
}

function switchWhite() {
    const root = document.documentElement;

    root.style.setProperty('--bg-color', '#f6f6f6');
    root.style.setProperty('--font-color', 'black');
    localStorage.setItem('theme', 'white');
}


function switchBlack() {
    const root = document.documentElement;

    root.style.setProperty('--bg-color', '#232323');
    root.style.setProperty('--font-color', 'white');
    localStorage.setItem('theme', 'black');
}