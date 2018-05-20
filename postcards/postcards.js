// Hashes a string into an int
// Reference implementation:
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
function easy_hash(input) {
  var hash = 0, i, chr;
  if (input.length === 0) return hash;
  for (i = 0; i < input.length; i++) {
    chr   = input.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// checks user input string against list of valid answers
// and returns true if answer matches, false otherwise
// this function will canonicalize the input into a standard form
// user_input: string
// valid_answer_hashes: array<int>
function check_answer(user_input, valid_answer_hashes)
{
    var inputStr = user_input.toLowerCase().replace(/[^a-z]/gi, '');
    var inputHash = easy_hash(inputStr);
    console.log("Hello " + inputStr + " hash: " + inputHash);
    return valid_answer_hashes.includes(inputHash);
}

function myFunction(valid_answer_hashes) {
    var answerElem =  document.getElementById("answer");
    var isCorrect = check_answer(answerElem.value, valid_answer_hashes);
    var feedbackStr = "";
    if (isCorrect)
    {
        feedbackStr = "That is correct!";
    }
    else
    {
        feedbackStr = "Try again";
    }
    document.getElementById("feedback_answer").innerHTML = feedbackStr;
}