const fs = require("fs");
const csv = require("csv-parser");
const { json2csv } = require("json-2-csv");
const jwt = require("jsonwebtoken");

const inputFile = process.argv[3];
const outputFile = process.argv[4] ?? "newCallRecords.csv";
const formsPortalUrl = process.argv[5];

const getToken = (key, value, validity) => {
    const payload = {
        [key]: value,
    };
    const privateKey = Buffer.from(process.env.ACCESS_TOKEN_PRIVATE_KEY, "base64").toString("ascii");
    return jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn: validity, keyid: "JWTCert", notBefore: -30 });
};
const replaceTokens = (account) => {
    const hostedSuiteLinks = account.Hostedsuite_Links__c;
    if (!hostedSuiteLinks) {
        return hostedSuiteLinks;
    }

    const linkPairs = hostedSuiteLinks.split(";");
    const token = getToken(account.Id, "id", 50 * 365 * 24 * 60 * 60);
    const newLinkPairs = [];
    for (const linkPair of linkPairs) {
        let newLinkPair = linkPair;
        let querySeparator = newLinkPair.includes("?") ? "&" : "?";
        querySeparator += "token=";

        if (newLinkPair.includes("token=")) {
            const tokenPairs = newLinkPair.split(querySeparator);
            newLinkPair = tokenPairs[0];
        }

        if (newLinkPair.includes(formsPortalUrl)) {
            newLinkPair += querySeparator + token;
        }

        newLinkPairs.push(newLinkPair);
    }

    return newLinkPairs.join(";");
};

const updateHostedSuiteLinks = (accounts) => {
    const newAccounts = [];

    for (const account of accounts) {
        const newAccount = {
            ...account,
        };
        newAccount.Hostedsuite_Links__c = replaceTokens(account);
        newAccounts.push(newAccount);
    }

    const newCsv = json2csv(newAccounts);
    fs.writeFileSync(outputFile, newCsv);
};

const readAccountAndUpdate = () => {
    const listOfAccounts = [];

    fs.createReadStream(inputFile)
        .pipe(csv())
        .on("data", (data) => {
            listOfAccounts.push(data);
        })
        .on("end", () => {
            updateHostedSuiteLinks(listOfAccounts);
        });
};

module.exports = () => {
    if (inputFile) {
        readAccountAndUpdate();
    }
};
