const puppeteer = require("puppeteer");

// Function to start the browser
async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser...");
        browser = await puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

module.exports = { startBrowser };
