const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { queuePDFDownload } = require("./downloadPdf");

let duplicatePdfCount = 0;
let distinctPdfCount = 0;

// Updated metadata file path to be in the helper folder
const metadataFilePath = path.resolve(
    __dirname,
    "../../../../temp_files/cdsco/helper/allPdfsMetaData.json"
);

let metadata = {};

// Load the metadata from the file if it exists
if (fs.existsSync(metadataFilePath)) {
    metadata = JSON.parse(fs.readFileSync(metadataFilePath));
}

// Define the directory path
const dirPath = path.resolve(__dirname, "../../../../temp_files/cdsco/json");

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

// Function to save a single PDF link to a JSON file and update the global metadata file
function savePDFLink(pdfLink, tagString) {
    const existingData = metadata[pdfLink.pdfUrl];
    let updateRequired = false;

    // Check if the PDF link already exists in the in-memory hashmap
    if (existingData) {
        const currentTitle = pdfLink.title.toLowerCase();
        const existingTitle = existingData.title.toLowerCase();
        if (existingTitle === "" || existingTitle.includes("click")) {
            // Update is required if the title is empty or contains "click"
            updateRequired = true;
        } else {
            // Increment the duplicate PDF count if no update is required
            duplicatePdfCount++;
            logMessage(`Duplicate PDF link found: ${pdfLink.pdfUrl}`);
            return;
        }
    }

    let pdfDataWithId = "";
    try {
        // If an update is required, read the existing file and update the title
        if (updateRequired && existingData) {
            const existingFilePath = path.join(dirPath, existingData.jsonFileName);
            const existingPdfData = JSON.parse(fs.readFileSync(existingFilePath));

            // Update the title field
            existingPdfData.title = pdfLink.title;
            pdfDataWithId = existingPdfData;

            // Write the updated data back to the file
            fs.writeFileSync(existingFilePath, JSON.stringify(existingPdfData, null, 2));
        } else {
            // Generate a unique ID for the PDF link if it doesn't exist
            const id = existingData ? existingData.id : new ObjectId().toString();

            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            const fileName = `${tagString.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${id}.json`;
            const filePath = path.join(dirPath, fileName);

            pdfDataWithId = { ...pdfLink, id };

            // Write the new PDF data if not updating
            fs.writeFileSync(filePath, JSON.stringify(pdfDataWithId, null, 2));

            // Modify pdfData to include the file path for hashmap
            pdfDataWithId = { ...pdfDataWithId, jsonFileName: fileName };
            distinctPdfCount++;

            // Add it to queue to be downloaded
            queuePDFDownload(pdfLink.pdfUrl, pdfDataWithId.jsonFileName);
        }

        // Add or update the PDF link in the in-memory hashmap
        metadata[pdfLink.pdfUrl] = pdfDataWithId;

        // Save the updated metadata to the global metadata file
        saveMetadataToFile();

        logMessage(
            `Successfully saved PDF: ${pdfLink.pdfUrl}, JSON file: ${pdfDataWithId.jsonFileName}`
        );
    } catch (error) {
        logMessage(`Error saving PDF link: ${pdfLink.pdfUrl}, Error: ${error.message}`);
    }
}

// Function to save the in-memory hashmap to the global metadata file
function saveMetadataToFile() {
    try {
        fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
        // logMessage(`Metadata saved successfully.`);
    } catch (error) {
        logMessage(`Error saving metadata: ${error.message}`);
    }
}

// Function to log counts
function logScrapeCounts() {
    logMessage(`Distinct PDF count: ${distinctPdfCount}`);
    logMessage(`Duplicate PDF count: ${duplicatePdfCount}`);
    console.log("Distinct PDF count:", distinctPdfCount);
    console.log("Duplicate PDF count:", duplicatePdfCount);
}

module.exports = { savePDFLink, saveMetadataToFile, logScrapeCounts };
