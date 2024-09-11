const fs = require("fs");
const csv = require("csv-parser");
const { json2csv } = require("json-2-csv");

const inputFile = process.argv[3];
const outputFile = process.argv[4] ?? "faqsWithSpecialCharacters.csv";

const regexPattern = /[-/\\|]/g;

const getMatches = (text, field) => {
    let matches = "";
    const textMatches = text.match(regexPattern);
    if (textMatches) {
        const mapOfMatches = {};
        textMatches.forEach((match) => {
            if (!mapOfMatches[match]) {
                mapOfMatches[match] = 0;
            }
            mapOfMatches[match] += 1;
        });
        matches += `Matches for ${field}: `;
        const charactersMatched = Object.keys(mapOfMatches).map((match) => {
            return `${mapOfMatches[match]} matches of ${match}`;
        });
        matches += charactersMatched.join(", ");
        matches += "\n";
    }

    return matches;
};

const filterFAQs = (faqs) => {
    const filteredFAQs = [];

    for (const faq of faqs) {
        let matches = "";
        const question = faq.Question__c;
        const question2 = faq.Question2__c;
        const answer = faq.Answer__c;
        const answer2 = faq.Answer2__c;

        matches += getMatches(question, "Question");
        matches += getMatches(answer, "Answer");
        matches += getMatches(question2, "Question2");
        matches += getMatches(answer2, "Answer 2");

        if (matches) {
            filteredFAQs.push({
                Id: faq.Id,
                Matches: matches,
                Question: question,
                Answer: answer,
                "Question 2": question2,
                "Aswer 2": answer2,
            });
        }
    }

    const newCsv = json2csv(filteredFAQs);
    fs.writeFileSync(outputFile, newCsv);
};

const readFAQsAndFilter = () => {
    const listOfFAQs = [];

    fs.createReadStream(inputFile)
        .pipe(csv())
        .on("data", (data) => {
            listOfFAQs.push(data);
        })
        .on("end", () => {
            filterFAQs(listOfFAQs);
        });
};

module.exports = () => {
    if (inputFile) {
        readFAQsAndFilter();
    }
};
