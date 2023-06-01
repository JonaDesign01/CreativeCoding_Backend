# Merged Minds

Dit project biedt een unieke kans om kunst en technologie op een innovatieve manier te combineren en een brug te slaan tussen de schoolgemeenschap en de kunstwereld. En dit door middel van een dynamisch grid van gezichten van studenten. Een grid dat blijft evolueren en zorgt voor een gevoel van gemeenschap en inclusiviteit, waarbij iedereen de kans krijgt om deel te nemen en zijn of haar eigen gezicht bij te dragen aan de tentoonstelling.

Van elke versie van het grid wordt steeds automatisch een NFT gemaakt die je kan terugvinden via een QR-code die ook automatisch wordt afgedrukt. Door het gebruik van een QR-code en NFT-technologie wordt de kunst ook nog eens toegankelijker en kan deze door iedereen worden bezeten en verhandeld als een uniek digitaal kunstwerk. Hierdoor krijg je kunst gemaakt uit een gemeenschap bezeten door diezelfde gemeenschap en groter.

Ik maak gebruik van een Raspberry pi, een webcam, een printer, (eventueel Philips hue lampen) en een grote hoeveelheid aan (backend) code. De programmeertalen zijn voornamelijk javascript zelf en node.js.

![videothumbnail.](/mdImages/videothumbnail.png 'This is a sample image.')
Link naar de video

# Installation

Below is the setup process to start the installation.

You will need to use seperate backend code to run:
https://github.com/JonaDesign01/CreativeCoding_Backend

## Backend

Change secrets.example to secrets.js and add your API key and crypto walletAdress.

```
module.exports = {
  myApiKey: 'yourKeyHere',
  myWalletAddress: 'yourWalletAddressHere',
};
```

cd Nodebackend

```
$npm install
$npm run start
```

## Frontend

cd HTMLtoPNG

```
$npm install
$npm run dev
```

open http://localhost:5173/camera.html
![camera.](/mdImages/camera.png 'This is a sample image.')
_This is the place where you take the pictures for the grid._

open http://localhost:5173/qrnft.html
![certificaat.](/mdImages/certificaat.png 'This is a sample image.')
_This is the place the certificate gets made._

open http://localhost:5173 (grid)
![grid.](/mdImages/grid.png 'This is a sample image.')
_This is the place where the grid gets made._

## Equipment

### Materials

- Laptop
- Raspberry pi
- Webcam
- Beamer
- Lamp
- Printer
- Button

## Connect

Connect your laptop to the webcam, projector and printer.
Make sure your camera input is set to that of the external webcam. The printer should be configured as the default printer.

**Raspberry Pi**

Boot up the Rasperry Pi and connect it to your computer.
Connect the cables from the button to the Raspberry to pin 2 (5v Power) and pin 37 (GPIO 26)

![raspberrypiconfiguratie.](/mdImages/raspberrypi.jpg 'This is a sample image.')

You will need to setup a nodered to be able to talk to the button
![noderedmain.](/mdImages/noderedmain.png 'This is a sample image.')
![noderedpin.](/mdImages/noderedpin.png 'This is a sample image.')
![nodereddelay.](/mdImages/nodereddelay.png 'This is a sample image.')
![noderedwebsocket.](/mdImages/noderedwebsocket.png 'This is a sample image.')

## Make Button

Box design with: https://www.makercase.com/#/

## Units

| Left columns       | Right columns |
| ------------------ | :-----------: |
| Inits              |  Millimeters  |
| width              |     150mm     |
| height             |     150mm     |
| depth              |     150mm     |
| Inside or Outside  |    Outside    |
| Material Thickness |      4mm      |
| Edge Joints        |    Finger     |

**Download as .svg,**
modify the box design in illustrator so that you have a hole at the top for the liver to stick through (25mm) and a hole where the cables can come out.

![box.](/mdImages/box.svg 'This is a sample image.')

**Save as .dxf,** after this you can lazer print this and put it together. (Download .dxf here)

![boxbuild.](/mdImages/boxbuild.JPG 'This is a sample image.')

Solder cables to the button.

Drill holes in the top so you can use screws to attach the knob to the top. Then glue the box together with wood glue.

# Code Explanation

## Frontend

Grid code
https://github.com/JonaDesign01/CreativeCoding_Frontend/blob/main/index.html
https://github.com/JonaDesign01/CreativeCoding_Frontend/blob/main/main.js

> In summary, this code fetches a list of images from a server, reverses the order of the images, and then displays them in a grid on an HTML canvas element. The grid is periodically refreshed with new image data.

1. It selects the canvas element and prepares the 2D rendering context.

2. It fetches image URLs from a server and stores them in the images array.
   The order of the images in the images array is reversed.

3. The images are drawn on the canvas using the drawImage function.

4. The drawImage function loads each image, resizes it, and draws it on the canvas.
   The loadGrid function fetches and draws the images.

5. The loadGrid function is called initially to load the grid of images.
   The loadGrid function is called repeatedly every 10 seconds to refresh the grid.

Camera code
https://github.com/JonaDesign01/CreativeCoding_Frontend/blob/main/camera.html
https://github.com/JonaDesign01/CreativeCoding_Frontend/blob/main/takepicture.js

> Overall, the code sets up video capture, establishes a WebSocket connection, handles capturing photos, communicates with a server, and provides status updates to the user during various stages of the process.

1. The code utilizes the getUserMedia API to enable video capture from the user's camera.

2. A capture button is provided to allow the user to take a photo.

3. When the capture button is clicked, the current frame from the video stream is captured and sent to a server for further processing.

4. A countdown timer is implemented to restrict the frequency of capturing photos, preventing rapid consecutive captures.

5. The code establishes a WebSocket connection with a server, allowing it to receive instructions related to capturing photos.

6. During the capture and cooldown periods, status updates are displayed to inform the user about the current state of the application.

7. The code includes error handling for camera access denial or any issues encountered during the WebSocket connection.

8. The commented-out section at the end of the code presents an alternative implementation of the countdown timer and capture button functionality.

Certificate code
https://github.com/JonaDesign01/CreativeCoding_Frontend/blob/main/qrnft.html
https://github.com/JonaDesign01/CreativeCoding_Frontend/blob/main/fetchQR.js

> The code fetches a QR code image from a server and updates it on a webpage every second. It also displays various information such as a number, date, time, number of images, and price on the webpage.

1. Fetches a QR code image URL and updates an image element.

2. Repeatedly updates the QR code image every second.

3. Displays a number, current date, current time, number of images and price in an HTML element.

## Backend

Save images locally and send info
https://github.com/JonaDesign01/CreativeCoding_Backend/blob/main/node.js

> In summary, this application provides functionality for uploading images, retrieving image URLs, and capturing screenshots of a web page.

1. Imports required modules and sets up the necessary dependencies.

2. Defines the paths for uploading images and serving static files.

3. Sets up a multer middleware to handle file uploads.

4. Implements an endpoint for receiving image uploads and saving them to a specified directory.

5. Implements an endpoint for retrieving a list of file URLs from the server.

6. Implements an endpoint for capturing screenshots of a web page using Puppeteer, cropping the desired element, and saving the screenshot to a specified directory.

7. Starts the server and listens on port 3000 for incoming requests.

Create nft, make qr and print certificate
https://github.com/JonaDesign01/CreativeCoding_Backend/blob/main/nft.js

> In summary, this code mints an NFT, generates a QR code for the NFT's OpenSea link, saves it as a PDF, and prints a certificate using a specified printer.

This code exports a function named `save` that performs the following steps:

1. It requires necessary modules and sets up variables.

2. It generates a unique name for the file.

3. It retrieves an API key and wallet address.

4. It prepares form data with the file.

5. It sends a POST request to mint an NFT on the Polygon network.

6. It retrieves the transaction hash and constructs a URL to fetch additional information about the NFT.

7. It sets up an Express server and defines a route to generate a QR code.

8. After a delay, it sends a GET request to retrieve NFT information.

9. Upon receiving the response, it extracts the contract address and token ID.

10. It defines a route to generate a QR code based on the NFT's OpenSea link.

11. It uses Puppeteer to generate a PDF containing the QR code.

12. It logs the file path of the generated PDF and closes the server.

13. It uses the `lp` command-line tool to print the PDF.

14. The server starts listening on port 4000.

15. After a delay, it generates and prints the QR code PDF.

16. Any errors that occur are logged to the console.

## Thanks

Thanks for reading.
