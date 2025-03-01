const slideData = {
    1: [
        {
            content: [
                {
                    type: "code",
                    language: "html",
                    code: `<table border="1">
    <colgroup>
        <col span="2" style="background:Khaki"><!-- С помощью этой конструкции задаем цвет фона для первых двух столбцов таблицы-->
        <col style="background-color:LightCyan"><!-- Задаем цвет фона для следующего (одного) столбца таблицы-->
    </colgroup>
    <tr>
        <th>№ п/п</th>
        <th>Наименование</th>
        <th>Цена, руб.</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Карандаш цветной</td>
        <td>20,00</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Линейка 20 см</td>
        <td>30,00</td>
    </tr>
</table>`,
                },
            ],
        },
    ],
    2: [
        {
            content: [
                {
                    type: "code",
                    language: "html",
                    code: `<table border="1">
    <tr>
        <th>№ п/п</th>
        <th>Наименование товара</th>
        <th>Ед. изм.</th>
        <th>Количество</th>
        <th>Цена за ед. изм., руб.</th>
        <th>Стоимость, руб.</th>
    </tr>
    <tr>
        <td>1.</td>
        <td>Томаты свежие</td>
        <td>кг</td>
        <td>15,20</td>
        <td>69,00</td>
        <td>1048,80</td>
    </tr>
    <tr>
        <td>2.</td>
        <td>Огурцы свежие</td>
        <td>кг</td>
        <td>2,50</td>
        <td>48,00</td>
        <td>120,00</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:right">ИТОГО:</td>
        <td>1168,80</td>
    </tr>
    </table>`,
                },
            ],
        },
    ],
    3: [
        {
            content: [
                {
                    type: "code",
                    language: "html",
                    code: `<table align=center bordercolor="#99181b">
  <tr bgcolor="#99181b" style="color:#f7f3e4">
    <td> </td>
    <td>2004</td>
    <td>2005</td>
    <td>2006</td>
  </tr>
  <tr bgcolor="#f7f3e4">
    <td>Рубины</td>
    <td>43</td>
    <td>51</td>
    <td>79</td>
  </tr>
  <tr bgcolor="#f5ebc6">
    <td>Изумруды</td>
    <td>28</td>
    <td>34</td>
    <td>48</td>
  </tr>
  <tr bgcolor="#f7f3e4">
    <td>Сапфиры</td>
    <td>29</td>
    <td>57</td>
    <td>36</td>
  </tr>
  <tr bgcolor="#f5ebc6">
    <td>Аметисты</td>
    <td>23</td>
    <td>64</td>
    <td>97</td>
  </tr>
</table>`,
                },
            ],
        },
    ],
    4: [
        {
            content: [
                {
                    type: "code",
                    language: "html",
                    code: `<ul>
  <li>Пункт 1.</li>
   <li>Пункт 2.
     <ul>
       <li>Подпункт 2.1.</li>
        <li>Подпункт 2.2.     
         <ul>
           <li>Подпункт 2.2.1.</li>
           <li>Подпункт 2.2.2.</li>
           </ul>
        </li>          
       <li>Подпункт 2.3.</li>
     </ul>
   </li>
  <li>Пункт 3.</li>
 </ul>`,
                },
            ],
        },
    ],
    5: [
        {
            content: [
                {
                    type: "code",
                    language: "html",
                    code: `<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8">
  <title>Списки</title>
  <style>
   ul {
    list-style-image: url(/example/image/bullet.png);
   }
  </style>
 </head>
 <body>
  <ul>
   <li>Сепульки</li>
   <li>Сепулькарии</li>
   <li>Сепуление</li>
  </ul>
</body>
</html>
`,
                },
            ],
        },
    ],
    6: [
        {
            content: [
                {
                    type: "code",
                    language: "html",
                    code: `<html>
 <head>
  <meta charset="utf-8">
  <title>Списки</title>
  <style>
   ol li { font-weight: bold;  /* Выделение пунктов */ }
   ol ol { list-style: lower-alpha;  /* Тип нумерации подпунктов */ }
   ol ol li { font-weight: normal;  /* Оформление подпунктов */ }
  </style>
 </head>
 <body>
   <ol>
    <li>Русская кухня
     <ol>
     <li>Уха бурлацкая</li>
     <li>Бабушкина тюря</li>
     <li>Растегай</li>
    </ol>
   </li>
   <li>Беларусская кухня</li>
   <li>Молдавская кухня</li>
  </ol>
 </body>
</html>
`,
                },
            ],
        },
    ],
    7: [
        {
            content: [
                {
                    type: "code",
                    language: "html",
                    code: `<html>
<head>
    <title>Уникальное выделение</title>
<style>
::selection {
    background-color: green; 
    color: white;
}
</style>
</head>
<body>
    <p>
        Быть энтузиасткой сделалось ее общественным положением, и<br>
        иногда, когда ей даже того не хотелось, она, чтобы не обмануть<br>
        ожиданий людей, знавших ее, делалась энтузиасткой.<br>
        В середине разговора про политические действия Анна Павловна<br>
        разгорячилась
        —Ах, не говорите мне про Австрию! Я ничего не понимаю, может<br>
        быть, но Австрия никогда не хотела и не хочет войны. Она предает<br>
        нас. Россия одна должна быть спасительницей Европы. Наш<br>
        благодетель знает свое высокое призвание и будет верен ему. Вот одно,<br> во что я верю.
    </p>
</body>
</html>
`,
                },
            ],
        },
    ],
    8: [
        {
            content: [
                {
                    type: "code",
                    language: "html",
                    code: `<html>
<head>
    <title>абзацы 2</title>
<style>
body {
    counter-reset: paragraph 7;
}
.abzac {
    counter-increment: paragraph; 
}
.abzac::before {
    content: "Абзац " counter(paragraph) ". "; 
    font-weight: bold; 
}
</style>
</head>
<body>
    <p class="abzac">Быть энтузиасткой сделалось ее общественным положением, и<br>
        иногда, когда ей даже того не хотелось, она, чтобы не обмануть<br>
        ожиданий людей, знавших ее, делалась энтузиасткой.</p>
    <p class="abzac">В середине разговора про политические действия Анна Павловна<br>
        разгорячилась</p>
    <p class="abzac">—Ах, не говорите мне про Австр ничегоию! Я не понимаю, может<br>
        быть, но Австрия никогда не хотела и не хочет войны. Она предает<br>
        нас. Россия одна должна быть спасительницей Европы. Наш<br>
        благодетель знает свое высокое призвание и будет верен ему. Вот одно,<br> во что я верю.</p>
</body>
</html>
`,
                },
            ],
        },
    ],
    9: [
        {
            content: [
                {
                    type: "code",
                    language: "html",
                    code: `<html>
<head>
    <title>список</title>
<style>
ul li:first-child {
    color: red; 
}
ul li:last-child {
    color: green; 
}
</style>
</head>
<body>
<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
    <li>7</li>
    <li>8</li>
    <li>9</li>
</ul>
</body>
</html>
`,
                },
            ],
        },
    ],
};

let isCodeVisible = false;
let isCodeButtonClicked = false;

const swiper = new Swiper(".swiper-container", {
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    on: {
        slideChangeTransitionEnd: function () {
            if (!isCodeButtonClicked) return;
            const activeSlide = document.querySelector(".swiper-slide-active");
            if (activeSlide) {
                const slideId = activeSlide.getAttribute("data-slide");
                displayCode(slideId);
            }
        },
    },
});

function displayCode(slideId) {
    const codeDisplay = document.getElementById("code-display");
    codeDisplay.innerHTML = "";

    if (slideData[slideId]) {
        slideData[slideId].forEach((item) => {
            item.content.forEach((content) => {
                if (content.type === "code") {
                    const pre = document.createElement("pre");
                    const code = document.createElement("code");
                    code.textContent = content.code;
                    code.classList.add("language-" + content.language);
                    pre.appendChild(code);
                    codeDisplay.appendChild(pre);

                    Prism.highlightElement(code);
                }
            });
        });
    }
}

document.querySelector(".view-code").addEventListener("click", function () {
    const activeSlide = document.querySelector(".swiper-slide-active");
    if (activeSlide) {
        const slideId = activeSlide.getAttribute("data-slide");
        if (isCodeVisible) {
            document.getElementById("code-display").style.display = "none";
        } else {
            displayCode(slideId);
            document.getElementById("code-display").style.display = "block";
        }
        isCodeVisible = !isCodeVisible;

        isCodeButtonClicked = true;
    }
});
