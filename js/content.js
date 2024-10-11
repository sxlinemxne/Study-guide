var selectedTheme, size;
document.addEventListener("DOMContentLoaded", function () {
  var scriptTag = document.getElementById("dataScript");

  var theme = scriptTag.dataset.page;
  size = scriptTag.dataset.size;
  console.log(theme);

  updateTheme(theme, selectedTheme);
});
var contentElement = document.getElementById("content-text");
var asideElement = document.getElementById("aside-themes");
var urlParams = new URLSearchParams(window.location.search);
selectedTheme = urlParams.get("theme");
function loadJSON(file, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", file, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(JSON.parse(xobj.responseText));
    }
  };
  xobj.send(null);
}
function updateTheme(theme, themeType) {
  loadJSON(theme + ".json", function (data) {
    console.log("Полученные данные:", data);
    console.log("Тип темы:", themeType);
    contentElement.innerHTML = "";
    asideElement.innerHTML = "";

    var themes = data[themeType];
    console.log("Тип темы:", data[themeType]);
    themes.forEach(function (themeData) {
      var themeDiv = document.createElement("div");
      var titleElement = document.createElement("h4");
      var id = themeData.title.toLowerCase().replace(/\s+/g, "-");
      themeDiv.classList.add("theme");
      titleElement.setAttribute("id", id);
      titleElement.textContent = themeData.title;
      themeDiv.appendChild(titleElement);

      themeData.content.forEach(function (contentBlock) {
        if (contentBlock.type === "text") {
          var textElement = document.createElement("p");
          textElement.textContent = contentBlock.text;
          themeDiv.appendChild(textElement);
        } else if (contentBlock.type === "code") {
          var codeBlock = document.createElement("pre");
          var codeElement = document.createElement("code");
          codeElement.textContent = contentBlock.code;
          codeElement.classList.add("language-" + contentBlock.language);
          codeBlock.appendChild(codeElement);
          themeDiv.appendChild(codeBlock);
        }
      });
      contentElement.appendChild(themeDiv);
      var asideResultDiv = document.createElement("div");
      var asideResultTitle = document.createElement("li");
      var asideResultLink = document.createElement("a");
      asideResultLink.setAttribute("href", "#" + id);
      asideResultDiv.appendChild(asideResultTitle);
      asideResultTitle.appendChild(asideResultLink);
      asideResultLink.textContent = themeData.title;
      asideElement.appendChild(asideResultDiv);
    });

    Prism.highlightAll();
  });
}
function prevTheme(s) {
  if (+selectedTheme + 1 <= size) {
    selectedTheme = +selectedTheme + 1;
  }
  updateTheme(s, selectedTheme);
}

function nextTheme(s) {
  if (+selectedTheme - 1 >= 1) {
    selectedTheme = +selectedTheme - 1;
  }
  updateTheme(s, selectedTheme);
}
