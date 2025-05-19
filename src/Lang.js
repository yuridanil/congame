const langs = new Map([
  ["en", {
    "lang": "en",
    "title": "Concentration game",
    "desc": "Find two cards that match to win the Game",
    "type": "Type",
    "level": "Level",
    "play": "Play",
    "scores": "Scores",
    "version": "Version",
    "stop": "Stop",
    "new": "New",
    "hint": "Hint",
    "shuffle": "Shuffle",
    "clear": "Clear",
    "close": "Close",
    "scoretable": "Score Table",
    "score": "Score",
    "oldscore": "Old score",
    "newhigh": "New high score",
    "loadingmsg": "Loading images...",
    "numflips": "Number of flips",
    "successful": "Successful",
    "failure": "Failure",
    "timespent": "Seconds spent",
    "nextlevel": "Next level",
    "replay": "Replay",
    "win": "Win",
    "yes": "Yes",
    "no": "No",
    "startnew": "Start new game",
    "warning": "Warning",
    "progresslost": "The progress will be lost. Are you sure",
    "cleanup": "Clean up scores",
    "imagetypes": ["Keyword", "Circles", "English letters", "Russian letters", "Numbers", "Symbols", "Emojis", "Flags", "Smiles"]
  }],
  ["ru", {
    "lang": "ru",
    "title": "Концентрация",
    "desc": "Найдите парные карточки, чтобы победить",
    "type": "Тип",
    "level": "Уровень",
    "play": "Играть",
    "scores": "Результаты",
    "version": "Версия",
    "stop": "Стоп",
    "new": "Новая",
    "hint": "Подсказка",
    "shuffle": "Перемешать",
    "clear": "Очистить",
    "close": "Закрыть",
    "scoretable": "Таблица результатов",
    "score": "Результат",
    "oldscore": "Предыдущий результат",
    "newhigh": "Новый рекорд",
    "loadingmsg": "Загрузка изображений...",
    "numflips": "Количество попыток",
    "successful": "Удачных",
    "failure": "Неудачных",
    "timespent": "Потрачено секунд",
    "nextlevel": "Следующий",
    "replay": "Заново",
    "win": "Победа",
    "yes": "Да",
    "no": "Нет",
    "startnew": "Начать новую игру",
    "warning": "Внимание",
    "progresslost": "Текущий прогресс будет утерян. Вы уверены",
    "cleanup": "Очистить результаты",
    "imagetypes": ["Ключевое слово", "Круги", "Английские буквы", "Русские буквы", "Цифры", "Символы", "Эмодзи", "Флаги", "Смайлы"]
  }]
]);

let lang = navigator.language.substring(0, 2);

let result = langs.get(lang);

if (lang !== "en")
  for (let v in langs.get("en"))
    result[v] = langs.get(lang)[v] || langs.get("en")[v];

export const Lang = result;