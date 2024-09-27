const fs = require("fs");
const csv = require("csv-parser");
const { json2csv } = require("json-2-csv");

const inputFile = process.argv[3];
const outputFile = process.argv[4] ?? "newCACHRecords.csv";

const updateCACHRecords = (cachRecords) => {
    const newCACHRecords = [];

    for (const cachRecord of cachRecords) {
        let enabled = false;
        const actionsStr = cachRecord["Picklist_Value__r.Actions__c"];
        const contactId = cachRecord["Contact__c"];
        if (actionsStr) {
            try {
                const actions = JSON.parse(actionsStr);
                if (actions && actions.type && actions.type === "referContact") {
                    if (actions.data && actions.data.length) {
                        const contactSpecified = actions.data.find((action) => action.contact);
                        const contactSpecifiedId = contactSpecified ? contactSpecified.contact : null;
                        if (contactSpecifiedId && contactSpecifiedId === contactId) {
                            enabled = true;
                        } else if (contactSpecifiedId && contactSpecifiedId !== contactId) {
                            enabled = false;
                        } else {
                            enabled = true;
                        }
                    }
                }
            } catch (err) {
                continue;
            }
        }

        if (enabled) {
            cachRecord.Enabled__c = true;
            newCACHRecords.push(cachRecord);
        }
    }

    const newCsv = json2csv(newCACHRecords);
    fs.writeFileSync(outputFile, newCsv);
};

const readCACHAndUpdate = () => {
    const listOfCACHRecords = [];

    fs.createReadStream(inputFile)
        .pipe(csv())
        .on("data", (data) => {
            listOfCACHRecords.push(data);
        })
        .on("end", () => {
            updateCACHRecords(listOfCACHRecords);
        });
};

module.exports = () => {
    if (inputFile) {
        readCACHAndUpdate();
    }
};
