/* Changes mades:
	added more levels
	added more pages, like menu and help page as well as a game over page
    	added monster
    	added bad sticks that decreases the score
*/


 /* @pjs preload="Hopper-Happy.png"; */
 /* @pjs preload="Hopper-Jumping.png"; */
 /* @pjs preload="Grass Block.png"; */
 /* @pjs preload="old-spice-man.png"; */
 /* @pjs preload="OhNoes.png"; */
 PImage beaverImage;
 PImage beaverhopImage;
 PImage beaverfallImage;
 PImage grassImage;
 PImage monsterImage;
 PImage ohnoesImage;
 

void setup()
 {
 size(400,400);
 background(125);
 fill(255);
 PFont fontA = loadFont("serif");
 textFont(fontA, 14);
 
 beaverImage = loadImage("https://raw.githubusercontent.com/Victor-Brasil/Happy-Beaver/master/Hopper-Happy.png");
 beaverhopImage = loadImage("https://raw.githubusercontent.com/Victor-Brasil/Happy-Beaver/master/Hopper-Jumping.png");
 beaverfallImage = loadImage("https://raw.githubusercontent.com/Victor-Brasil/Happy-Beaver/master/Hopper-Happy.png"); 
 grassImage = loadImage("https://raw.githubusercontent.com/Victor-Brasil/Happy-Beaver/master/Grass.Block.png");
 monsterImage = loadImage("https://raw.githubusercontent.com/Victor-Brasil/Happy-Beaver/master/old-spice-man.png");
 ohnoesImage = loadImage("https://raw.githubusercontent.com/Victor-Brasil/Happy-Beaver/master/OhNoes.png");
 
 }      

var currentScene = "menu";

var Button = function (x, y, width, label, description, nextScene) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.label = label;
    this.description = description || "";
    this.nextScene = nextScene;
};

Button.prototype.draw = function(x, y) {
    //change the position of the buttom for the specif drawing
    var x1 = this.x;
    var y1 = this.y;
    this.x = x || this.x;
    this.y = y || this.y;
        
    //draws the button
    fill(217, 181, 158);
    rectMode(CENTER);
    rect (this.x, this.y, this.width, this.width / 2);
    fill(0, 0, 0);
    textSize(18 / 50 * this.width / 2);
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
        
    //check if the mouse is inside button and if the button has been clicked
    if ((mouseX >= (this.x - this.width / 2) && mouseX <= (this.x + this.width / 2)) &&
        (mouseY >= (this.y - this.width /4) && mouseY <= (this.y + this.width / 4))) {
        
        textSize (15 / 50 * this.width / 2);
        text(this.description, this.x + 70 / 100 * this.width, this.y, this.width, this.width);   
        if (mousePressed) {
        fill(230, 210, 198);
        rectMode(CENTER);
        rect (this.x, this.y, this.width, this.width / 2);
        fill(0, 0, 0);
        textSize(18 / 50 * this.width / 2);
        text(this.label, this.x, this.y);
        
        //change scene
        currentScene = this.nextScene;
        }
    }
    textAlign(LEFT, BOTTOM);
    this.x = x1;
    this.y = y1;
};

var Beaver = function(x, y) {
    this.x = x;
    this.y = y;
    this.img = beaverImage;
    this.sticks = 0;
    this.score = 0;
    this.highScore = 0;
};

Beaver.prototype.draw = function() {
    fill(255, 0, 0);
    this.y = constrain(this.y, 0, height-50);
    image(this.img, this.x, this.y, 40, 40);
};

Beaver.prototype.hop = function() {
    this.img = beaverhopImage; 
    this.y -= 5;
};

Beaver.prototype.fall = function() {
    this.img = beaverfallImage; 
    this.y += 5;
};

Beaver.prototype.checkForStickGrab = function(stick) {
    if ((stick.x >= this.x && stick.x <= (this.x + 40)) &&
        (stick.y >= this.y && stick.y <= (this.y + 40))) {
        stick.y = -400;
        this.sticks ++;
        this.score ++;
    }
};
Beaver.prototype.checkForBadStickGrab = function(badstick) {
    if ((badstick.x >= this.x && badstick.x <= (this.x + 40)) &&
        (badstick.y >= this.y && badstick.y <= (this.y + 40))) {
        badstick.y = -400;
        this.score -=2;
    }
};

Beaver.prototype.checkForHolePassing = function (hole) {
    if (((hole.x - hole.radius) <= this.x && (hole.x + hole.radius) >= (this.x + 40)) &&
        ((hole.y - hole.radius) <= this.y && (hole.y + hole.radius) >= (this.y + 40))) {
        this.score += 0.05;
    }    
};

var Obstacle = function (x, y, image, speed) {
    this.x = x;
    this.y = y;
    this.img = image;
    this.speed = speed;
};

Obstacle.prototype.draw = function() {
    image(this.img, this.x, this.y, 40, 40);
};

var Hole = function (x, y) {
    this.x = x;
    this.y = y;
    this.radius = 70;
};

Hole.prototype.draw = function() {
    fill(227, 254, 255);
    strokeWeight(1.5);
    ellipse(this.x, this.y, this.radius, this.radius);
    strokeWeight(0);
};

var Stick = function(x, y) {
    this.x = x;
    this.y = y;
};

Stick.prototype.draw = function(type) {
    if(type === "good"){
        fill(89, 71, 0);
    }
    else {
        fill(255, 0, 0);
    }
    rectMode(CENTER);
    rect(this.x, this.y, 5, 40);
};

var beaver = new Beaver(200, 300);
var buttonPlay = new Button (200, 250, 100, "Play", "", "normal game");
var buttonHelp = new Button (200, 325, 100, "Help", " ", "help page");
var buttonMenu = new Button (50, 25, 100, "Menu", " ", "menu");


var sticks = [];
var badsticks = [];
var holes = [];
var monster = [];
var finalScore = 0;
var level = 1;
var increasingSpeed = 1;

var clear = function() {
    //redraws the game
        holes.splice (0, holes.length);
        sticks.splice (0, sticks.length);
        monster.splice (0, monster.length);
        badsticks.splice (0, badsticks.length);
        
        increasingSpeed = pow(1.1, (level - 1));
        
        //creates monsters
        for (var i = 0; i < 2 + 5 * (level - 1); i++) {
    monster.push(new Obstacle(i * 40 + random (100 * level, 2000 * level), random (20, 260), monsterImage, random (2, 4) * increasingSpeed));
}
        //creates holes
        for (var i = 0; i < 5 + 1 * (level - 1) ; i++) {
            holes.push(new Hole(i*250 + 300, random (20, 260)));
        }
        
        //creates sticks
        for (var i = 0; i < 40 + 5 * (level - 1); i++) {  
            sticks.push(new Stick(i * 40 + 300, random(20, 260)));
        }
        //creates bad sticks
        for (var i = 0; i < 20 + 5 * (level - 1); i++) {  
            badsticks.push(new Stick(i * 80 + 300, random(20, 260)));
        }
        
        beaver.sticks = 0;
};

Beaver.prototype.obstacleHit = function(obstacle){
    if (((obstacle.x >= this.x && obstacle.x <= (this.x + 40)) || 
    (this.x <= (obstacle.x + 40) && this.x >= obstacle.x)) &&
        ((obstacle.y >= this.y && obstacle.y <= (this.y + 40)) || 
        (this.y <= (obstacle.y + 40) && this.y >= obstacle.y))) {
            currentScene = "game over";
        }
};

for (var i = 0; i < 5 + 1* (level - 1); i++) {
    holes.push(new Hole(i*250 + 300, random (20, 260)));
}

for (var i = 0; i < 40 + 5 * (level - 1); i++) {  
    sticks.push(new Stick(i * 40 + 300, random(20, 260)));
}

for (var i = 0; i < 20 + 5 * (level - 1); i++) {  
    badsticks.push(new Stick(i * 80 + 300, random(20, 260)));
}
if (monsterImage != null){
    for (var i = 0; i < 2 + 5 * (level - 1); i++) {
    monster.push(new Obstacle(i * 60 + random (100 * level, 1000 * level), random (20, 260), monsterImage, random (0.05, 1.5) * increasingSpeed));
}
}


var grassXs = [];
for (var i = 0; i < 25; i++) { 
    grassXs.push(i * 20);
}

void draw() {
    //Initial screen
    if (currentScene === "menu") {
        //draws the beaver at the center of the screen
        background(227, 254, 255);
        fill(0, 0, 0);
        textSize (30);
        text("Hoppy Beaver Extreme", 50, 50);
        pushMatrix();
        beaver.y = 0;
        beaver.x = -20;
        scale(2);
        beaver.x = 80;
        beaver.y = 50;
        beaver.hop();
        beaver.draw();
        popMatrix();
        
        //draws the play button
        buttonPlay.draw();
        
        //draws the help button
        buttonHelp.draw();
    }
    
    //Normal game
    else if (currentScene === "normal game") {
        // static
        background(227, 254, 255);
        fill(130, 79, 43);
        rectMode(CORNER);
        rect(0, height*0.90, width, height*0.10);
        
        //creates the grass
        for (var i = 0; i < grassXs.length; i++) {
            image(grassImage, grassXs[i], height*0.85, 20, 40);
	    grassXs[i] -= 1 * increasingSpeed;
            if (grassXs[i] <= -20) {
                grassXs[i] = width;
            }
        }
        
        /*teste posiciona o beaver de acordo com a posição do mouse
        beaver.x = mouseX;
        beaver.y = mouseY;
        */
        
        //draws the holes
        for (var j = 0; j < holes.length; j++) {
            holes[j].draw();
            beaver.checkForHolePassing (holes[j]);
            holes[j].x -= 1 * increasingSpeed; // changes the speed according to the level
        }
        
        //draws the sticks
        for (var i = 0; i < sticks.length; i++) {
            sticks[i].draw("good");
            beaver.checkForStickGrab(sticks[i]);
            sticks[i].x -= 1 * increasingSpeed; 
        }
        
        //draws the bad sticks
        for (var i = 0; i < badsticks.length; i++) {
            badsticks[i].draw("bad");
            beaver.checkForBadStickGrab(badsticks[i]);
            badsticks[i].x -= 1 * increasingSpeed; 
        }

        //draws obstacles
        for (var j = 0; j < monster.length; j++) {
        
	    monster[j].draw();
            beaver.obstacleHit (monster[j]);
            monster[j].x -= monster[j].speed;
        }
       
        //writes the infos about score, level and sticks
        fill(130, 79, 43);
        textSize(18);
        text("Score: " + round (beaver.score) , 20, 30);
        text("Sticks: " + beaver.sticks + " / " + sticks.length, 285, 30);
        text("Level: " + level, 20, 50);
        
        if (beaver.sticks/sticks.length >= 0.5) {
            textSize(36);
            text("YOU WIN!!!!", 100, 200);
            for(i=0; i<1000000; i++){}
            level ++;
            clear();
        }
        
        //check if the beaver passes through the last stick without winning
        else if (sticks[sticks.length - 1].x > 0 && sticks[sticks.length - 1].x < beaver.x) {
            clear();
            currentScene = "game over";
        }
        
        
        if (keyPressed && keyCode === 0) {
            beaver.hop();
        } else {
            beaver.fall();
        }
        beaver.draw();
    }
    
    //game over 
    else if (currentScene === "game over") {
        background(227, 254, 255);
        fill(0, 0, 0);
        textSize(20);
        text("GAME OVER!", 150, 50);
        image(ohnoesImage, 160, 80);
        textSize(15);
        if (beaver.score > beaver.highScore) {
            beaver.highScore = round(beaver.score);
        }
        if (beaver.score > 0) {
            finalScore = round (beaver.score);
        }
        
        beaver.score = 0;
        
        level = 1;
        
        text("Your Score: " + finalScore, 150, 220);
        text("High score: " + beaver.highScore, 150, 260);
        text("Try again?", 170, 300);
        clear();
        buttonPlay.draw(200, 350);
        buttonMenu.draw();
    }
    
    //help page
    else {
        background(227, 254, 255);
        fill(0, 0, 0);
        textSize (30);
        text("How to play", 50, 50);
        
        //draws the beaver at the center of the screen
        pushMatrix();
        beaver.y = 0;
        beaver.x = -20;
        scale(2);
        beaver.x = 80;
        beaver.y = 50;
        beaver.fall();
        beaver.draw();
        popMatrix();
        
        fill(0, 0, 0);
        textSize (15);
        text("Press space bar to hop.", 50, 220);
        text("Colect at least 50% of the sticks.", 50, 250);
        text("Avoid the obstacles by jumping.", 50, 280);
        text("ATENTION! Red sticks decreases your score.", 50, 310);
        text("Passing through holes gives extra points!", 50, 340);
        buttonPlay.draw(200, 370);
        buttonMenu.draw(325, 50);
    }
};
