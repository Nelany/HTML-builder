const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFileInfo() {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);

      if (file.isFile()) {
        const fileStats = await fs.stat(filePath);
        const fileSizeKB = (fileStats.size / 1024).toFixed(3);

        const fileExtension = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, `.${fileExtension}`);

        console.log(`${fileName} - ${fileExtension} - ${fileSizeKB}kb`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

displayFileInfo();
