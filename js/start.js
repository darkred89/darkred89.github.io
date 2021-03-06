// Global object to store our game parameters
var BeeLaga = {
    velocity: 10,
    gravity: 5,
    nextPresentTimeout: 100,
    finalWaveTImeout: 300,
    maxPresents: 20,
    tilesize: 100
    
};

//Presents region-----------
var nextPresentTimeout;
var activeIndexes = [0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,0,0];
var collidedIndex;
var present;
var finalPresents;
//--------------------------

//Controls------------------
var keys;
var seven;
//--------------------------

//UI------------------------
var leftArrow;
var rightArrow;
var unpressedArrowOpacity=0.1;
var pressedArrowOpacity=0.3;
//TEXTS
var helloText;
var gameOverText;
var scoreText;
var helloBanner;
var label='GIFTS:'
var codeText;
var codeUnderline;
var codeUnderlineBlinkTime=20;

//to get android keyboard
var input;
var inputTextbox; //in Html

var button;

//var inputLabel;
//var inputTexbox;

//--------------------------

//Player--------------------
var dude;
var eyes;
var blinkInterval=200;
var nextBlinkTime=blinkInterval;
var blinkCounter=0;
//--------------------------

//Graphics------------------
var emitter;
var front_emitter;
//--------------------------

//Settings------------------
var language="ru";
var collidePadding=70;
var gameOver=0;
var totalScore=0;
var scoreIncrease=50;
//colors
var beelineOrange='#ffb612';
var beelineDarkGrey='#665546';

var debug=false;
//-------------------------

//GameVars-----------------
//Game state
var gameState=0;
//States:
var startGame=0;
var processGame=1;
var endGame=2;
var finalRound=3;

var firstStart=true;
var focused=false;
var pixelLoaded=false;
//----------------------------

// Create a new Phaser game object with a single state that has 3 functions
var gameWidth=1000;
var game = new Phaser.Game(gameWidth, 500, Phaser.AUTO, 'area', {
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
    game.load.crossOrigin = 'anonymous'; // game.load object that needs to be set to the string "anonymous" if you’re loading assets from another server
    //var resLoadUrl="https://darkred89.github.io/BeeLaga/";
    
    game.load.spritesheet('dude','img/dudeanim.png', 100, 100);
    game.load.image('eyes','img/dudeEyes.png');
    
    game.load.image('present','img/present.png');
    game.load.image('leftArrow','img/leftArrow.png');
    game.load.image('rightArrow','img/rightArrow.png');
    
    game.load.image('star','img/star.png');
    
    game.load.image('button', 'img/button.png');
}

// Called after preload
function create() {
    
    button = game.add.button(game.world.centerX-195, game.world.centerY, 'button', actionOnClick, this, 2, 1, 0);
    
    button.onInputOver.add(over, this);
    button.onInputOut.add(out, this);
    button.onInputUp.add(up, this);
    
    button.alpha=0;
    button.scale.setTo(2, 2);
    
    //console.log(this.data("lang")); 
    //var place = eval(("settings").attr('data-lang'));
    var element = document.getElementById("settings");
    if(element==null) console.log("Can't find object with settings id");
    else  {
        language=element.getAttribute("lang");
     if(debug) console.log("Language: "+language);   
    }
    
    /* //-old code. Used to get code from inputbox in html
    inputTextbox=document.getElementById("code");
    if(inputTextbox==null) console.log("Can't find object with code id");
    else  {
        if(debug) console.log(inputTextbox.value);
    }
    */
    
    //game.stage.backgroundColor = rgb(68, 136, 170);
    //	Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
    front_emitter = game.add.emitter(game.world.centerX, -32, 50);
    front_emitter.makeParticles('star');
    front_emitter.maxParticleScale = 1;
    front_emitter.minParticleScale = 0.4;
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
    
    
   // input = document.createElement("input");
   // input.type = "text";
   // input.style.cssText = "position:absolute;  boundsAlignH: center; top: 150px; width:200px; height:40px; opacity:0; font-size:44px ";
   // document.body.appendChild(input);
    
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
    //seven= game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
    
    
    
 
    /*
     seven.onDown.add(function(){
        PrintSeven();
    })
    */
    
    //SetLabelTexts();
    
   // input.focus();
   // game.input.onDown.add(function(){InputFocus();});
   
    game.stage.backgroundColor = 0x000000;
    
    
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
   // game.stage.backgroundColor = 0x000000;
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
    //Check for endGame
    if(!(eyes.alpha==0 && gameState==endGame)) {
    
    eyes.alpha=Math.abs(eyes.alpha-1);
    if(eyes.alpha==0){
        blinkCounter=0;
        nextBlinkTime=blinkInterval+getRandomInt(-150,200);
    }
    }
}

var codeUnderlineCounter=0;
function BlinkInputLabel(){
    /*
    codeUnderlineCounter++;
    if(codeUnderlineCounter<codeUnderlineBlinkTime) return;
    
    codeUnderlineCounter=0;
    
    switch (codeText.text.length){
        case 0:
            if(codeUnderline.text=='___'){
                codeUnderline.text="-__";
            }
            else{
                codeUnderline.text="___";
            }
           
            break;
        case 1:
            if(codeUnderline.text=='___'){
                codeUnderline.text="_-_";
            }
            else{
                codeUnderline.text="___";
            }
            break;
         case 2:
            if(codeUnderline.text=='___'){
                codeUnderline.text="__-";
            }
            else{
                codeUnderline.text="___";
            }
            break;
        default:
            codeUnderline.text="___";
            break;
    }
    */
}
//funct eyes to follow the body
//TODO make them a GROUP
function EyesFollow(){
    eyes.x=dude.x;
    eyes.y=dude.y;
}

//update texts
function SetLabelTexts(){
    
        gameOverText = game.add.text(0, 130, '', { 
        fontSize: '64px', 
        fill: '#FFFFFF',
         font: 'Pixel',
         align: "center",
        boundsAlignH: "center"
    });
    gameOverText.alpha=0;
    if(language=="kg"){
        
    }
    
    codeText = game.add.text(425, 240, '', { 
        fontSize: '84px', 
        fill: '#FFFFFF',
         font: 'Pixel',
       // boundsAlignH: "center"
    });
     //codeText.setTextBounds(0, 0, 1000, 100);
    
    
    codeUnderline = game.add.text(0, 190, '', { 
        fontSize: '64px', 
        fill: '#FFFFFF',
         font: 'Pixel',
        boundsAlignH: "center"
    });
     
    
    helloBanner=game.add.text(0, 100, '', { 
        fontSize: '32px', 
        fill: '#FFFFFF',
        font: 'Pixel',
        boundsAlignH: "center",
        align: "center"
    });
   
    
    if(language=='kg'){
        helloBanner.text='Белектен кача албайсын!\n777ни тер';
        gameOverText.text='Белектен кача\nалбайсын!';
    }
    else{
        gameOverText.text='От подарка\nне убежишь!';
        helloBanner.text='От подарка не убежишь!\nНажмите 777';
    }
    //codeUnderline.text="___";
    helloBanner.cssFont='52px Pixel';
    gameOverText.cssFont='84px Pixel';
    
    codeUnderline.setTextBounds(0, 0, gameWidth, 100);
    helloBanner.setTextBounds(0, 0, gameWidth, 100);
    gameOverText.setTextBounds(0, 0, gameWidth, 100);
    
    firstStart=false;
}
//Game Processes
function StartGame(){
    lockDude();
     dude.animations.play('up');
    
    if(firstStart && Delay(10) && pixelLoaded){
        SetLabelTexts();
         button.alpha=1;
    }
    //Update texts
   //SetLabelTexts();
    if(!firstStart){
    //inputTextbox.disabled=false;
    
    
   
    
    //if(input.value!='') gameOverText.text=input.value;
    
   // input.value=input.value.slice(0,3);
    //input.value=inputTextbox.value.slice(0,3);
    //codeText.text=input.value;
    if(focused){
           InputFocus();
       
    }
    
    BlinkInputLabel(); 
    
    if(codeText.text=='777'){
       
        //focused=false;
        if(Delay(30)){ 
        //inputTextbox.value='';
        //inputTextbox.disabled=true;
        //input.value='';
        //input.disabled='disabled';
        codeText.text='';
        codeUnderline.text="";
        //helloBanner.text='';
        helloBanner.alpha=0;
        gameState=processGame;
        StartWithLevel(3);   
        scoreText.text='';        
        front_emitter.on=true;
        
            if(debug) console.log("GameStarted");
            
        nextPresentTimeout=BeeLaga.nextPresentTimeout;
        }
    }
    }
}

function ProcessGame(){
     //Next Level Logic
    counter++;
    if(counter>=nextPresentTimeout+getRandomInt(0,100)){
         counter=0;
        //SetRandomPos(levelCounter);
       // activeIndexes[levelCounter]=1;
       
        if(levelCounter<BeeLaga.maxPresents){
            //helloText.text=levelCounter;
            
             ActivatePresent(levelCounter);
            levelCounter++;
            if(levelCounter==BeeLaga.maxPresents-1) {
                nextPresentTimeout+=BeeLaga.finalWaveTImeout+getRandomInt(-100,200);
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
        gameState=startGame;
        gameOver=0;       
       
        //codeUnderline.text="___";
        //helloBanner.text='Введите 777 для начала игры:';
        helloBanner.alpha=1;
        //input.disabled='';
        totalScore=0;
        
        for(var i=0; i<BeeLaga.maxPresents+10; i++){
        MoveAway(present[i]);
        activeIndexes[i]=0;
        
        }
        firstStart=false;    
        levelCounter=0;
        //gameOverText.text='';
        gameOverText.alpha=0;
        //input.focus();
        focused=false;
        button.alpha=1;
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
        if(element==null) console.log("Can't find element with focusId id");
        else element.scrollIntoView(alignWithTop);
    
}

//For smartphone input, we had to place inputbox, make it transparent
//Now we turned it off
function InputFocus(){
    //focused=true;
   // input.focus();
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
    //gameOverText.text="ОТ ПОДАРКА НЕ\r\nУБЕЖИШЬ!";
    gameOverText.alpha=1;
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
    EyesFollow();
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

function waitForWebfonts(fonts, callback) {
    var loadedFonts = 0;
    for(var i = 0, l = fonts.length; i < l; ++i) {
        (function(font) {
            var node = document.createElement('span');
            // Characters that vary significantly among different fonts
            node.innerHTML = 'giItT1WQy@!-/#';
            // Visible - so we can measure it - but not on the screen
            node.style.position      = 'absolute';
            node.style.left          = '-10000px';
            node.style.top           = '-10000px';
            // Large font size makes even subtle changes obvious
            node.style.fontSize      = '300px';
            // Reset any font properties
            node.style.fontFamily    = 'sans-serif';
            node.style.fontVariant   = 'normal';
            node.style.fontStyle     = 'normal';
            node.style.fontWeight    = 'normal';
            node.style.letterSpacing = '0';
            document.body.appendChild(node);

            // Remember width with no applied web font
            var width = node.offsetWidth;

            node.style.fontFamily = font;

            var interval;
            function checkFont() {
                // Compare current width with original width
                if(node && node.offsetWidth != width) {
                    ++loadedFonts;
                    node.parentNode.removeChild(node);
                    node = null;
                }

                // If all fonts have been loaded
                if(loadedFonts >= fonts.length) {
                    if(interval) {
                        clearInterval(interval);
                    }
                    if(loadedFonts == fonts.length) {
                        callback();
                        return true;
                    }
                }
            };

            if(!checkFont()) {
                interval = setInterval(checkFont, 50);
            }
        })(fonts[i]);
    }
};

waitForWebfonts(['Pixel'], function() {
    // Will be called as soon as ALL specified fonts are available
    console.log("Pixel has been loaded");
    pixelLoaded=true;
});

function actionOnClick () {

    if(debug) console.log("Clicked");
    
    if(!firstStart && gameState==startGame){
        codeText.text='777';
        button.alpha=0;
    }
}

function up() {
  if(debug) console.log('button up', arguments);
}

function over() {
   if(debug) console.log('button over');
}

function out() {
 if(debug)  console.log('button out');
}