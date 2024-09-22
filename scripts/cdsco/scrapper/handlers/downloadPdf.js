const Redis = require("ioredis");
const redis = new Redis();
const fs = require("fs");
const path = require("path");
const { default: axios } = require("axios");

function queuePDFDownload(pdfUrl, jsonFileName) {
    // Push the download request to a Redis queue
    redis
        .lpush("pdf_download_queue", JSON.stringify({ pdfUrl, jsonFileName }))
        .then(() => {
            // console.log(`Queued PDF download: ${pdfUrl}`);
        })
        .catch((error) => {
            console.error(`Error queuing PDF download: ${error.message}`);
        });
}

// Worker function to process the download queue
async function processPDFQueue() {
    while (true) {
        const item = await redis.rpop("pdf_download_queue");
        if (item) {
            const { pdfUrl, jsonFileName } = JSON.parse(item);
            downloadPDF(pdfUrl, jsonFileName);
        } else {
            // Sleep for a bit before checking the queue again
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

// Updated download function (same as above)
function downloadPDF(pdfUrl, jsonFileName) {
    const filePath = path.resolve(
        __dirname,
        "../../../../temp_files/cdsco/pdf",
        jsonFileName.replace(".json", ".pdf")
    );

    // Create the directory if it doesn't exist
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Use axios to download the PDF
    axios({
        method: "get",
        url: pdfUrl,
        responseType: "stream",
    })
        .then((response) => {
            response.data.pipe(fs.createWriteStream(filePath));
            // console.log(`Downloading PDF: ${pdfUrl} to ${filePath}`);
        })
        .catch((error) => {
            console.error(`Error downloading PDF: ${error.message}`);
        });
}

module.exports = { queuePDFDownload, processPDFQueue };
