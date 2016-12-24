/**
 * Created by Manuel on 01.12.2016.
 */

class Question {

    constructor() {

        this.usedQuestions = [];
    };

    // Gets the question with the appropriate answers from database and returns it.
    // Receives the category name, the difficulty name and the language name.
    // Returns an array with 3 elements:
    // 0. The question object - (will contain the correct answer).
    // 1. The translated question as a string.
    // 2. The translated answers as a string array.
    getQuestionWithAnswers(category, difficulty, language) {

        try {
            // Not sure if hack or just necessary...
            let _this = this;

            // Query database and get the language id.
            // TODO: make sure, the database languages entries are not going to change -> use a switch-case instead of an database query -> getLanguageId function.
            var sql1 = 'SELECT id FROM language ' +
                'WHERE language = "' + language + '"';

            return DB.query(sql1).then(function (result) {

                // console.log('LanguageId: ', result);
                var languageId = result[0].id;
                var difficultyInt = _this.getDifficulty(difficulty);

                // Query database and get one random question.
                var sql2 = 'SELECT * FROM question ' +
                    'WHERE difficulty = ' + difficultyInt + ' ' +
                    'AND category = "' + category + '" ' +
                    'ORDER BY RAND() LIMIT 1';

                return DB.query(sql2).then(function (result) {

                    // console.log(result);
                    var question = result[0];
                    var isNewQuestion = _this.isNewQuestion(question.id);

                    if (isNewQuestion) {

                        // Query database and get the translated question.
                        var sql3 = 'SELECT content FROM question_translation ' +
                            'WHERE question_id = "' + question.short_code + '" ' +
                            'AND language_id = ' + languageId;

                        return DB.query(sql3).then(function (result) {

                            // console.log(result);
                            var translatedQuestion = result[0].content;

                            // Query database and get the translated answers.
                            var sql4 = 'SELECT id, content FROM answer_translation ' +
                                'WHERE question_id = "' + question.short_code + '" ' +
                                'AND language_id = ' + languageId;

                            return DB.query(sql4).then(function (result) {

                                // console.log(result);
                                var translatedAnswers = result;

                                return new Promise((resolve) => {
                                    return resolve([question, translatedQuestion, translatedAnswers]);
                                });
                            });
                        });
                    }
                    else {
                        // For understanding recursion you first have to understand recursion.
                        _this.getQuestionWithAnswers(category, difficulty, language);
                    }
                });
            });
        }
        catch (ex) {
            console.log(ex);
        }
    };

    // old one!
    // Gets the question with the appropriate answers from database and returns it.
    // Receives the category name, the difficulty name and the language name.
    // Returns an array with 3 elements:
    // 0. The question object - (will contain the correct answer).
    // 1. The translated question as a string.
    // 2. The translated answers as a string array.
    // getQuestionWithAnswers(category, difficulty, language) {
    //
    //     try {
    //         // Not sure if hack or just necessary...
    //         var _this = this;
    //
    //         // Query database and return the language id.
    //         var sql1 = 'SELECT id FROM language ' +
    //             'WHERE language = "' + language + '"';
    //
    //         _this.db.executeQuery(sql1, function (error, result) {
    //             if (error) {
    //                 console.log(error);
    //                 throw error;
    //             }
    //             else {
    //                 console.log('LanguageId: ', result);
    //                 var languageId = result[0].id;
    //
    //                 var difficultyInt = _this.getDifficulty(difficulty);
    //
    //                 // Query database and return one random question.
    //                 var sql2 = 'SELECT * FROM question ' +
    //                     'WHERE difficulty = ' + difficultyInt + ' ' +
    //                     'AND category = "' + category + '" ' +
    //                     'ORDER BY RAND() LIMIT 1';
    //
    //                 _this.db.executeQuery(sql2, function (error, result) {
    //                     if (error) {
    //                         console.log(error);
    //                         throw error;
    //                     }
    //                     else {
    //                         console.log(result);
    //                         var question = result[0];
    //
    //                         var isNewQuestion = _this.isNewQuestion(question.id);
    //
    //                         if (isNewQuestion) {
    //
    //                             // Query database and return the translated question.
    //                             var sql3 = 'SELECT content FROM question_translation ' +
    //                                 'WHERE question_id = "' + question.short_code + '" ' +
    //                                 'AND language_id = ' + languageId;
    //
    //                             _this.db.executeQuery(sql3, function (error, result) {
    //                                 if (error) {
    //                                     console.log(error);
    //                                     throw error;
    //                                 }
    //                                 else {
    //                                     console.log(result);
    //                                     var translatedQuestion = result[0].content;
    //
    //                                     // Query database and return the translated answers.
    //                                     var sql4 = 'SELECT content FROM answer_translation ' +
    //                                         'WHERE question_id = "' + question.short_code + '" ' +
    //                                         'AND language_id = ' + languageId;
    //
    //                                     _this.db.executeQuery(sql4, function (error, result) {
    //                                         if (error) {
    //                                             console.log(error);
    //                                             throw error;
    //                                         }
    //                                         else {
    //                                             console.log(result);
    //                                             var translatedAnswers = result;
    //
    //                                             //Not working yet...
    //                                             return [question, translatedQuestion, translatedAnswers];
    //                                         }
    //                                     });
    //                                 }
    //                             });
    //                         }
    //                         else {
    //                             // For understanding recursion you first have to understand recursion.
    //                             _this.getQuestionWithAnswers(category, difficulty, language);
    //                         }
    //                     }
    //                 });
    //             }
    //         });
    //
    //
    //
    //         // while (true) {
    //         //     var question = this.getQuestion(category, difficulty);
    //         //     var isNewQuestion = this.isNewQuestion(question.Id);
    //         //
    //         //     if (isNewQuestion) {
    //         //         var translatedQuestion = this.getQuestionTranslation(question.short_code, languageId);
    //         //         var translatedAnswers = this.getAnswersTranslation(question.short_code, languageId);
    //         //
    //         //         return [question, translatedQuestion, translatedAnswers];
    //         //     }
    //         // }
    //     }
    //     catch (ex) {
    //         console.log(ex);
    //     }
    //     finally {
    //         // this.connection.end();
    //     }
    // };

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

        // Query database and return the language id.
        var sql = 'SELECT id FROM language ' +
            'WHERE language = ?';

        this.connection.query(sql, [language], function (error, result) {
            if (error) {
                throw error;
            }
            else {
                console.log('LanguageId: ', result);
                return result;
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
        var index = this.usedQuestions.indexOf(questionId);

        if (index === -1) {
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
            'WHERE question_id = ? ' +
            'AND language_id = ??';

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
            'WHERE question_id = ? ' +
            'AND language_id = ??';

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
}

module.exports = Question;