const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");

const metadataFilePath = path.resolve(
    __dirname,
    "../../../../temp_files/cdsco/allPdfsMetaData.json"
);

let metadata = {};

// Load the metadata from the file if it exists
if (fs.existsSync(metadataFilePath)) {
    metadata = JSON.parse(fs.readFileSync(metadataFilePath));
}

// Function to save a single PDF link to a JSON file and update the global metadata file
function savePDFLink(pdfLink, tagString) {
    const existingData = metadata[pdfLink.pdfUrl];
    let updateRequired = false;

    // Check if the PDF link already exists in the in-memory hashmap
    if (existingData) {
        // Check if the title is empty or includes "click" (case-insensitive)
        const currentTitle = pdfLink.title.toLowerCase();
        const existingTitle = existingData.title.toLowerCase();
        if (
            existingTitle === "" ||
            existingTitle.includes("click") ||
            existingTitle !== currentTitle
        ) {
            console.log(`Updating existing PDF link: ${pdfLink.pdfUrl}`);
            updateRequired = true;
        } else {
            console.log(`Duplicate PDF link found: ${pdfLink.pdfUrl}`);
            return;
        }
    }

    let pdfDataWithId = "";
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
        const dirPath = path.resolve(__dirname, "../../../../temp_files/cdsco/json");

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const fileName = `${tagString.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${id}.json`;
        const filePath = path.join(dirPath, fileName);

        pdfDataWithId = { ...pdfLink, id, jsonFileName: fileName };

        // Write the new PDF data if not updating
        fs.writeFileSync(filePath, JSON.stringify(pdfDataWithId, null, 2));
    }

    // Add or update the PDF link in the in-memory hashmap
    metadata[pdfLink.pdfUrl] = pdfDataWithId;

    // Save the updated metadata to the global metadata file
    saveMetadataToFile();
}

// Function to save the in-memory hashmap to the global metadata file
function saveMetadataToFile() {
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
}

module.exports = { savePDFLink, saveMetadataToFile };
