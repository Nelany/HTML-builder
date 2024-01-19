const fs = require('fs/promises');
const path = require('path');
const mergeStyles = require('../05-merge-styles/index');
const copyDir = require('../04-copy-directory/index');

async function buildPage() {
  try {
    // 1) Создаем project-dist
    const outputFolderPath = path.join(__dirname, 'project-dist');
    await fs.mkdir(outputFolderPath, { recursive: true });

    // 2) Копируем контент из template.html
    const templatePath = path.join(__dirname, 'template.html');
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    // 3) Находим все нужные теги emplate.html
    const tagNames = templateContent.match(/{{(.*?)}}/g);

    // 4) Заменяем данные теги на контент соответствующих файлов
    const replacedContent = await Promise.all(
      tagNames.map(async (tagName) => {
        const componentName = tagName.slice(2, -2).trim();
        const componentPath = path.join(
          __dirname,
          'components',
          `${componentName}.html`,
        );
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        return { tagName, componentContent };
      }),
    ).then((replacements) => {
      return replacements.reduce((content, { tagName, componentContent }) => {
        return content.replace(tagName, componentContent);
      }, templateContent);
    });

    // 5) Записываем измененный контент в index.html папки project-dist
    const indexPath = path.join(outputFolderPath, 'index.html');
    await fs.writeFile(indexPath, replacedContent, 'utf-8');

    // 6) Импортируем скрипт из таска 05-merge-styles - создаем style.css
    const stylesFolderPath = path.join(__dirname, 'styles');
    const outputFile = path.join(outputFolderPath, 'style.css');
    await mergeStyles(stylesFolderPath, outputFolderPath, outputFile);

    // 7) Импортируем скрипт из таска 04-copy-directory - копируем assets

    await copyDir(
      path.join(__dirname, 'assets'),
      path.join(outputFolderPath, 'assets'),
    );

    console.log('Build successful! Check the project-dist folder.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

buildPage();
