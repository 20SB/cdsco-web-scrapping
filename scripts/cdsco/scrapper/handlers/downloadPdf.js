const Redis = require("ioredis");
const redis = new Redis();
const fs = require("fs");
const path = require("path");
const { default: axios } = require("axios");

// Log file path for saving logs
const logDirPath = path.resolve(__dirname, "../../../../temp_files/cdsco/helper");
const logFilePath = path.join(logDirPath, "logs.txt");

// Function to log messages with timestamps
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${message}\n`;

    // Ensure that the log directory exists before writing to the log file
    if (!fs.existsSync(logDirPath)) {
        fs.mkdirSync(logDirPath, { recursive: true });
    }

    fs.appendFileSync(logFilePath, logEntry, "utf8");
}

// Queue function to download PDFs
function queuePDFDownload(pdfUrl, jsonFileName) {
    redis
        .lpush("pdf_download_queue", JSON.stringify({ pdfUrl, jsonFileName }))
        .then(() => {
            logMessage(`Queued PDF download: ${pdfUrl}`);
        })
        .catch((error) => {
            logMessage(`Error queuing PDF download: ${error.message}`);
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
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

// Function to download the PDF and log success or errors
function downloadPDF(pdfUrl, jsonFileName) {
    const filePath = path.resolve(
        __dirname,
        "../../../../temp_files/cdsco/pdf",
        jsonFileName.replace(".json", ".pdf")
    );

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    axios({
        method: "get",
        url: pdfUrl,
        responseType: "stream",
    })
        .then((response) => {
            response.data.pipe(fs.createWriteStream(filePath));
            logMessage(`Downloaded PDF: ${pdfUrl} to ${filePath}`);
        })
        .catch((error) => {
            logMessage(`Error downloading PDF: ${pdfUrl}, Error: ${error.message}`);
        });
}

module.exports = { queuePDFDownload, processPDFQueue };
