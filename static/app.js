class BoggleGame {
  constructor(boardId, secs) {
    this.board = $("#" + boardId);
    this.score = 0;
    this.gameCounter = 0;
    this.secs = secs;
    this.wordList = new Set();

    this.timer = setInterval(this.countDown.bind(this), 1000);

    $("#inputForm", this.board).on("submit", this.handleSubmit.bind(this));
    $("#resetBtn").on("click", this.newGame.bind(this));
  }

  async countDown() {
    this.secs -= 1;
    this.showTimer();

    if (this.secs === 0) {
      clearInterval(this.timer);
      this.gameCounter += 1;
      await this.handleScore();
    }
  }

  showTimer() {
    $("#timer").text(this.secs);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const word = $("#input").val();

    if (this.wordList.has(word)) {
      this.showMessage(`${word} is ALREADY in WORDS`, "error");
      $("#input").val("").focus();

      return;
    }

    try {
      //axios.get("/check-word?word=word")
      const response = await axios.get("/check-word", {
        params: { word: word },
      });
      const result = response.data.result;

      if (result === "WELL-DONE") {
        this.score += 1;
        this.showScore();
        this.wordList.add(word);
        this.showWordList(word);
        this.showMessage(`WELL Done!`, "message");
      } else if (result === "NOT-A-WORD") {
        this.showMessage(`${word} is NOT a VALID english WORD!`, "error");
      } else {
        this.showMessage(`${word} is NOT a VALID WORD on Board!`, "error");
      }
    } catch (err) {
      console.log(err);
    }

    $("#input").val("").focus();
  }

  showScore() {
    $("#counterValue", this.board).text(this.score);
  }

  showMessage(message, cls) {
    $("#message", this.board).removeClass().addClass(`${cls}`).text(message);
  }

  async handleScore() {
    console.log("handleScore");
    const response = await axios.post("/post-score", { score: this.score });
    console.log("response", response);
    if (response.data.brokeRecord) {
      this.showMessage(`NEW RECORD : ${this.score}`, "message");
    } else {
      this.showMessage(`Your SCORE is : ${this.score}`, "message");
    }
  }

  newGame() {
    window.location.href = "/";
  }
}

let newGame = new BoggleGame("boggle_1", 15);
