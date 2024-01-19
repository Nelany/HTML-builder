const fs = require('fs/promises');
const path = require('path');
const sourceFolder = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

const copyDir = async (src, dest) => {
  try {
    await fs.mkdir(dest, { recursive: true });

    const [srcFiles, destFiles] = await Promise.all([
      fs.readdir(src),
      fs.readdir(dest),
    ]);

    const filesToCopy = srcFiles;

    const filesToRemove = destFiles.filter((file) => !srcFiles.includes(file));

    await Promise.all(
      filesToCopy.map(async (file) => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        const stats = await fs.stat(srcPath);

        if (stats.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }),
    );

    await Promise.all(
      filesToRemove.map(async (file) => {
        const destPath = path.join(dest, file);
        await fs.unlink(destPath);
      }),
    );

    console.log(`Successfully synchronized contents from ${src} to ${dest}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

copyDir(sourceFolder, destinationFolder);

module.exports = copyDir;
