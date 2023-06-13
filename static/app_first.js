const $inputForm = $("#inputForm");
const $wordList = $("#wordList");
const $msg = $("#message");

let wordlist = [];

async function getPlayerInput(event) {
  event.preventDefault();
  const word = $("#word").val();
  console.log("word", word);

  function showMessage(result, word) {
    $msg.append(`<li class="${result}"> "${word}" is ${result} </li>`);
    setTimeout(function () {
      $msg.empty();
      $wordList.val("");
    }, 3000);
  }

  function updateWordList() {
    $wordList.empty();
    for (let word of wordlist) {
      $wordList.append(`<li>${word}</li>`);
    }
  }

  function showScore() {
    $("#score").append(`<span>${wordlist.length}</span>`);
  }

  try {
    //axios.get("/check-word?word=word")
    const response = await axios.get("/check-word", {
      params: { word: word },
    });
    result = response.data.result;
    if (result === "not-word") {
      showMessage(result, word);
    } else if (result === "not-on-board") {
      showMessage(result, word);
    } else {
      showMessage(result, word);
      showScore();
      wordlist.push(word);
      updateWordList();
      console.log(wordlist);
      updateScore();
    }
    console.log("response please!!!", response.data.result);
  } catch (error) {
    console.error(error);
  }
}

$inputForm.on("submit", getPlayerInput);

async function updateScore() {
  let score = wordlist.length;
  console.log("score", score);
  try {
    const response = await axios.post("/scores", { score: score });
  } catch (error) {
    console.error(error);
  }
}
