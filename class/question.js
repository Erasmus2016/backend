/**
 * Created by Manuel on 01.12.2016.
 */

module.exports = function () {

    this.mysql = require('mysql');
    this.connection = null;
    this.usedQuestions = [];

    // Gets the question with the appropriate answers from database and returns it.
    // Receives the category name, the difficulty name and the language name.
    // Returns an array with 3 elements:
    // 0. The question object - will contain the correct answer).
    // 1. The translated question as a string.
    // 2. The translated answers as a string array.
    this.getQuestionWithAnswers = function (category, difficulty, language) {

        try {
            this.initDb();

            var languageId = this.getLanguage(language);

            while (true) {
                var question = this.getQuestion(category, difficulty);
                var isNewQuestion = this.isNewQuestion(question.Id);

                if (isNewQuestion) {
                    var translatedQuestion = this.getQuestionTranslation(question.short_code, languageId);
                    var translatedAnswers = this.getAnswersTranslation(question.Id, languageId);

                    return [question, translatedQuestion, translatedAnswers];
                }
            }
        }
        finally {
            this.connection.end();
        }
    };

    // Initializes database and establishes connection to database.
    this.initDb = function () {

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

    // Returns the question difficulty as an integer.
    this.getDifficulty = function (difficulty) {
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
    this.getLanguageId = function (language) {
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
    this.getLanguage = function (language) {

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
    this.getQuestion = function (category, difficulty) {

        var difficultyInt = this.getDifficulty(difficulty);

        // Query database and return a random question.
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
    this.isNewQuestion = function (questionId) {
        if (!this.usedQuestions.contains(questionId)) {
            this.saveQuestionIdToRam(questionId);
            return true;
        }
        else {
            return false;
        }
    };

    // Adds a questionId to the already used questions array.
    this.saveQuestionIdToRam = function (questionId) {
        this.usedQuestions.push(questionId);
    };

    // Returns the translated question for this question.
    this.getQuestionTranslation = function (question_short_code, languageId) {

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
    this.getAnswersTranslation = function (question_short_code, languageId) {

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
    this.getDbConnection = function () {
        var dbConfigFile = require(APPLICATION_PATH + '/config/db.json');

        return this.mysql.createConnection({
            host: dbConfigFile.host,
            user: dbConfigFile.user,
            password: dbConfigFile.pass,
            database: dbConfigFile.db
        });
    };
};