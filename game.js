class Game {
  constructor(){
    this.player = null;
    this.questionList = null;
    this.currentQuestion = 0;
    this.playersAnswerList = [];  // [[0],[1]..] array.length = size.


    this.root = document.getElementById('root');
  }

  start (event) {
    const btnPlay = document.createElement('button');
    btnPlay.id = 'btnPlay';
    btnPlay.innerHTML = 'PLAY NOW'; 
    btnPlay.addEventListener('click', (event) => {
      this.play();
    });
    this.root.appendChild(btnPlay);
  }

  play() { //if game starts add form (username, age)

    this.root.innerHTML = ''; //  då root är tom
    
    let labelnamesRoot = document.createElement('p'); // for username
    labelnamesRoot.innerText = ("Insert your name");
    this.root.appendChild(labelnamesRoot); 

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

  askName () {
    let nameInput = document.getElementById('name');
    let greetingsRoot = document.getElementById('greetings');
    this.player = new Player(nameInput.value);
    const btnPlay = document.getElementById("btnAskQ");
    if (nameInput.value === "Mikael" || nameInput.value ==="Миша" || nameInput.value ==="Мишка") {
      greetingsRoot.innerHTML = "Hello, birthday boy!if you can handle it, you'll find your way to the gift. Good luck! And don't cheat!";
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

  askCurrentQuestion() {     // - for every question QuestionList  item[i]:

    root.innerHTML = '';  // clear with GO
    let questionCounter = document.createElement('div'); // for number of current question
    questionCounter.id = 'questionCounter';
    questionCounter.innerHTML = ((this.currentQuestion + 1) + " / " + this.questionList.size);  // number current question and size för den Quis
    this.root.appendChild(questionCounter); 
  
    let questText = document.createElement('div');
    questText.id = 'questText';
    questText.innerHTML = this.escapeHTML(this.questionList.items[this.currentQuestion].question);  // use method escapeHTML (function to correct difference between HTML tags in questions' texts
    this.root.appendChild(questText); 
  
    let answerList = document.createElement('ul'); //add field for answers wrap
    answerList.id = 'answerList';
    this.root.appendChild(answerList); 
    
    for (let key in this.questionList.items[this.currentQuestion].answers) { //  for... in   = remove unused spaces in questions
      const element = this.questionList.items[this.currentQuestion].answers[key];
      if (element !== null) {


        let answerTextWrap = document.createElement('li'); //create checkbox wrap
        answerList.appendChild(answerTextWrap);
        let answerText = document.createElement('input'); //create checkbox for every answer
        answerText.type = 'checkbox';
        answerText.id = (key);
        answerText.name = ('answer_' + this.currentQuestion);

        let labelAnswerText = document.createElement('label'); //skapar label för checkbox (text med svar)
        labelAnswerText.setAttribute('for', key); //
        
        labelAnswerText.innerHTML = this.escapeHTML(element); // användar function för att korrekt skildring HTML taggar i text med svar
        answerTextWrap.appendChild(answerText);
        answerTextWrap.appendChild(labelAnswerText);
      }
    }

    // BUTTON FOR CHECK THE ANSWER
    // let btnCheck = document.createElement('button');
    // btnCheck.innerHTML = 'CHECK';
    // btnCheck.id = 'btnCheck';
    // this.root.appendChild(btnCheck);
    //
    // btnCheck.addEventListener('click', (event) => {
    //   this.savePlayersAnswer(); // to safe answer to answers array
    //   const isCorrect = this.compareOneAnswer(
    //     playersAnswer, //TODO - add this variable for this userAnswer
    //     this.questionList.items[this.currentQuestion].correct_answers
    //   );
    //
    //   if (isCorrect) {
    //     if (this.currentQuestion < this.questionList.size - 1) {
    //       this.currentQuestion++;
    //       this.askCurrentQuestion();
    //     } else {
    //       this.showResults(); //  if it's the last question go to showResult
    //     }
    //   } else {
    //   //  TODO: add message about wrong answer
    //   }
    //
    // })


    let btnNext = document.createElement('button');
    btnNext.innerHTML = 'NEXT';
    btnNext.id = 'btnNext';
    this.root.appendChild(btnNext);

    btnNext.addEventListener('click', (event) => { 
      this.savePlayersAnswer(); // to safe answer to answers array

      if (this.currentQuestion < this.questionList.size - 1) {
        this.currentQuestion++; //späder på this.currentQuestion
        this.askCurrentQuestion(); //anropar _den_ metoden igen
      } else {
        this.showResults(); //  if it's the last question go to showResult
      };
    })
  }

  savePlayersAnswer() {      // push checked answers in playersAnswer[] and in this.playersAnswerList[]
    let checkboxList = document.getElementsByName('answer_' + this.currentQuestion); //create HTML collection
    let playersAnswer = [];  // create array for playersAnswer
    for (let i=0; i < checkboxList.length; i++) {
      if (checkboxList[i].checked) {
        playersAnswer.push(checkboxList[i].id); //push checkbox id in array playersAnswer
      }
    }
    this.playersAnswerList.push(playersAnswer); //push every playersAnswer[] in this.playersAnswerList[]
  }

  showResults() {   //get and show result, restart game
    root.innerHTML = '';  // remove question's block med btn
    let resultField = document.createElement('div'); // create field for result
    resultField.id = 'resultField';
    this.root.appendChild(resultField);

    // let sumPoints = this.getPoints(); // return value from this.getPoints() //TODO: убрать

    let resultField1 = document.createElement('p'); //field for result
    // let resultField2 = document.createElement('p');
    resultField1.innerHTML = ('Congratulations, ' + this.player.name + ', you almost made it!');
    // resultField2.innerHTML = ('You got '+ sumPoints + ' out of ' + this.questionList.size + ' answers correct!');
    resultField.appendChild(resultField1);
    // resultField.appendChild(resultField2);

    let btnPlayAgain =  document.createElement('button'); //add button 'Play again' btnNext.type = 'image'; TODO: DELETE
    btnPlayAgain.innerHTML = 'NEW GAME'; 
    btnPlayAgain.id = 'btnPlayAgain';
    this.root.appendChild(btnPlayAgain);
    btnPlayAgain.addEventListener('click', (event) => { 
      this.reset();
      this.play();
    });
  }

  getPoints() {  // sumPoints for showResult
    console.log(this.playersAnswerList); // TODO: TEST debugging

    const sumPoints = this.playersAnswerList.reduce(
      (points, playersAnswer, i) => {
        const isCorrect = this.compareOneAnswer(
          playersAnswer,
          this.questionList.items[i].correct_answers
        );

        if (isCorrect) {
          return points + 1;
        }

        return points;
      },
      0
    );

    return sumPoints;
  }

  compareOneAnswer(playersAnswer, correctAnswer) { //compare user answers with correct answers
    /* Example:
      
      playersAnswer = [
        'answer_b', 
        'answer_c'
      ]
      correctAnswer = {
        answer_a_correct: "false", 
        answer_b_correct: "true", 
        answer_c_correct: "true", 
        answer_d_correct: "false"
      }
    */

    for (let option in correctAnswer) {
      const option2 = option.slice(0, -8); // 'answer_c_correct' -> 'answer_c'
      
      // Example: option = 'answer_c_correct'
      // Example: option2 = 'answer_c'
      
      if (correctAnswer[option] === 'true') {
        // correct answer
        if (!playersAnswer.includes(option2)) {
          return false;
        }
      } else {
        // incorrect answers
        if (playersAnswer.includes(option2)) {
          return false;
        }
      }
    } 
    
    return true;
  }

  reset() {
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
