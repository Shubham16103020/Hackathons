'use strict';

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
  return knex('configuration.questions').del()
    .then(function () {
      // Inserts seed entries
      return knex('configuration.questions').insert([
        { id: 300, template_id: 200, question_text:  'Company Name', sequence: 1, is_mandatory: true, category: category.FREE_TEXT, placeholder: null},
        { id: 301, template_id: 200, question_text:  'Company Address', sequence: 2, is_mandatory: true, category: category.FREE_TEXT, placeholder: null},
        { id: 302, template_id: 200, question_text:  'Contact', sequence: 3, is_mandatory: true, category: category.FREE_TEXT, placeholder: null},
        { id: 303, template_id: 200, question_text:  'Year Of Incorporation', sequence: 4, is_mandatory: true, category: category.FREE_TEXT, placeholder: null},
        { id: 304, template_id: 200, question_text:  'Authorised Signatory Name', sequence: 1, is_mandatory: true, category: category.FREE_TEXT, placeholder: null},
        { id: 305, template_id: 200, question_text:  'Authorised Signatory email Id', sequence: 2, is_mandatory: true, category: category.FREE_TEXT, placeholder: null},
        { id: 306, template_id: 200, question_text:  'Authorised Signatory Nationality', sequence: 3, is_mandatory: true, category: category.FREE_TEXT, placeholder: null},
        { id: 307, template_id: 200, question_text:  'Authorised Signatory Passport No.', sequence: 4, is_mandatory: true, category: category.FREE_TEXT, placeholder: null},
        { id: 308, template_id: 200, question_text:  'Are you an existing customer of the DP World Group?', sequence: 1, is_mandatory: true, category: category.DROPDOWN_SINGLE_SELECT, placeholder: ['YES', 'NO']},
        { id: 309, template_id: 200, question_text:  'Which economic sector does the company primarily deal in?', sequence: 2, is_mandatory: false, category: category.DROPDOWN_MULTI_SELECT, placeholder: ['Trading', 'Agriculture', 'Food']},
        { id: 310, template_id: 200, question_text:  'Is the company exposed to a politically exposed person?', sequence: 3, is_mandatory: true, category: category.DROPDOWN_SINGLE_SELECT, placeholder: ['YES', 'NO']},
        { id: 311, template_id: 200, question_text:  'Annual revenue as per last audited financials (million USD)', sequence: 4, is_mandatory: true, category: category.FREE_TEXT_NUMBER, placeholder: null},
        { id: 312, template_id: 200, question_text:  'Any check returns in last 12 months', sequence: 5, is_mandatory: true, category: category.DROPDOWN_SINGLE_SELECT, placeholder: ['YES', 'NO']},
        { id: 313, template_id: 200, question_text:  'Has company or owners gone through bankruptcy in past', sequence: 6, is_mandatory: true, category: category.DROPDOWN_SINGLE_SELECT, placeholder: ['YES', 'NO']},
        { id: 314, template_id: 200, question_text:  'Net profit margin as per last audited financials', sequence: 7, is_mandatory: true, category: category.FREE_TEXT_PERCENTAGE, placeholder: null},
        // Add more seed data as needed
      ]);
    });
};


/*


question,option,example_input
"What is your name?", "Aatreya", "Red"
"What is your favorite color?", "Red", "Rd"
"What is your favorite color?", "Red", "R"
"What is your favorite color?", "Blue", "Blu"
"What is your favorite color?", "Blue", "Bl"
"What is your favorite color?", "Green", "Gr"



*/