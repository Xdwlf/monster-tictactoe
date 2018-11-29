var squares = document.querySelectorAll(".square");
var resetButton= document.querySelector("#reset");
var modeButton= document.querySelector("#mode")
var winningSpaces=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var display= document.querySelector("#display");
var counterX= document.querySelector("#countx");
var counterTie= document.querySelector("#counttie");
var counterO= document.querySelector("#counto");
var refreshCountButton= document.querySelector("#countbutton");
var turn = "x"; //X starts
var winningIndex; //identifies position to be played that will end the game
var gameMode="ai";
var gameStatus= true;
var winningCombination; //identifies where winning combination is located
var xWinNum=0;
var oWinNum=0;
var tieNum=0;

for(i=0; i<squares.length; i++){
	squares[i].addEventListener("click",function(){
		if(checkSquare(this)){ //checks if anything in square
			if(gameStatus===true){ //checks if game is ongoing
			markSquare(this);};
			checkWin();
			if(checkTie()){
				gameStatus=false;
				tieNum++;
				updateCount();
				display.textContent ="It's a Tie!";
			}
			if(gameMode==="ai"&&gameStatus===true){
				aiPlay();
			}

		}
	});
}

resetButton.addEventListener("click",function(){
	reset();
});

modeButton.addEventListener("click",function(){
	if(gameMode==="ai"){
		gameMode="human";
		modeButton.innerHTML="<i class='fas fa-user'></i> vs. <i class='far fa-user'></i>";
	}
	else if(gameMode==="human"){
		gameMode="ai";
		modeButton.innerHTML="<i class='fas fa-user'></i> vs. <i class='fas fa-robot'></i>";
	}
	reset();

});

refreshCountButton.addEventListener("click",function(){
	restartCount();
});
//alternates marking of squares

function markSquare(square){
	if(turn==="x"){
		markX(square);
		if(gameMode==="human"){
			display.textContent="O's Turn";
		}
	}
	else if(gameMode==="human"){
		if(turn==="o"){
		markO(square);
		display.textContent="X's Turn";
	};
	}
}

function markX(square){
	square.classList.add("xmarked");
	turn= "o";
}

function markO(square){
	square.classList.add("omarked");
	turn= "x";
}
//checks if existing element in square
//returns false if square already taken
//returns true if square is empty
function checkSquare(square){
	if(square.classList.contains("xmarked") || 
		square.classList.contains("omarked")){
		return false;
	}
	else{
		return true;
	}
}

//resets entire page
function reset(){
	for(i=0; i<squares.length; i++){
		squares[i].classList.remove("xmarked");
		squares[i].classList.remove("omarked");
	};
	gameStatus=true;
	turn ="x";
	display.textContent="";
};

//checks if someone has won the game
//012,345,678
//036,147,258
//048,246
function checkWin(){
	if(checkXWinTotal()===true&&gameStatus===true){
		xWinNum++;
		console.log("in checkXWintotal");
		if(gameMode=== "human"){
			display.textContent ="X Wins!";
		}
		else{
			display.textContent ="You Win!";
		}
		gameStatus= false;
	}else if(checkOWinTotal()===true&&gameStatus===true){
		oWinNum++;
		console.log("in checkOWintotal");
		if(gameMode=== "human"){
			display.textContent ="O Wins!";
		}
		else{
			display.textContent ="You Lose!";
		}
		gameStatus= false;
	};
	updateCount();
}
//checks if X wins anywhere on page
function checkXWinTotal(){
	var win=false;

	if(checkXWin(0,1,2)||checkXWin(3,4,5)||
		checkXWin(6,7,8)||checkXWin(0,3,6)||
		checkXWin(1,4,7)||checkXWin(2,5,8)||
		checkXWin(0,4,8)||checkXWin(2,4,6) ===true){
		return win=true;
	};
	return win;
}

//checks if O wins anywhere on page
function checkOWinTotal(){
	var win=false;

	if(checkOWin(0,1,2)||checkOWin(3,4,5)||
		checkOWin(6,7,8)||checkOWin(0,3,6)||
		checkOWin(1,4,7)||checkOWin(2,5,8)||
		checkOWin(0,4,8)||checkOWin(2,4,6) ===true){
		return win=true;
	};

	return win;

}
function checkXWin(a,b,c){
	if(checkX(squares[a])&&checkX(squares[b])&&checkX(squares[c])){
		winningCombination=[a,b,c];
		return true;
	}
	else{
		return false;
	}
}

function checkOWin(a,b,c){
	if(checkO(squares[a])&&checkO(squares[b])&&checkO(squares[c])){
		winningCombination=[a,b,c];
		return true;
	}
	else{
		return false;
	}
}

function checkX(square){
	if(square.classList.contains("xmarked")){
 		return true;
 	}
	else{
	return false;
}};

function checkO(square){
	if(square.classList.contains("omarked")){
 		return true;
 	}
	else{
	return false;
}};

//create AI for AI Mode
//create array of unchosen squares

function aiPlay(){
	var marked= false;
	var index;
	display.textContent="A.I. is Playing";
	if(almostWinTotal()==-2||almostWinTotal()==2){
		gameStatus=false;
		setTimeout(function(){
			markO(squares[checkThird(winningIndex)]);
			gameStatus=true;
			display.textContent="Your Turn";
			turn="x";
			checkWin();
			if(checkTie()){
				gameStatus=false;
				tieNum++;
				updateCount();
				display.textContent ="It's a Tie!";
			};
		},600);
		marked=true;
	}
	else{
		while(!marked){//randomly chooses component and checks if marked
			index = Math.floor(Math.random()*9);
			marked = checkSquare(squares[index]);
		}
		gameStatus=false;
		setTimeout(function(){
			markO(squares[index]); 
			display.textContent="Your Turn";
			gameStatus=true;
			checkWin();
			turn="x";
			if(checkTie()){
				gameStatus=false;
				tieNum++;
				updateCount();
				display.textContent ="It's a Tie!";
			};
		},600);
	}};
//checks if 3 in a row is about to happen
function almostWinTotal(){
	//create value for scoring if 2 Os and 1 space
	var score=0;
	//Os = -1
	//Xs = 1
	//blanks = 0
	//if 2, then almost X win

	if(almostOWin(0,1,2)  || almostOWin(3,4,5)||
		almostOWin(6,7,8) || almostOWin(0,3,6)||
		almostOWin(1,4,7) || almostOWin(2,5,8)||
		almostOWin(0,4,8) || almostOWin(2,4,6) == true){
		score=-2;
	}
	else if(almostXWin(0,1,2)  || almostXWin(3,4,5)||
		almostXWin(6,7,8) || almostXWin(0,3,6)||
		almostXWin(1,4,7) || almostXWin(2,5,8)||
		almostXWin(0,4,8) || almostXWin(2,4,6) == true){
		score=2;
	};
	return score; //returns -2 if O wins and 2 if X wins
}


//checks if X 3 in a row is about to happen
function almostXWin(index1,index2,index3){
	var score=0;
	score = valueSquare(index1) + valueSquare(index2) +
		valueSquare(index3);
	if(score==2){
		winningIndex=[index1,index2,index3];
		return true;
	}
	return 0;
}

//checks if Y 3 in a row is about to happen
function almostOWin(index1,index2,index3){
	var score=0;
	score = valueSquare(index1) + valueSquare(index2) +
		valueSquare(index3);
	if(score==-2){
		winningIndex=[index1,index2,index3];
		return true;
	}
	return false;
}


//function that checks value of square with index
function valueSquare(index){
	var squareValue=0;
	if(squares[index].classList.contains("xmarked")){
 		squareValue=1;
 	}
	else if(squares[index].classList.contains("omarked")){
		squareValue=-1;
	}
	return squareValue;
}

function checkThird(arrayOfIndex){
	var thirdLocation;
	arrayOfIndex.forEach(function(element){
		if(checkSquare(squares[element])){
			thirdLocation=element;
		}
	})
	return thirdLocation;
}

function checkTie(){//returns true if no empty squares
	var hasEmptySquare= false;
	for(i=0;i<squares.length;i++){
		if(checkSquare(squares[i])){
			hasEmptySquare = true;
		}
	}
	return !hasEmptySquare;
};

function updateCount(){
	counterX.textContent=xWinNum;
	counterTie.textContent=tieNum;
	counterO.textContent=oWinNum;
}

function restartCount(){
	xWinNum=0;
	tieNum=0;
	oWinNum=0;
	updateCount();
}