$(document).ready(function(){
	trackCal();	
});

trackCal=function(){
	workSpaceElement = $('div.wrapper');
	screenSizeObj = screenComputation(50);		
	workSpaceElement.css({'width':screenSizeObj.w,'height':screenSizeObj.h}); 	
	dotMakerInstance = new dotmaker();
	workSpaceElement.bind('touchstart touchmove touchend click',function(e){		 		
		if(e.type=='touchstart'){						
			processLeftRight(e.originalEvent.targetTouches[0].clientY,'');
		}else if(e.type=='touchmove' || e.type=='click'){						
			processLeftRight(e.originalEvent.targetTouches[0].clientY,'doAnimate');
		}else if(e.type=='touchend'){							
			dotMakerInstance.resetTheAxis();			
		}
		
		function processLeftRight(clientYData,animateKey){			
			if(screenSizeObj.pW>=e.originalEvent.targetTouches[0].screenX){						
				dotmaker((e.originalEvent.targetTouches[0].screenX-50),clientYData,'lft',animateKey);		
			}else{										
				dotmaker(e.originalEvent.targetTouches[0].screenX-50,clientYData,'rgt',animateKey);
			}
		}		 				
	});		
}

function screenComputation(wp,hp){			
	windowObj = $(window);
	scrW=windowObj.width();
	scrH=windowObj.height();			
	if(typeof wp!='undefined' && typeof hp!='undefined'){		
		return {'w':scrW,'h':scrH,'pW':(scrW/100)*wp,'pH':(scrH/100)*hp};
	}else{
		return {'w':scrW,'h':scrH,'pW':(scrW/100)*wp};
	}
	return {'w':scrW,'h':scrH};	
}

function dotmaker(pgX,pgY,klass,actionToPerform){		
	// var xDeg=0;
	if(actionToPerform=='doAnimate'){		
		$('div.dot').css({'top':(pgY-80),'transform':'rotateX(60deg)','-webkit-transform':'rotateX(60deg)'});						
		/*workSpaceElement.find('div.dot').animate({top:(pgY-80)},{				
			step:function(now,fx){								
				 $(this).css('transform','rotateX('+(xDeg*2)+'deg)');
				 $(this).css('-moz-transform','rotateX('+(xDeg*2)+'deg)');	
				 $(this).css('-webkit-transform','rotateX('+(xDeg*2)+'deg)');									
				 xDeg++;
			},
			complete:function(){
				$(this).css('transform','rotateX(0deg)');
			}
		});*/
	}else{
		htmlStr = '<div class="dot '+klass+'" style="left:'+(pgX)+'px;top:'+(pgY-80)+'px"></div>';			
			if(typeof workSpaceElement.has('div.dot')[0]!='undefined'){	
				workSpaceElement.find('div.dot').remove();				
				workSpaceElement.append(htmlStr);
			 }
			 else{					 	
			 	workSpaceElement.append(htmlStr);
			 }	
	 }
	 this.resetTheAxis = function(){
	 	workSpaceElement.find('div.dot').css({'transform':'rotateX(0deg)','-webkit-transform':'rotateX(0deg)'});	 	
	 	// workSpaceElement.find('div.dot').removeClass('axisChange');

	 }
}




