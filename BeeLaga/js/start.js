// Global object to store our game parameters
var BeeLaga = {
    velocity: 10,
    gravity: 5,
    nextPresentTimeout: 100,
    finalWaveTImeout: 300,
    maxPresents: 20,
    tilesize: 100
    
};

var activeIndexes = [0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0];
var collidedIndex;
var present;
var finalPresents;
var keys;
var seven;
var dude;
var eyes;
var blinkInterval=200;
var nextBlinkTime=blinkInterval;
var blinkCounter=0;
var leftArrow;
var rightArrow;
var unpressedArrowOpacity=0.1;
var pressedArrowOpacity=0.3;

var emitter;
var front_emitter;

var helloText;

var inputLabel;
var inputTexbox;

//to get android keyboard
var input;

var gameOverText;
var scoreText;
var helloBanner;
var label='GIFTS:'

var collidePadding=70;
var gameOver=0;

var totalScore=0;
var scoreIncrease=50;

//Game state
var gameState=0;
//States:
var startGame=0;
var processGame=1;
var endGame=2;
var finalRound=3;
var firstStart=true;

//colors
var beelineOrange='#ffb612';
var beelineDarkGrey='#665546';

var debug=false;

// Create a new Phaser game object with a single state that has 3 functions
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'area', {
    preload: preload,
    create: create,
    update: update
});

//Just testing callbacks
function onFocus(){
    if(debug) console.log("Focus");
}

// Called first
function preload() {
    // Load our image assets
    //game.load.image('dude', 'img/dude.png');
    game.load.spritesheet('dude', 'img/dudeanim.png', 100, 100);
    game.load.image('eyes','img/dudeEyes.png');
    
    game.load.image('present','img/present.png');
    game.load.image('leftArrow','img/leftArrow.png');
    game.load.image('rightArrow','img/rightArrow.png');
    
     game.load.image('star','img/star.png');
}

// Called after preload
function create() {
    
    //	Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
    front_emitter = game.add.emitter(game.world.centerX, -32, 50);
    front_emitter.makeParticles('star');
    front_emitter.maxParticleScale = 0.8;
    front_emitter.minParticleScale = 0.1;
    front_emitter.setYSpeed(500,500);
    front_emitter.setXSpeed(0,0);
    front_emitter.gravity = 0;
    front_emitter.width = game.world.width * 1.5;
   front_emitter.minRotation = 0;
   front_emitter.maxRotation = 0;
   
    front_emitter.start(false, 1200, 100);
    front_emitter.on=false;
    //emitter.emitX = 500;
    //game.add.tween(emitter).to( { emitX: 800 }, 2000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
    
    game.onFocus.add(onFocus, this);
    
    CreateArrows();
    
    
    input = document.createElement("input");
    input.type = "text";
    input.style.cssText = "position:absolute; left:-1px; top: -1px; width:1px; height:1px; opacity:0; font-size:24px";
    document.body.appendChild(input);
    
    // Center game canvas on page
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setShowAll();
    
    window.addEventListener('resize', function () {game.scale.refresh();});
    game.scale.refresh();
    
   // game.scale.pageAlignHorizontally = true;
 //  game.scale.pageAlignVertically = true;
  // game.scale.refresh();
    // Change background color
    game.stage.backgroundColor = '#181818';
    
   
    
     
    scoreText = game.add.text(700, 5, '', { 
        fontSize: '32px', 
        fill:'#FFFFFF',
         font: 'Pixel'
    });
    
    
   
    present=[CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),
             CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),
             CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),
             CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),
             CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),
             CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),
            ];
    
    for(var i=0; i<BeeLaga.maxPresents+10; i++){
       MoveAway(present[i]);
    }
    
    
    // Add the dude to the middle of the game area
    dude = game.add.sprite(game.world.centerX, game.world.centerY+game.height/2, 'dude');
    dude.anchor.set(0.5, 0.5);  
    dude.animations.add('up',[1],0,false);
    dude.animations.add('down',[0],0,false);
    dude.animations.add('left',[2],0,false);
    dude.animations.add('right',[3],0,false);
    dude.animations.add('joy',[0,1],10,false);
    dude.animations.add('death',[0,1,0,1],15,true);
    
    eyes=game.add.sprite(game.world.centerX, game.world.centerY+game.height/2, 'eyes');
    eyes.anchor.set(0.5, 0.5);  
    eyes.alpha=0;
    
    // Add key input to the game
    keys = game.input.keyboard.createCursorKeys();
    seven= game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
    
    
    
     gameOverText = game.add.text(230, 130, '', { 
        fontSize: '64px', 
        fill: '#FFFFFF',
         font: 'Pixel'
    });
    
    codeText = game.add.text(0, 180, '', { 
        fontSize: '64px', 
        fill: '#FFFFFF',
         font: 'Pixel',
        boundsAlignH: "center"
    });
     codeText.setTextBounds(0, 0, 1000, 100);
    
    helloBanner=game.add.text(0, 100, 'Введите 777 для начала игры:', { 
        fontSize: '32px', 
        fill: '#FFFFFF',
         font: 'Pixel',
         boundsAlignH: "center"        
    });
    helloBanner.setTextBounds(0, 0, 1000, 100);
    
     seven.onDown.add(function(){
        PrintSeven();
    })
    
    
    input.focus();
    game.input.onDown.add(function(){InputFocus();});
    
}

//Create graphical arrows, which lights when it is movement
function CreateArrows(){
     
    leftArrow=game.add.sprite(0, game.world.height, 'leftArrow');
    leftArrow.anchor.set(0.5, 0.5);
    leftArrow.x+=leftArrow.width/2;
    leftArrow.y-=leftArrow.height/2;
    leftArrow.alpha=unpressedArrowOpacity;
    
    rightArrow=game.add.sprite(game.world.width, game.world.height, 'rightArrow');
    rightArrow.anchor.set(0.5, 0.5);
    rightArrow.x-=leftArrow.width/2;
    rightArrow.y-=leftArrow.height/2;
    rightArrow.alpha=unpressedArrowOpacity;
}

var counter=0;
var levelCounter= 0;

// Called once every frame, ideally 60 times per second
function update() {
    
    /*
    if(gameOver>0) {
        dude.animations.play('death');
        return;       
    }
    */
    switch(gameState){
        case startGame:
            StartGame();
            break;
        case processGame:
            ProcessGame();
            break;
            
        case endGame:
            EndGame();
            break;
        case finalRound:
            FinalRound()
            break;
            
                    }
       
    blinkCounter++;
    
    if(blinkCounter>=nextBlinkTime){
        nextBlinkTime+=10;
        Blink();
    }
    
    
}

//Blinks with his eyes by timer
function Blink(){
    eyes.alpha=Math.abs(eyes.alpha-1);
    if(eyes.alpha==0){
        blinkCounter=0;
        nextBlinkTime=blinkInterval+getRandomInt(-100,200);
    }
}
//funct eyes to follow the body
//TODO make them a GROUP
function EyesFollow(){
    eyes.x=dude.x;
    eyes.y=dude.y;
}

//Game Processes
function StartGame(){
    
   
    
    dude.animations.play('up');
    lockDude();
    
    
    //if(input.value!='') gameOverText.text=input.value;
    codeText.text=input.value;
    
    
    if(codeText.text=='777'){
        if(Delay(30)){
            
            input.value='';
            input.disabled='disabled';
        codeText.text='';
        helloBanner.text='';
        gameState=processGame;
        StartWithLevel(3);
            
        scoreText.text='';
            
        front_emitter.on=true;
        }
    }
    
}

function ProcessGame(){
     //Next Level Logic
    counter++;
    if(counter>=BeeLaga.nextPresentTimeout+getRandomInt(0,100)){
         counter=0;
        //SetRandomPos(levelCounter);
       // activeIndexes[levelCounter]=1;
       
        if(levelCounter<BeeLaga.maxPresents){
            //helloText.text=levelCounter;
            levelCounter++;
             ActivatePresent(levelCounter);
            if(levelCounter==BeeLaga.maxPresents-1) {
                BeeLaga.nextPresentTimeout+=BeeLaga.finalWaveTImeout+getRandomInt(-100,200);
            }
        }
        else{
            AllighPresentsForFinalWave();
            gameState=finalRound;
            RemoveUpperPresents();
        }
    }
    rightArrow.alpha=unpressedArrowOpacity;
    leftArrow.alpha=unpressedArrowOpacity;
    MovePresents();
    
    GetKeyboarControls();
    GetTouchControl();
    lockDude();
}

function FinalRound(){
    rightArrow.alpha=unpressedArrowOpacity;
    leftArrow.alpha=unpressedArrowOpacity;
    
    MovePresents();
    
    GetKeyboarControls();
    GetTouchControl();
    lockDude();
}

function EndGame(){
   
    dude.animations.play('death');
    
    if(AnimateGameOver())
    {
           
        gameOver=0;       
        gameState=startGame;
        helloBanner.text='Введите 777 для начала игры:';
        input.disabled='';
        totalScore=0;
        
        for(var i=0; i<BeeLaga.maxPresents+10; i++){
        MoveAway(present[i]);
        activeIndexes[i]=0;
        
        }
        firstStart=false;    
        levelCounter=0;
        gameOverText.text='';
        //input.focus();
        Focus();
    }
}

//REmoves active presents for final wave, which are not on screen right now
function RemoveUpperPresents(){
    for(var i=0; i<BeeLaga.maxPresents;i++){
        if(present[i].y<0) activeIndexes[i]=0;
    }
}

//Sets starting level
function StartWithLevel(levelIndex){
    for(var i=0; i<levelIndex;i++){
        ActivatePresent(i);
        //SetRandomPos(i);
    }
    levelCounter=levelIndex;
}

//Focus on the specific document <div>
function Focus(){
     var element = document.getElementById("focusId");
        alignWithTop = true;
        //helloBanner.text=element.value;
        element.scrollIntoView(alignWithTop);
}
//For smartphone input, we had to place inputbox, make it transparent
function InputFocus(){
    input.focus();
}

//Old function, was  before inputbox
function PrintSeven(){
    
    //Changed logic to input focus
    if(gameState==startGame){
        input.value+='7';
    }
    
    //InputFocus();
}

//Input and controls
function GetKeyboarControls(){
    // Poll the arrow keys to move the ball
    if (keys.left.isDown) {
        MoveLeft();
    }
    if (keys.right.isDown) {
        MoveRight();
    }
    /*
    if (this.keys.up.isDown) {
        this.ball.y -= BallWorld.velocity;
    }
    if (this.keys.down.isDown) {
        this.ball.y += BallWorld.velocity;
    }
    */
}
function GetTouchControl(){
    var RIGHT = 1, LEFT = 0;
    if (game.input.pointer1.isDown){          
        if (Math.floor(game.input.x/(game.width/2)) === LEFT) {      //  Move to the left 
            MoveLeft();
        }  
        if (Math.floor(game.input.x/(game.width/2)) === RIGHT) {      //  Move to the  right
            MoveRight();   
        }    
    }
}
//prevent dude from getting out of the borders
function lockDude(){
    // Prevent dude from escaping outside the stage's boundaries
    var halfWidth = dude.width / 2;
    var halfHeight = dude.height / 2;
    if ((dude.x - halfWidth) < 0) {
        dude.x = halfWidth;
    }
    if ((dude.x + halfWidth) > game.width) {
        dude.x = game.width - halfWidth;
    }
    if ((dude.y - halfHeight) < 0) {
        dude.y = halfHeight;
    }
    if ((dude.y + halfHeight) > game.height) {
        dude.y = game.height - halfHeight;
    } 
    EyesFollow();
}

// Present stuff---------
function ActivatePresent(i){
    SetRandomPos(present[i]);
    activeIndexes[i]=1;
}

function  CreatePresent(){
    var object;
    object=game.add.sprite(0, 0, 'present');
    object.anchor.set(0.5, 0.5);
    return object;
}

function SetRandomPos(object){
    object.x= getRandomInt(0,10)*BeeLaga.tilesize+BeeLaga.tilesize/2;
    object.y= -100-getRandomInt(20, 1000);
}

function AllighPresentsForFinalWave(){
    for(var i=BeeLaga.maxPresents; i<BeeLaga.maxPresents+10; i++){
        present[i].x=(i-BeeLaga.maxPresents)*BeeLaga.tilesize+BeeLaga.tilesize/2;
        present[i].y= -100;
        activeIndexes[i]=1;
    }
}

function MoveAway(object){
    object.x=0;
    object.y=-200;
}

//-----------------------

function SetCentrPosition(object){
    object.x=game.world.centerX;
    object.y=100;
}

//Двигает активные подарки
function MovePresents(){
    for(var i=0; i<BeeLaga.maxPresents+10; i++){
        if(activeIndexes[i]==1){
            present[i].y+=BeeLaga.gravity;
            CollisionCheck(i);
            if( present[i].y>game.height+100){
               if(debug) console.log("Index "+i);
                MoveAway(present[i]);
                PresentFallCallback(i);
            }
        }
    } 
}

//Our movement
function MoveLeft(){
    dude.x -= BeeLaga.velocity;
    dude.animations.play('left');
    leftArrow.alpha=pressedArrowOpacity;
    EyesFollow();
}
function MoveRight(){
    dude.x += BeeLaga.velocity;
    dude.animations.play('right');
    rightArrow.alpha=pressedArrowOpacity;
    EyesFollow();
}
//
function CollisionCheck(i){
    if(Math.abs(present[i].x-dude.x)<=collidePadding && Math.abs(present[i].y-dude.y)<collidePadding){
        collidedIndex=i;
        GameOver();
    }
}

//Game mechanics
function GameOver(){
    gameOver=1;
    gameOverText.text="ОТ ПОДАРКА НЕ\r\nУБЕЖИШЬ!";
    dude.animations.play('death');
    
    front_emitter.on=false;
    gameState=endGame;
}

// Возвращает случайное целое число между min (включительно) и max (не включая max)
// Использование метода Math.round() даст вам неравномерное распределение!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Calls when present leaves canvas
function PresentFallCallback(index){
    if(gameState==processGame){
           SetRandomPos(present[index]);
    }
    else{

        activeIndexes[index]=0;
    }
    dude.animations.play('joy');
    totalScore+=scoreIncrease;
    scoreText.text=label+totalScore;
}
/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

//Returns true after delay
var delay=0;
function Delay(ticks){
    delay++;
    if(delay>=ticks){
        delay=0;
        return true;
    }
    return false;
}

//animation for GameOver
var animCounter=0;
function AnimateGameOver(){
    animCounter++;
    
    if(animCounter<200){
        var yVel=10-animCounter/5;
        dude.y-=yVel;
        
        present[collidedIndex].y-=yVel;
        return false;
    }
    else{
        animCounter=0;
        return true;
    }
}