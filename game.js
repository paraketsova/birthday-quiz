class Game {
  constructor() {
    this.player = null;
    this.questionList = null;
    this.currentQuestion = 0;
    this.playersAnswerList = [];  // [[0],[1]..] array.length = size.
    this.playerNames = ["mikael", "миша", "михаил", "мишка", "mikols", "миша ольшанский","михаил ольшанский", "mikael olshansky"];

    this.title = document.getElementById('title');
    this.root = document.getElementById('root');
  }

  // ----- FIRST SCREEN WITH TEXT ------- //
  start(event) {
    const introductionText = document.createElement('div');
    introductionText.id = 'introductionText';
    const intro1= document.createElement('p');
    intro1.innerHTML = "Once a year a birthday person can go to this resource and pass the test.";
    const intro2= document.createElement('p');
    intro2.innerHTML = "If you are a birthday person and you manage to answer 10 questions correctly, then you will receive the key to the <b>treasure</b>, as well as the glory of the HERO OF THE DAY, and you can undoubtedly be proud of yourself.";
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
    const btnTEST = document.createElement('button');
    btnTEST.id = 'btnTEST';
    btnTEST.innerHTML = 'TO THE END';
    btnTEST.addEventListener('click', (event) => {
      this.showResults();
    });
    this.root.appendChild(btnTEST);
  }

  play() { //if game starts add form (username, age)
    // ----- GREETINGS AND INPUT FOR NAME ------- //
    this.root.innerHTML = ''; //  då root är tom

    let labelNamesRoot = document.createElement('p'); // for username
    labelNamesRoot.innerText = ("Insert your name");
    this.root.appendChild(labelNamesRoot);

    let namesRoot = document.createElement('input');
    this.root.appendChild(namesRoot);
    namesRoot.id = 'name';

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
    let greetingsRoot = document.getElementById('greetings');
    this.player = new Player(nameInput.value);
    const btnPlay = document.getElementById("btnAskQ");
    // if (nameInput.value === "Mikael" || nameInput.value === "Миша" || nameInput.value === "Мишка") {
    if (nameInput.value && this.playerNames.includes(nameInput.value.toLowerCase())) {
      greetingsRoot.innerHTML = "Good luck! And don't cheat!";
      let size = 10;
      this.questionList = new QuestionList(size);
      const btnPlay = document.getElementById("btnAskQ");
      btnPlay.remove();

      this.questionList.load().then((result) => {  //The then() method returns a Promise. It takes an argument: callback function for the success
        this.askCurrentQuestion();   // TODO: setTimeout(this.askCurrentQuestion, 5000) OR change input to type submit and revise f for button
      })
    } else {
      greetingsRoot.innerHTML = "Sorry! This quest only for birthday boy";
      btnPlay.remove(); // TODO: add exit to first page?
    }

  }

  // ======= QUESTIONS ZONE ======= //
  askCurrentQuestion() {     // - for every question QuestionList  item[i]:
    root.innerHTML = '';  // clear with GO

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
    answerTextField.name = ('answer_' + this.currentQuestion); //TODO: это нужно???
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
      //  TODO: add message about wrong answer
      }
    })
  }

  // ----- SAVE THE ANSWERS ------- //
  savePlayersAnswer(currentAnswer) {      // push checked answers in playersAnswer[] and in this.playersAnswerList[]
    console.log('we on safe now '); //TODO: delete
    this.playersAnswerList.push([this.currentQuestion , +currentAnswer.value]); //push userAnswer in array playersAnswer
    console.log(this.playersAnswerList); //TODO: delete
    console.log(this.playersAnswerList[0]); //TODO: delete
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

  // ====== SHOW GIF WITH THE BOX ======//
  openTheBox() {
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
    numberImg.src = "number12.png"; // TODO: this part only for Mikael
    resultField.appendChild(numberImg);

    let resultField1 = document.createElement('p'); //field for result
    resultField1.id = 'resultField1';
    resultField1.innerHTML = ("Congratulations Mikael !"); //TODO: delete after testing
    //resultField1.innerHTML = ('Congratulations, ' + this.player.name + ', you made it!'); //TODO: to do default option
    resultField.appendChild(resultField1);

    let resultField2 = document.createElement("div");
    resultField2.id = "resultField2";
    let messageAboutPresent = document.createElement("p");
    messageAboutPresent.id = 'messageAboutPresent';
    messageAboutPresent.innerHTML = (`Now you can find your PRESENT: go to the living room, there in the right bookcase, on the bottom shelf, in the 8th book on the left, on the eighth page you will find a note with the exact location of your gift. Good luck!`);//TODO: change with correct information
    resultField.appendChild(messageAboutPresent);

    let btnFinish = document.createElement('button');
    btnFinish.id = 'btnFinish';
    btnFinish.innerHTML = 'AND FINALLY...';
    resultField.appendChild(btnFinish);

    btnFinish.addEventListener('click', (event) => {
      showLastImage();
    })


    let showLastImage = () => {
      this.root.innerHTML = '';  // remove question's block med btn
      this.title.innerHTML = '';
      let bodyElement = document.body; //
      bodyElement.className = 'lastBackground'; // add background for body
    }
  }



  getWrongAnswerMessage() {} //TODO: use or delete

  reset() { //TODO: use or delete
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
