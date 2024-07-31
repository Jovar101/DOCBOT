// script.js
let currentQuestionIndex = 0;
let answers = {};

document.addEventListener("DOMContentLoaded", () => {
    loadQuestion();

    document.getElementById("next-button").addEventListener("click", () => {
        saveAnswer();
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            submitAnswers();
        }
    });
});
async function fetchQuestions() {
    let response = await fetch('/get_questions');
    questions = await response.json();
}

async function loadQuestion() {
    if (questions.length > 0) {
        const question = questions[currentQuestionIndex];
        const chatContainer = document.getElementById("chat-container");

        // Clear previous options
        chatContainer.innerHTML = '';

        // Show question
        const questionDiv = document.createElement('div');
        questionDiv.className = 'message bot';
        questionDiv.innerText = question.question;
        chatContainer.appendChild(questionDiv);

        // Show options
        question.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'message user';
            optionDiv.innerText = option;

            // Event listener for recording the selection
            optionDiv.addEventListener('click', () => {
                selectOption(option, optionDiv);
            });

            chatContainer.appendChild(optionDiv);
        });
    }
}

function selectOption(option, optionElement) {
    const question = questions[currentQuestionIndex];
    answers[question.id] = option;
    
    highlightSelectedOption(optionElement);
}
function highlightSelectedOption(optionElement) {
    const chatContainer = document.getElementById("chat-container");
    const optionElements = chatContainer.getElementsByClassName('message user');

    // Remove 'selected' class from all options
    Array.from(optionElements).forEach(element => {
        element.classList.remove('selected');
    });

    // Add 'selected' class to the clicked option
    selectedElement.classList.add('selected');
}

function saveAnswer() {
    const question = questions[currentQuestionIndex];
    const selectedOption = answers[question.id];
    const chatContainer = document.getElementById("chat-container");

    if (selectedOption) {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'message user';
        answerDiv.innerText = selectedOption;
        chatContainer.appendChild(answerDiv);
    }
}


async function submitAnswers() {
    const response = await fetch('/submit_answers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
    });
    const result = await response.json();
    displayResults(result.answers);
}

// Function to display all answers
function displayResults(answers) {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.innerHTML = ''; // Clear the chat container

    answers.forEach((answerSet, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'message bot';
        answerDiv.innerText = `Question ${index + 1}: ${questions[index].question}\nAnswer: ${answerSet[questions[index].id]}`;
        chatContainer.appendChild(answerDiv);
    });
}

// Fetch questions from the backend
let questions = [];
fetch('/get_questions')
    .then(response => response.json())
    .then(data => {
        questions = data;
        loadQuestion();
    });
