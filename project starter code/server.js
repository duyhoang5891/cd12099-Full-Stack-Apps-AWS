import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// Root Endpoint
// Displays a simple message to the user
app.get("/filteredimage", async (req, res) => {
  try {
    let imageUrl = req.query?.image_url?.toString();

    //1. validate the image_url query
    if (!imageUrl) {
      res.status(404).send("Image URL is not found.");
    } else {
      //2. call filterImageFromURL(image_url) to filter the image
      let localPath = await filterImageFromURL(imageUrl)

      //3. send the resulting file in the response
      res.status(200).sendFile(localPath);

      res.on("finish", async () => {
        //4. deletes any files on the server on finish of the response
        await deleteLocalFiles([localPath]);
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error when processing the image")
  }
});

app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});