'use strict'

const cheerio = require('cheerio');
const axios = require('axios');
const uuidv4 = require('uuid/v4');
require('dotenv').config()
const Fs = require('fs')  
const Path = require('path')  
const mime = require('mime-types');
const { Storage } = require('@google-cloud/storage')
const admin = require('firebase-admin');
const { config, states } = require('./src/utils');

const keyFilename = './playa-firebase-firebase-adminsdk-wtfl8-8538065ddc.json';
const projectId = config.projectId
const bucketName = config.storageBucket;
const gcs = new Storage({ projectId, keyFilename });
const bucket = gcs.bucket(bucketName);

const serviceAccount = require(keyFilename);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL: config.databaseURL });
const db = admin.firestore();

const deleteFolderRecursive = (path) => {
  if (Fs.existsSync(path)) {
    Fs.readdirSync(path).forEach((file) => {
      const curPath = Path.join(path, file);
      if (Fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        Fs.unlinkSync(curPath);
      }
    });
  }
};

const upload = async (filePath, filename, callback) => {
  const uuid = uuidv4();
  const options = {
    destination: filename,
    uploadType: "media",
    metadata: {
      contentType: mime.lookup(filePath),
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    }
  };
  
  await bucket.upload(filePath, options);
  const image_url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${uuid}`;
  callback({ uuid, image_url });
}

const capture = async() => {
  const baseUrl = 'https://www.guiaviajarmelhor.com.br';
  const url = `${baseUrl}/melhores-praias-brasil/`;

  await deleteFolderRecursive('./tmp');

  const response = await axios.get(url, {
    processData: false,
    contentType: false,
    cache: false,
  });

  const $ = cheerio.load(response.data, {
    withDomLvl1: true,
    normalizeWhitespace: false,
    xmlMode: true,
    decodeEntities: false
  });

  const rows = $('h3');
  rows.each(async(i, e) => {
    const checkTitle = $(e).find('span').text();
    const checkTitle2 = $(e).find('span').find('span').text();
    const title = (checkTitle2 ? checkTitle2 : checkTitle).trim().replace(/&#8211;/gi, '-');
    
    if (title !== '') {
      const region = title.split(',').reverse()[0].trim();
      const data = states.find(item => item.name === region || item.value === region);
      
      if (data) {
        const { value: state } = data;
        const source = $(e).next().text().trim();
        const description = $(e).next().next().text().trim();
        let image_url = `${baseUrl}${$(e).next().find('img').attr('src')}`;

        const filename = Path.basename(image_url);
        const path = Path.resolve(__dirname, 'tmp', filename);
        const writer = Fs.createWriteStream(path);

        const response = await axios.get(image_url, {
          responseType: 'stream',
        });
        response.data.pipe(writer);
        writer.on('finish', async() => {        
          await upload(path, `playas/${filename}`, ({ uuid, image_url }) => {
            const docRef = db.collection('playas').doc(uuid);
            docRef.set({
              title,
              image_url,
              description,
              state,
              source
            });
          });
        });
      }
    }
  });
};

capture();