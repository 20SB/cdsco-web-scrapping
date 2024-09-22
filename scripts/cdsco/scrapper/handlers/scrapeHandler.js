const { delay } = require("../utils/delay");
const {
    helperType3A,
    helperType5A,
    helperScrapeAnchor,
    helperType6A,
} = require("../utils/scrapeHelper");
const { savePDFLink } = require("./pdfHandler");

// Function to scrape extra PDF links from a page
async function scrapeExtraSingleLinks(page, tagString) {
    try {
        const pdfData = await page.evaluate((tagString) => {
            const collectPdfLinks = () => {
                const anchors = document.querySelectorAll('a[href$=".pdf"]');
                return Array.from(anchors).map((anchor) => {
                    const title = anchor.innerText.trim();
                    const pdfUrl = anchor.href;
                    return { title, pdfUrl, tagString };
                });
            };
            return collectPdfLinks();
        }, tagString);

        // Save each PDF link individually
        pdfData.forEach((pdfLink) => savePDFLink(pdfLink, tagString));

        return pdfData;
    } catch (error) {
        console.error(`Error scraping extra single links for ${tagString}:`, error);
        return [];
    }
}

// Scrape page Type 1
async function scrapeType1Page(page, tagString, submenu) {
    try {
        const submenuLinks = await page.evaluate(
            (tagString, submenu) => {
                const collectPdfLinks = (tagString, submenu) => {
                    const anchors = document.querySelectorAll('a[href$=".pdf"]');
                    return Array.from(anchors).map((anchor) => {
                        let title;
                        const innerText = anchor.innerText.trim();
                        const parentDiv = anchor.parentElement;

                        if (innerText !== "Click here to download") {
                            title = innerText;
                        } else {
                            let previousP = parentDiv.previousElementSibling;
                            while (previousP && previousP.tagName !== "P") {
                                previousP = previousP.previousElementSibling;
                            }
                            title = previousP
                                ? previousP.innerText.trim()
                                : submenu.heading
                                ? submenu.heading
                                : "";
                        }

                        const pdfUrl = anchor.href;
                        return { title, pdfUrl, tagString };
                    });
                };

                return collectPdfLinks(tagString, submenu);
            },
            tagString,
            submenu
        );

        // Save each PDF link individually
        submenuLinks.forEach((pdfLink) => savePDFLink(pdfLink, tagString));

        return submenuLinks;
    } catch (error) {
        console.error(`Error scraping Type 1 page for ${tagString}:`, error);
        return [];
    }
}

// Scrape page Type 2
async function scrapeType2Page(page, tagString, tableType) {
    try {
        let pdfData = [];
        let previousEndingCount = 0;
        let hasNextPage = true;

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
                                const lists = Array.from(
                                    document.querySelectorAll("ul.ul_events li")
                                );
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

        // Save each PDF link individually
        pdfData.forEach((pdfLink) => savePDFLink(pdfLink, tagString));

        return pdfData;
    } catch (error) {
        console.error(`Error scraping Type 2 page for ${tagString}:`, error);
        return [];
    }
}

// Scrape page Type 3
async function scrapeType3Page(page, tagString, submenu) {
    try {
        let subMenuPDFLinks = [];

        if (submenu.pageType == "typeA") {
            // Find sub-sub-menu tabButtons
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

            // Now, loop through each button in the tab menu
            for (const button of tabButtons) {
                console.log(`Clicking tab: ${button.name} with id ${button.id}`);

                // Click the button
                await page.evaluate((button) => {
                    const element = document.getElementById(button.id);
                    if (element) {
                        element.click();
                    }
                }, button);

                // Adding a delay to ensure content loads after clicking
                await delay(2000);

                const submenuLinksForButton = await helperType3A(page, tagString, button, counter);
                counter++;

                console.log(`PDF count for ${button.name}: ${submenuLinksForButton.length}`);
                subMenuPDFLinks = subMenuPDFLinks.concat(submenuLinksForButton);
            }
        } else if (submenu.pageType == "typeB") {
            const submenuLinks = await scrapeType2Page(page, tagString, submenu.tableType);
            subMenuPDFLinks = subMenuPDFLinks.concat(submenuLinks);
            console.log("pdf count: ", submenuLinks.length);
        }
        return subMenuPDFLinks;
    } catch (error) {
        console.error(`Error scraping Type 3 page for ${tagString}:`, error);
        return [];
    }
}

// Scrape page Type 5
async function scrapeType5Page(page, tagString) {
    try {
        let pdfLinks = [];

        // Scrape Data from Tables
        const tablePdfLinks = await helperType5A(page, tagString);
        pdfLinks = pdfLinks.concat(tablePdfLinks);

        // Scrape Data from Anchors
        const AnchorPdfLinks = await helperScrapeAnchor(page, tagString);
        pdfLinks = pdfLinks.concat(AnchorPdfLinks);

        return pdfLinks;
    } catch (error) {
        console.error(`Error scraping Type 5 page for ${tagString}:`, error);
        return [];
    }
}

// Scrape page Type 6
async function scrapeType6Page(page, tagString) {
    try {
        let allPDFLinks = [];
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

            const submenuLinksForButton = await helperType3A(page, tagString, button, counter);
            counter++;

            allPDFLinks = allPDFLinks.concat(submenuLinksForButton);
        }
        return allPDFLinks;
    } catch (error) {
        console.error(`Error scraping Type 6 page for ${tagString}:`, error);
        return [];
    }
}

module.exports = {
    scrapeExtraSingleLinks,
    scrapeType1Page,
    scrapeType2Page,
    scrapeType3Page,
    scrapeType5Page,
    scrapeType6Page,
};
