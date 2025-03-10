var selectedTheme, size, theme;
document.addEventListener("DOMContentLoaded", function () {
  var scriptTag = document.getElementById("dataScript");

  theme = scriptTag.dataset.page;
  size = scriptTag.dataset.size;
  updateTheme(theme, selectedTheme);
});

var contentElement = document.getElementById("content-text");
var asideElement = document.getElementById("aside-themes");
var urlParams = new URLSearchParams(window.location.search);
selectedTheme = urlParams.get("theme");

async function loadJSONFromServer(filename, callback) {
  try {
    const response = await fetch('http://localhost:5000/file/downloadByName', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    });

    if (!response.ok) throw new Error('Ошибка загрузки данных: ' + response.statusText);

    const data = await response.json();
    callback(data);
  } catch (error) {
    console.error('Ошибка при загрузке JSON с сервера:', error);
  }
}

function updateTheme(theme, themeType) {
  loadJSONFromServer(theme + "-themes.json", function (data) {
    contentElement.innerHTML = "";
    asideElement.innerHTML = "";

    var themes = data[themeType];
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
  if (+selectedTheme + 1 <= size) selectedTheme = +selectedTheme + 1;
  updateURLParams();
  updateTheme(s, selectedTheme);
  clearQuestions();
  fetchQuizData(selectedTheme);
}

function nextTheme(s) {
  if (+selectedTheme - 1 >= 1) selectedTheme = +selectedTheme - 1;
  updateURLParams();
  updateTheme(s, selectedTheme);
  fetchQuizData(selectedTheme);
  clearQuestions();
}

function updateURLParams() {
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search);
  params.set('theme', selectedTheme);
  window.history.replaceState({}, '', `${url.pathname}?${params.toString()}`);
}

function createQuestion(questionData, questionIndex, topicIndex) {
  const section = document.getElementById("test");
  section.style.visibility = "visible";
  const btn = document.getElementById("checkAnswers");
  btn.style.visibility = "visible";

  const questionContainer = document.createElement("div");
  questionContainer.classList.add("question");

  const questionTitle = document.createElement("h3");
  questionTitle.textContent = `${topicIndex}-${questionIndex + 1}. ${questionData.question}`;
  questionContainer.appendChild(questionTitle);

  questionData.answers.forEach((answer, i) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="topic-${topicIndex}-question-${questionIndex}" value="${i}">${answer}`;
    questionContainer.appendChild(label);
    questionContainer.appendChild(document.createElement("br"));
  });

  section.appendChild(questionContainer);
}

function loadQuestions(quizData, selectedTheme) {
  let foundQuestions = false;

  for (let topicIndex in quizData) {
    const topicQuestions = quizData[topicIndex];
    topicQuestions.forEach((question, questionIndex) => {
      if (topicIndex == selectedTheme) {
        createQuestion(question, questionIndex, topicIndex);
        foundQuestions = true;
      }
    });
  }

  if (!foundQuestions) {
    const section = document.getElementById("test");
    section.style.visibility = "hidden";
    const btn = document.getElementById("checkAnswers");
    btn.style.visibility = "hidden";
  }
}

function checkAnswers(quizData) {
  let correctAnswersCount = 0;
  let totalQuestions = 0;

  for (let topicIndex in quizData) {
    if (topicIndex == selectedTheme) {
      const topicQuestions = quizData[topicIndex];
      topicQuestions.forEach((question, questionIndex) => {
        const selectedOption = document.querySelector(`input[name="topic-${topicIndex}-question-${questionIndex}"]:checked`);
        const options = document.querySelectorAll(`input[name="topic-${topicIndex}-question-${questionIndex}"]`);

        options.forEach((option) => {
          if (parseInt(option.value) === question.correct) {
            option.parentElement.style.color = "green";
          } else {
            option.parentElement.style.color = "";
          }
        });

        if (selectedOption) {
          const userAnswer = parseInt(selectedOption.value);
          if (userAnswer === question.correct) {
            correctAnswersCount++;
          } else {
            selectedOption.parentElement.style.color = "red";
          }
        }

        totalQuestions++;
      });
    }
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `Вы ответили правильно на ${correctAnswersCount} из ${totalQuestions} вопросов.`;
}

async function fetchQuizData(selectedTheme) {
  try {
    const filename = theme + "-tests.json";
    const response = await fetch('http://localhost:5000/file/downloadByName', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    });

    if (!response.ok) throw new Error("Ошибка загрузки данных с сервера");

    const quizData = await response.json();
    loadQuestions(quizData, selectedTheme);

    document.getElementById("checkAnswers").addEventListener("click", function () {
      checkAnswers(quizData);
    });
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}

window.onload = function () {
  fetchQuizData(selectedTheme);
};

function clearQuestions() {
  const section = document.getElementById("test");
  section.innerHTML = "";
  const res = document.getElementById("result");
  res.innerHTML = "";
}
