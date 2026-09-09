const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// =====================================================
// REGISTERED STUDENTS
// =====================================================

let registeredStudentsList = [
    {
        id: 'BSA-2026-001',
        firstName: 'Abebe',
        fatherName: 'Kebede',
        grandfatherName: 'Alemu',
        fullName: 'Abebe Kebede Alemu',
        email: 'abebe.k@gmail.com',
        phone: '+251 911 223344',
        guardianName: 'Kebede Alemu',
        guardianPhone: '+251 911 000000',
        address: 'Addis Ababa, Bole Sub-City',
        password: 'password123',
        registeredAt: '2026-09-05'
    }
];

// =====================================================
// CONTACT MESSAGES
// =====================================================

let messagesList = [
    {
        id: 1,
        sender: 'Sample Parent',
        email: 'parent@example.com',
        subject: 'Inquiry about Grade 9 Admissions',
        body: 'Hello, I would like to know when the entrance exams for Grade 9 will be held.',
        date: '2026-09-04'
    }
];

// =====================================================
// NEWS & EVENTS
// =====================================================

let newsList = [
    {
        id: 1,
        title: 'Welcome to BeteSeb Academy',
        day: '05',
        month: 'SEP',
        desc: 'Welcome to our new academic year.'
    }
];

// =====================================================
// DEFAULT ROUTE
// =====================================================

app.get('/', (req, res) => {
    res.send('Beteseb Academy API Server is running.');
});

// =====================================================
// STUDENT REGISTRATION
// =====================================================

// GET all registered students
app.get('/api/register-student', (req, res) => {
    res.json(registeredStudentsList);
});

// POST new student
app.post('/api/register-student', (req, res) => {

    const {
        firstName,
        fatherName,
        grandfatherName,
        studentId,
        email,
        phone,
        guardianName,
        guardianPhone,
        address,
        password
    } = req.body;

    // Required fields
    if (!firstName || !fatherName || !studentId || !email || !password) {
        return res.status(400).json({
            error: 'Please fill in required fields.'
        });
    }

    // Check duplicate student ID
    const existingStudent = registeredStudentsList.find(
        student => student.id === studentId
    );

    if (existingStudent) {
        return res.status(409).json({
            error: 'Student ID already exists.'
        });
    }

    // Combine full name
    const fullName =
        `${firstName} ${fatherName} ${grandfatherName || ''}`.trim();

    // Create student
    const newStudent = {
        id: studentId,
        firstName,
        fatherName,
        grandfatherName: grandfatherName || '',
        fullName,
        email,
        phone: phone || '',
        guardianName: guardianName || '',
        guardianPhone: guardianPhone || '',
        address: address || '',
        password,
        registeredAt: new Date().toISOString().split('T')[0]
    };

    // Add to beginning
    registeredStudentsList.unshift(newStudent);

    res.status(201).json({
        message: 'Student registered successfully',
        data: newStudent
    });
});

// =====================================================
// NEWS & EVENTS
// =====================================================

// GET all news
app.get('/api/news', (req, res) => {
    res.json(newsList);
});

// ADD news
app.post('/api/news', (req, res) => {

    const {
        title,
        day,
        month,
        desc
    } = req.body;

    if (!title || !day || !month || !desc) {
        return res.status(400).json({
            error: 'Title, day, month and description are required.'
        });
    }

    const newNews = {
        id: Date.now(),
        title,
        day,
        month,
        desc
    };

    newsList.unshift(newNews);

    res.status(201).json({
        message: 'News added successfully',
        data: newNews
    });
});

// DELETE news
app.delete('/api/news/:id', (req, res) => {

    const id = Number(req.params.id);

    const oldLength = newsList.length;

    newsList = newsList.filter(
        news => news.id !== id
    );

    if (newsList.length === oldLength) {
        return res.status(404).json({
            error: 'News not found.'
        });
    }

    res.json({
        message: 'News deleted successfully'
    });
});

// =====================================================
// CONTACT MESSAGES
// =====================================================

// GET all messages
app.get('/api/messages', (req, res) => {
    res.json(messagesList);
});

// POST new message
app.post('/api/messages', (req, res) => {

    const {
        sender,
        email,
        subject,
        body
    } = req.body;

    if (!sender || !email || !body) {
        return res.status(400).json({
            error: 'Sender, email, and message body are required.'
        });
    }

    const newMessage = {
        id: Date.now(),
        sender,
        email,
        subject: subject || 'No Subject',
        body,
        date: new Date().toISOString().split('T')[0]
    };

    messagesList.unshift(newMessage);

    res.status(201).json({
        message: 'Message sent successfully to admin dashboard',
        data: newMessage
    });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
    console.log(`Beteseb Academy API Server running on port ${PORT}`);
});
