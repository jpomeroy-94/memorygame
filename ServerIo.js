 var serverIo = function (){
	this.getTableDataInner=function(){
		this.cmdLine="http://lindy/doio.php";
		this.theCode="memorygame";
		var that=this;
		$(document).ready(function(){
			$(document).ajaxError(function(event,xhr,opt,exc){
				 alert("Error requesting " + opt.url + ": status: " + xhr.status + ", statusText: " + xhr.statusText);
			});
			serverIo.ajaxIsRunning=true;
			//console.log('serverio.gettabledatainner at start serverio.ajaxisrunning: '+serverIo.ajaxIsRunning);
		  $.post(that.cmdLine,function (returningJson,theStatus){
		      var returnObj = $.parseJSON(returningJson);
		      var idLp;
		      for (idLp in returnObj){
		    	  var idValue=returnObj[idLp];
		    	  serverIo.returnAry[idLp]=idValue;
		      }
		      serverIo.ajaxIsRunning=false;
		      //console.log('servio.gettabledatainner at end serverio.ajaxisrunning: '+serverIo.ajaxIsRunning);
		    });
		});
	};
	return {
		returnAry:[],
		getTableData:function(){
			getTableDataInner();
		},
		retrieveData:function(){
			return this.returnAry;
		}
	 };
 }();