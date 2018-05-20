// Yes, we know you could probably reverse engineer this (we're looking at you, Robert). 
// If you figure out how to do that, let us know ;)

function easyHash(input) {
    // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
    var hash = 0, i, chr;
    if (input.length === 0) return hash;
    for (i = 0; i < input.length; i++) {
        chr   = input.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

var hintIndex = 0;
var wrongAnswerIndex = 0;
let wrongAnswerFeedbacks = ["That's not it", "That's not it, keep trying!", "That's not it, keep trying! We believe in you!", "That's not it, keep trying! We really believe in you!"];

function checkAnswer(answerHashes) {
    var userInput =  document.getElementById("answer").value;
    var inputStr = userInput.toLowerCase().replace(/[^a-z]/gi, '');
    var inputHash = easyHash(inputStr);
    var isCorrect = answerHashes.includes(inputHash);

    var feedbackStr = "";
    if (isCorrect) {
        feedbackStr = "Correct!<br><br>P.S. Let us know how this one went ❤️";
        document.getElementById("hints").innerHTML = "";
    } else {
        feedbackStr = wrongAnswerFeedbacks[wrongAnswerIndex];
        wrongAnswerIndex = (wrongAnswerIndex + 1) % wrongAnswerFeedbacks.length;
    }
    document.getElementById("feedback").innerHTML = feedbackStr;
}

function giveHint(hints) {
    document.getElementById("hints").innerHTML += hints[hintIndex++] + "<br>";
    if (hintIndex >= hints.length) {
        document.getElementById("hint").disabled = true;
    }
}
