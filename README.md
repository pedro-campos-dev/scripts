Steps to run the script:

1 - Clone the repository

2 - Run npm install

3 - Make sure the csv files are on the same folder as the current script

4 - Run:
npm start FUNC_NAME INPUT_FILE_NAME OUTPUT_FILE_NAME ADDITIONAL_PARAMS

Example:

    npm start hostedSuiteLinks inputFile.csv outputFile.csv

Functions:

hostedSuiteLinks -> Update hostedSuiteLinks

callRecords -> Update callRecords with new question field

retrieveFaqs -> Get FAQs and filter to check special characters

cachRecords -> Enable Contact Availability Call Handlers

updateKeywords -> Update the Keywords\_\_c field on Salesforce with accounts and contact names
