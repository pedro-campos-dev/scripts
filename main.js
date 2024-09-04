const updateHostedSuiteLinks = require("./updateHostedSuiteLinks");
const updateCallRecords = require("./updateCallRecords");

const funcName = process.argv[2];

if (funcName == "hostedSuiteLinks") {
    updateHostedSuiteLinks();
} else if ((funcName = "callRecords")) {
    updateCallRecords();
}
