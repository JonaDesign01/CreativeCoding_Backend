const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const multer = require('multer');
var cors = require('cors');
const nft = require('./nft');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.use(cors());

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/screenshots', express.static(SCREENSHOTS_DIR));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `image-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post('/uploadimage', (req, res) => {
  const base64Image = req.body.image;
  const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(imageData, 'base64');
  const filename = `image-${Date.now()}.png`;
  const filepath = path.join(UPLOADS_DIR, filename);

  fs.writeFile(filepath, buffer, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.get('/give', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading directory');
    } else {
      let fileUrls = files.map((file) => {
        return `http://localhost:3000/uploads/${file}`;
      });
      fileUrls = fileUrls.filter(
        (url) => url.indexOf('.png') > 0 || url.indexOf('.jpg') > 0,
      );
      res.json({ files: fileUrls });
    }
  });
});

app.post('/screenshots', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('.maingrid');
  await page.waitForTimeout(5000);
  const element = await page.$('.maingrid');
  const boundingBox = await element.boundingBox();
  fs.readdir('uploads', async (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading directory');
    } else {
      const fileName = `${SCREENSHOTS_DIR}/mergedminds-${files.length}.png`;
      const screenshotOptions = {
        path: fileName,
        clip: {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      };
      await page.screenshot(screenshotOptions);
      await browser.close();

      nft.save(fileName);
      res.sendStatus(200);
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
