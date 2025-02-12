/**
 * Phat Video Background
 * @version 2.6
 * @author Fabrice Spee (fspee.com)
 * @copyright	Author
**/
(function(){
'use strict';

var firstScriptTag = document.getElementsByTagName('script')[0];
	
var youtubeScript = document.createElement('script');
youtubeScript.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(youtubeScript, firstScriptTag);
var vimeoScript = document.createElement('script');
// vimeoScript.src = "https://f.vimeocdn.com/js/froogaloop2.min.js";
firstScriptTag.parentNode.insertBefore(vimeoScript, firstScriptTag);

(function($){
    $.fn.extend({
        phatVideoBg: function(options) {
			return this.each(function(index) {
				var el = jQuery(this);
				
				var defaults = {
					phattype: false,
					phatvideoid: false,
					phatmp4: false,
					phatwebm: false,
					phatogv: false,
					phatratio: "16/9",
					phatloop: true,
					phatposter: false,
					phatoverlaycolor: false,
					phatoverlayopacity: 0.6,
					phatmute: true,
					phatmobiledisable: false,
					phatplaypause: false,
					phatplaymobile: false,
					phatplayonhover: false
				};
				var settings = $.extend({}, defaults, options,el.data());
				
				if (!el.hasClass("phatvideo-bg")) { // only initialise if not already done before
					
					// NEW (force ratio height)
					if (el.hasClass("forceratio")) {
						var videoWidth = 16;
						var videoHeight = 9; 
						if (settings.phatratio === "4/3") { videoWidth = 4; videoHeight = 3; } 
						if (settings.phatratio === "21/9") { videoWidth = 21; videoHeight = 9; } 
						var phatratio = videoWidth / videoHeight;
						
						var mainWidth = el.width();
						var minMainHeight = parseInt(mainWidth * (videoHeight / videoWidth),10)
						el.css({
							'min-height' : minMainHeight+'px'
						});
					}
					
					el.addClass("phatvideo-bg");
					buildVideo(el,settings,index);
					if (settings.phattype === 'youtube' && jQuery(window).width() > 1024) { onYouTubePlayerAPIReady(index); }
					if (settings.phattype === 'vimeo' && jQuery(window).width() > 1024) { onVimeoAPIReady(index); }
					if (settings.phattype === 'html5' && jQuery(window).width() > 1024) { el.find(".phat-bgvideo-container").addClass("loaded"); }
					if (settings.phatplayonhover) { el.addClass("play-on-hover"); }
					el.addClass("videobg-id-"+index);
				}
			});
		}
    });
})(jQuery);
	
	
(function($){
    $.fn.extend({
        phatVideoResize: function(options) {
			return this.each(function(index) {
				var el = jQuery(this);
				
				var defaults = {
					phattype: false,
					phatratio: "16/9"
				};
				var settings = $.extend({}, defaults, options,el.data());
				
				setRatio(el,settings.phatratio,settings.phattype);
			});
		}
    });
})(jQuery);	


function buildVideo(el,settings,i){
	
	// PREPARE
	if (el.css('position') !== 'absolute' || el.css('position') !== 'relative') { el.css({'position':'relative'}); }
	
	el.css('background','none');
	
	el.append('<div class="phat-bgvideo-container" style="position:absolute;width:100%;height:100%;top:0;left:0;z-index:0;overflow:hidden;"><div class="phat-bgvideo-loader" style="position:absolute;width:100%;height:100%;top:0;left:0;z-index:-2;"><div class="loader"><span></span><span></span><span></span></div></div></div>');
	var elBgContainer = el.find('.phat-bgvideo-container');
	
	if (settings.phatposter) {
		elBgContainer.css({ 'background': 'url('+settings.phatposter+') center center', 'background-size': 'cover' });
		elBgContainer.find('.phat-bgvideo-loader').css({ 'background': 'url('+settings.phatposter+') center center', 'background-size': 'cover' });
	}
	
	elBgContainer.prepend('<div class="phat-bgvideo-overlay" style="position:absolute;width:100%;height:100%;top:0;left:0;z-index:0;"></div>');
	if (settings.phatoverlaycolor) {
		elBgContainer.find('.phat-bgvideo-overlay').css({ 'background': settings.phatoverlaycolor, 'opacity': settings.phatoverlayopacity });
	} else {
		elBgContainer.find('.phat-bgvideo-overlay').css({ 'background': 'transparent' });
	}
	// PREPARE
	
	switch (settings.phattype) {
		case "youtube":
			
			var loop = "loop=0"; if ( settings.phatloop || settings.phatloop === "true" ) { loop =  'loop=1&playlist='+settings.phatvideoid; }
			// var mute = ""; if ( settings.phatmute || settings.phatmute === "true" ) { mute =  ' youtube-muted'; } // old browser policy
			var mute =  ' youtube-muted'; 
			var autoplay = "autoplay=1"; var autoplayClass = "  youtube-play";
			if ( settings.phatplayonhover || settings.phatplayonhover === "true" ) { autoplay =  'autoplay=0'; autoplayClass = "  youtube-pause"; }
			
			var markup = '<iframe id="bgvid-'+i+'" class="video-background'+mute+''+autoplayClass+'" style="width:100%;height:100%;z-index:-1;" src="https://www.youtube.com/embed/'+settings.phatvideoid+'?'+autoplay+'&amp;controls=0&amp;'+loop+'&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1" frameborder="0"></iframe>';
			
			var lightcaseLink = 'https://www.youtube.com/embed/'+settings.phatvideoid+'?'+autoplay;
						
			break;
			
		case "vimeo":
		
			var loop = "loop=0"; if ( settings.phatloop || settings.phatloop === "true" ) { loop =  'loop=1'; }
			// var mute = ""; if ( settings.phatmute || settings.phatmute === "true" ) { mute =  ' vimeo-muted'; } // old browser policy
			var mute =  ' vimeo-muted'; 
			var autoplay = "autoplay=1"; var autoplayClass = "  vimeo-play";
			if ( settings.phatplayonhover || settings.phatplayonhover === "true" ) { autoplay = 'autoplay=0'; autoplayClass = "  vimeo-pause"; }
			
			var markup = '<iframe id="bgvid-'+i+'" class="video-background'+mute+''+autoplayClass+'" style="width:100%;height:100%;z-index:-1;" src="https://player.vimeo.com/video/'+settings.phatvideoid+'?api=1&'+loop+'&'+autoplay+'&background=1&muted=1&player_id=bgvid-'+i+'"></iframe>';
			
			var lightcaseLink = 'https://player.vimeo.com/video/'+settings.phatvideoid+'?'+autoplay;
		
			break;
			
		case "html5":
			
			var loop = ''; if ( settings.phatloop || settings.phatloop === "true" ) { loop =  ' loop="true"'; }
			// var mute = ""; if ( settings.phatmute || settings.phatmute === "true" ) { mute =  ' muted="muted"'; } // old browser policy
			var mute =  ' muted="muted"'; 
			var autoplay = 'autoplay="autoplay"'; if ( settings.phatplayonhover || settings.phatplayonhover === "true" ) { autoplay =  ''; }
			
			// obkect fit not supported by edge/explorer
			//var markup = '<video style="object-fit:cover;width:101%;height:101%;" class="video-background" preload="auto" '+autoplay+''+loop+mute+'>';
			var markup = '<video style="width:100%;height:100%;z-index:-1;" class="video-background" preload="auto" playsinline="playsinline" '+autoplay+''+loop+mute+'>';
			if (settings.phatmp4) { markup += '<source src="'+settings.phatmp4+'" type="video/mp4" />'; }
			if (settings.phatwebm) {markup += '<source src="'+settings.phatwebm+'" type="video/webm" />'; }
			if (settings.phatogv) {markup += '<source src="'+settings.phatogv+'" type="video/ogg" />'; }
			markup += '</video>';
			
			var lightcaseLink = settings.phatmp4;
								
			break;
	}
	
	
	if (jQuery(window).width() > 1024) {
		if ( !settings.phatmute || settings.phatmute == "false" ) {
			el.append('<a href="#" id="mute-video-'+i+'" class="mute-video mute-'+settings.phattype+' unmute" data-rel="bgvid-'+i+'" style="position:absolute;bottom:15px;left:15px;"><span>Sound</span><span></span><span></span></a>');	
		}
		if ( settings.phatplaypause || settings.phatplaypause == "true" ) {
			el.append('<a href="#" id="playpause-video-'+i+'" class="playpause-video playpause-'+settings.phattype+'" data-rel="bgvid-'+i+'" style="position:absolute;bottom:15px;left:45px;"><span>Play</span><span></span></a>');	
		}
		elBgContainer.prepend(markup);
		setRatio(el,settings.phatratio,settings.phattype);
	} else if (jQuery(window).width() < 1025 && settings.phattype == "html5" && !settings.phatmobiledisable) {
		elBgContainer.prepend(markup);
		setRatio(el,settings.phatratio,settings.phattype);
	} else if (settings.phatplaypause && settings.phatplaymobile) {
		el.append('<a href="'+lightcaseLink+'" class="phatlightcase-play" data-rel="lightcase:phatlightcase-video-'+i+'" style="position:absolute;bottom:15px;left:15px;"><span>Play</span></a>');
	}
	
	if (settings.phattype !== "html5" || (jQuery(window).width() < 1025 && settings.phattype == "html5" && settings.phatmobiledisable)) {
		el.addClass("phatdisablemobile");
	}
	
		
}

function setRatio(el,ratio,type){	
	
	var videoWidth = 16;
	var videoHeight = 9; 
	if (ratio === "4/3") { videoWidth = 4; videoHeight = 3; } 
	if (ratio === "21/9") { videoWidth = 21; videoHeight = 9; } 
	if (ratio === "9/16") { videoWidth = 9; videoHeight = 16; } 
	var phatratio = videoWidth / videoHeight;
	
	var elWidth = el.find('.phat-bgvideo-container').width();
	var elHeight = el.find('.phat-bgvideo-container').height();
	var elRatio = elWidth / elHeight;
			
	if (elRatio > phatratio) {
		var multiplicator = elRatio / phatratio;
		// * 1.05 to force the fullwidth with some overlay
		// + 300 to hide the default player controls/logos
		var newHeight = (parseInt(multiplicator * elHeight,10)) * 1.03 + 300;
		var newWidth = parseInt(elWidth,10) * 1.03;
		el.find("iframe.video-background, video.video-background").css({
			'max-width' : 'inherit',
			'width' : parseInt(newWidth,10)+'px',
			'height' : parseInt(newHeight,10)+'px',
			'position': 'relative',
			'top': '50%',
			'left': '50%',
			'-webkit-transform' : 'translateX(-50%) translateY(-50%)',
			'-moz-transform'    : 'translateX(-50%) translateY(-50%)',
			'-ms-transform'     : 'translateX(-50%) translateY(-50%)',
			'-o-transform'      : 'translateX(-50%) translateY(-50%)',
			'transform'         : 'translateX(-50%) translateY(-50%)'
		});
	} else {
		var multiplicator = phatratio / elRatio;
		var newWidth = (parseInt(multiplicator * elWidth,10)) * 1.03;
		var newHeight = (parseInt(elHeight,10)) * 1.03 + 300;
		el.find("iframe.video-background, video.video-background").css({
			'max-width' : 'inherit',
			'height' : parseInt(newHeight,10)+'px',
			'width' : parseInt(newWidth,10)+'px',
			'position': 'relative',
			'top': '50%',
			'left': '50%',
			'-webkit-transform' : 'translateX(-50%) translateY(-50%)',
			'-moz-transform'    : 'translateX(-50%) translateY(-50%)',
			'-ms-transform'     : 'translateX(-50%) translateY(-50%)',
			'-o-transform'      : 'translateX(-50%) translateY(-50%)',
			'transform'         : 'translateX(-50%) translateY(-50%)'
		});
	}
	
}
	
jQuery('body').on("click", ".mute-video", function() { 
	if (jQuery(this).hasClass("mute-html5")) {
		var video = jQuery(this).siblings('.phat-bgvideo-container').find('video');
		if (video.prop('muted') == false) { video.prop('muted',true); } 
		else { video.prop('muted',false); }
	}
	else if (jQuery(this).hasClass("mute-vimeo")) {
		var relIframe = jQuery(this).data("rel");
		var iframe = document.getElementById(relIframe); var relPlayer = $f(iframe); // $f == Froogaloop
		if (!jQuery(this).hasClass("unmute")) { relPlayer.api('setVolume', 0); } 
		else { relPlayer.api('setVolume', 1); }
	}
	jQuery(this).toggleClass("unmute");
	return false;
});
	
jQuery('body').on("click", ".playpause-video", function() { 
	if (jQuery(this).hasClass("playpause-html5")) {
		var video = jQuery(this).siblings('.phat-bgvideo-container').find('video').get(0);
		if (!jQuery(this).hasClass("play")) { video.pause(); } 
		else { video.play(); }
	}
	else if (jQuery(this).hasClass("playpause-vimeo")) {
		var relIframe = jQuery(this).data("rel");
		var iframe = document.getElementById(relIframe); var relPlayer = $f(iframe); // $f == Froogaloop
		if (!jQuery(this).hasClass("play")) { relPlayer.api('pause'); } 
		else { relPlayer.api('play'); }
	}
	jQuery(this).toggleClass("play");
	return false;
});


jQuery("body").on("mouseenter", ".videobg-section.play-on-hover", function() { 
	if (jQuery(this).find(".phat-bgvideo-container > video").length > 0) {
		var video = jQuery(this).find(".phat-bgvideo-container > video");
		jQuery(video)[0].play();
	}
}).on("mouseleave", ".videobg-section.play-on-hover", function() { 
	if (jQuery(this).find(".phat-bgvideo-container > video").length > 0) {
		var video = jQuery(this).find(".phat-bgvideo-container > video");
		jQuery(video)[0].pause(); 
		setTimeout(function(){ jQuery(video)[0].currentTime = 0; },200);
	}
});
		
function onYouTubePlayerAPIReady(i) {
	var ytplayer = new YT.Player('bgvid-'+i, {
		events: {
			'onReady': function() {
				jQuery('#bgvid-'+i).parent(".phat-bgvideo-container").addClass("loaded");
				
				// mute youtube video
				if (jQuery('#bgvid-'+i).hasClass("youtube-muted")) { ytplayer.mute(); }
				jQuery('body').on("click", "#mute-video-"+i+".mute-video", function() {
					if (ytplayer.isMuted()) { ytplayer.unMute(); } 
					else { ytplayer.mute(); }
				});
				
				// play pause youtube video
				jQuery('body').on("click", "#playpause-video-"+i+".playpause-video", function() {
					if (!jQuery(this).hasClass("play")) { ytplayer.playVideo(); } 
					else { ytplayer.pauseVideo(); }
				});
				
				// Play on hover
				jQuery(".play-on-hover.videobg-id-"+i).on({
					mouseenter: function() { ytplayer.playVideo(); },
					mouseleave: function() { ytplayer.pauseVideo(); setTimeout(function(){ ytplayer.seekTo(0);  },200); }
				});
				
			}
		}
	});
}

function onVimeoAPIReady(i) {
	var iframe = document.getElementById('bgvid-'+i);
	var player = $f(iframe); // $f == Froogaloop
	
	player.addEvent('ready', function() {
		// settimeout workaround if multiple videos are embedded and conflict each other
		setTimeout(function(){ player.api('play'); jQuery('#bgvid-'+i).parent(".phat-bgvideo-container").addClass("loaded"); }, 300);
		if (jQuery('.videobg-id-'+i).hasClass("play-on-hover")) { setTimeout(function(){ player.api('pause');  }, 500); }
		if (jQuery('#bgvid-'+i).hasClass("vimeo-muted")) {
			player.api('setVolume', 0);
		} else {
			// else is needed (since 2.4.1) for vimeo because of the background=0 option
			setTimeout(function(){ player.api('setVolume', 1); }, 1000);
		}
		
		// settimeout workaround for safari
		setTimeout(function(){ player.api('play'); }, 2000);
		
		// Play on hover
		jQuery(".play-on-hover.videobg-id-"+i).on({
			mouseenter: function() { player.api('seekTo',0); player.api('play'); },
			mouseleave: function() { player.api('pause'); setTimeout(function(){ player.api('seekTo',0); },200); }
		});
    });
}
	
	
jQuery(window).on('resize',function() { 
	
	jQuery(".phatvideo-bg").each(function(i) {
		var el = jQuery(this);
		var ratio = el.data("phatratio");
		var type = el.data("phattype");
		setRatio(el,ratio,type);
	});
		
});	

})(jQuery);