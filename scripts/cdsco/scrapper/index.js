const { startBrowser } = require("./utils/browser");
const { mainUrl, menuItems } = require("./config/urls");
const {
    scrapeExtraSingleLinks,
    scrapePDFLinks_TypeA,
    scrapeType1Page,
    scrapeType2Page,
    scrapeType3Page,
    scrapeType5Page,
} = require("./handlers/scrapeHandler");

async function scrapeAllMenuItems() {
    try {
        const browser = await startBrowser();
        const page = await browser.newPage();
        let allPDFLinks = [];

        for (const menuItem of menuItems) {
            console.log(`Scraping PDFs from: ${menuItem.name}`);

            if (menuItem.type == "type1") {
                for (const submenu of menuItem.submenus) {
                    // Goto the submenu page url
                    await page.goto(`${mainUrl}${submenu.link}`, {
                        waitUntil: "networkidle2",
                        timeout: 10000,
                    });

                    console.log(`Scraping PDFs from submenu: ${submenu.name}`);
                    const tagString = `${menuItem.name} <--> ${submenu.name}`;
                    let submenuLinks = [];

                    // Call function to scrape extra PDF links
                    const extraPdfLinks = await scrapeExtraSingleLinks(page, tagString);
                    allPDFLinks = allPDFLinks.concat(extraPdfLinks);

                    // call function to scrape page Type 1 data
                    submenuLinks = await scrapeType1Page(page, tagString, submenu);
                    allPDFLinks = allPDFLinks.concat(submenuLinks);
                }
            } else if (menuItem.type == "type2") {
                for (const submenu of menuItem.submenus) {
                    // Goto the submenu page url
                    await page.goto(`${mainUrl}${submenu.link}`, {
                        waitUntil: "networkidle2",
                        timeout: 10000,
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
                        timeout: 10000,
                    });

                    console.log(`Scraping PDFs from submenu: ${submenu.name}`);
                    const tagString = `${menuItem.name} <--> ${submenu.name}`;
                    let submenuLinks = [];

                    // call function to scrape page Type 2 data
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
                    timeout: 10000,
                });

                console.log(`Scraping PDFs from menu: ${menuItem.name}`);
                const tagString = `${menuItem.name}`;
                let menuLinks = [];

                // Call function to scrape extra PDF links
                const extraPdfLinks = await scrapeExtraSingleLinks(page, tagString);
                allPDFLinks = allPDFLinks.concat(extraPdfLinks);
                console.log("Extra pdf count: ", extraPdfLinks.length);

                // call function to scrape page Type 2 data
                menuLinks = await scrapeType2Page(page, tagString, menuItem.tableType);
                allPDFLinks = allPDFLinks.concat(menuLinks);
                console.log("pdf count: ", menuLinks.length);
            } else if (menuItem.type == "type5") {
                // Goto the submenu page url
                await page.goto(`${mainUrl}${menuItem.link}`, {
                    waitUntil: "networkidle2",
                    timeout: 10000,
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
            }
        }

        await browser.close();
        return allPDFLinks;
    } catch (error) {
        console.error(`Error in scraping:`, error);
        return [];
    }
}

(async () => {
    try {
        const pdfLinks = await scrapeAllMenuItems();
        // console.log("pdfLinks", pdfLinks);
        console.log(`Found ${pdfLinks.length} PDF links.`);
    } catch (error) {
        console.error("Error during scraping: ", error);
    }
})();
