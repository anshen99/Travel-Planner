const https = require('https');
const fs = require('fs');
const path = require('path');

const textures = [
  {
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    filename: 'earth_texture.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    filename: 'earth_bump.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    filename: 'earth_specular.jpg'
  }
];

const downloadFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join('public', filename));
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename);
      reject(err);
    });
  });
};

const downloadAll = async () => {
  for (const texture of textures) {
    await downloadFile(texture.url, texture.filename);
  }
};

downloadAll().catch(console.error); 