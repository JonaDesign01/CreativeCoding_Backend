const { log } = require('console');
import { myApiKey } from './secrets';
import { myWalletAddress } from './secrets';

module.exports.save = function (filename) {
  //make nft
  const fs = require('fs');
  const fetch = require('node-fetch');
  const FormData = require('form-data');
  const qrcode = require('qrcode');
  const puppeteer = require('puppeteer');
  const path = require('path');

  function generateUniqueName() {
    let fullPath = filename;
    let name = path.basename(fullPath, path.extname(fullPath));
    return name;
  }
  let mijnNaam = generateUniqueName();

  const apiKey = myApiKey;
  const nftName = mijnNaam;
  const nftDescription = 'NFT Collectie van gezichten van de campus';
  const walletAddress = myWalletAddress;

  const form = new FormData();
  const fileStream = fs.createReadStream(filename);
  form.append('file', fileStream);

  const options = {
    method: 'POST',
    body: form,
    headers: {
      Authorization: apiKey,
    },
  };
  fetch(
    'https://api.nftport.xyz/v0/mints/easy/files?' +
      new URLSearchParams({
        chain: 'polygon',
        name: nftName,
        description: nftDescription,
        mint_to_address: walletAddress,
      }),
    options,
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let transactionHash = data.transaction_hash;
      const url2 = `https://api.nftport.xyz/v0/mints/${transactionHash}?chain=polygon`;
      const options2 = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: apiKey,
        },
      };

      const express = require('express');
      const qrcode = require('qrcode');
      const app = express();
      var cors = require('cors');
      app.use(cors());

      setTimeout(() => {
        fetch(url2, options2)
          .then((res) => res.json())
          .then((json) => {
            const contractAddress = json.contract_address;
            const tokenId = json.token_id;
            console.log(contractAddress, tokenId);
            let mijnLink = `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`;

            // make QR code and serve it
            app.get('/qrcode', (req, res) => {
              qrcode.toDataURL(
                mijnLink,
                {
                  errorCorrectionLevel: 'H',
                  width: 500,
                },
                function (err, dataURI) {
                  if (err) {
                    console.error(err);
                    res.status(500).send('Error generating QR code');
                    return;
                  }
                  res.send(dataURI);
                },
              );
            });

            const util = require('util');
            const exec = util.promisify(require('child_process').exec);

            async function printIt() {
              const browser = await puppeteer.launch();
              const page = await browser.newPage();
              await page.goto('http://localhost:5173/qrnft.html');
              await page.waitForTimeout(3000);
              const timestamp = Date.now();
              const filePath = `qrcodes/qrnft-${timestamp}.pdf`;
              await page.pdf({ path: filePath, format: 'A4' });
              await browser.close();
              console.log(`PDF saved to ${filePath}`);
              await server.close();

              const printerName = 'Canon_TS5000_series';
              try {
                const { stdout, stderr } = await exec(
                  `lp -d ${printerName} ${filePath}`,
                );
                console.log('stdout:', stdout);
                console.log('stderr:', stderr);
              } catch (err) {
                console.error(err);
              }
            }

            server = app.listen(4000, () => {
              console.log('Server started on port 4000');
            });

            setTimeout(() => {
              printIt();
            }, 3000);
          })
          .catch((err) => console.error('error:' + err));
      }, 8 * 1000);
    });
};
