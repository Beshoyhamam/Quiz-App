// Slecet Elments
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContanier = document.querySelector(".results");
let countdownEl = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.open("GET", "html_Questions.json", true);
    myRequest.send();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;

            // Create Bullets + Set Questions Count
            createBullets(qCount)

            // Add Question Data
            addQuestionData(questionsObject[currentIndex], qCount);

            // CountDown
            countdown(5, qCount);

            // Click On Submit
            submitButton.onclick = () => {
                // Get Right Answer
                let theRightAnswer = questionsObject[currentIndex].right_answer
                // Increase Index
                currentIndex++
                // Check The Answer
                checkAnswer(theRightAnswer, qCount);
                // Remove Previous Question
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";
                // Add Question Data
                addQuestionData(questionsObject[currentIndex], qCount);

                countSpan.innerHTML--

                // Handle Bullets Class
                handleBullets();

                clearInterval(countdownInterval);
                countdown(5, qCount);

                // Show Results
                showResults(qCount);

            }
        }
    }
}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    // Create Spans
    for (let i = 0; i < num; i++) {
        // Create Bullet
        let theBullet = document.createElement("span");

        if (i === 0) {
            theBullet.className = "on";
        }

        bulletsSpanContainer.appendChild(theBullet)
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // Create H2 Question Title
        let questionTitle = document.createElement("h2");
        // Create Question Text
        let questionText = document.createTextNode(obj.title)
        // Append Text To H2
        questionTitle.appendChild(questionText)
        // Append H2 To QuizArea
        quizArea.appendChild(questionTitle)

        // Craete The Answers
        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.classList = "answer";

            let radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = "question"
            radioInput.id = `answer_${i}`
            radioInput.dataset.answer = obj[`answer_${i}`]

            if (i === 1) {
                radioInput.checked = true;
            }

            let labelInput = document.createElement("label");
            labelInput.htmlFor = `answer_${i}`
            let textLabel = document.createTextNode(obj[`answer_${i}`]);
            labelInput.appendChild(textLabel)

            mainDiv.appendChild(radioInput)
            mainDiv.appendChild(labelInput)

            answerArea.appendChild(mainDiv)
        }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span")
    let arrayOfSpan = Array.from(bulletsSpans);
    arrayOfSpan.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove()
        answerArea.remove()
        submitButton.remove()
        bullets.remove()

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="Good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span> All Answers Is Good`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }

        resultsContanier.innerHTML = theResults
        resultsContanier.style.padding = "13px";
        resultsContanier.style.marginTop = "10px";
        resultsContanier.style.fontSize = "20px";
        resultsContanier.style.backgroundColor = "white";
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;

        countdownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownEl.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000)
    }
}