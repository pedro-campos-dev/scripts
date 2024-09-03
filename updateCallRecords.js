const fs = require("fs");
const csv = require("csv-parser");
const { json2csv } = require("json-2-csv");

const inputFile = process.argv[2];
const outputFile = process.argv[3] ?? "newCallRecords.csv";

const updateCallRecords = (callRecords) => {
  const newCallRecords = [];

  for (const callRecord of callRecords) {
    const questionAboutCall = callRecord.AI_Question_About_Call__c;
    const answerAboutCall = callRecord.AI_Answer_About_Call__c;
    if (!questionAboutCall && answerAboutCall) {
      const answerQuestionParts = answerAboutCall.split(":");
      newCallRecords.push({
        Id: callRecord.Id,
        AI_Answer_About_Call__c: answerQuestionParts[1].trim(),
        AI_Question_About_Call__c: answerQuestionParts[0].trim(),
      });
    }
  }

  const newCsv = json2csv(newCallRecords);
  fs.writeFileSync(outputFile, newCsv);
};

const readCallRecordsAndUpdate = () => {
  const listOfCallRecords = [];

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on("data", (data) => {
      listOfCallRecords.push(data);
    })
    .on("end", () => {
      updateCallRecords(listOfCallRecords);
    });
};

if (inputFile) {
  readCallRecordsAndUpdate();
}
