//--- constructor with load object...
function FlipCard(flipCardSetup){
	for (var theName in flipCardSetup){
		var theValue=flipCardSetup[theName];
		this[theName]=theValue;
	}
}
//--- all code goes into prototype
FlipCard.prototype.doInit=function(){
	this.theImage = new Image();
	this.theImage.src = this.backOfCardPath;
	this.theImage.id = this.imageId;
	this.theImage.className = this.imageClass;
	//this.flipCardCsx.drawImage(this.theImage, this.xPos, this.yPos, this.imageWidth, this.imageHeight);
	this.flipCardCsx.drawImage(this.theImage, this.xPos, this.yPos);
	this.cardExposed=false;
};
FlipCard.prototype.showFront=function(){
	if (this.cardExposed == false){
		this.theImage.src=this.frontOfCardPath;
		//this.flipCardCsx.drawImage(this.theImage, this.xPos, this.yPos, this.imageWidth, this.imageHeight);
		this.flipCardCsx.drawImage(this.theImage, this.xPos, this.yPos);
		this.cardExposed=true;
		//console.log(this.cardno+') '+this.cardName+': change image path to: '+this.theImage.src);
	}
	else {
		//sometimes first  click doesnt change card????
		//this.flipCardCsx.drawImage(this.theImage, this.xPos, this.yPos, this.imageWidth, this.imageHeight);
		this.flipCardCsx.drawImage(this.theImage, this.xPos, this.yPos);
		//console.log(this.cardno+') '+this.cardName+': dont change image path because cardexposed is '+this.cardExposed);
	};
};
FlipCard.prototype.getCardName=function(){
	return this.cardName;
};
FlipCard.prototype.getImagePath=function(){
	return this.frontOfCardPath;
};
FlipCard.prototype.setDone = function(){
	this.theImage.src=this.noCardPath;
	this.flipCardCsx.drawImage(this.theImage, this.xPos, this.yPos);
	this.cardIsDone=true;
	
};
FlipCard.prototype.doReset= function(){
	this.cardExposed=false;
	this.theImage.src = this.backOfCardPath;
	//this.flipCardCsx.drawImage(this.theImage, this.xPos, this.yPos, this.imageWidth, this.imageHeight);
	this.flipCardCsx.drawImage(this.theImage, this.xPos, this.yPos);
	//console.log(this.cardName+': set card back to backofcardpath');
};