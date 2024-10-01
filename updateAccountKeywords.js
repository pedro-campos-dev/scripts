const fs = require("fs");
const csv = require("csv-parser");
const { json2csv } = require("json-2-csv");

const inputFile = process.argv[3];
const outputFile = process.argv[4] ?? "newAccountsWithKeywords.csv";

const getContactName = (contactRecord) => {
    const contactName = [];

    if (contactRecord.First_Name_Mask__c) {
        contactName.push(contactRecord.First_Name_Mask__c);
    } else {
        if (contactRecord.FirstName) {
            contactName.push(contactRecord.FirstName);
        }
    }

    if (contactRecord.Last_Name_Mask__c) {
        contactName.push(contactRecord.Last_Name_Mask__c);
    } else {
        if (contactRecord.LastName) {
            contactName.push(contactRecord.LastName);
        }
    }

    return contactName.join(" ");
};

const updateKeywords = (contactRecords) => {
    const mapOfKeywordsByAccount = {};
    const accountRecords = [];

    for (const contactRecord of contactRecords) {
        const contactName = getContactName(contactRecord);
        const accountId = contactRecord.AccountId;
        const accountName = contactRecord["Account.Name"];
        if (accountId) {
            if (!mapOfKeywordsByAccount[accountId]) {
                mapOfKeywordsByAccount[accountId] = [accountName];
            }

            const currentKeywords = mapOfKeywordsByAccount[accountId];

            if (!currentKeywords.includes(contactName)) {
                mapOfKeywordsByAccount[accountId].push(contactName);
            }
        }
    }

    for (const accountId of Object.keys(mapOfKeywordsByAccount)) {
        const keywords = mapOfKeywordsByAccount[accountId];

        if (keywords && keywords.length) {
            accountRecords.push({
                Id: accountId,
                Keywords__c: keywords.join(","),
            });
        }
    }

    const newCsv = json2csv(accountRecords);
    fs.writeFileSync(outputFile, newCsv);
};

const readContactsAndUpdate = () => {
    const listOfContacts = [];

    fs.createReadStream(inputFile)
        .pipe(csv())
        .on("data", (data) => {
            listOfContacts.push(data);
        })
        .on("end", () => {
            updateKeywords(listOfContacts);
        });
};

module.exports = () => {
    if (inputFile) {
        readContactsAndUpdate();
    }
};
