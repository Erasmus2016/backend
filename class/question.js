/**
 * Created by Manuel on 01.12.2016.
 */

const shuffle = require('../functions/shuffle');

class Question {

    constructor(db) {
        this.db = db;
        this.usedQuestionIds = [0];
    };

    // Gets the question with the appropriate answers from the database and returns it.
    // Receives the category name, the difficulty value and the language short code.
    // Returns an array with 3 elements:
    // 0. The question object - (will contain the correct answer id).
    // 1. The translated question as a string.
    // 2. The translated answers with the id as a array.
    getQuestionWithAnswers(category, difficulty, language) {

        return this.determineQuestion(category, difficulty).then((question) => {

            return this.getTranslatedQuestion(question.id, language).then((translatedQuestion) => {

                return this.getTranslatedAnswers(question.id, language).then((translatedAnswers) => {

                    return Promise.resolve([question, translatedQuestion, translatedAnswers]);
                });
            });
        }).catch(function (ex) {
            console.log(ex);
            return ex;
        });
    };

    // Determines and returns a random question object based on the selected category and difficulty level.
    determineQuestion(category, difficulty) {

        let joinedUsedQuestionIds = '(' + this.usedQuestionIds.join() + ')';

        // Query database and get one random not already used question.
        const sql = 'SELECT * FROM question ' +
            'WHERE id NOT IN ' + joinedUsedQuestionIds + ' ' +
            'AND category = ? ' +
            'AND difficulty = ? ' +
            'ORDER BY RAND() LIMIT 1';

        return this.db.query(sql, [category, difficulty]).then((result) => {

            if (result.length === 1 && typeof(result[0].id !== undefined)) {
                this.saveQuestionIdToRam(result[0].id);
                return result[0];
            }
            else {
                throw "No appropriate questions left.";
            }
        });
    }

    // Adds a question id to the already used question ids array.
    saveQuestionIdToRam(questionId) {
        this.usedQuestionIds.push(questionId);
    };

    // Returns the translated question for this very question.
    getTranslatedQuestion(questionItemId, language) {
        // Query database and get the translated question.
        const sql = 'SELECT content FROM translation ' +
            'WHERE type = "question" ' +
            'AND parent = ? ' +
            'AND lang = ?';

        return this.db.query(sql, [questionItemId, language]).then((result) => {
            return result[0].content;
        });
    }

    // Returns the translated answers for this very question as an array.
    getTranslatedAnswers(questionItemId, language) {
        // Query database and get the translated answers.
        const sql = 'SELECT content, parent AS id FROM translation ' +
            'INNER JOIN answer ON translation.parent = answer.id ' +
            'WHERE translation.type = "answer" ' +
            'AND answer.question_id = ? ' +
            'AND translation.lang = ?' +

            // Discard empty content values.
            'AND content <> "" ';

        return this.db.query(sql, [questionItemId, language]).then((result) => {
            // Shuffle the answers to avoid repetition.
            return shuffle.shuffleAnswers(result);
        });
    }
}

module.exports = Question;