// const express = require('express');
// const bodyParser = require('body-parser');
// const knex = require('knex')(require('./knexfile').development);

// const app = express();
// app.use(bodyParser.json());

// // Add a new module type
// app.post('/modules', async (req, res) => {
//     const { name } = req.body;
//     const [id] = await knex('module_types').insert({ name }).returning('id');
//     res.json({ id, name });
// });

// // Add a new question
// app.post('/questions', async (req, res) => {
//     const { moduleTypeId, question } = req.body;
//     const [id] = await knex('questions').insert({ module_type_id: moduleTypeId, question }).returning('id');
//     res.json({ id, moduleTypeId, question });
// });

// // Get all questions
// app.get('/questions', async (req, res) => {
//     const questions = await knex('questions').select('*');
//     res.json(questions);
// });

// // Get question by ID
// app.get('/questions/:id', async (req, res) => {
//     const questionId = req.params.id;
//     const question = await knex('questions').where('id', questionId).first();
//     if (!question) {
//         return res.status(404).json({ error: 'Question not found' });
//     }
//     res.json(question);
// });

// // Get all answers by question ID
// app.get('/questions/:id/answers', async (req, res) => {
//     const questionId = req.params.id;
//     const answers = await knex('answers').where('question_id', questionId);
//     res.json(answers);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });



const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Import route handlers
const moduleRoutes = require('./routes/moduleRoutes');
const questionRoutes = require('./routes/questionRoutes');

// Use route handlers
app.use('/modules', moduleRoutes);
app.use('/questions', questionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


