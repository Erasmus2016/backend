/*
	Manu: Just a little script for changing the charset 
			from 'latin1_swedish_ci' to 'utf8_general_ci'.
*/

USE erasmus;

ALTER DATABASE erasmus CHARACTER SET "utf8";
ALTER DATABASE erasmus COLLATE "utf8_unicode_ci";

ALTER TABLE answer DEFAULT CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";
ALTER TABLE answer_translation DEFAULT CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";
ALTER TABLE categories DEFAULT CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";
ALTER TABLE language DEFAULT CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";
ALTER TABLE question DEFAULT CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";
ALTER TABLE question_translation DEFAULT CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";

SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE answer CONVERT TO CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";
ALTER TABLE answer_translation CONVERT TO CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";
ALTER TABLE categories CONVERT TO CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";
ALTER TABLE language CONVERT TO CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";
ALTER TABLE question CONVERT TO CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";
ALTER TABLE question_translation CONVERT TO CHARACTER SET "utf8" COLLATE "utf8_unicode_ci";

SET FOREIGN_KEY_CHECKS=1;