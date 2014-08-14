// jquery links
$(document).ready(function() {
	$('#memoryGameId').click(function (e){
		var xPos=e.clientX;
		var yPos=e.clientY;
		memoryGame.selectCard(xPos, yPos);
	});
	$('#endButtonId').click(function(e){
		memoryGame.exitGame();
	});
});