
const noGoTypes = {
  RANGE: "RANGE",
  MATH: "MATH",
  INCLUDES: "INCLUDES",
};
const category = {
  DROPDOWN_SINGLE_SELECT: "DD_SS",
  DROPDOWN_MULTI_SELECT: "DD_MS",
  CHECKBOX: "CB",
  FREE_TEXT: "FT",
  FREE_TEXT_CURRENCY: "FT_CU",
  FREE_TEXT_PERCENTAGE: "FT_PR",
  FREE_TEXT_NUMBER: "FT_NU",
};
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('configuration.answers').del()
    .then(function () {
      // Inserts seed entries
      return knex('configuration.answers').insert([
        {id: 400, question_id: 300, valid_answer: null, no_go_type: null, no_go_criteria: null},
        {id: 401, question_id: 301, valid_answer: null, no_go_type: null, no_go_criteria: null},
        {id: 402, question_id: 302, valid_answer: null, no_go_type: null, no_go_criteria: null},
        {id: 403, question_id: 303, valid_answer: null, no_go_type: noGoTypes.MATH, no_go_criteria: '>2022'},
        {id: 404, question_id: 304, valid_answer: null, no_go_type: null, no_go_criteria: null},
        {id: 405, question_id: 305, valid_answer: null, no_go_type: null, no_go_criteria: null},
        {id: 406, question_id: 306, valid_answer: null, no_go_type: null, no_go_criteria: null},
        {id: 407, question_id: 307, valid_answer: null, no_go_type: null, no_go_criteria: null},
        {id: 408, question_id: 308, valid_answer: ['YES', 'NO'], no_go_type: noGoTypes.INCLUDES, no_go_criteria: 'YES'},
        {id: 409, question_id: 309, valid_answer: ["Trading","Agriculture","Food"], no_go_type: null, no_go_criteria: null},
        {id: 410, question_id: 310, valid_answer: ['YES', 'NO'], no_go_type: noGoTypes.INCLUDES, no_go_criteria: 'YES'},
        {id: 411, question_id: 311, valid_answer: null, no_go_type: noGoTypes.MATH, no_go_criteria: '<10'},
        {id: 412, question_id: 312, valid_answer: ['YES', 'NO'], no_go_type: noGoTypes.INCLUDES, no_go_criteria: 'YES'},
        {id: 413, question_id: 313, valid_answer: ['YES', 'NO'], no_go_type: noGoTypes.INCLUDES, no_go_criteria: 'YES'},
        {id: 414, question_id: 314, valid_answer: null, no_go_type: noGoTypes.MATH, no_go_criteria: '<-2'},
        

        // Add more seed data as needed
      ]);
    });
};
