// Quiz Data
// Data Kuis
const quizData = {
    questions: [
        {
            type: 'multiple',
            question: 'Apa ibu kota Indonesia?',
            options: ['Jakarta', 'Surabaya', 'Bandung', 'Medan'],
            correct: 'Jakarta',
            points: 5
        },
        {
            type: 'text',
            question: 'Apa nama lagu kebangsaan Indonesia? (jawab dengan huruf besar diawal)',
            correct: 'Indonesia Raya',
            points: 10
        },
        {
            type: 'multiple',
            question: 'Pulau manakah yang terbesar di Indonesia?',
            options: ['Jawa', 'Sumatra', 'Kalimantan', 'Papua'],
            correct: 'Papua',
            points: 5
        },
        {
            type: 'text',
            question: 'Pada tahun berapa Indonesia mendeklarasikan kemerdekaannya? (tahun)',
            correct: '1945',
            points: 10
        },
        {
            type: 'multiple',
            question: 'Siapa presiden pertama Indonesia?',
            options: ['Soekarno', 'Soeharto', 'Habibie', 'Gus Dur'],
            correct: 'Soekarno',
            points: 5
        },
        {
            type: 'text',
            question: 'Pempek berasal dari? (jawab dengan huruf besar diawal)',
            correct: 'Palembang',
            points: 10
        },
        {
            type: 'multiple',
            question: 'Di kota manakah terdapat Jembatan Ampera?',
            options: ['Palembang', 'Jakarta', 'Surabaya', 'Bandung'],
            correct: 'Palembang',
            points: 5
        },
        {
            type: 'text',
            question: 'Ibu kota Jawa Timur adalah? (jawab dengan huruf besar diawal)',
            correct: 'Surabaya',
            points: 10
        },
        {
            type: 'multiple',
            question: 'Apa nama pulau tempat terletaknya ibu kota Indonesia?',
            options: ['Sumatra', 'Jawa', 'Kalimantan', 'Sulawesi'],
            correct: 'Jawa',
            points: 5
        },
        {
            type: 'text',
            question: 'Berapa lama indonesia dijajah oleh Belanda? (tahun)',
            correct: '350',
            points: 10
        }
    ]
};


// State Management
let currentState = {
    currentQuestion: 0,
    answers: {},
    timer: null,
    timeLeft: 30,
    playerName: '',
    playerNIM: ''
};

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}   

// Quiz Initialization
function startQuiz() {
    currentState.playerName = document.getElementById('playerName').value;
    currentState.playerNIM = document.getElementById('playerNIM').value;

    if (!currentState.playerName || !currentState.playerNIM) {
        alert('Please fill in all fields');
        return;
    }

    showScreen('quizScreen');
    initializeQuiz();
}

function initializeQuiz() {
    currentState.currentQuestion = 0;
    currentState.answers = {};
    updateQuestionNav();
    displayQuestion();
    updateProgressInfo();
    startTimer();
}

// Question Display and Navigation
function displayQuestion() {
    const question = quizData.questions[currentState.currentQuestion];
    const container = document.getElementById('questionContainer');
    
    let html = `<h3>Question ${currentState.currentQuestion + 1}</h3>
                <p>${question.question}</p>`;

    if (question.type === 'multiple') {
        html += '<div class="options">';
        question.options.forEach(option => {
            const checked = currentState.answers[currentState.currentQuestion] === option ? 'checked' : '';
            html += `
                <label>
                    <input type="radio" name="answer" value="${option}" ${checked}>
                    ${option}
                </label>`;
        });
        html += '</div>';
    } else {
        html += `<input type="text" id="textAnswer" value="${currentState.answers[currentState.currentQuestion] || ''}">`;
    }

    container.innerHTML = html;

    updateProgressInfo();

    if (question.type === 'multiple') {
        document.querySelectorAll('input[name="answer"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                currentState.answers[currentState.currentQuestion] = e.target.value;
                updateProgressInfo();
            });
        });
    } else {
        document.getElementById('textAnswer').addEventListener('input', (e) => {
            currentState.answers[currentState.currentQuestion] = e.target.value;
            updateProgressInfo();
        });
    }

    resetTimer();
    startTimer();
}

// Navigation Controls
function updateQuestionNav() {
    const nav = document.getElementById('questionNav');
    nav.innerHTML = '';
    
    quizData.questions.forEach((_, index) => {
        const button = document.createElement('div');
        button.className = `nav-btn ${currentState.answers[index] ? 'answered' : ''} ${index === currentState.currentQuestion ? 'current' : ''}`;
        button.textContent = index + 1;
        button.onclick = () => navigateToQuestion(index);
        nav.appendChild(button);
    });
}

function navigateToQuestion(index) {
    currentState.currentQuestion = index;
    displayQuestion();
    updateQuestionNav();
}

function nextQuestion() {
    if (currentState.currentQuestion < quizData.questions.length - 1) {
        currentState.currentQuestion++;
        displayQuestion();
        updateQuestionNav();
        resetTimer();
    }
}

function previousQuestion() {
    if (currentState.currentQuestion > 0) {
        currentState.currentQuestion--;
        displayQuestion();
        updateQuestionNav();
        resetTimer();
    }
}

// Progress Tracking
function updateProgressInfo() {
    const completed = Object.keys(currentState.answers).length;
    document.getElementById('completedQuestions').textContent = completed;
    document.getElementById('totalQuestions').textContent = quizData.questions.length;
}

// Score Calculation
function calculateScore() {
    let totalScore = 0;
    const breakdown = [];

    quizData.questions.forEach((question, index) => {
        const userAnswer = currentState.answers[index];
        const points = userAnswer === question.correct ? question.points : 0;
        totalScore += points;
        breakdown.push({
            question: index + 1,
            points: points,
            maxPoints: question.points
        });
    });

    return { totalScore, breakdown };
}

// Quiz Completion
function submitQuiz() {
    clearInterval(currentState.timer);
    const { totalScore, breakdown } = calculateScore();

    document.getElementById('playerInfo').innerHTML = `
        <p>Name: ${currentState.playerName}</p>
        <p>NIM: ${currentState.playerNIM}</p>
    `;

    document.getElementById('scoreBreakdown').innerHTML = '<h3>Score Breakdown:</h3>' + 
        breakdown.map(item => `
            <p>Question ${item.question}: ${item.points}/${item.maxPoints} points</p>
        `).join('');

    document.getElementById('totalScore').innerHTML = `<h3>Total Score: ${totalScore} points</h3>`;

    showScreen('resultsScreen');
}

// Quiz Reset
function restartQuiz() {
    currentState = {
        currentQuestion: 0,
        answers: {},
        timer: null,
        timeLeft: 30,
        playerName: '',
        playerNIM: ''
    };
    showScreen('homeScreen');
}

// Initialize total questions count on load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('totalQuestions').textContent = quizData.questions.length;
});

// Timer Management
function startTimer() {
    clearInterval(currentState.timer);
    currentState.timer = setInterval(() => {
        currentState.timeLeft--;
        document.getElementById('timer').textContent = currentState.timeLeft;

        if (currentState.timeLeft <= 0) {
            clearInterval(currentState.timer);
            nextQuestion();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(currentState.timer);
    currentState.timeLeft = 30;
    document.getElementById('timer').textContent = currentState.timeLeft;
}
