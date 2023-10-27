class Game {
  constructor() {
    this.player = null;
    this.questionList = null;
    this.currentQuestion = 0;
    this.playersAnswerList = [];  // [[0],[1]..] array.length = size.

    this.title = document.getElementById('title');
    this.root = document.getElementById('root');
  }

  // ----- FIRST SCREEN WITH TEXT ------- //
  start(event) {
    const introductionText = document.createElement('div');
    introductionText.id = 'introductionText';
    const intro1= document.createElement('p');
    intro1.innerHTML = "Раз в год именинник может прийти сюда и пройти ИСПЫТАНИЕ.";
    const intro2= document.createElement('p');
    intro2.innerHTML = "Если у тебя сегодня день рождения и ты верно ответишь на все 10 вопросов, ты найдёшь путь к СОКРОВИЩУ, а также получишь заслуженый титул ГЕРОЙ ДНЯ и сможешь действительно гордиться собой.";
    introductionText.appendChild(intro1);
    introductionText.appendChild(intro2);
    this.root.appendChild(introductionText);

    const btnPlay = document.createElement('button');
    btnPlay.id = 'btnPlay';
    btnPlay.innerHTML = 'СЫГРАТЬ';
    btnPlay.addEventListener('click', (event) => {
      this.play();
    });
    this.root.appendChild(btnPlay);

    //======================TODO: delete = this area for testing only!
    // const btnTEST = document.createElement('button');
    // btnTEST.id = 'btnTEST';
    // btnTEST.innerHTML = 'TO THE END';
    // btnTEST.addEventListener('click', (event) => {
    //   this.showResults();
    // });
    // this.root.appendChild(btnTEST);
    //======================TODO: delete area finished here!
  }

  play() { //if game starts add form (username, age)
    // ----- GREETINGS AND INPUT FOR AGE AND NAME ------- //
    this.root.innerHTML = ''; //

    let labelNamesRoot = document.createElement('p'); // for username
    labelNamesRoot.innerText = ("Введи своё имя");
    this.root.appendChild(labelNamesRoot);

    let namesRoot = document.createElement('input');
    namesRoot.type = 'text';
    this.root.appendChild(namesRoot);
    namesRoot.id = 'name';

    let labelDateRoot = document.createElement('p'); // for username
    labelDateRoot.innerText = ("Введи день и год своего рождения");
    this.root.appendChild(labelDateRoot);

    let dateRoot = document.createElement('input');
    dateRoot.type = 'date';
    this.root.appendChild(dateRoot);
    dateRoot.id = 'date';

    let greetingsRoot = document.createElement('p');
    greetingsRoot.innerText = ("");
    greetingsRoot.id = 'greetings';
    this.root.appendChild(greetingsRoot);


    let btnAskQ = document.createElement('button');
    btnAskQ.innerHTML = 'ПОЕХАЛИ!';
    btnAskQ.id = 'btnAskQ';

    this.root.appendChild(btnAskQ);
    btnAskQ.addEventListener('click', (event) => {
      this.askName();
    })
  }

  // ----- ASK NAME ------- //
  askName() {
    let nameInput = document.getElementById('name');
    let dateInput = document.getElementById('date');
    let greetingsRoot = document.getElementById('greetings');
    const btnPlay = document.getElementById("btnAskQ");
    // ----  CHECK THE DATE OF BIRTH  ---- //

    const today = new Date().toISOString().split('T')[0];
    const isToday =  dateInput.value.substring(5) === today.substring(5);
    const age = (+today.substring(0,4)) - (+dateInput.value.substring(0,4));
    this.player = new Player(nameInput.value, age);

    if (nameInput.value && dateInput.value && isToday) {
      greetingsRoot.className = "goodLuckMessage";
      if (age < 9) {
        greetingsRoot.innerHTML = "Ты уверен, что тебе сегодня исполняется " + age + "? Кажется ты перепутал год, попробуй ввести имя и дату заново";
        btnPlay.remove();
        this.addButtonToHome(); // add button to home screen
      } else {
        greetingsRoot.innerHTML = "Удачи " + nameInput.value + "! И не жульничай!";
        btnPlay.addEventListener('click', (event) => {
          this.goToThePlay();
        })
      }
    } else {
      greetingsRoot.innerHTML = "Извини! Этот квест только для именинников. У тебя действительно день рождения сегодня?";
      btnPlay.remove();
      this.addButtonToHome(); // add button to home screen
    }
  }

  // ======= GO TO THE PLAY ======= //
  goToThePlay() {
    let size = 10;//
    this.questionList = new QuestionList(size);
    let  btnPlay = document.getElementById("btnAskQ");
    btnPlay.remove();
    this.questionList.load().then((result) => {
      this.askCurrentQuestion();
    })
  }

  // ======= QUESTIONS ZONE ======= //
  askCurrentQuestion() {     // - for every question QuestionList  item[i]:
    this.root.innerHTML = '';  // clear with GO

    // ----- QUESTION'S COUNTER ------- //
    let questionCounter = document.createElement('div'); // for number of current question
    questionCounter.id = 'questionCounter';
    questionCounter.innerHTML = ((this.currentQuestion + 1) + " / " + this.questionList.size);  // number current question
    this.root.appendChild(questionCounter);

    // ----- QUESTION'S TEXT ------- //
    let questText = document.createElement('div');
    questText.id = 'questText';
    questText.innerHTML = this.escapeHTML(this.questionList.items[this.currentQuestion].question);  // use method escapeHTML (function to correct difference between HTML tags in questions' texts
    this.root.appendChild(questText);

    // ----- INPUT FOR ANSWER ------- //
    let answerWrap = document.createElement('div');
    answerWrap.id = 'answerWrap';
    this.root.appendChild(answerWrap);
    let labelAnswerTextField = document.createElement('label');
    answerWrap.appendChild(labelAnswerTextField);

    let answerTextField = document.createElement('input');
    labelAnswerTextField.setAttribute('for', 'answer'); //
    answerTextField.type = 'number';
    answerTextField.id = 'answer';
    answerTextField.name = ('answer_' + this.currentQuestion); //TODO: delete or use
    answerWrap.appendChild(answerTextField);


    // ----- CHECK THE ANSWER ------- //
    let btnCheck = document.createElement('button');
    btnCheck.innerHTML = 'ПРОВЕРИТЬ';
    btnCheck.id = 'btnCheck';
    this.root.appendChild(btnCheck);

    btnCheck.addEventListener('click', (event) => {
      let currentAnswer = document.getElementById('answer').value;
      // this.savePlayersAnswer(); // to safe answer to answers array
      const isCorrect = (+currentAnswer === this.questionList.items[this.currentQuestion].correct_answer);


      if (isCorrect) {
        if (this.currentQuestion < this.questionList.size - 1) {
          this.currentQuestion++;
          this.askCurrentQuestion();
        } else {
          this.showResults(); //  if it's the last question go to showResult
        }
      } else {
        this.getWrongAnswerMessage();
      }
    })
  }

  // ----- SAVE THE ANSWERS ------- // TODO: use in the future or delete
  savePlayersAnswer(currentAnswer) {      // push checked answers in playersAnswer[] and in this.playersAnswerList[]
    this.playersAnswerList.push([this.currentQuestion , +currentAnswer.value]); //push userAnswer in array playersAnswer
  }

  // ----- SHOW RESULTS, FINISH GAME? ------- //
  showResults() {   //get and show result, restart game
    this.root.innerHTML = '';  // remove question's block med btn
    this.title.innerHTML = '';
    let bodyElement = document.body; //
    bodyElement.className = 'resultBackground'; // add second background for body

    let resultField = document.createElement('div'); // create field for result
    resultField.id = 'resultField';
    this.root.appendChild(resultField);
    this.showFinishMessage(); //show the finish message
  }

  // ====== SHOW THE FINISH MESSAGE ======//
  showFinishMessage() {
    let resultField = document.getElementById('resultField');
    resultField.innerHTML = '';


    let resultField1 = document.createElement('p'); //field for result
    resultField1.id = 'resultField1';
    resultField1.innerHTML = `Поздравлем тебя с`; //
    resultField.appendChild(resultField1);

    let numberAge = document.createElement("p");
    numberAge.id = 'numberAge';
    numberAge.innerHTML = `${this.player.age}-м`;
    resultField.appendChild(numberAge);

    let resultField2 = document.createElement("p");
    resultField2.id = "resultField2";
    resultField2.innerHTML = `днём рождения, ${this.player?.name || 'kid'}!`;
    resultField.appendChild(resultField2);

    let resultField3 = document.createElement("div");
    resultField3.id = "resultField3";
    resultField3.innerHTML = `Надежда будет жить, пока в Хайруле <br/>Есть те, чьи помыслы всегда чисты.<br/>Герой придет, подобно летней буре, <br/>Теперь мы знаем, что герой наш - ты!`;
    resultField.appendChild(resultField3);


    let messageAboutPresent = document.createElement("p");
    messageAboutPresent.id = 'messageAboutPresent';
    messageAboutPresent.innerHTML = "Теперь ты можешь отправиться на поиски сокровища! <br/> Оно у тебя под подушкой!";
    resultField.appendChild(messageAboutPresent);


    let btnFinish = document.createElement('button'); //add button to last screen
    btnFinish.id = 'btnFinish';
    btnFinish.innerHTML = 'НО СНАЧАЛА...';
    resultField.appendChild(btnFinish);

    btnFinish.addEventListener('click', (event) => {
      showLastImage();
      // this.addButtonToHome(); //TODO: fix it
    })

    let showLastImage = () => {
      this.root.innerHTML = '';  // remove question's block med btn
      this.title.innerHTML = '';
      let bodyElement = document.body; //
      bodyElement.className = 'lastBackground'; // add background for body
    }
  }

  //----- SHOW MESSAGE IF ANSWER IS WRONG -----//
  getWrongAnswerMessage() {
    let wrongAnswerMessage = document.createElement('div');
    wrongAnswerMessage.id = 'wrongAnswerMessage';
    this.root.appendChild(wrongAnswerMessage);

    let wrongAnswerMessage1 = document.createElement('p');
    wrongAnswerMessage1.className = 'wrongAnswerMessage';
    wrongAnswerMessage1.innerHTML = `Ответ неверный! 🤖`;
    wrongAnswerMessage.appendChild(wrongAnswerMessage1);

    let wrongAnswerMessage2 = document.createElement('p');
    wrongAnswerMessage2.className = 'wrongAnswerMessage';
    wrongAnswerMessage2.innerHTML = `Не сдавайся, попробуй ответить ещё раз!`;
    wrongAnswerMessage.appendChild(wrongAnswerMessage2);
    setTimeout(this.removeWrongAnswerMessage, 3000);
  }

  //----- DELETE MESSAGE IF ANSWER IS WRONG -----//
  removeWrongAnswerMessage() {
    let wrongAnswerMessage = document.getElementById('wrongAnswerMessage');
    wrongAnswerMessage.remove();
  }


  //----- BUTTON TO HOME SCREEN -----//
  addButtonToHome() {
    const btnGoHome = document.createElement('button');
    btnGoHome.innerHTML = '🏠 HOME';
    btnGoHome.className = 'btnGoHome';
    this.root.appendChild(btnGoHome);
    btnGoHome.addEventListener('click', (event) => {
      this.root.innerHTML = '';
      this.start();
    })
  }

  reset() { //TODO: use or delete
    this.root.innerHTML = '';
    this.player = null;
    this.questionList = null;
    this.currentQuestion = 0;
    this.playersAnswerList = []; 
  }

  escapeHTML(text) {  //function to correct HTML text in questions
    return text
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;');
  }
}
