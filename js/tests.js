// function checkAnswers() {
//     resetResults(); // Сбрасываем предыдущие результаты

//     let correctCount = 0; // Счетчик правильных ответов

//     const testForms = document.querySelectorAll('.test-form'); // Получаем все формы теста на странице

//     testForms.forEach(form => {
//         const inputs = form.querySelectorAll('input[type="radio"]:checked');

//         inputs.forEach(input => {
//             if (input.type === 'text') { // Проверка для текстового ввода
//                 const correctAnswer = input.dataset.correctAnswer.toLowerCase(); // Правильный ответ
//                 const userAnswer = input.value.toLowerCase().trim(); // Ответ пользователя

//                 if (userAnswer === correctAnswer) { // Если ответ пользователя правильный
//                     correctCount++; // Увеличиваем счетчик правильных ответов
//                     highlightCorrect(input); // Подсвечиваем правильный ответ
//                 } else {
//                     highlightIncorrect(input); // Подсвечиваем неправильный ответ
//                 }
//             } else if (input.type === 'radio') { // Проверка для радиокнопок
//                 if (input.checked && input.dataset.correct === 'true') { // Если выбран правильный вариант
//                     correctCount++; // Увеличиваем счетчик правильных ответов
//                     highlightCorrect(input); // Подсвечиваем правильный ответ
//                 } else if (input.checked) {
//                     highlightIncorrect(input); // Подсвечиваем неправильный выбор
//                 }
//             }
//         });

//         if (inputs.length === 0) { // Если ни один ответ не выбран
//             form.querySelectorAll('input[type="radio"]').forEach(input => {
//                 highlightIncorrect(input); // Подсвечиваем все неотмеченные варианты как неправильные
//             });
//         }
//     });

//     const totalQuestions = 10; // Общее количество вопросов
//     const scorePercentage = Math.round((correctCount / totalQuestions) * 100); // Процент правильных ответов
//     const resultsContainer = document.querySelector('.results');
//     resultsContainer.textContent = `Вы ответили правильно на ${correctCount} из ${totalQuestions} вопросов (${scorePercentage}%).`;
// }

// function highlightCorrect(input) {
//     const label = input.closest('label');
//     if (label) {
//         label.style.backgroundColor = '#aaffaa'; // Зеленый цвет для правильных ответов
//     }
// }

// function highlightIncorrect(input) {
//     const label = input.closest('label');
//     if (label) {
//         label.style.backgroundColor = '#ffaaaa'; // Красный цвет для неправильных ответов
//     }
// }

// function resetResults() {
//     const labels = document.querySelectorAll('.test-form label');
//     labels.forEach(label => {
//         label.style.backgroundColor = ''; // Сброс цвета фона
//     });

//     const resultsContainer = document.querySelector('.results');
//     resultsContainer.textContent = ''; // Очистка текста результатов
// }

// window.onload = resetResults; // Сброс результатов при загрузке страницы