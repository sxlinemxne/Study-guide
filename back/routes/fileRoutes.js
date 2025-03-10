const express = require("express");
const pool = require("../db");
const router = express.Router();

// Эндпоинт для поиска файла по имени в базе данных
router.post('/downloadByName', async (req, res) => {
  try {
    const { filename } = req.body; // Извлекаем имя файла из тела запроса

    if (!filename) {
      return res.status(400).json({ error: 'Не передано имя файла!' });
    }

    // Поиск файла в базе данных по имени
    const result = await pool.query(
      'SELECT file_data FROM themes_files WHERE file_name = $1',
      [filename]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Файл ${filename} не найден в базе данных!` });
    }

    const fileData = result.rows[0].file_data;

    // Устанавливаем правильный тип контента и отправляем файл
    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.parse(fileData)); // Возвращаем данные как JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении файла', details: error.message });
  }
});

// Эндпоинт для загрузки файлов в базу данных
router.post('/uploadByName', async (req, res) => {
  try {
    const { filenames } = req.body; // Ожидаем массив имен файлов

    if (!filenames || !Array.isArray(filenames)) {
      return res.status(400).json({ error: 'Не передан список файлов!' });
    }

    // Обрабатываем каждый файл
    for (const filename of filenames) {
      if (!filename) {
        return res.status(400).json({ error: 'Имя файла не передано!' });
      }

      // Ищем файл в базе данных по имени
      const result = await pool.query(
        'SELECT file_data FROM themes_files WHERE file_name = $1',
        [filename]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: `Файл ${filename} не найден в базе данных!` });
      }

      const fileData = result.rows[0].file_data;

      // Вставляем или обновляем файл в базе данных
      await pool.query(
        'INSERT INTO themes_files (file_name, file_data) VALUES ($1, $2) ON CONFLICT (file_name) DO UPDATE SET file_data = $2',
        [filename, fileData]
      );
    }

    res.json({ message: 'Файлы успешно загружены в БД!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка загрузки файлов', details: error.message });
  }
});

module.exports = router;
