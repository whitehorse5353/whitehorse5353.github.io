$(document).ready(function(){	
	screenCompu();	
	$(this).fileHandler();		
	setImageGallery();		
});
// screen computation // 
var screenCompu = function(){	
	screenWidth = $(window).width();
	screenHeight = $(window).height();
		// calc percentage of screen //
		this.applyPercentage = function(wp,hp){
			calulatedWH={};
			calulatedWH.width=(screenWidth/100)*wp;
			calulatedWH.height=(screenHeight/100)*hp;		
			return calulatedWH;
		}
	$('div.wrapper').css({'width':screenWidth,'height':screenHeight,'overflow':'hidden'});		
	buttonHandle = this.applyPercentage(50,50);	
	$('a.cameraTrigger').css({'left': buttonHandle.width-($('a.cameraTrigger').width()/2) });		
};
// file handling and processing //
$.fn.fileHandler = function(){		
	$('a.cameraTrigger').click(function(){		
		$('#imageObj').bind('change click',function(evt){
			evt.stopImmediatePropagation();
			if(evt.type=='change'){
				file = evt.target.files[0];	
				// hide upload handle
				$('a.cameraTrigger,div.carouselContainer').hide();
				imageSizeNew = cropScrSize = cropHandleSizeObj = percentageCalcForUploader =  new screenCompu();
				imageSizeObjNew = imageSizeNew.applyPercentage(80,80); 
				cropRegSizeObj = cropScrSize.applyPercentage(30,15);
				cropHandle = cropHandleSizeObj.applyPercentage(8,5);
				percentageCalcObj = percentageCalcForUploader.applyPercentage(80,80);
				// plugin call for image issues in iOS and android							    
			    $.canvasResize(file, {
			        width: imageSizeObjNew.width,
			        height: 0,
			        crop: false,
			        quality: 80,
			        //rotate: 90,
			        callback: function(data, width, height) {					        
			        $('div.imageOutput').css({'width':percentageCalcObj.width,'height':percentageCalcObj.height}).append('<img src='+data+' width='+width+' height='+height+' id="updatedImage_'+$('div.imageOutput img').size()+'" />');
			        	// jCrop init
			        	initJcrop();    
					    function initJcrop(){
					      $('#'+$('div.imageOutput img').attr('id')).Jcrop({        					        
					        onSelect: showCoords,
					        setSelect:   [ 0, 0, 180, 250 ]        
					      },function(){	
					      	this.ui.selection.append('<a href="javascript:void(0)" class="action applyCrop"></a><a href="javascript:void(0)" class="action cancelCrop"></a>');				        						        
					        this.setOptions({allowResize:this.checked,aspectRatio: 4/3,allowMove:this.checked});
					    	this.focus();				        
					      });
					    };					    
					    function showCoords(c){
					    	canvasHandler(c.x,c.y,c.w,c.h,0,0,c.w,c.h,$('div.imageOutput img'));					    						    						      
					    }					    			        				            
			        }
			    });
			}
		}).trigger('click');			
	});
};
// redrawing imagedata in canvas and writing in local //	
canvasHandler = function(srcX,srcY,srcW,srcH,desX,desY,desW,desH,imageData){	
	globalArr=[];
	canvas = document.createElement('canvas');
	canvasCntx = canvas.getContext('2d');
	canvas.setAttribute('width',desW);
	canvas.setAttribute('height',desH);	
	canvasCntx.drawImage(imageData[0],srcX,srcY,srcW,srcH,0,0,desW,desH);		
		$('div.imageOutput').on('click','a.action',function(e){
			if($(this).hasClass('applyCrop')){
				e.stopImmediatePropagation();				
				galleryItem={};								
				galleryItem.id=e.timeStamp;
				galleryItem.src=canvas.toDataURL();
				globalArr.push(galleryItem);				
				stringifiedObject = JSON.stringify(globalArr);					
				if(localStorage.getItem('imageGallery')==null){					
					setImageObjectsInLocal(stringifiedObject);
				}else{										
					oldArrColl=[];
					oldObjects = localStorage.getItem('imageGallery');
					oldArrColl = eval(oldObjects);															
					oldArrColl.push(galleryItem);
					stringifiedAllObjects = JSON.stringify(oldArrColl);
					setImageObjectsInLocal(stringifiedAllObjects);					
				}
			}else{
				e.stopImmediatePropagation();				
				$('div.imageOutput').removeAttr('style').children().remove();
				$('a.cameraTrigger,div.carouselContainer').show();
				setImageGallery();
			}																																			
		});
};
// store local
setImageObjectsInLocal = function(arr){	
	localStorage.setItem('imageGallery',arr);
	$('div.imageOutput').removeAttr('style').children().remove();
	$('a.cameraTrigger,div.carouselContainer').show();
	setImageGallery();
}
// 2d/3d carousal viewer //
carousalViewer = function(collectedBase64Objects){
	panels = $('.carouselPanWrapper div.imageItems');
	deg = (360/$('.carouselPanWrapper div.imageItems').size());		
	$('div.carouselPanWrapper').removeAttr('style'); // reset the degree
	var tz = Math.round( ( panels.outerWidth() / 2 ) / 
	Math.tan( Math.PI / panels.size() ) );		
		if(collectedBase64Objects.length>3){			
			$('div.carouselPanWrapper').css('cssText','transform: translateZ(-'+tz+'px) rotateY(0deg);-webkit-transform: translateZ( -'+tz+'px );');
		}else if(collectedBase64Objects.length>=2){		
			$('div.imageItems').css('cssText','transform: rotateY(180deg);');		
		}
	$.each(panels,function(i){			
		if(collectedBase64Objects.length>=2){			
				$(this).css('cssText','background: url('+collectedBase64Objects[i].src+') no-repeat center bottom;-moz-background-size:100%;-webkit-background-size:100%;background-size:100%; transform:rotateY('+(deg*i)+'deg) translateZ('+tz+'px);-webkit-transform:rotateY('+(deg*i)+'deg) translateZ('+tz+'px);');
		}else{
			$(this).css('cssText','background: url('+collectedBase64Objects[i].src+') no-repeat center bottom;-moz-background-size:100%;-webkit-background-size:100%;background-size:100%;');
		}
	});
	var prv = nxt =1;
	var nxtprvCapture;	
	if(collectedBase64Objects.length>=2){
		$('div.carouselContainer').bind('swipeleft swiperight',function(e){
			e.stopImmediatePropagation();			
			if(e.type=='swipeleft'){
				$('div.carouselPanWrapper').css('cssText','transform: translateZ(-'+tz+'px) rotateY(-'+(deg*nxt)+'deg); -webkit-transform: translateZ(-'+tz+'px) rotateY(-'+(deg*nxt)+'deg);');
				nxt++;
			}else{
				nxt==0 ? nxt++ : nxt--; 																			
				$('div.carouselPanWrapper').css('cssText','transform: translateZ(-'+tz+'px) rotateY(-'+(deg*nxt)+'deg); -webkit-transform: translateZ(-'+tz+'px) rotateY(-'+(deg*nxt)+'deg);');							
			}			
		});
	}
}
// local data to image redrawing //
setImageGallery =function(){
	var emptyArr =[];
	$('div.carouselPanWrapper').empty();		
	if(localStorage.getItem('imageGallery')!=null){
		objectCollectionFromLocal = eval(localStorage.getItem('imageGallery'));		
		$.each(objectCollectionFromLocal,function(i,imageDataObject){		
			$('div.carouselPanWrapper').append('<div class="imageItems" id='+imageDataObject.id+'></div>');
			var base64Obj={};
			base64Obj.id= imageDataObject.id;
			base64Obj.src= imageDataObject.src;
			emptyArr.push(base64Obj);						
		});				
		carousalViewer(emptyArr);
	}
}