/**
 * Created by Manuel on 01.12.2016.
 */

this.mysql      = require('mysql');
this.connection = null;
this.usedQuestions = [];

this.getQuestionWithAnswers = function (category, difficulty, language) {
    try {
        this.initDb();

        var languageId = getLanguage(language);

        while (true) {
            var question = getQuestion(category, difficulty);
            var isNewQuestion = this.isNewQuestion(question.Id);

            if (isNewQuestion) {
                var translatedQuestion = getQuestionTranslation(question.Id, languageId);
                var translatedAnswers = getAnswersTranslation(question.Id, languageId);
                return {translatedQuestion, translatedAnswers};
            }
        }
    }
    finally {
        this.connection.end();
    }
}

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
}

// Returns the question difficulty as an integer.
this.getDifficulty = function (difficulty) {
    switch (difficulty) {
        case "easy":
            return 1;
        case "medium":
            return 2;
        case "hard":
            return 3;
    }
}

// Returns the language for both question and answer.
this.getLanguage = function (language) {

    // Query database and return a random question.
    var table = 'language';
    var sql = 'SELECT id FROM ' + table +
        'WHERE language = ?';

    this.connection.query(sql, language, function (error, result) {
        if(!error) {
            console.log('LanguageId: ', result);
            return result;
        }
        else {
            throw error;
        }
    });
}

// Returns a random question object based on input category and difficulty level.
this.getQuestion = function (category, difficulty) {

    var difficultyInt = this.getDifficulty(difficulty);

    // Query database and return a random question.
    var sql = 'SELECT * FROM question' +
              'WHERE difficulty = ? ' +
              'AND category = ?' +
              'ORDER BY RAND() LIMIT 1';

    this.connection.query(sql, difficultyInt, category, function (error, result) {
        if(!error) {
            console.log('Rows: ', result);
            return result;
        }
        else {
            throw error;
        }
    });
}

// Checks and returns true, if the question wasn't already used within this game - otherwise false.
this.isNewQuestion = function (questionId) {
    return this.usedQuestions.contains(questionId)
        ? false
        : true;
}

// Adds a questionId to the already used questions array.
this.saveQuestionIdToRam = function (questionId) {
    this.usedQuestions.push(questionId);
}

this.getQuestionTranslation = function (questionId, languageId) {

    // Query database and return the translated question.
    var sql = 'SELECT content FROM question_translation' +
              'WHERE questionId = ? ' +
              'AND languageId = ??';

    this.connection.query(sql, questionId, languageId, function (error, result) {
        if(!error) {
            console.log('Translated question: ', result);
            return result;
        }
        else {
            throw error;
        }
    });

    // var post  = {id: 1, title: 'Hello MySQL'};
    // var query = connection.query('INSERT INTO posts SET ?', post,    function(err, result) {
    //     // Neat!
    // });
    // console.log(query.sql);
}

this.getAnswersTranslation = function (questionId, languageId) {

    // Query database and return the translated answers.
    var sql = 'SELECT content FROM answer_translation' +
        'WHERE questionId = ? ' +
        'AND languageId = ??';

    this.connection.query(sql, questionId, languageId, function (error, result) {
        if(!error) {
            console.log('Translated question: ', result);
            return result;
        }
        else {
            throw error;
        }
    });

    // var post  = {id: 1, title: 'Hello MySQL'};
    // var query = connection.query('INSERT INTO posts SET ?', post,    function(err, result) {
    //     // Neat!
    // });
    // console.log(query.sql);
}
this.dbQuery = function (difficulty, language) {

    try {
        // Query database.
        var table = 'tableName';
        var sql = 'SELECT * FROM ' + table + 'WHERE difficulty = ?';

        connection.query(sql, difficulty, function (error, rows) {
            if(!error) {
                console.log('Rows: ', rows);
                return rows;
            }
            else {
                throw error;
            }
        });

        // var post  = {id: 1, title: 'Hello MySQL'};
        // var query = connection.query('INSERT INTO posts SET ?', post,    function(err, result) {
        //     // Neat!
        // });
        // console.log(query.sql);
    }
    finally {
        connection.end();
    }
}

// Set up and return database connection.
this.getDbConnection = function () {
    return this.mysql.createConnection({
        host     : 'localhost',
        user     : '< MySQL username >',
        password : '< MySQL password >',
        database : '<your database name>'
    });
}