let STORE={"slideshowPlaying":false,"slideshowPlayable":true,"slideshowResumeOnPlayable":true,"timer":null,"footerAnimating":false};const SLIDESHOW_AUTOADVANCE_MS=5000;const ANIMATION_TIME_MS=1000;const KEEP_LOG=true;function generateBanner(images){let html="";for(let i=0;i<images.length;i++){html+=`<div class="banner-item">
					<div class="banner-item-bgnd" style="background-image: url('${images[i]}');"></div>
				</div>`;}
$('.banner-slider').html(html);}
function bannerDisplayError(errorMessage){const html=`<div class="banner-item">
					<div class="banner-item-bgnd">
						<p style="color: white;">${errorMessage}</p>
					</div>
				</div>`
$('.banner-slider').html(html);}
function slideNext(){let restartSlideshow=STORE.slideshowPlaying;stopSlideshow();$('.banner-slider').animate({left:`-=${Number($('.banner-item:first-child').width())}px`},ANIMATION_TIME_MS,function(){$('.banner-item:last-child').after($('.banner-item:first-child'));$('.banner-slider').css({'left':'0%'});});if(restartSlideshow){startSlideshow();}}
function slidePrev(){let restartSlideshow=STORE.slideshowPlaying;stopSlideshow();const width=Number($('.banner-item:first-child').width());$('.banner-item:first-child').before($('.banner-item:last-child'));$('.banner-slider').css({'left':`${-1*width }px`});$('.banner-slider').animate({left:`+=${width}`},ANIMATION_TIME_MS,function(){$('.banner-slider').css('left','0%');});if(restartSlideshow){startSlideshow();}}
function startSlideshow(alwaysStart=false){if(!alwaysStart&&!slideShowCheckWidth()){return;}
if(STORE.timer){clearInterval(STORE.timer);}
STORE.slideshowPlaying=true;STORE.timer=setInterval(function(){slideNext();},SLIDESHOW_AUTOADVANCE_MS);$('.btn-pause').find('i').addClass('fa-pause').removeClass('fa-play');}
function stopSlideshow(){STORE.slideshowPlaying=false;clearInterval(STORE.timer);$('.btn-pause').find('i').removeClass('fa-pause').addClass('fa-play');}
function slideShowHideControls(hide=true){if(hide){$('.btn-arrow').addClass('no-display');$('.btn-pause').addClass('no-display');}else{$('.btn-arrow').removeClass('no-display');$('.btn-pause').removeClass('no-display');}}
function slideShowCheckWidth(){const numPics=$('.banner-item').length;const numPicsDisplayed=Math.round($(".banner-slider").width()/$('.banner-item').width());if(numPics>numPicsDisplayed){if(!STORE.slideshowPlayable){$('.banner-item').removeClass('banner-item-override-1').removeClass('banner-item-override-2');slideShowHideControls(false);STORE.slideshowPlayable=true;if(STORE.slideshowResumeOnPlayable){startSlideshow(true);}}
return true;}else{if(STORE.slideshowPlayable){$('.banner-item').addClass(`banner-item-override-${numPics}`);slideShowHideControls();STORE.slideshowPlayable=false;STORE.slideshowResumeOnPlayable=STORE.slideshowPlaying;stopSlideshow();}
return false;}}
function bannerNextHandler(){$('#banner-next').click(function(event){slideNext();});}
function bannerPrevHandler(){$('#banner-prev').click(function(event){slidePrev();});}
function pauseSlideshowHandler(){$('.btn-pause').click(function(event){event.stopPropagation();toggleSlideshow();})}
function slideshowSwipeLeftHandler(){$('.banner').on('swipeleft',function(event){slideNext();});}
function slideshowSwipeRightHandler(){$('.banner').on('swiperight',function(event){slidePrev();});}
function handleVisibility(){if(document.visibilityState==='hidden'){STORE.slideshowResumeOnVisible=STORE.slideshowPlaying;stopSlideshow();}else if(STORE.slideshowResumeOnVisible){startSlideshow();}}
function toggleSlideshow(){if(!STORE.slideshowPlaying){startSlideshow();slideNext();}else{stopSlideshow();}}
function modeSelectHandler(){$('#form-mode').on('change','input',function(event){let val=Number($('#form-mode input:checked').val());$('#form-mode').addClass('no-display');switch(val){case 3:$('#form-breed').removeClass('no-display');$('#breed').focus();break;default:$('#form-number').removeClass('no-display');$('#number').focus();break;}
$('.btn-restart').removeClass('no-display');});}
function numberSubmitHandler(){$('#form-number').on('submit',function(event){event.stopPropagation();event.preventDefault();const mode=Number($('#form-mode input:checked').val());const number=Number($('#number').val());fetch(`https://dog.ceo/api/breeds/image/random/${number}`).then(response=>{if(!response.ok){throw new Error(`Received ${response.status} response.`);}
return response.json();}).then(responseJson=>{switch(mode){case 1:(KEEP_LOG)?console.log(responseJson.message):false;break;case 2:$('.banner').removeClass('no-display');generateBanner(responseJson.message);startSlideshow();break;}}).catch(error=>{$('.banner').removeClass('no-display');bannerDisplayError(`Unable to retrieve image for ${breed}. ${error.message}`);startSlideshow();})})}
function breedSubmitHandler(){$('#form-breed').on('submit',function(event){event.stopPropagation();event.preventDefault();const breed=$('#breed').val();let ok=true;let status=200;fetch(`https://dog.ceo/api/breed/${breed}/images/random`).then(response=>{ok=response.ok;status=response.status;return response.json()}).then(responseJson=>{if(!responseJson.hasOwnProperty('message')){throw new Error('Unexpected result format. No \'message\' property.')}
if(!ok){throw new Error(`Error (status ${status}): ${responseJson.message}`);}
$('.banner').removeClass('no-display');generateBanner([responseJson.message]);startSlideshow();}).catch(error=>{$('.banner').removeClass('no-display');bannerDisplayError(`Unable to retrieve image for ${breed}.<br>${error.message}`);startSlideshow();})})}
function footerMouseIn(event){if(STORE.footerAnimating){return;}
STORE.footerAnimating=true;$('.footer-initial').fadeOut();$('.footer-hover').eq(0).fadeIn();let n=$('.footer-hover').length;const time=3000;for(let i=0;i<n;i++){setTimeout(()=>{$('.footer-hover').eq(i).fadeOut();if(i<n-1){$('.footer-hover').eq(i+1).fadeIn();}else{$('.footer-initial').fadeIn(()=>STORE.footerAnimating=false);}},time*(i+1));}}
function footerMouseOut(event){}
function footerHandler(){$('footer').hover(footerMouseIn,footerMouseOut);}
function slideshowResizeHandler(){$(window).on('resize',function(event){slideShowCheckWidth();})}
function restartButtonHandler(){$('.btn-restart').click(function(event){stopSlideshow();$('.banner').addClass('no-display');$('#form-breed').addClass('no-display');$('#form-number').addClass('no-display');$('#number').val('3');$('#breed').val('');$('#form-mode').removeClass('no-display');$('#form-mode input:checked').prop('checked',false);$('.btn-restart').addClass('no-display');});}
function main(){$(modeSelectHandler);$(numberSubmitHandler);$(breedSubmitHandler);$(footerHandler);document.addEventListener('visibilitychange',()=>handleVisibility());$(bannerPrevHandler);$(bannerNextHandler);$(pauseSlideshowHandler);$(slideshowSwipeLeftHandler);$(slideshowSwipeRightHandler);$(slideshowResizeHandler);$(restartButtonHandler);}
$(document).ready(function(){main();});