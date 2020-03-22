/*jslint browser: true*/
/*global console, alert, Swiper, $*/

/**
 * Shows a swipeable tutorial screen to the user
 * @author www.timo-ernst.net
 * @license MIT
 * @version 1.1
 */
var Welcomescreen = function (slides, options) {

  // Private properties
  var self = this,
    container,
    swiper,
    swiperContainer,
    defaults = {
      closeButton: true,        // enabled/disable close button
      closeButtonText : 'Skip', // close button text
      cssClass: '',             // additional class on container
      pagination: true,         // swiper pagination
      navigation: false,        // swiper navigation
      loop: false,              // swiper loop
      open: true,               // open welcome screen on init
      parallax: false,          // adds parallax capabilities
      parallaxSpeed: 600,       // parallax default speed
      parallaxBackgroundImage: '//lorempixel.com/900/600/nightlife/2/', // parallax default background image
      parallaxBackground: '-23%', // parallax default background effect
      parallaxSlideElements: {  // start positions of elements for parallax
          title: -100, 
          subtitle: -300, 
          text: -500
      },
      enableTitle: false,       // previous handling / enabling adds new styles that might break your previously configured visuals if you upgrade
  };

  // Initializes the swiper
  function initSwiper() {
    swiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      loop: options.loop,
      pagination: options.pagination ? swiperContainer.find('.swiper-pagination') : undefined,
      parallax: options.parallax, 
      speed: options.parallaxSpeed
    });
  }

  // Sets colors from options
  function setColors() {
    if (options.bgcolor) {
      container.css({
        'background-color': options.bgcolor,
        'color': options.fontcolor
      });
    }
  }

  function compileTemplate() {
    var $welcomescreenContainer = $('<div class="welcomescreen-container ' + options.cssClass + '">');
    if (options.closeButton) $('<div class="welcomescreen-closebtn close-welcomescreen">' + options.closeButtonText + '</div>').appendTo($welcomescreenContainer);
    var $swiperContainer = $('<div class="welcomescreen-swiper swiper-container">').appendTo($welcomescreenContainer);

    if (options.parallax) $('<div class="parallax-bg" style="background-image:url(' + options.parallaxBackgroundImage + ')" data-swiper-parallax="' + options.parallaxBackground + '"></div>').appendTo($swiperContainer);

    var $swiperWrapper = $('<div class="swiper-wrapper">').appendTo($swiperContainer);
    
    for (var i=0; i<slides.length; i++) {
      var slide = slides[i];
      var $slide = $('<div class="swiper-slide">').appendTo($swiperWrapper);
      if (slide.id) $slide.attr('id', slide.id);

      if (options.enableTitle) $('<div class="welcomescreen-title ' + (!slide.title ? 'hide-title' :'') + '" data-swiper-parallax="' + (options.parallax ? options.parallaxSlideElements.title :'') + '">' + (slide.title || '') + '</div>').appendTo($slide);

      if (slide.content) $('<div class="welcomescreen-content">' + slide.content + '</div>').appendTo($slide);
      else {
        if (slide.picture) $('<div class="welcomescreen-picture" data-swiper-parallax="' + (options.parallax ? options.parallaxSlideElements.subtitle :'') + '">' + slide.picture + '</div>').appendTo($slide);
        if (slide.text) $('<div class="welcomescreen-text" data-swiper-parallax="' + (options.parallax ? options.parallaxSlideElements.text :'') + '">' + slide.text + '</div>').appendTo($slide); 
      }
      
    }
    
    if (options.pagination) $('<div class="welcomescreen-pagination swiper-pagination"></div>').appendTo($swiperContainer);

    if (options.navigation)
      $('<div class="welcomescreen-navigation-prev swiper-button-prev"></div>' + 
      '<div class="welcomescreen-navigation-next swiper-button-next"></div>').appendTo($swiperContainer);
    
    return $welcomescreenContainer;
  }

  // Sets the options that were required
  function applyOptions() {
    options = $.extend({}, defaults, options);
  }

  // Shows the welcome screen
  self.open = function () {
    // protect from opening twice
    if (container) return;

    // have changeable options by processing it here
    applyOptions();
    container = compileTemplate();
    
    swiperContainer = container.find('.swiper-container');
    setColors();
    $('body').append(container);
    initSwiper();
    container[0].welcomescreen = self;
    if (typeof options.onOpened === 'function') { options.onOpened(); }
  };

  // Hides the welcome screen
  self.close = function () {
    if (swiper) { swiper.destroy(true); }
    if (container) { container.remove(); }
    container = swiperContainer = swiper = undefined;
    if (typeof options.onClosed === 'function') { options.onClosed(); }
  };

  // hows the next slide
  self.next = function () {
    if (swiper) { swiper.slideNext(); }
  };

  // Shows the previous slide
  self.previous = function () {
    if (swiper) { swiper.slidePrev(); }
  };

  // Goes to the desired slide
  self.slideTo = function (index) {
    if (swiper) { swiper.slideTo(index); }
  };

  // Prepare the instance
  applyOptions();

  // Open on DOM ready
  $(document).ready(function () {
    if (options.open)
      self.open();
  });

  // Return instance
  return self;
};

// Click handler to close welcomescreen
$(document).on('click', '.close-welcomescreen', function (e) {
  e.preventDefault();
  var $wscreen = $(this).parents('.welcomescreen-container');
  if ($wscreen.length > 0 && $wscreen[0].welcomescreen) { $wscreen[0].welcomescreen.close(); }
});

// Click handler to show previous slide
$(document).on('click', '.welcomescreen-navigation-prev', function (e) {
  e.preventDefault();
  var $wscreen = $(this).parents('.welcomescreen-container');
  if ($wscreen.length > 0 && $wscreen[0].welcomescreen) { $wscreen[0].welcomescreen.previous(); }
});

// Click handler to show next slide
$(document).on('click', '.welcomescreen-navigation-next', function (e) {
  e.preventDefault();
  var $wscreen = $(this).parents('.welcomescreen-container');
  if ($wscreen.length > 0 && $wscreen[0].welcomescreen) { $wscreen[0].welcomescreen.next(); }
});