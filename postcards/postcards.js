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

function checkAnswer(answerHashes, showMessage) {
    var userInput =  document.getElementById("answer").value;
    var inputStr = userInput.toLowerCase().replace(/[^a-z]/gi, '');
    var inputHash = easyHash(inputStr);
    var isCorrect = answerHashes.includes(inputHash);

    var feedbackStr = "";
    if (isCorrect) {
        feedbackStr = "";
        if (showMessage) {
            feedbackStr += "Congratulations! You solved the first puzzle!<br><br>What's going on here? We just wanted to reach out to some of our friends and family in an interesting and tactile way.<br>No big announcements or anything, just some fun puzzles and postcards from us.<br>We hope you enjoy it, and let us know how this one went ❤️";
        } else {
            feedbackStr += "Correct!<br><br>P.S. Let us know how this one went ❤️";
        }
        feedbackStr += "<br><br>davidklionsky@gmail.com<br>julenka.schwarz@gmail.com";
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
