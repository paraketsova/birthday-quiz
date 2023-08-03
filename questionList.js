class QuestionList {
  constructor(size) {
    this.size = size;
    this.items = []; 
  }

  load() {
    let link = ('questions-data.json');
   
    return fetch(link) 
      .then((response) => response.json())
      .then((data) => {
        
        for (let i=0; i<data.length; i++) {
          const question = new Question(data[i]);
          this.items.push(question);
        }
        console.log(this.items); //TODO: DELETE test
        return this.items; 
      }); 
  }
}

