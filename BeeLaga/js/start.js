// Global object to store our game parameters
var BeeLaga = {
    velocity: 10,
    gravity: 5,
    nextPresentTimeout: 150,
    maxPresents: 20,
    tilesize: 100
    
};

var activeIndexes = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var collidedIndex;
var present;
var keys;
var seven;
var dude;

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
var firstStart=true;

//colors
var beelineOrange='#ffb612';
var beelineDarkGrey='#665546';

// Create a new Phaser game object with a single state that has 3 functions
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'area', {
    preload: preload,
    create: create,
    update: update
});

 
// Called first
function preload() {
    // Load our image assets
    //game.load.image('dude', 'img/dude.png');
    game.load.spritesheet('dude', 'img/dudeanim.png', 100, 100);
    game.load.image('present','img/present.png')
}


 
// Called after preload
function create() {
    
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
    
   
    
     helloText = game.add.text(5, 5, '', { 
        fontSize: '62px', 
        fill: beelineOrange,
         font: 'Pixel'
    });
    scoreText = game.add.text(700, 5, '', { 
        fontSize: '32px', 
        fill: beelineOrange,
         font: 'Pixel'
    });
    
    
   
    present=[CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent(),CreatePresent()];
    
    for(var i=0; i<BeeLaga.maxPresents; i++){
       MoveAway(present[i]);
    }
    
    
    //SetCentrPosition(present);
    
    
    // Add the dude to the middle of the game area
    dude = game.add.sprite(game.world.centerX, game.world.centerY+game.height/2, 'dude');
    dude.anchor.set(0.5, 0.5);  
    dude.animations.add('up',[1],0,false);
    dude.animations.add('down',[0],0,false);
    dude.animations.add('left',[2],0,false);
    dude.animations.add('right',[3],0,false);
    dude.animations.add('joy',[0,1],10,false);
    dude.animations.add('death',[0,1,0,1],15,true);
    
    // Add key input to the game
    keys = game.input.keyboard.createCursorKeys();
    seven= game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
    
    
    
     gameOverText = game.add.text(200, 200, '', { 
        fontSize: '64px', 
        fill: beelineOrange,
         font: 'Pixel'
    });
    
    
    helloBanner=game.add.text(220, 100, 'Введите 777 для начала игры:', { 
        fontSize: '32px', 
        fill: beelineOrange,
         font: 'Pixel'
    });
    
    
     seven.onDown.add(function(){
        PrintSeven();
    })
    
    
    input.focus();
    game.input.onDown.add(function(){InputFocus();});
    
}


 
var counter=0;
var levelCounter= 1;

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
            
                    }
       
    
}

//Game Processes

function StartGame(){
    
   
    
    dude.animations.play('up');
    lockDude();
    
    
    //if(input.value!='') gameOverText.text=input.value;
    gameOverText.text=input.value;
    
    
    if(gameOverText.text=='777'){
        if(Delay(30)){
            
            input.value='';
            input.disabled='disabled';
        gameOverText.text='';
        helloBanner.text='';
        gameState=processGame;
        ActivatePresent(0);
        }
    }
    
}

function ProcessGame(){
     //Next Level Logic
    counter++;
    if(counter>=BeeLaga.nextPresentTimeout){
         counter=0;
        //ActivatePresent(0); // - НЕ ПАШЕТ
        SetRandomPos(levelCounter);
        activeIndexes[levelCounter]=1;
        if(levelCounter<BeeLaga.maxPresents){
            //helloText.text=levelCounter;
            levelCounter++;
        }      
    }
    
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
        helloBanner.text='Ввеедите 777 для начала игры:';
        input.disabled='';
        totalScore=0;
        scoreText.text='';
        for(var i=0; i<BeeLaga.maxPresents; i++){
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

function Focus(){
     var element = document.getElementById("focusId");
        alignWithTop = true;
        //helloBanner.text=element.value;
        element.scrollIntoView(alignWithTop);
}
function InputFocus(){
    input.focus();
}

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

function SetCentrPosition(object){
    object.x=game.world.centerX;
    object.y=100;
}

function SetRandomPos(object){
    object.x= getRandomInt(0,10)*BeeLaga.tilesize+BeeLaga.tilesize/2;
    object.y= -100-getRandomInt(20, 1000);
}

function MoveAway(object){
    object.x= -100;
    object.y=-100;
}
//-----------------------

//Двигает активные подарки
function MovePresents(){
    for(var i=0; i<BeeLaga.maxPresents; i++){
        if(activeIndexes[i]===1){
            present[i].y+=BeeLaga.gravity;
            CollisionCheck(i);
            if( present[i].y>game.height+100){
                SetRandomPos(present[i]);
                PresentFallCallback();
            }
        }
    } 
}

function MoveLeft(){
    dude.x -= BeeLaga.velocity;
        dude.animations.play('left');
}

function MoveRight(){
    dude.x += BeeLaga.velocity;
        dude.animations.play('right');
}

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
    
    
    gameState=endGame;
}

// Возвращает случайное целое число между min (включительно) и max (не включая max)
// Использование метода Math.round() даст вам неравномерное распределение!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function PresentFallCallback(){
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

var delay=0;
function Delay(ticks){
    delay++;
    if(delay>=ticks){
        delay=0;
        return true;
    }
    return false;
}

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