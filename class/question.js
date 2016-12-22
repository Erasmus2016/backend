/**
 * Created by Manuel on 01.12.2016.
 */

class Question {

    constructor() {
        this.mysqldb = require('mysql');
        this.connection = null;
        this.usedQuestions = [];

        this.initDb();
    };

    // Initializes database and establishes connection to database.
    initDb() {

        // Get and set database connection.
        this.connection = this.getDbConnection();

        // Connect to database.
        this.connection.connect(function (error) {
            if (error) {
                throw error;
            }

            console.log('Database connection established.');
        });
    };

    // Gets the question with the appropriate answers from database and returns it.
    // Receives the category name, the difficulty name and the language name.
    // Returns an array with 3 elements:
    // 0. The question object - (will contain the correct answer).
    // 1. The translated question as a string.
    // 2. The translated answers as a string array.
    getQuestionWithAnswers(category, difficulty, language) {

        try {
            var languageId = this.getLanguage(language);

            while (true) {
                var question = this.getQuestion(category, difficulty);
                var isNewQuestion = this.isNewQuestion(question.Id);

                if (isNewQuestion) {
                    var translatedQuestion = this.getQuestionTranslation(question.short_code, languageId);
                    var translatedAnswers = this.getAnswersTranslation(question.short_code, languageId);

                    return [question, translatedQuestion, translatedAnswers];
                }
            }
        }
        finally {
            this.connection.end();
        }
    };

    // Returns the question difficulty as an integer.
    getDifficulty(difficulty) {
        switch (difficulty) {
            case "easy":
                return 1;
            case "medium":
                return 2;
            case "hard":
                return 3;
            default:
                throw 'Unable to get difficultyId.';
        }
    };

    // Returns the language id as an integer.
    getLanguageId(language) {
        switch (language) {
            case "German":
                return 1;
            case "Czech":
                return 2;
            case "English":
                return 3;
            default:
                throw 'Unable to get languageId.';
        }
    };

    // Returns the language id for both question and answer.
    getLanguage(language) {

        // Query database and return a random question.
        var sql = 'SELECT id FROM language ' +
            'WHERE language = ?';

        this.connection.query(sql, language, function (error, result) {
            if (!error) {
                console.log('LanguageId: ', result);
                return result;
            }
            else {
                throw error;
            }
        });
    };

    // Returns a random question object based on input category and difficulty level.
    getQuestion(category, difficulty) {

        var difficultyInt = this.getDifficulty(difficulty);

        // Query database and return one random question.
        var sql = 'SELECT * FROM question ' +
            'WHERE difficulty = ? ' +
            'AND category = ? ' +
            'ORDER BY RAND() LIMIT 1';

        this.connection.query(sql, difficultyInt, category, function (error, result) {
            if (!error) {
                console.log('Question: ', result);
                return result;
            }
            else {
                throw error;
            }
        });
    };

    // Checks and returns true, if the question wasn't already used within this game - otherwise false.
    isNewQuestion(questionId) {
        if (!this.usedQuestions.contains(questionId)) {
            this.saveQuestionIdToRam(questionId);
            return true;
        }
        else {
            return false;
        }
    };

    // Adds a questionId to the already used questions array.
    saveQuestionIdToRam(questionId) {
        this.usedQuestions.push(questionId);
    };

    // Returns the translated question for this question.
    getQuestionTranslation(question_short_code, languageId) {

        // Query database and return the translated question.
        var sql = 'SELECT content FROM question_translation ' +
            'WHERE questionId = ? ' +
            'AND languageId = ??';

        this.connection.query(sql, question_short_code, languageId, function (error, result) {
            if (!error) {
                console.log('Translated question: ', result);
                return result;
            }
            else {
                throw error;
            }
        });
    };

    // Returns the translated answers for this question as an array.
    getAnswersTranslation(question_short_code, languageId) {

        // Query database and return the translated answers.
        var sql = 'SELECT content FROM answer_translation ' +
            'WHERE questionId = ? ' +
            'AND languageId = ??';

        this.connection.query(sql, question_short_code, languageId, function (error, result) {
            if (!error) {
                console.log('Translated answers: ', result);
                return result;
            }
            else {
                throw error;
            }
        });
    };

    // Set up and return database connection.
    getDbConnection() {
        var dbConfigFile = require(APPLICATION_PATH + '/config/db.json');

        return this.mysqldb.createConnection({
            host: dbConfigFile.host,
            user: dbConfigFile.user,
            password: dbConfigFile.pass,
            database: dbConfigFile.db
        });
    };
}

module.exports = Question;