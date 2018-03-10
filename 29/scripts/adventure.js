"use strict";

class Room {
    constructor(name, description, items) {
        this.name = name;
        this.description = description;

        this.items = {};
        for (var item of items) {
            this.items[item.name] = item;
        }
    }
}

class Item {
    constructor(name, description, actions) {
        this.name = name;
        this.description = description;
        this.actions = actions == null ? {} : actions;
    }
}

class Transition {
    constructor(room1, room2, locked) {
        this.room1 = room1;
        this.room2 = room2;
        this.locked = locked;
    }
}

let bedroomPassword = "twohandmanip";
let kitchenPassword = "skieveryday";
let gameOverPassword = "davidlovesjulia"

let helpText = `Commands:
LOOK (L)
EXAMINE (X) <OBJECT>
TAKE (T) <OBJECT>
OPEN (O) <OBJECT>
ENTER (E) <ROOM>
HELP (H)`;

let riddle = `
Two sisters are we, one is dark and one is fair
In twin towers dwelling we're quite the pair
One from land and one from sea
Tell us truly, who are we?
`;

let EXAMINE = "x";
let OPEN = "o";
let TAKE = "t";

let bed = new Item("bed", "It's a double bed. You spend about 1/3 of your time in it. Maybe someday David will decide that you need a bigger one.");
let windowItem = new Item("window", "The sky is bright but overcast. The occasional car glides down the road. You see a lot of apartment buildings, but nothing else of interest.");
let closetItem = new Item("closet", "It's your closet, where you keep all your clothes and other stuff. I wonder what's in there?");
let door = new Item("door", "The door glows with a mysterious blue light, as though it was made of ice.", {[OPEN]: "You try the handle but it doesn't move a millimeter. The door is frozen in place by the blue light."});

let clothes = new Item("clothes", "Most of these clothes are David's, which is funny because he seems to wear the same five shirts every week. You have some nice dresses in here too.");
let tools = new Item("tools", "You're proud of your small tool collection. Most tools you'd ever need are right here. Maybe when you move somewhere bigger, you'll have more room for some fancier ones.");
let bins = new Item("bins", "The bins seem to hold various cables and electronics parts. One bin, however, is labeled \"secret\"...");

let desk = new Item("desk", "The desk is where you spend most of your time at home. A lot of good work gets done here. There's nothing unusual here except for a COFFEECUP that you don't remember being there last night.");
let coffeeCup = new Item("coffeecup", "It's an empty coffee cup, obediently waiting to be filled.", {[TAKE]: `You pick up the coffee cup, revealing a note that was hiding underneath it. The note says "${kitchenPassword}"...`});
let kitchenDoor = new Item("kitchendoor", "The door glows with a mysterious blue light, as though it was made of ice.", {[OPEN]: "You try the handle but it doesn't move a millimeter. The door is frozen in place by the blue light."});

let bedroom = new Room("bedroom", "The BEDROOM is small but cozy. Most of the room is taken up by a BED. To the left of the bed is a WINDOW. To the right is a CLOSET. Behind you is a DOOR.", [bed, windowItem, closetItem, door]);
let closet = new Room("closet", "Wow, there's a lot of stuff in here. On your left are some hanging CLOTHES. On your right are various BINS and TOOLS.", [clothes, tools, bins]);
let livingRoom = new Room("livingroom", "The LIVINGROOM is lovely and spatious. You smile approvingly at the modular couch and new table, as both have served you well. From here you can see your DESK. What's unusual is that there's a new wall blocking the KITCHEN, and a KITCHENDOOR.", [desk, coffeeCup, kitchenDoor]);
let kitchen = new Room("kitchen", `Just standing in the kitchen makes you want to slow cook a meal, or ask Google about the news. Everything seems ordinary here. Suddenly, a voice on the air whispers a riddle:\n${riddle}`, []);

let bedroomToCloset = new Transition(bedroom, closet, false);
let bedroomToLivingRoom = new Transition(bedroom, livingRoom, true);
let livingRoomToKitchen = new Transition(livingRoom, kitchen, true);

let transitions = [
    bedroomToCloset,
    bedroomToLivingRoom,
    livingRoomToKitchen,
];

class GameState {
    constructor() {
        this.room = null;
        this.bedroomUnlocked = false;
        this.kitchenUnlocked = false;
        this.gameIsOver = false;
    }
}

class TextAdventure {
    constructor(outputFunction, inputFunction) {
        this.outputFunction = outputFunction;
        this.inputFunction = inputFunction;
        this.gameState = new GameState();
    }

    start() {
        this.gameState.room = bedroom;
        this.print(`You wake up in a maze of twisty passages, all alike.

Actually, it's only your bedroom in Redmond. The room is lit with the soft, hazy glow of overcast sunlight through the window. It's a cloudy Seattle morning, and you can already hear the sounds of cars passing by on the road outside.

You sit on the edge of the bed and think. There was something important about today... Oh right, it's your birthday! David said he had something special planned for you, but what could it be? You know that David's terrible at planning things. As you sit there, slowly waking up, you notice a slip of paper poking out from under the lamp on the nightstand...
`);
        this.prompt();
    }

    prompt() {
        var self = this;
        this.inputFunction("\nWhat do you do?", function(input) {
            self.handleInput(input);
        });
    }

    print(string) {
        this.outputFunction('\n' + string);
    }

    handleInput(input) {
        let originalInput = input;
        input = input.toLowerCase().trim();
        let components = input.split(" ");

        if (components.length == 0 || components[0] == "") {
            this.prompt();
            return;
        }

        let command = components[0];
        if (command == "l" || command == "look") {
            this.print(this.gameState.room.description);
        } else if (command == "e" || command == "enter") {
            if (components.length == 1) {
                this.print("ENTER needs a room");
            } else {
                let room = components[1];
                this.enter(room);
            }
        } else if (command == "x" || command == "examine") {
            if (components.length == 1) {
                this.print("EXAMINE needs an item");
            } else {
                let itemName = components[1];
                this.examine(itemName);
            }
        } else if (command == "o" || command == "open") {
            if (components.length == 1) {
                this.print("OPEN needs an item");
            } else {
                let itemName = components[1];
                this.open(itemName);
            }
        } else if (command == "t" || command == "take") {
            if (components.length == 1) {
                this.print("TAKE needs an item");
            } else {
                let itemName = components[1];
                this.take(itemName);
            }
        } else if (command == "h" || command == "help") {
            this.print(helpText);
        } else if (command == bedroomPassword) {
            this.unlockBedroomDoor();
        } else if (command == kitchenPassword) {
            this.unlockKitchenDoor();            
        } else if (command == gameOverPassword) {
            this.gameOver();            
        } else {
            this.invalidInput(originalInput);
        }

        if (!this.gameState.gameIsOver) {
            this.prompt();
        }
    }

    invalidInput(input) {
        this.print(`I don't understand "${input}".`);
    }

    enter(roomName) {
        if (this.gameState.room.name == roomName) {
            this.print("You're already here!");
            return;
        }

        for (var transition of transitions) {
            if ((transition.room1.name == this.gameState.room.name && transition.room2.name == roomName) || 
                (transition.room2.name == this.gameState.room.name && transition.room1.name == roomName)) {
                if (transition.locked) {
                    this.print("The door is locked.");
                } else {
                    let newRoom = transition.room1.name == roomName ? transition.room1 : transition.room2;
                    this.gameState.room = newRoom;
                    this.print(this.gameState.room.description);
                }
                return;
            }
        }

        this.print("You can't go there from here.");
    }

    examine(itemName) {
        this.itemAction(itemName, EXAMINE);
    }

    open(itemName) {
        this.itemAction(itemName, OPEN);
    }

    take(itemName) {
        this.itemAction(itemName, TAKE);
    }

    itemAction(itemName, actionName) {
        let item = this.gameState.room.items[itemName];
        if (item == null) {
            this.print(`There's no ${itemName} here.`);
            return;
        }

        if (actionName == EXAMINE) {
            this.print(item.description);
            return;
        }

        let result = item.actions[actionName];
        if (result == null) {
            this.print(`You can't do that to ${itemName}`);
        } else {
            this.print(result);
        }
    }

    unlockBedroomDoor() {
        if (this.gameState.bedroomUnlocked) {
            this.print("You already did that!");
            return;
        }
        if (this.gameState.room != bedroom) {
            this.print("You speak the mysterious phrase aloud but nothing happens. Maybe you need to be in the BEDROOM and not the CLOSET for this to work...");
            return;
        }
        this.gameState.bedroomUnlocked = true;
        bedroomToLivingRoom.locked = false;
        door.actions[OPEN] = "The door is already open.";
        door.description = "It's just a normal, boring door between the BEDROOM and LIVINGROOM.";
        this.print("There's a sound like a lightning strike and the blue glow around the door instantly vanishes. The door creaks slightly, now under the influence of gravity, and slowly swings open, revealing the LIVINGROOM.");
    }

    unlockKitchenDoor() {
        if (!this.gameState.bedroomUnlocked) {
            this.invalidInput(kitchenPassword);
            return;
        }
        if (this.gameState.kitchenUnlocked) {
            this.print("You already did that!");
            return;
        }
        if (this.gameState.room != livingRoom) {
            this.print("You speak the mysterious phrase aloud but nothing happens. Maybe you need to be in the LIVINGROOM for this to work...");
            return;
        }
        this.gameState.kitchenUnlocked = true;
        livingRoomToKitchen.locked = false;
        kitchenDoor.actions[OPEN] = "The door is already open.";
        kitchenDoor.description = "It's just a normal, boring door between the LIVINGROOM and KITCHEN.";
        this.print("There's a sound like a lightning strike and the blue glow around the door instantly vanishes. The door creaks slightly, now under the influence of gravity, and slowly swings open, revealing the KITCHEN.");
    }

    gameOver() {
        if (this.gameState.bedroomUnlocked && this.gameState.kitchenUnlocked) {
            this.gameState.gameIsOver = true;
            this.print("After speaking the words, the apartment door opens. David is home! He comes over and gives you a big hug, and tells you something in your ear...");
        } else {
            this.invalidInput(gameOverPassword);
        }
    }
}
