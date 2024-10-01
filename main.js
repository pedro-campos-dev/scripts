const updateHostedSuiteLinks = require("./updateHostedSuiteLinks");
const updateCallRecords = require("./updateCallRecords");
const retrieveFaqs = require("./retrieveFaqs");
const updateCACH = require("./updateCACH");
const updateAccountKeywords = require("./updateAccountKeywords");

const funcName = process.argv[2];

if (funcName === "hostedSuiteLinks") {
    updateHostedSuiteLinks();
} else if (funcName === "callRecords") {
    updateCallRecords();
} else if (funcName === "retrieveFaqs") {
    retrieveFaqs();
} else if (funcName == "cachRecords") {
    updateCACH();
} else if (funcName == "updateKeywords") {
    updateAccountKeywords();
}
