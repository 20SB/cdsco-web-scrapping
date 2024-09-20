const puppeteer = require("puppeteer");
const menuItems = require("./navLinks");
const mainUrl = "https://cdsco.gov.in";
const fs = require("fs");
const path = require("path");

// Basic delay function
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to start the browser
async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser...");
        browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

// Function to scrape PDF links and titles from a specific table type (table1) with pagination
async function scrapePDFLinks_Table1(page, url, tagString, tableType) {
    await page.goto(`${mainUrl}${url}`, { waitUntil: "networkidle2", timeout: 10000 });
    let pdfData = [];
    let previousEndingCount = 0;
    let hasNextPage = true;

    // page.on("console", (msg) => {
    //     console.log("PAGE LOG:", msg.text());
    // });

    while (hasNextPage) {
        const pageData = await page.evaluate(
            (tagString, previousEndingCount, tableType) => {
                // Function to scrape table rows within the page context
                function scrapeTableRows(tagString) {
                    switch (tableType) {
                        case "typeA": {
                            const rows = Array.from(
                                document.querySelectorAll("table#example tbody tr")
                            );
                            return rows
                                .map((row) => {
                                    const title = row
                                        ?.querySelector("td:nth-child(2)")
                                        ?.innerText.trim();
                                    const linkElement = row?.querySelector("td:nth-child(4) a");
                                    const pdfUrl = linkElement ? linkElement.href : "";
                                    return { title, pdfUrl, tagString };
                                })
                                .filter((item) => item.pdfUrl);
                        }

                        case "typeB": {
                            const rows = Array.from(
                                document.querySelectorAll("table#example tbody tr")
                            );
                            return rows
                                .map((row) => {
                                    const title = row
                                        ?.querySelector("td:nth-child(3)")
                                        ?.innerText.trim();
                                    const linkElement = row?.querySelector("td:nth-child(5) a");
                                    const pdfUrl = linkElement ? linkElement.href : "";
                                    return { title, pdfUrl, tagString };
                                })
                                .filter((item) => item.pdfUrl);
                        }

                        case "typeC": {
                            const rows = Array.from(
                                document.querySelectorAll("tr.views-row-first")
                            );
                            return rows
                                .map((row) => {
                                    const title = row
                                        ?.querySelector("td:nth-child(2)")
                                        ?.innerText.trim();
                                    const linkElement = row?.querySelector("td:nth-child(3) a");
                                    const pdfUrl = linkElement ? linkElement.href : "";
                                    return { title, pdfUrl, tagString };
                                })
                                .filter((item) => item.pdfUrl);
                        }

                        case "typeD": {
                            const lists = Array.from(document.querySelectorAll("ul.ul_events li"));
                            return lists
                                .map((list) => {
                                    const title =
                                        list.querySelector("span.bold")?.innerText.trim() ||
                                        list.innerText.trim();
                                    const linkElement = list.querySelector("p:nth-child(3) a");
                                    const pdfUrl = linkElement ? linkElement.href : "";
                                    return { title, pdfUrl, tagString };
                                })
                                .filter((item) => item.pdfUrl);
                        }

                        case "typeE": {
                            const rows = Array.from(
                                document.querySelectorAll("table#example tbody tr")
                            );
                            return rows
                                .map((row) => {
                                    const title = row
                                        ?.querySelector("td:nth-child(2)")
                                        ?.innerText.trim();
                                    const linkElement = row?.querySelector("td:nth-child(5) a");
                                    const pdfUrl = linkElement ? linkElement.href : "";
                                    return { title, pdfUrl, tagString };
                                })
                                .filter((item) => item.pdfUrl);
                        }

                        default:
                            break;
                    }
                }

                // Check if pagination info exists
                const pageInfo = document.querySelector("#example_info")?.innerText;

                // If no pagination info, scrape the table on this page and exit
                if (!pageInfo) {
                    const data = scrapeTableRows(tagString);
                    return { data, hasNextPage: false, endingCount: 0 };
                }

                // Remove commas from pageInfo to correctly extract numeric values
                const cleanedPageInfo = pageInfo.replace(/,/g, "");

                // If pagination exists, extract pagination details
                const [startingCount, endingCount, totalEntries] = cleanedPageInfo
                    .match(/(\d+)/g)
                    .map(Number);

                // If the current ending count matches the previous one, skip scraping
                if (endingCount === previousEndingCount) {
                    return { data: [], hasNextPage: endingCount !== 0, endingCount };
                }

                const data = scrapeTableRows(tagString);

                return { data, hasNextPage: endingCount < totalEntries, endingCount };
            },
            tagString,
            previousEndingCount,
            tableType
        );

        // Update the previous ending count to the current one
        previousEndingCount = pageData.endingCount;

        pdfData = pdfData.concat(pageData.data);
        hasNextPage = pageData.hasNextPage;

        // If there are more pages, click the "next" button
        if (hasNextPage) {
            await page.evaluate(() => {
                const element = document.getElementsByClassName("next");
                if (element.length > 0) {
                    element[0].click();
                }
            });

            // Adding a delay to avoid race conditions
            await delay(1000);
        }
    }
    return pdfData;
}

// Function to scrape all menu items and submenus
async function scrapeAllMenuItems() {
    const browser = await startBrowser();
    const page = await browser.newPage();
    let allPDFLinks = [];

    for (const menuItem of menuItems) {
        console.log(`Scraping PDFs from: ${menuItem.name}`);

        if (menuItem.submenus) {
            for (const submenu of menuItem.submenus) {
                console.log(`Scraping PDFs from submenu: ${submenu.name}`);
                let submenuLinks = [];
                const tagString = `${menuItem.name} <--> ${submenu.name}`;
                switch (submenu.pageType) {
                    case "table1":
                        submenuLinks = await scrapePDFLinks_Table1(
                            page,
                            submenu.link,
                            tagString,
                            submenu.tableType
                        );
                        break;
                    // case "table2":
                    //     // Assuming scrapePDFLinks_Table2 function exists and is implemented similarly
                    //     submenuLinks = await scrapePDFLinks_Table2(page, submenu.link, tagString);
                    //     break;
                    default:
                        console.log("Page Type Not Matching");
                        break;
                }
                console.log("pdf count: ", submenuLinks.length);

                allPDFLinks = allPDFLinks.concat(submenuLinks);

                // Save results to JSON file
                if (submenuLinks.length > 0) {
                    const dirPath = path.resolve(__dirname, "../../../temp_files/cdsco/json");
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath, { recursive: true });
                    }
                    const fileName = tagString.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".json";
                    const filePath = path.join(dirPath, fileName);
                    fs.writeFileSync(filePath, JSON.stringify(submenuLinks, null, 2));
                }
            }
        }
    }

    await browser.close();
    return allPDFLinks;
}

// Main function to orchestrate the scraping
(async () => {
    try {
        const pdfLinks = await scrapeAllMenuItems();
        console.log(`Found ${pdfLinks.length} PDF links.`);
    } catch (error) {
        console.error("Error during scraping: ", error);
    }
})();
