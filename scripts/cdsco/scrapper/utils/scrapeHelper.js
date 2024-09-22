const puppeteer = require("puppeteer");
const { delay } = require("./delay");
const { savePDFLink } = require("../handlers/pdfHandler");

async function helperType3A(page, tagString, button, counter) {
    try {
        const subSubmenuTagString = `${tagString} <--> ${button.name}`;

        let pdfData = [];
        let previousEndingCount = 0;
        let hasNextPage = true;

        // Loop Until there is no next page
        while (hasNextPage) {
            let pageData;
            try {
                pageData = await page.evaluate(
                    (subSubmenuTagString, previousEndingCount, counter) => {
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
                                    const linkElement = row?.querySelector("td:nth-child(4) a");
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

                        const [startingCount, endingCount, totalEntries] = match.map(Number);

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
                    counter
                );
            } catch (error) {
                console.error("Error evaluating page:", error);
                hasNextPage = false;
                continue;
            }

            previousEndingCount = pageData.endingCount;
            pdfData = pdfData.concat(pageData.data);
            hasNextPage = pageData.hasNextPage;

            // If next Page is there then click  on it to fetch data from next page
            if (hasNextPage) {
                await page.evaluate((counter) => {
                    const tab = document.getElementById(`tab${counter + 1}`);
                    if (!tab) throw new Error(`Tab with id 'tab${counter + 1}' not found.`);
                    const element = tab.getElementsByClassName("next");
                    if (element.length > 0) {
                        element[0].click();
                    }
                }, counter);

                // Add a delay to avoid race conditions
                await delay(1000);
            }
        }

        // Save each PDF link individually
        pdfData.forEach((pdfLink) => savePDFLink(pdfLink, tagString));

        return pdfData;
    } catch (error) {
        console.error(
            `Error scraping Type 3 page, typeA submenu, button ${button.name} for ${tagString}:`,
            error
        );
        return [];
    }
}

async function helperType5A(page, tagString) {
    try {
        let pdfData = [];
        let previousEndingCount = 0;
        let hasNextPage = true;

        // Loop Until there is no next page
        while (hasNextPage) {
            let pageData;
            try {
                pageData = await page.evaluate(
                    (tagString, previousEndingCount) => {
                        const tab = document.getElementById(`printableArea`);
                        if (!tab) throw new Error(`Tab with id 'printableArea' not found.`);

                        function scrapeTableRows(tagString, tab) {
                            const rows = Array.from(tab.querySelectorAll(`table tbody tr`));
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

                        const pageInfo = tab.querySelector(".dt-info")?.innerText;

                        if (!pageInfo) {
                            const data = scrapeTableRows(tagString, tab);
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

                        const [startingCount, endingCount, totalEntries] = match.map(Number);

                        if (endingCount === previousEndingCount) {
                            return {
                                data: [],
                                hasNextPage: endingCount !== 0,
                                endingCount,
                            };
                        }

                        const data = scrapeTableRows(tagString, tab);
                        return {
                            data,
                            hasNextPage: endingCount < totalEntries,
                            endingCount,
                        };
                    },
                    tagString,
                    previousEndingCount
                );
            } catch (error) {
                console.error("Error evaluating page:", error);
                hasNextPage = false;
                continue;
            }

            previousEndingCount = pageData.endingCount;
            pdfData = pdfData.concat(pageData.data);
            hasNextPage = pageData.hasNextPage;

            // If next Page is there then click  on it to fetch data from next page
            if (hasNextPage) {
                await page.evaluate(() => {
                    const tab = document.getElementById(`printableArea`);
                    if (!tab) throw new Error(`Tab with id 'printableArea' not found.`);
                    const element = tab.getElementsByClassName("next");
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
        console.error(`Error scraping Type 5 page, tables for ${tagString}:`, error);
        return [];
    }
}

async function helperType6A(page, tagString, button, counter) {
    const subSubmenuTagString = `${tagString} <--> ${button.name}`;

    let pdfData = [];
    let previousEndingCount = 0;
    let hasNextPage = true;

    while (hasNextPage) {
        let pageData;
        try {
            pageData = await page.evaluate(
                (subSubmenuTagString, previousEndingCount, counter) => {
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
                                const linkElement = row?.querySelector("td:nth-child(4) a");
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

                    const [startingCount, endingCount, totalEntries] = match.map(Number);

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
}

// Extranct from anchor tags
async function helperScrapeAnchor(page, tagString) {
    try {
        pdfData = await page.evaluate((tagString) => {
            function pdfsFromAnchor(tagString, anchors) {
                return Array.from(anchors)
                    .map((anchor) => {
                        const title = anchor?.innerText.trim();
                        const pdfUrl = anchor?.href;
                        return { title, pdfUrl, tagString };
                    })
                    .filter((item) => item.pdfUrl);
            }

            const anchors = document.querySelectorAll("div.panel-body a");
            return pdfsFromAnchor(tagString, anchors);
        }, tagString);

        // Save each PDF link individually
        pdfData.forEach((pdfLink) => savePDFLink(pdfLink, tagString));

        return pdfData;
    } catch (error) {
        console.error(`Error scraping Type 5 page, anchors for ${tagString}:`, error);
        return [];
    }
}
module.exports = { helperType3A, helperType5A, helperType6A, helperScrapeAnchor };
