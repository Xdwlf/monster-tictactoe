var squares = document.querySelectorAll(".square");
var resetButton= document.querySelector("#reset");
var modeButton= document.querySelector("#mode")
var display= document.querySelector("#display");
var counterX= document.querySelector("#countx");
var counterTie= document.querySelector("#counttie");
var counterO= document.querySelector("#counto");
var refreshCountButton= document.querySelector("#countbutton");
var winningCombination; //identifies where winning combination is located
var game = {
	winningIndex : null, //tracks position to be played that will end the game
	mode : "ai",
	status : true,
	turn: "x" //X starts
}
var winCounter = {
	x : 0,
	o : 0,
	tie : 0
}

for(i=0; i<squares.length; i++){
	squares[i].addEventListener("click",function(){
		if(checkSquare(this)){ //checks if anything in square
			if(game.status===true) playTurn(this);//checks if game is ongoing
			checkWin();
			if(checkTie()) gameTie();
			if(game.mode==="ai"&&game.status===true) aiPlay();
		}
	});
}

resetButton.addEventListener("click",function(){
	reset();
});

modeButton.addEventListener("click",function(){
	if(game.mode==="ai"){
		game.mode="human";
		modeButton.innerHTML="<i class='fas fa-user'></i> vs. <i class='far fa-user'></i>";
	}
	else if(game.mode==="human"){
		game.mode="ai";
		modeButton.innerHTML="<i class='fas fa-user'></i> vs. <i class='fas fa-robot'></i>";
	}
	reset();
});

refreshCountButton.addEventListener("click",function(){
	restartCount();
});


//BASIC GAME LOGIC

//alternates marking of squares
function playTurn(square){
	if(game.turn==="x"){
		mark(square, "x");
		if(game.mode==="human"){
			display.textContent="O's Turn";
		}
	}
	else if(game.mode==="human"){
		if(game.turn==="o"){
		mark(square, "o");
		display.textContent="X's Turn";
	};
	}
}

//checks if existing element in square
//returns false if square already taken
//returns true if square is empty
//if second parameter is entered, returns true or false for if contains corresponding class

function checkSquare(square, mark){
	if(mark && mark==="o"){ //checks if square is marked O
		if(square.classList.contains("omarked")) return true;
		else return false;
	} else if(mark && mark ==="x"){ //checks if square is marked x
		if(square.classList.contains("xmarked")) return true;
		else return false;
	} else{ //checks if square is marked at all
		if(square.classList.contains("xmarked") || square.classList.contains("omarked")) return false;
		else return true;
	}
}

function mark(square, mark){
	if(mark ==="x"){
		square.classList.add("xmarked");
		game.turn= "o";
	} else{
		square.classList.add("omarked");
		game.turn= "x";
	}
}


//COMPUTER PLAYER LOGIC

function aiPlay(){
	var marked= false;
	var index;
	display.textContent="A.I. is Playing";
	if(almostWinTotal()==-2||almostWinTotal()==2){
		index = checkThird(game.winningIndex);
		marked=true;
	} else{
		while(!marked){//randomly chooses square and checks if marked
			index = Math.floor(Math.random()*9);
			marked = checkSquare(squares[index]);
		}
	}
	game.status=false; //prevents player from playing while ai is playing
	setTimeout(function(){ // ai plays on slight delay
		mark(squares[index], "o");
		display.textContent="Your Turn";
		game.status=true;
		checkWin();
		game.turn="x";
		if(checkTie()) gameTie();
	},600)
};



//checks if 3 in a row is about to happen
function almostWinTotal(){
	//create value for scoring if 2 Os and 1 space
	var score=0;
	var winningPositions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7],
		[2,5,8], [0,4,8], [2,4,6]];
	let i = 0;
	//if 2, then almost X win
	while(i<winningPositions.length){
		if(almostLineWin(winningPositions[i])=== -2){
			score = almostLineWin(winningPositions[i])
			break;
		} else if(almostLineWin(winningPositions[i])=== 2){
			score = almostLineWin(winningPositions[i]);
		}
		i++;
	}
	return score;
}

//checks if X 3 in a row is about to happen
function almostLineWin(arr){ //input is array with 3 position
	var score=0;
	score = valueSquare(arr[0]) + valueSquare(arr[1]) + valueSquare(arr[2]);
	if(score==2 || score == -2) game.winningIndex=[arr[0],arr[1],arr[2]];
	return score;
}

//function that checks value of square with index
//if x , returns 1
//if y, returns -1
function valueSquare(index){
	var squareValue=0;
	if(squares[index].classList.contains("xmarked")) squareValue=1;
	else if(squares[index].classList.contains("omarked")) squareValue=-1;
	return squareValue;
}

function checkThird(arrayOfIndex){
	var thirdLocation;
	arrayOfIndex.forEach(function(element){
		if(checkSquare(squares[element])) thirdLocation=element;
	})
	return thirdLocation;
}


//CHECKS IF THE GAME IS TIED

function checkTie(){//returns true if no empty squares
	var hasEmptySquare= false;
	for(i=0;i<squares.length;i++){
		if(checkSquare(squares[i])) hasEmptySquare = true;
	}
	return !hasEmptySquare;
};

function gameTie(){
	game.status=false;
	winCounter.tie++;
	updateCount();
	display.textContent ="It's a Tie!";
}


//CHECKS IF ANYONE HAS WON

//Checks if someone has won the game and handles logic for how to proceed
function checkWin(){
	if(checkBoardWin("x")===true&&game.status===true){
		winCounter.x++;
		if(game.mode=== "human") display.textContent ="X Wins!";
		else display.textContent ="You Win!";
		game.status= false;
	}else if(checkBoardWin("o")===true&&game.status===true){
		winCounter.o++;
		if(game.mode=== "human") display.textContent ="O Wins!"
		else display.textContent ="You Lose!";
		game.status= false;
	};
	updateCount();
}

//checks if O or X wins anywhere on board
function checkBoardWin(mark){
	if(checkLineWin([0,1,2], mark)||checkLineWin([3,4,5], mark)||
		checkLineWin([6,7,8], mark)||checkLineWin([0,3,6], mark)||
		checkLineWin([1,4,7], mark)||checkLineWin([2,5,8], mark)||
		checkLineWin([0,4,8], mark)||checkLineWin([2,4,6], mark) ===true){
		return true;
	};
	return false;
}

//input is an array of square positions and a mark
//checks if the class corresponding to the mark exists in all 3 locations
function checkLineWin(arr, mark){ // mark input must be "o" or "x"
	var [a,b,c] = arr;
	if( checkSquare(squares[a], mark) && checkSquare(squares[b], mark) && checkSquare(squares[c], mark)){
		winningCombination=[a,b,c];
		return true;
	} else return false;
} //returns true or false

//RESETS BOARD

function reset(){
	for(i=0; i<squares.length; i++){
		squares[i].classList.remove("xmarked");
		squares[i].classList.remove("omarked");
	};
	game.status=true;
	game.turn ="x";
	display.textContent="";
};


//UPDATES WIN COUNTER

function updateCount(){
	counterX.textContent= winCounter.x;
	counterTie.textContent= winCounter.tie;
	counterO.textContent= winCounter.o;
}

function restartCount(){
	winCounter.x = 0;
	winCounter.o = 0;
	winCounter.tie = 0;
	updateCount();
}
