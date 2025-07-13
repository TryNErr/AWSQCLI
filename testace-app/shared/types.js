"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CritiqueStatus = exports.WritingType = exports.TestMode = exports.DifficultyLevel = exports.QuestionType = void 0;
var QuestionType;
(function (QuestionType) {
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["TRUE_FALSE"] = "true_false";
    QuestionType["FILL_BLANK"] = "fill_blank";
    QuestionType["ESSAY"] = "essay";
    QuestionType["MATH"] = "math";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
var DifficultyLevel;
(function (DifficultyLevel) {
    DifficultyLevel["EASY"] = "easy";
    DifficultyLevel["MEDIUM"] = "medium";
    DifficultyLevel["HARD"] = "hard";
})(DifficultyLevel || (exports.DifficultyLevel = DifficultyLevel = {}));
var TestMode;
(function (TestMode) {
    TestMode["PRACTICE"] = "practice";
    TestMode["TIMED"] = "timed";
    TestMode["DAILY_CHALLENGE"] = "daily_challenge";
})(TestMode || (exports.TestMode = TestMode = {}));
var WritingType;
(function (WritingType) {
    WritingType["ESSAY"] = "essay";
    WritingType["PARAGRAPH"] = "paragraph";
    WritingType["CREATIVE"] = "creative";
    WritingType["ARGUMENTATIVE"] = "argumentative";
})(WritingType || (exports.WritingType = WritingType = {}));
var CritiqueStatus;
(function (CritiqueStatus) {
    CritiqueStatus["PENDING"] = "pending";
    CritiqueStatus["PROCESSING"] = "processing";
    CritiqueStatus["COMPLETED"] = "completed";
    CritiqueStatus["FAILED"] = "failed";
})(CritiqueStatus || (exports.CritiqueStatus = CritiqueStatus = {}));
//# sourceMappingURL=types.js.map