const puppeteer = require("puppeteer");
const menuItems = require("./navLinks");
const mainUrl = "https://cdsco.gov.in";
const fs = require("fs");
const path = require("path");
const { count } = require("console");

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
            headless: false,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

// Function to scrape PDF links and titles from a specific table type (table1) with pagination
async function scrapePDFLinks_Table1(page, tagString, tableType) {
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

                        case "typeF": {
                            const rows = Array.from(
                                document.querySelectorAll("table#example tbody tr")
                            );
                            return rows
                                .map((row) => {
                                    const title = row
                                        ?.querySelector("td:nth-child(2)")
                                        ?.innerText.trim();
                                    const linkElement = row?.querySelector("td:nth-child(6) a");
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

        if (menuItem.type == "type2") {
            for (const submenu of menuItem.submenus) {
                console.log(`Scraping PDFs from submenu: ${submenu.name}`);
                const tagString = `${menuItem.name} <--> ${submenu.name}`;

                let submenuLinks = [];

                await page.goto(`${mainUrl}${submenu.link}`, {
                    waitUntil: "networkidle2",
                    timeout: 10000,
                });
                switch (submenu.pageType) {
                    case "table1":
                        submenuLinks = await scrapePDFLinks_Table1(
                            page,
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
        } else if (menuItem.type == "type3") {
            for (const submenu of menuItem.submenus) {
                console.log(`Scraping PDFs from submenu: ${submenu.name}`);
                let submenuLinks = [];
                const tagString = `${menuItem.name} <--> ${submenu.name}`;

                await page.goto(`${mainUrl}${submenu.link}`, {
                    waitUntil: "networkidle2",
                    timeout: 10000,
                });

                if (submenu.pageType == "typeA") {
                    // Now, loop through each button in the tab menu
                    const tabButtons = await page.evaluate(() => {
                        const subSubMenuTab = document.getElementById("myTab");

                        return Array.from(subSubMenuTab?.getElementsByTagName("button")).map(
                            (button) => {
                                return {
                                    id: button.id,
                                    name: button.innerText.trim(),
                                };
                            }
                        );
                    });

                    let counter = 0;
                    for (const button of tabButtons) {
                        // const currentUrl = page.url();
                        // console.log(currentUrl);

                        console.log(`Clicking tab: ${button.name} with id ${button.id}`);

                        // Click the button
                        // await page.click(`#${button.id}`);
                        await page.evaluate((button) => {
                            const element = document.getElementById(button.id);
                            if (element) {
                                element.click();
                            }
                        }, button);

                        // Adding a delay to ensure content loads after clicking
                        await delay(2000);

                        // Scrape the data from the active tab after the button click
                        const subSubmenuTagString = `${tagString} <--> ${button.name}`;

                        let pdfData = [];
                        let previousEndingCount = 0;
                        let hasNextPage = true;

                        const tableType = submenu.tableType;

                        let tableId = `table#example${counter == 0 ? "" : counter} tbody tr`;

                        console.log("tableId- ", tableId);
                        console.log("counter: ", counter);

                        while (hasNextPage) {
                            // console.log("counter (while): ", counter);
                            let pageData;
                            try {
                                pageData = await page.evaluate(
                                    (
                                        subSubmenuTagString,
                                        previousEndingCount,
                                        tableType,
                                        counter
                                    ) => {
                                        let a1,
                                            b1 = counter + 1;
                                        if (counter == 0) {
                                            a1 = "";
                                        } else {
                                            a1 = counter;
                                        }

                                        const tab = document.getElementById(`tab${b1}`);
                                        if (!tab)
                                            throw new Error(`Tab with id 'tab${b1}' not found.`);

                                        function scrapeTableRows(subSubmenuTagString, tab) {
                                            const rows = Array.from(
                                                tab.querySelectorAll(`table tbody tr`)
                                            );
                                            return rows
                                                .map((row) => {
                                                    const title = row
                                                        ?.querySelector("td:nth-child(2)")
                                                        ?.innerText.trim();
                                                    const linkElement =
                                                        row?.querySelector("td:nth-child(4) a");
                                                    const pdfUrl = linkElement
                                                        ? linkElement.href
                                                        : "";
                                                    return { title, pdfUrl, subSubmenuTagString };
                                                })
                                                .filter((item) => item.pdfUrl);
                                        }

                                        const pageInfo = tab.querySelector(".dt-info")?.innerText;

                                        if (!pageInfo) {
                                            const data = scrapeTableRows(subSubmenuTagString, tab);
                                            return { data, hasNextPage: false, endingCount: 0 };
                                        }

                                        const cleanedPageInfo = pageInfo.replace(/,/g, "");
                                        const match = cleanedPageInfo.match(/(\d+)/g);
                                        if (!match) {
                                            console.error(
                                                "Failed to parse pagination info:",
                                                pageInfo
                                            );
                                            return {
                                                data: [],
                                                hasNextPage: false,
                                                endingCount: previousEndingCount,
                                            };
                                        }

                                        const [startingCount, endingCount, totalEntries] =
                                            match.map(Number);

                                        if (endingCount === previousEndingCount) {
                                            return {
                                                data: [],
                                                hasNextPage: endingCount !== 0,
                                                endingCount,
                                            };
                                        }

                                        const data = scrapeTableRows(subSubmenuTagString, tab);
                                        return {
                                            data,
                                            hasNextPage: endingCount < totalEntries,
                                            endingCount,
                                        };
                                    },
                                    subSubmenuTagString,
                                    previousEndingCount,
                                    tableType,
                                    counter
                                );
                            } catch (error) {
                                console.error("Error evaluating page:", error);
                                hasNextPage = false; // Stop the loop on error
                                continue; // Optionally continue to the next iteration
                            }

                            previousEndingCount = pageData.endingCount;
                            pdfData = pdfData.concat(pageData.data);
                            hasNextPage = pageData.hasNextPage;

                            // console.log("counter before next btn:", counter);
                            if (hasNextPage) {
                                await page.evaluate((counter) => {
                                    const tab = document.getElementById(`tab${counter + 1}`);
                                    if (!tab)
                                        throw new Error(
                                            `Tab with id 'tab${counter + 1}' not found.`
                                        );
                                    const element = tab.getElementsByClassName("next");
                                    if (element.length > 0) {
                                        element[0].click();
                                    }
                                }, counter);

                                // Adding a delay to avoid race conditions
                                await delay(1000);
                            }
                        }

                        submenuLinksForButton = pdfData;
                        console.log(
                            `PDF count for ${button.name}: ${submenuLinksForButton.length}`
                        );

                        // Add to submenu links
                        // submenuLinks = submenuLinks.concat(submenuLinksForButton);
                        // Save results to JSON file
                        if (submenuLinksForButton.length > 0) {
                            const dirPath = path.resolve(
                                __dirname,
                                "../../../temp_files/cdsco/json"
                            );
                            if (!fs.existsSync(dirPath)) {
                                fs.mkdirSync(dirPath, { recursive: true });
                            }
                            const fileName =
                                subSubmenuTagString.replace(/[^a-z0-9]+/gi, "-").toLowerCase() +
                                ".json";
                            const filePath = path.join(dirPath, fileName);
                            fs.writeFileSync(
                                filePath,
                                JSON.stringify(submenuLinksForButton, null, 2)
                            );
                        }
                        await delay(3000);
                        counter++;

                        allPDFLinks = allPDFLinks.concat(submenuLinksForButton);
                    }
                } else if (submenu.pageType == "typeB") {
                    submenuLinks = await scrapePDFLinks_Table1(page, tagString, submenu.tableType);
                    console.log("pdf count: ", submenuLinks.length);

                    allPDFLinks = allPDFLinks.concat(submenuLinks);

                    // Save results to JSON file
                    if (submenuLinks.length > 0) {
                        const dirPath = path.resolve(__dirname, "../../../temp_files/cdsco/json");
                        if (!fs.existsSync(dirPath)) {
                            fs.mkdirSync(dirPath, { recursive: true });
                        }
                        const fileName =
                            tagString.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".json";
                        const filePath = path.join(dirPath, fileName);
                        fs.writeFileSync(filePath, JSON.stringify(submenuLinks, null, 2));
                    }
                }

                // // Save results to JSON file
                // if (submenuLinks.length > 0) {
                //     const dirPath = path.resolve(__dirname, "../../../temp_files/cdsco/json");
                //     if (!fs.existsSync(dirPath)) {
                //         fs.mkdirSync(dirPath, { recursive: true });
                //     }
                //     const fileName = tagString.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".json";
                //     const filePath = path.join(dirPath, fileName);
                //     fs.writeFileSync(filePath, JSON.stringify(submenuLinks, null, 2));
                // }
            }
        } else if (menuItem.type == "type4") {
            console.log(`Scraping PDFs from menu: ${menuItem.name}`);

            await page.goto(`${mainUrl}${menuItem.link}`, {
                waitUntil: "networkidle2",
                timeout: 10000,
            });

            let menuLinks = [];
            const tagString = `${menuItem.name}`;
            menuLinks = await scrapePDFLinks_Table1(page, tagString, menuItem.tableType);
            console.log("pdf count: ", menuLinks.length);

            allPDFLinks = allPDFLinks.concat(menuLinks);

            // Save results to JSON file
            if (menuLinks.length > 0) {
                const dirPath = path.resolve(__dirname, "../../../temp_files/cdsco/json");
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
                const fileName = tagString.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".json";
                const filePath = path.join(dirPath, fileName);
                fs.writeFileSync(filePath, JSON.stringify(menuLinks, null, 2));
            }
        } else if (menuItem.type == "type6") {
            console.log(`Scraping PDFs from menu: ${menuItem.name}`);

            await page.goto(`${mainUrl}${menuItem.link}`, {
                waitUntil: "networkidle2",
                timeout: 10000,
            });

            let menuLinks = [];
            const tagString = `${menuItem.name}`;

            // Now, loop through each button in the tab menu
            const tabButtons = await page.evaluate(() => {
                const subSubMenuTab = document.getElementById("myTab");

                return Array.from(subSubMenuTab?.getElementsByTagName("button")).map((button) => {
                    return {
                        id: button.id,
                        name: button.innerText.trim(),
                    };
                });
            });

            let counter = 0;
            for (const button of tabButtons) {
                console.log(`Clicking tab: ${button.name} with id ${button.id}`);

                await page.evaluate((button) => {
                    const element = document.getElementById(button.id);
                    if (element) {
                        element.click();
                    }
                }, button);

                // Adding a delay to ensure content loads after clicking
                await delay(2000);

                // Scrape the data from the active tab after the button click
                const subSubmenuTagString = `${tagString} <--> ${button.name}`;

                let pdfData = [];
                let previousEndingCount = 0;
                let hasNextPage = true;

                const tableType = submenu.tableType;

                let tableId = `table#example${counter == 0 ? "" : counter} tbody tr`;

                console.log("tableId- ", tableId);
                console.log("counter: ", counter);

                while (hasNextPage) {
                    // console.log("counter (while): ", counter);
                    let pageData;
                    try {
                        pageData = await page.evaluate(
                            (subSubmenuTagString, previousEndingCount, tableType, counter) => {
                                let a1,
                                    b1 = counter + 1;
                                if (counter == 0) {
                                    a1 = "";
                                } else {
                                    a1 = counter;
                                }

                                const tab = document.getElementById(`tab${b1}`);
                                if (!tab) throw new Error(`Tab with id 'tab${b1}' not found.`);

                                function scrapeTableRows(subSubmenuTagString, tab) {
                                    const rows = Array.from(tab.querySelectorAll(`table tbody tr`));
                                    return rows
                                        .map((row) => {
                                            const title = row
                                                ?.querySelector("td:nth-child(2)")
                                                ?.innerText.trim();
                                            const linkElement =
                                                row?.querySelector("td:nth-child(4) a");
                                            const pdfUrl = linkElement ? linkElement.href : "";
                                            return { title, pdfUrl, subSubmenuTagString };
                                        })
                                        .filter((item) => item.pdfUrl);
                                }

                                const pageInfo = tab.querySelector(".dt-info")?.innerText;

                                if (!pageInfo) {
                                    const data = scrapeTableRows(subSubmenuTagString, tab);
                                    return { data, hasNextPage: false, endingCount: 0 };
                                }

                                const cleanedPageInfo = pageInfo.replace(/,/g, "");
                                const match = cleanedPageInfo.match(/(\d+)/g);
                                if (!match) {
                                    console.error("Failed to parse pagination info:", pageInfo);
                                    return {
                                        data: [],
                                        hasNextPage: false,
                                        endingCount: previousEndingCount,
                                    };
                                }

                                const [startingCount, endingCount, totalEntries] =
                                    match.map(Number);

                                if (endingCount === previousEndingCount) {
                                    return {
                                        data: [],
                                        hasNextPage: endingCount !== 0,
                                        endingCount,
                                    };
                                }

                                const data = scrapeTableRows(subSubmenuTagString, tab);
                                return {
                                    data,
                                    hasNextPage: endingCount < totalEntries,
                                    endingCount,
                                };
                            },
                            subSubmenuTagString,
                            previousEndingCount,
                            tableType,
                            counter
                        );
                    } catch (error) {
                        console.error("Error evaluating page:", error);
                        hasNextPage = false; // Stop the loop on error
                        continue; // Optionally continue to the next iteration
                    }

                    previousEndingCount = pageData.endingCount;
                    pdfData = pdfData.concat(pageData.data);
                    hasNextPage = pageData.hasNextPage;

                    // console.log("counter before next btn:", counter);
                    if (hasNextPage) {
                        await page.evaluate((counter) => {
                            const tab = document.getElementById(`tab${counter + 1}`);
                            if (!tab) throw new Error(`Tab with id 'tab${counter + 1}' not found.`);
                            const element = tab.getElementsByClassName("next");
                            if (element.length > 0) {
                                element[0].click();
                            }
                        }, counter);

                        // Adding a delay to avoid race conditions
                        await delay(1000);
                    }
                }

                submenuLinksForButton = pdfData;
                console.log(`PDF count for ${button.name}: ${submenuLinksForButton.length}`);

                // Add to submenu links
                // submenuLinks = submenuLinks.concat(submenuLinksForButton);
                // Save results to JSON file
                if (submenuLinksForButton.length > 0) {
                    const dirPath = path.resolve(__dirname, "../../../temp_files/cdsco/json");
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath, { recursive: true });
                    }
                    const fileName =
                        subSubmenuTagString.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".json";
                    const filePath = path.join(dirPath, fileName);
                    fs.writeFileSync(filePath, JSON.stringify(submenuLinksForButton, null, 2));
                }
                await delay(3000);
                counter++;

                allPDFLinks = allPDFLinks.concat(submenuLinksForButton);
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
