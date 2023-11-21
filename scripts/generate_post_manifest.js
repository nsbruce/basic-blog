// Run to update manifest.json in posts directory
// `node generate_post_manifest.js`
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname,'../posts'); 
const manifestFile = path.join(directoryPath,'manifest.json'); 

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  const markdownFiles = files.filter(file => file.endsWith('.md'));

  const manifestContent = JSON.stringify(markdownFiles, null, 2);

  fs.writeFile(manifestFile, manifestContent, err => {
    if (err) {
      console.error('Error writing manifest file:', err);
      return;
    }
    console.log('Manifest file created/updated successfully!');
  });
});
