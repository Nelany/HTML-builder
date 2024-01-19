const fs = require('fs/promises');
const path = require('path');
const mergeStyles = async (stylesFolderPath, outputFolderPath, outputFile) => {
  try {
    await fs.mkdir(outputFolderPath, { recursive: true });

    const styleFiles = await fs.readdir(stylesFolderPath);

    const cssFiles = styleFiles.filter((file) => file.endsWith('.css'));

    const stylesArray = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesFolderPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
      }),
    );

    const bundleContent = stylesArray.join('\n');
    await fs.writeFile(outputFile, bundleContent, 'utf-8');

    console.log('Styles successfully merged into bundle.css');
  } catch (error) {
    console.error('Error:', error.message);
  }
};
const stylesFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolderPath, 'bundle.css');

mergeStyles(stylesFolderPath, outputFolderPath, outputFile);

// module.export = { mergeStyles };

module.exports = mergeStyles;
