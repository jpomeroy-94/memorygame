var memoryGame = function() {
	//--- internal methods and properties 
	this.endGame=false;
	this.noFlipCards = 24;
	this.flipCards = [];
	this.flipCardStatus = [];
	this.disableMouse=false;
	this.ctr=0;
	this.cardCheck = {
		cardWasFlipped : false,
		firstCardNo : 999
	};
	//--- 
	this.innerStartGame = function() {
		this.dataAry=serverIo.getTableData();
		this.ctr=0;
		this.innerMonitorProgress();
	};
	//---
	this.innerMonitorProgress=function(){
		if (!serverIo.ajaxIsRunning){
			this.doInnerStartGame();
		}
		else {
			this.ctr++;
			if (this.ctr<1000){
				var sessionId=setTimeout("memoryGame.monitorProgress()",1000);
			}
			else {alert ('this.ctr: '+this.ctr);}
		}
	};
	//---
	this.doInnerStartGame = function() {
		this.endGame=false;
		$('#dialogueId').text('');
		var dataAry = serverIo.retrieveData();
		var cardXrefObj={};
		var cardXrefObj2={};
		var cardSort=[];
		var cardCtr=0;
		for (var dataLp in dataAry){
			var imageName=dataAry[dataLp]['imagename'];
			//console.log('image name: '+imageName);//xxxf
			var imagePath=dataAry[dataLp]['imagepath'];
			var sortPrefix=Math.random();
			sortPrefix=Math.floor(sortPrefix*100);
			var sortImageName=sortPrefix+'_'+dataLp+'_'+imageName;
			if (cardCtr<this.noFlipCards){
				cardSort[cardSort.length]=sortImageName;
			}
			cardCtr++;
			var tst=cardXrefObj[imageName];
			if (tst == undefined){
				cardXrefObj[imageName]={lp:dataLp,imageName:imageName,imagePath:imagePath};
			}
			else {
				cardXrefObj2[imageName]={lp:dataLp,imageName:imageName,imagePath:imagePath};
			}
		}
		cardSort.sort();
		this.settings = {
			xPosBegin : 10,
			yPosBegin : 10,
			beginColPos : 0,
			yIncr : 135,
			xIncr : 110,
			maxColNo : 5,
			imageWidth : 80,
			imageHeight : 100
		};
		// plugs
		var imageClass = 'memorycard';
		var imageId = 'memorycardid';
		var theCanvasId = document.getElementById('memoryGameId');
		var theCanvasCsx = theCanvasId.getContext('2d');
		var xPosLp = this.settings.xPosBegin;
		var yPosLp = this.settings.yPosBegin;
		var colPos = this.settings.beginColPos;
		var maxColNo = this.settings.maxColNo;
		// plug
		this.cardCheck['cardsRemaining'] = this.noFlipCards;
		// setup cards
		for ( var flipCardNo = 0; flipCardNo < noFlipCards; flipCardNo++) {
			var setupFlipCard = {};
			// canvas context
			setupFlipCard['flipCardCsx'] = theCanvasCsx;
			// positioning
			setupFlipCard['xPos'] = xPosLp;
			setupFlipCard['yPos'] = yPosLp;
			if (colPos >= maxColNo) {
				xPosLp = 10;
				yPosLp += this.settings.yIncr;
				colPos = 0;
			} else {
				xPosLp += this.settings.xIncr;
				colPos++;
			}
			// back of flip card
			setupFlipCard['backOfCardPath'] = '/images/memorygame/backofcard.png';
			setupFlipCard['noCardPath']='/images/memorygame/nocard.png';
			// front of flip card
			// card name
			var useCardNameOrig=cardSort[flipCardNo];
			//console.log('names from sort: '+useCardNameOrig);
			if (useCardNameOrig != undefined){
				useCardNameAry=useCardNameOrig.split('_', 5);
				useCardName=useCardNameAry[2];
				useCardNo=useCardNameAry[1];
			}
			try {
				setupFlipCard['frontOfCardPath']=cardXrefObj[useCardName]['imagePath'];
			} catch (e){
				alert ('memorycard: '+e+', usecardname: '+useCardName+', imagepath: '+imagePath);
				}
			setupFlipCard['cardName'] = useCardName;
			setupFlipCard['cardno'] = useCardNo;
			setupFlipCard['imageId'] = imageId + flipCardNo;
			setupFlipCard['imageClass'] = imageClass;
			setupFlipCard['imageHeight'] = this.settings.imageHeight;
			setupFlipCard['imageWidth'] = this.settings.imageWidth;
			// load it in
			this.flipCards[flipCardNo] = new FlipCard(setupFlipCard);
		}
		//--- preload images
		var preLoadImages='';
		for ( var flipCardNo = 0; flipCardNo < this.noFlipCards; flipCardNo++) {
			this.flipCards[flipCardNo].doInit();
			//- get image into the cache ahead of time
			var theImagePath=this.flipCards[flipCardNo].getImagePath();
			preLoadImages+='<img src="'+theImagePath+'"></img>'
		}
		preLoadImages+='<img src="/images/memorygame/nocard.png">';
		$('#preLoadId').html(preLoadImages);
		//--- start clock running
		this.startDate=new Date();
		this.startITime=this.startDate.getTime();
		var dmy=setTimeout(function(){
			this.doClockStuffInner();
		},2000);
	};
	this.doClockStuffInner=function(){
		var currentDate = new Date();
		this.nowITime=currentDate.getTime();
		this.iTimeTaken=this.nowITime-this.startITime;
		this.iTimeTaken=Math.floor(this.iTimeTaken/1000);
		var minutes=Math.floor(this.iTimeTaken/60);
		var seconds=this.iTimeTaken-(minutes*60);
		if (minutes<10){minutes='0'+minutes;}
		if (seconds<10){seconds='0'+seconds;}
		var displayTime=minutes+':'+seconds;
		$('#clockId').text(displayTime);
		if (!this.endGame){
			var dmy=this.setTimeout("memoryGame.doClockStuff()",1000);
		}
	};
	//---
	this.innerSelectCard = function(xPos, yPos) {
		if (this.disableMouse != true){this.innerSelectCardDo(xPos,yPos);}
	};
	//---
	this.innerSelectCardDo = function(xPos, yPos){
		var xCanvasBegin = parseInt($('#memoryGameId').css('left'));
		var yCanvasBegin = parseInt($('#memoryGameId').css('top'));
		var xPosBegin = this.settings.xPosBegin;
		var yPosBegin = this.settings.yPosBegin;
		xPosBegin += xCanvasBegin;
		yPosBegin += yCanvasBegin;
		var xIncr = this.settings.xIncr;
		var yIncr = this.settings.yIncr;
		var maxColNo = this.settings.maxColNo;
		var colNo = Math.floor((xPos - xPosBegin) / xIncr);
		var rowNo = Math.floor((yPos - yPosBegin) / yIncr);
		var cardNo = (rowNo * (maxColNo + 1)) + colNo;// maxcolno is 4 but 5
														// cards per row
		//console.log('show front for first or second card no: '+cardNo);
		this.flipCards[cardNo].showFront();
		if (this.cardCheck.cardWasFlipped === false) {
			this.cardCheck.noCardsFlipped++;
			this.cardCheck.firstCardNo = cardNo;
			this.cardCheck.cardWasFlipped = true;
		} else {
			if (cardNo != this.cardCheck.firstCardNo) {
				this.cardCheck.cardWasFlipped=false;
				this.flipCards[cardNo].showFront();
				var firstName = this.flipCards[this.cardCheck.firstCardNo]
						.getCardName();
				var secondName = this.flipCards[cardNo].getCardName();
				if (firstName == secondName) {
					this.flipCards[this.cardCheck.firstCardNo].setDone();
					this.flipCards[cardNo].setDone();
					this.cardCheck.cardsRemaining -= 2;
					if (this.cardCheck.cardsRemaining <= 0) {
						this.innerExitGame();
					} else {
						$('#dialogueId').text('cards remaining: '+this.cardCheck.cardsRemaining);
						//this.innerExitGame();
					}
				} else {
					//console.log('mismatch: '+firstName+', ' + secondName);//xxxf
					this.disableMouse=true;
					var dmy=setTimeout(function (){
						this.flipCards[this.cardCheck.firstCardNo].doReset();
						this.flipCards[cardNo].doReset();
						this.disableMouse=false;
					},2000);
				}
			}
		}
		//$('#debugitid').text(
		//		'cardno: ' + cardNo + ', colno: ' + colNo + ', rowNo: ' + rowNo
		//				+ ', maxColNo: ' + maxColNo);
	};
	//---
	this.doWait=function(milliSeconds){
		var startTime = new Date().getTime();
		while (new Date().getTime() < startTime + milliSeconds); 
	};
	//---
	this.displayMsg=function(theMsg){
		$('#debugitid').text(theMsg);
	};
	//---
	this.innerExitGame=function(){
		var runTime=$('#clockId').text();
		if (this.cardCheck.cardsRemaining>0){
			$('#dialogueId').text('early termination of game! cards left: '+this.cardCheck.cardsRemaining);
		} else {
			$('#dialogueId').text('');//need to update dialogueid twice for it to show at end of game???
			$('#dialogueId').text('game is over!!! You did it in: '+runTime);
		}
		this.endGame=true;
	};
	//---
	return {
		//--- external methods
		exitGame : function() {
			innerExitGame();
		},
		startGame : function() {
			innerStartGame();
		},
		selectCard : function(xPos, yPos) {
			innerSelectCard(xPos, yPos);
		},
		monitorProgress: function (){
			returnBool=innerMonitorProgress();
			return returnBool;
		},
		doClockStuff: function(){
			doClockStuffInner();
		}
	};
}();