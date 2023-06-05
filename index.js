const ExcelJS = require('exceljs');

const isDateString = require('./internal/isDateString');
const getObjectDepth = require('./internal/getObjectDepth');

// Загрузите JSON-данные из файла
const jsonData = require('./data.json');

const jsonDataDepth = getObjectDepth(jsonData) + 1;

// Создайте новую книгу Excel
const workbook = new ExcelJS.Workbook();
// Создайте новый лист в книге
const worksheet = workbook.addWorksheet('Sheet 1');

// Определите заголовки столбцов
// const headers = ["Название", "Тип", "Обязательность", "Пример", "Комментарий"];;
// worksheet.getRow(1).values = headers;

// worksheet.getCell(2, 1).value = "asdfasdf";

// Объединение ячеек с использованием индексов строк и столбцов
// startRow, startCol, endRow, endCol
worksheet.mergeCells(1, 1, 1, jsonDataDepth);
// Задание текста в объединенной ячейке
worksheet.getCell(1, 1).value = 'Название';
// Выравнивание текста в объединенной ячейке
worksheet.getCell(1, 1).alignment = {horizontal: 'center', vertical: 'middle'};

worksheet.getCell(1, jsonDataDepth + 1).value = 'Тип';
worksheet.getCell(1, jsonDataDepth + 1).alignment = {horizontal: 'center', vertical: 'middle'};

worksheet.getCell(1, jsonDataDepth + 2).value = 'Обязательность';
worksheet.getCell(1, jsonDataDepth + 2).alignment = {horizontal: 'center', vertical: 'middle'};

worksheet.getCell(1, jsonDataDepth + 3).value = 'Пример';
worksheet.getCell(1, jsonDataDepth + 3).alignment = {horizontal: 'center', vertical: 'middle'};

worksheet.getCell(1, jsonDataDepth + 4).value = 'Комментарий';
worksheet.getCell(1, jsonDataDepth + 4).alignment = {horizontal: 'center', vertical: 'middle'};

// Установка автоматической ширины столбцов на основе содержимого
worksheet.columns.forEach((column, i) => {
  if(i === jsonDataDepth + 1){
    column.width = 20;
  }
  else if(i >= jsonDataDepth + 2){
    column.width = 35;
  }
});

let row = 1;
function objectsTraversal(obj, nesting){
    // Можно было бы вынести логику с массивами сюда или
    /*if(Array.isArray(obj)){
         row += 1;
         // startRow, startCol, endRow, endCol
         worksheet.mergeCells(row, nesting, row, jsonDataDepth);
         worksheet.getCell(row, nesting + 1).value = key;

         // console.log(`setIds: objectsTraversal by key ${key}:`, obj)
         objectsTraversal(obj[key], nesting + 1);
       }
       else */
  for(const key in obj){
    row += 1;
    // startRow, startCol, endRow, endCol
    worksheet.mergeCells(row, nesting, row, jsonDataDepth);
    // Пример
    worksheet.getCell(row, jsonDataDepth + 1).value = Array.isArray(obj[key]) ? 'array' : (isDateString(obj[key]) ? 'date' : typeof obj[key]);
    // Название поля, но если поле - массив, то определяем [индекс] 
    worksheet.getCell(row, nesting).value = Array.isArray(obj) ? `[${key}]` : key;

    if(typeof obj[key] === 'object'){ // null это видимо тоже объект
        // console.log(`objectsTraversal by key ${key}:`, obj)
        objectsTraversal(obj[key], nesting + 1);
    }
    else {
        worksheet.getCell(row, jsonDataDepth + 3).value = (typeof obj[key] === 'string' && obj[key] === 'string') ? '' : String(obj[key]);
        worksheet.getCell(row, jsonDataDepth + 3).alignment = {horizontal: 'left', vertical: 'middle'};
    }
  }
}

objectsTraversal(jsonData, 1);

// Сохраните книгу в файл
workbook.xlsx.writeFile('output.xlsx')
  .then(() => {
    console.log('Файл Excel успешно создан!');
  })
  .catch((error) => {
    console.error('Произошла ошибка при создании файла Excel:', error);
  });