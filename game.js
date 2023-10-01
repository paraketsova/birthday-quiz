class Game {
  constructor() {
    this.player = null;
    this.questionList = null;
    this.currentQuestion = 0;
    this.playersAnswerList = [];  // [[0],[1]..] array.length = size.
    this.playerNames = ["mariia"];

    this.title = document.getElementById('title');
    this.root = document.getElementById('root');
  }

  // ----- FIRST SCREEN WITH TEXT ------- //
  start(event) {
    const introductionText = document.createElement('div');
    introductionText.id = 'introductionText';
    const intro1= document.createElement('p');
    intro1.innerHTML = "Once a year, a birthday person can come here, and try to pass The Test.";
    const intro2= document.createElement('p');
    intro2.innerHTML = "If it's your birthday today, and you manage to answer all 10 questions correctly, you will receive the key to The Treasure, as well as the glory of the Hero of the Day, and you can certainly be proud of yourself.";
    introductionText.appendChild(intro1);
    introductionText.appendChild(intro2);
    this.root.appendChild(introductionText);

    const btnPlay = document.createElement('button');
    btnPlay.id = 'btnPlay';
    btnPlay.innerHTML = 'PLAY NOW';
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
    labelNamesRoot.innerText = ("Insert your name");
    this.root.appendChild(labelNamesRoot);

    let namesRoot = document.createElement('input');
    namesRoot.type = 'text';
    this.root.appendChild(namesRoot);
    namesRoot.id = 'name';

    let labelDateRoot = document.createElement('p'); // for username
    labelDateRoot.innerText = ("Insert your day of birth");
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
    btnAskQ.innerHTML = 'GO';
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
    this.player = new Player(nameInput.value);
    const btnPlay = document.getElementById("btnAskQ");
    // if (nameInput.value && this.playerNames.includes(nameInput.value.toLowerCase())) {
    console.log("name " + nameInput.value) //TODO: delete after testing

    // ----  CHECK THE DATE OF BIRTH  ---- //
    // const today = new Date();
    const today = new Date().toISOString().split('T')[0];
    const isToday =  dateInput.value.substring(5) === today.substring(5);

    console.log("date " + dateInput.value); //TODO: delete after testing
    console.log("date-short " + dateInput.value.substring(5)); //TODO: delete after testing
    console.log("date-today-short " + today.substring(5)); //TODO: delete after testing
    console.log("is it birthday " + isToday) //TODO: delete after testing

    if (nameInput.value && dateInput.value && isToday) {
      greetingsRoot.className = "bungee-spice";
      greetingsRoot.innerHTML = "Good luck " + nameInput.value + "! And don't cheat!";
      btnPlay.addEventListener('click', (event) => {
        this.goToThePlay();
      })
    } else {
      greetingsRoot.innerHTML = "Sorry! This quest is only for a birthday person. Is it really your birthday today?";
      btnPlay.remove();
      this.addButtonToHome(); // add button to home screen
    }
  }

  // ======= GO TO THE PLAY ======= //
  goToThePlay() {
    let size = 10;
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
    btnCheck.innerHTML = 'CHECK';
    btnCheck.id = 'btnCheck';
    this.root.appendChild(btnCheck);

    btnCheck.addEventListener('click', (event) => {
      let currentAnswer = document.getElementById('answer').value;
      console.log(currentAnswer);
      // this.savePlayersAnswer(); // to safe answer to answers array
      const isCorrect = (+currentAnswer === this.questionList.items[this.currentQuestion].correct_answer);

      console.log(isCorrect);

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

    this.openTheBox(); //show the box
    setTimeout(this.showFinishMessage, 3000); //show the finish message
  }

  // ====== SHOW GIF WITH BOX ======//
  openTheBox() { //TODO: delete or use
    let resultField = document.getElementById('resultField');
    let resultGif = document.createElement('iframe');
    resultGif.id = 'resultGif';
    resultGif.src = 'box.gif'
    resultField.appendChild(resultGif);
  }

  // ====== SHOW THE FINISH MESSAGE ======//
  showFinishMessage() {
    let resultField = document.getElementById('resultField');
    resultField.innerHTML = '';

    let numberImg = document.createElement("img");
    numberImg.id = 'numberImg';
    numberImg.src = "number12.png"; // TODO: it must be depend of age!
    resultField.appendChild(numberImg);

    let resultField1 = document.createElement('p'); //field for result
    resultField1.id = 'resultField1';
    resultField1.innerHTML = `Congratulations, ${this.player?.name || 'kid'}!`;
    resultField.appendChild(resultField1);

    let resultField2 = document.createElement("div");
    resultField2.id = "resultField2";
    let messageAboutPresent = document.createElement("p");
    messageAboutPresent.id = 'messageAboutPresent';
    messageAboutPresent.innerHTML = "Now you can look for your Present: read a note under your pillow";
    resultField.appendChild(messageAboutPresent);

    let btnFinish = document.createElement('button'); //add button to last screen
    btnFinish.id = 'btnFinish';
    btnFinish.innerHTML = 'BUT FIRST...';
    resultField.appendChild(btnFinish);

    btnFinish.addEventListener('click', (event) => {
      showLastImage();
      // this.addButtonToHome(); //TODO: fix it - doesn't work
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
    wrongAnswerMessage1.innerHTML = `Wrong answer 🤖`;
    wrongAnswerMessage.appendChild(wrongAnswerMessage1);

    let wrongAnswerMessage2 = document.createElement('p');
    wrongAnswerMessage2.className = 'wrongAnswerMessage';
    wrongAnswerMessage2.innerHTML = `Try again and don't give up!`;
    wrongAnswerMessage.appendChild(wrongAnswerMessage2);
    setTimeout(this.removeWrongAnswerMessage, 3000);
  }

  //----- DELETE MESSAGE IF ANSWER IS WRONG -----//
  removeWrongAnswerMessage() {
    let wrongAnswerMessage = document.getElementById('wrongAnswerMessage');
    console.log('remove it now', wrongAnswerMessage);
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
    console.log('reset');
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
