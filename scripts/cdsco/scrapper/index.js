const { startBrowser } = require("./utils/browser");
const { mainUrl, menuItems } = require("./config/urls");
const {
    scrapeExtraSingleLinks,
    scrapeType1Page,
    scrapeType2Page,
    scrapeType3Page,
    scrapeType5Page,
    scrapeType6Page,
} = require("./handlers/scrapeHandler");
const { processPDFQueue, logDownloadCounts } = require("./handlers/downloadPdf");
const cron = require("node-cron");
const { savePDFLink, logScrapeCounts } = require("./handlers/pdfHandler");

async function scrapeAllMenuItems() {
    try {
        const browser = await startBrowser();
        const page = await browser.newPage();
        let allPDFLinks = [];

        for (const menuItem of menuItems) {
            console.log(`Scraping PDFs from: ${menuItem.name} ***`);

            if (menuItem.type == "type1") {
                for (const submenu of menuItem.submenus) {
                    // Goto the submenu page url
                    await page.goto(`${mainUrl}${submenu.link}`, {
                        waitUntil: "networkidle2",
                        timeout: 60000,
                    });

                    console.log(`Scraping PDFs from submenu: ${submenu.name}`);
                    const tagString = `${menuItem.name} <--> ${submenu.name}`;
                    let submenuLinks = [];

                    // call function to scrape page Type 1 data
                    submenuLinks = await scrapeType1Page(page, tagString, submenu);
                    allPDFLinks = allPDFLinks.concat(allPDFLinks);
                    console.log("pdf count: ", submenuLinks.length);

                    // Call function to scrape extra PDF links
                    const extraPdfLinks = await scrapeExtraSingleLinks(page, tagString);
                    allPDFLinks = allPDFLinks.concat(extraPdfLinks);
                    console.log("pdf count: ", submenuLinks.length);
                }
            } else if (menuItem.type == "type2") {
                for (const submenu of menuItem.submenus) {
                    // Goto the submenu page url
                    await page.goto(`${mainUrl}${submenu.link}`, {
                        waitUntil: "networkidle2",
                        timeout: 60000,
                    });

                    console.log(`Scraping PDFs from submenu: ${submenu.name}`);
                    const tagString = `${menuItem.name} <--> ${submenu.name}`;
                    let submenuLinks = [];

                    // call function to scrape page Type 2 data
                    submenuLinks = await scrapeType2Page(page, tagString, submenu.tableType);
                    allPDFLinks = allPDFLinks.concat(submenuLinks);
                    console.log("pdf count: ", submenuLinks.length);

                    // Call function to scrape extra PDF links
                    const extraPdfLinks = await scrapeExtraSingleLinks(page, tagString);
                    allPDFLinks = allPDFLinks.concat(extraPdfLinks);
                    console.log("Extra pdf count: ", extraPdfLinks.length);
                }
            } else if (menuItem.type == "type3") {
                for (const submenu of menuItem.submenus) {
                    // Goto the submenu page url
                    await page.goto(`${mainUrl}${submenu.link}`, {
                        waitUntil: "networkidle2",
                        timeout: 60000,
                    });

                    console.log(`Scraping PDFs from submenu: ${submenu.name}`);
                    const tagString = `${menuItem.name} <--> ${submenu.name}`;
                    let submenuLinks = [];

                    // call function to scrape page Type 3 data
                    submenuLinks = await scrapeType3Page(page, tagString, submenu);
                    allPDFLinks = allPDFLinks.concat(submenuLinks);
                    console.log("pdf count: ", submenuLinks.length);

                    // Call function to scrape extra PDF links
                    const extraPdfLinks = await scrapeExtraSingleLinks(page, tagString);
                    allPDFLinks = allPDFLinks.concat(extraPdfLinks);
                    console.log("Extra pdf count: ", extraPdfLinks.length);
                }
            } else if (menuItem.type == "type4") {
                // Goto the submenu page url
                await page.goto(`${mainUrl}${menuItem.link}`, {
                    waitUntil: "networkidle2",
                    timeout: 60000,
                });

                console.log(`Scraping PDFs from menu: ${menuItem.name}`);
                const tagString = `${menuItem.name}`;
                let menuLinks = [];

                // call function to scrape page Type 2 data as its similar to type 4
                menuLinks = await scrapeType2Page(page, tagString, menuItem.tableType);
                allPDFLinks = allPDFLinks.concat(menuLinks);
                console.log("pdf count: ", menuLinks.length);

                // Call function to scrape extra PDF links
                const extraPdfLinks = await scrapeExtraSingleLinks(page, tagString);
                allPDFLinks = allPDFLinks.concat(extraPdfLinks);
                console.log("Extra pdf count: ", extraPdfLinks.length);
            } else if (menuItem.type == "type5") {
                // Goto the submenu page url
                await page.goto(`${mainUrl}${menuItem.link}`, {
                    waitUntil: "networkidle2",
                    timeout: 60000,
                });

                console.log(`Scraping PDFs from menu: ${menuItem.name}`);
                const tagString = `${menuItem.name}`;

                // call function to scrape PDFs from table
                const tablePdfLinks = await scrapeType5Page(page, tagString);
                allPDFLinks = allPDFLinks.concat(tablePdfLinks);
                console.log("pdf count: ", tablePdfLinks.length);

                // Call function to scrape extra PDF links
                const extraPdfLinks = await scrapeExtraSingleLinks(page, tagString);
                allPDFLinks = allPDFLinks.concat(extraPdfLinks);
                console.log("Extra pdf count: ", extraPdfLinks.length);
            } else if (menuItem.type == "type6") {
                // Goto the submenu page url
                await page.goto(`${mainUrl}${menuItem.link}`, {
                    waitUntil: "networkidle2",
                    timeout: 60000,
                });

                console.log(`Scraping PDFs from menu: ${menuItem.name}`);
                const tagString = `${menuItem.name}`;
                let menuLinks = [];

                // call function to scrape page Type 2 data as its similar to type 6
                menuLinks = await scrapeType6Page(page, tagString);
                allPDFLinks = allPDFLinks.concat(menuLinks);
                console.log("pdf count: ", menuLinks.length);

                // Call function to scrape extra PDF links
                const extraPdfLinks = await scrapeExtraSingleLinks(page, tagString);
                allPDFLinks = allPDFLinks.concat(extraPdfLinks);
                console.log("Extra pdf count: ", extraPdfLinks.length);
            } else if (menuItem.type == "type7") {
                await page.goto(`${mainUrl}${menuItem.link}`, {
                    waitUntil: "networkidle2",
                    timeout: 60000,
                });

                console.log(`Scraping PDFs from menu: ${menuItem.name}`);
                const tagString = `${menuItem.name}`;
                let menuLinks = [];

                // Scrape pdfs from lists
                menuLinks = await page.evaluate((tagString) => {
                    // Function to collect PDF links and titles from list items
                    const collectPdfLinks = (tagString) => {
                        const items = document.querySelectorAll(
                            'li a[href*="download_file_division.jsp"]'
                        );
                        return Array.from(items).map((item) => {
                            const pdfUrl = item.href;
                            const title = item.querySelector("span.font_black")?.innerText.trim();
                            return { title, pdfUrl, tagString };
                        });
                    };

                    return collectPdfLinks(tagString);
                }, tagString);

                allPDFLinks = allPDFLinks.concat(menuLinks);
                console.log("pdf count: ", menuLinks.length);

                // Save each PDF link individually
                menuLinks.forEach((pdfLink) => savePDFLink(pdfLink, tagString));

                // Call function to scrape extra PDF links
                const extraPdfLinks = await scrapeExtraSingleLinks(page, tagString);
                allPDFLinks = allPDFLinks.concat(extraPdfLinks);
                console.log("Extra pdf count: ", extraPdfLinks.length);
            }
        }

        await browser.close();
        return allPDFLinks;
    } catch (error) {
        console.error(`Error in scraping:`, error);
        return [];
    }
}

// Start processing the PDF download queue
processPDFQueue();

// Schedule the scraping job to run at 12 AM every day
cron.schedule("0 0 * * *", async () => {
    console.log("Running weekly scrape...");
    try {
        const pdfLinks = await scrapeAllMenuItems();
        console.log(`Total PDF count:`, pdfLinks.length);
        logScrapeCounts();
    } catch (error) {
        console.error("Error during scraping: ", error);
    }
});

// Initial scraping run
(async () => {
    try {
        const pdfLinks = await scrapeAllMenuItems();
        console.log(`Total PDF count:`, pdfLinks.length);
        logScrapeCounts();
    } catch (error) {
        console.error("Error during initial scraping: ", error);
    }
})();
