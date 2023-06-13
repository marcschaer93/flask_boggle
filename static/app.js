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

    try {
      //axios.get("/check-word?word=word")
      const response = await axios.get("/check-word", {
        params: { word: word },
      });
      const result = response.data.result;
      if (result === "WELL-DONE") {
        this.score += 1;
        this.showScore();
        this.showWordList(word);
        this.wordList.add(word);
      } else {
        this.flashMessage(result, word);
      }
    } catch (err) {
      console.log(err);
    }

    $("#input").val("").focus();
  }

  showScore() {
    $("#counterValue", this.board).text(this.score);
  }

  flashMessage(result, word) {
    $("#message").html(`<p class="${result}"> "${word}" is ${result} </p>`);

    setTimeout(function () {
      $("#message").empty();
    }, 3000);
  }

  showWordList(word) {
    if (this.wordList.has(word)) {
      this.flashMessage("ALREADY-IN-WORDS", word);
    } else {
      $("#wordList", this.board).append(`<li>${word}</li>`);
    }
  }

  async handleScore() {
    console.log("handleScore");
    const response = await axios.post("/post-score", { score: this.score });
    console.log("response", response);
    if (response.data.brokeRecord) {
      alert("NEW RECORD");
      this.newGame();
    } else {
      alert(`YOUR SCORE IS: ${this.score}`);
      this.newGame();
    }
  }

  newGame() {
    window.location.href = "/";
  }
}

let newGame = new BoggleGame("boggle_1", 4);
