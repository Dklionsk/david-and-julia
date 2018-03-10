"use strict";

$(function() {
    var terminal = new Terminal();
    $("body").append(terminal.html);

    var outputFunction = function(text) {
        terminal.print(text);
    };

    var inputFunction = function(text, completion) {
        terminal.input(text, function(input) {
            completion(input);
        });
    };

    var ta = new TextAdventure(outputFunction, inputFunction);
    ta.start();
});
