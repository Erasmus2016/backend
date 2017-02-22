/**
 * Created by Manuel on 01.12.2016.
 */

const shuffle = require('../functions/shuffle');

class Question {

    constructor(db) {
        this.db = db;
        this.usedQuestionIds = [0];
    };

    // Gets the question with the appropriate answers from database and returns it.
    // Receives the category name, the difficulty name and the language name.
    // Returns an array with 3 elements:
    // 0. The question object - (will contain the correct answer).
    // 1. The translated question as a string.
    // 2. The translated answers as a string array.
    getQuestionWithAnswers(category, difficulty, language) {

        return this.determineQuestion(category, difficulty).then((questionItem) => {

            return this.getTranslatedQuestion(questionItem.id, language).then((translatedQuestion) => {

                return this.getTranslatedAnswers(questionItem.id, language).then((translatedAnswers) => {

                    return Promise.resolve([questionItem, translatedQuestion, translatedAnswers]);
                });
            });
        }).catch(function (ex) {
            console.log(ex);
            return ex;
        });
    };

    // Checks and returns true, if the question wasn't already used within this game - otherwise false.
    isNewQuestion(questionId) {
        const index = this.usedQuestionIds.indexOf(questionId);

        if (index === -1) {
            this.saveQuestionIdToRam(questionId);
            return true;
        }
        else {
            return false;
        }
    };

    // Adds a question id to the already used question ids array.
    saveQuestionIdToRam(questionId) {
        this.usedQuestionIds.push(questionId);
    };

    // Sets the language id (required for both question and answers).
    // Obsolete - no longer in use.
    setLanguageId(language) {
        // Query database and get the language id.
        // TODO: Make sure, the database languages entries are not going to change -> use a switch-case instead of an database query -> getLanguageId function.
        const sql = 'SELECT id FROM language ' +
            'WHERE language = ?';

        return this.db.query(sql, [language]).then((result) => {
            return result[0].id;
        });
    }

    // Determines and sets a random question object based on the selected category and difficulty level.
    determineQuestion(category, difficulty) {
        const difficultyInt = difficulty;

        let joinedUsedQuestionIds = '(' + this.usedQuestionIds.join() + ')';

        // Query database and get one random not already used question.
        const sql = 'SELECT * FROM question ' +
            'WHERE id NOT IN ' + joinedUsedQuestionIds + ' ' +
            'AND difficulty = ? ' +
            'AND category = ? ' +
            'ORDER BY RAND() LIMIT 1';

        return this.db.query(sql, [difficultyInt, category]).then((result) => {

            if (result.length === 1 && typeof(result[0].id !== undefined)) {
                this.saveQuestionIdToRam(result[0].id);
                return result[0];
            }
            else {
                throw "No appropriate questions left.";
            }
        });
    }

    // Returns the translated question for this question.
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

    // Returns the translated answers for this question as an array.
    getTranslatedAnswers(questionItemId, language) {
        // Query database and get the translated answers.
        const sql = 'SELECT content, parent as id FROM translation ' +
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

    // Returns the language id as an integer.
    static getLanguageId(language) {
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
}

module.exports = Question;