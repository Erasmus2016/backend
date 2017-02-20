/**
 * Created by Manuel on 01.12.2016.
 */

const shuffle = require('../functions/shuffle');

class Question {

    constructor(db) {
        this.db = db;
        this.usedQuestionIds = [];
    };

    // Gets the question with the appropriate answers from database and returns it.
    // Receives the category name, the difficulty name and the language name.
    // Returns an array with 3 elements:
    // 0. The question object - (will contain the correct answer).
    // 1. The translated question as a string.
    // 2. The translated answers as a string array.
    getQuestionWithAnswers(category, difficulty, language) {
        try {
            return this.setLanguageId(language).then((languageId) => {

                return this.determineQuestion(category, difficulty).then((questionItem) => {

                    if (this.isNewQuestion(questionItem.id)) {

                        return this.getTranslatedQuestion(questionItem, languageId).then((translatedQuestion) => {

                            return this.getTranslatedAnswers(questionItem, languageId).then((translatedAnswers) => {

                                return Promise.resolve([questionItem, translatedQuestion, translatedAnswers]);
                            });
                        });
                    }
                    else {
                        // For understanding recursion you first have to understand recursion.
                        return Promise.resolve(this.getQuestionWithAnswers(category, difficulty, language));
                    }
                });
            });
        }
        catch (ex) {
            console.log(ex);
            throw ex;
        }
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
        const difficultyInt = Question.getDifficultyId(difficulty);

        // Query database and get one random question.
        const sql = 'SELECT * FROM question ' +
            'WHERE difficulty = ? ' +
            'AND category = ? ' +
            'ORDER BY RAND() LIMIT 1';

        return this.db.query(sql, [difficultyInt, category]).then((result) => {
            return result[0];
        });
    }

    // Returns the translated question for this question.
    getTranslatedQuestion(questionItem, languageId) {
        // Query database and get the translated question.
        const sql = 'SELECT content FROM question_translation ' +
            'WHERE question_id = ? ' +
            'AND language_id = ?';

        return this.db.query(sql, [questionItem.short_code, languageId]).then((result) => {
            return result[0].content;
        });
    }

    // Returns the translated answers for this question as an array.
    getTranslatedAnswers(questionItem, languageId) {
        // Query database and get the translated answers.
        const sql = 'SELECT id, content FROM answer_translation ' +
            'WHERE question_id = ? ' +
            'AND language_id = ?';

        return this.db.query(sql, [questionItem.short_code, languageId]).then((result) => {
            // Shuffle the answers to avoid repetition.
            return shuffle.shuffleAnswers(result);
        });
    }

    // Returns the question difficulty as an integer.
    static getDifficultyId(difficulty) {
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