const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

/**
 * Api to generate an image using web url
 */
app.get("/", async (req, res) => {
  return res.json({ message: "This is backend server!" });
});

/**
 * Api to generate an image using web url
 */
app.get("/generate-from-url", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.youtube.com/");
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 1,
    });
    await page.screenshot({ path: "./generated/image-by-url.png" });
    await browser.close();

    console.log("The image was created successfully!");

    return res.json({ status: true, message: "The image was created successfully!" });
  } catch (e) {
    return res.json({ status: false, message: e.message });
  }
});

/**
 * Api to generate an image of html file
 */
app.get("/generate-from-html", async (req, res) => {
  try {
    const html = await fs.readFileSync(__dirname + "/files/webpage.html", "utf8");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 1,
    });
    await page.setContent(html);
    await page.screenshot({ path: "./generated/image-by-html.png" });
    await browser.close();

    return res.json({ status: true, message: "The image was created successfully!" });
  } catch (e) {
    return res.json({ status: false, message: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});
