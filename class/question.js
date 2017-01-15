/**
 * Created by Manuel on 01.12.2016.
 */

class Question {

    constructor(db) {
        this.db = db;
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
            // Query database and get the language id.
            // TODO: make sure, the database languages entries are not going to change -> use a switch-case instead of an database query -> getLanguageId function.
            const sql1 = 'SELECT id FROM language ' +
                'WHERE language = "' + language + '"';

            return this.db.query(sql1).then((result) => {

                const languageId = result[0].id;
                const difficultyInt = Question.getDifficulty(difficulty);

                // Query database and get one random question.
                const sql2 = 'SELECT * FROM question ' +
                    'WHERE difficulty = ' + difficultyInt + ' ' +
                    'AND category = "' + category + '" ' +
                    'ORDER BY RAND() LIMIT 1';

                return this.db.query(sql2).then((result) => {

                    const question = result[0];
                    const isNewQuestion = this.isNewQuestion(question.id);

                    if (isNewQuestion) {

                        // Query database and get the translated question.
                        const sql3 = 'SELECT content FROM question_translation ' +
                            'WHERE question_id = "' + question.short_code + '" ' +
                            'AND language_id = ' + languageId;

                        return this.db.query(sql3).then((result) => {

                            const translatedQuestion = result[0].content;

                            // Query database and get the translated answers.
                            const sql4 = 'SELECT id, content FROM answer_translation ' +
                                'WHERE question_id = "' + question.short_code + '" ' +
                                'AND language_id = ' + languageId;

                            return this.db.query(sql4).then((result) => {

                                // console.log(result);
                                const translatedAnswers = result;

                                return new Promise((resolve) => {
                                    return resolve([question, translatedQuestion, translatedAnswers]);
                                });
                            });
                        });
                    }
                    else {
                        // For understanding recursion you first have to understand recursion.
                        this.getQuestionWithAnswers(category, difficulty, language);
                    }
                });
            });
        }
        catch (ex) {
            console.log(ex);
        }
    };


    // Returns the question difficulty as an integer.
    static getDifficulty(difficulty) {
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

    // Returns the language id for both question and answer.
    getLanguage(language) {

        // Query database and return the language id.
        const sql = 'SELECT id FROM language ' +
            'WHERE language = ?';

        this.connection.query(sql, [language], (error, result) => {
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

        const difficultyInt = this.getDifficulty(difficulty);

        // Query database and return one random question.
        const sql = 'SELECT * FROM question ' +
            'WHERE difficulty = ? ' +
            'AND category = ? ' +
            'ORDER BY RAND() LIMIT 1';

        this.connection.query(sql, difficultyInt, category, (error, result) => {
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
        const index = this.usedQuestions.indexOf(questionId);

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
        const sql = 'SELECT content FROM question_translation ' +
            'WHERE question_id = ? ' +
            'AND language_id = ??';

        this.connection.query(sql, question_short_code, languageId, (error, result) => {
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
        const sql = 'SELECT content FROM answer_translation ' +
            'WHERE question_id = ? ' +
            'AND language_id = ??';

        this.connection.query(sql, question_short_code, languageId, (error, result) => {
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