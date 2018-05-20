// Hashes a string into an int
// Reference implementation:
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
function easyHash(input) {
  var hash = 0, i, chr;
  if (input.length === 0) return hash;
  for (i = 0; i < input.length; i++) {
    chr   = input.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function checkAnswer(answerHashes) {
    var userInput =  document.getElementById("answer").value;
    var inputStr = userInput.toLowerCase().replace(/[^a-z]/gi, '');
    var inputHash = easyHash(inputStr);
    var isCorrect = answerHashes.includes(inputHash);

    var feedbackStr = "";
    if (isCorrect) {
        feedbackStr = "Correct!<br><br>P.S. Let us know how this one went ❤️";
    } else {
        feedbackStr = "Try again";
    }
    document.getElementById("feedback").innerHTML = feedbackStr;
}

var hintIndex = 0;

function giveHint(hints) {
    document.getElementById("feedback").innerHTML += hints[hintIndex++] + "<br>";
    if (hintIndex >= hints.length) {
        document.getElementById("hint").disabled = true;
    }
}
