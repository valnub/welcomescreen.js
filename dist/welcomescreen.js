/*jslint browser: true*/
/*global console, alert, Swiper, $*/

/**
 * Shows a swipeable tutorial screen to the user
 * @author www.timo-ernst.net
 * @license MIT
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
      loop: false,              // swiper loop
      open: true                // open welcome screen on init
    };

  // Initializes the swiper
  function initSwiper() {
    swiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      loop: options.loop,
      pagination: options.pagination ? swiperContainer.find('.swiper-pagination') : undefined
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
    var $swiperWrapper = $('<div class="swiper-wrapper">').appendTo($swiperContainer);
    
    for (var i=0; i<slides.length; i++) {
      var slide = slides[i];
      var $slide = $('<div class="swiper-slide">').appendTo($swiperWrapper);
      if (slide.id) $slide.attr('id', slide.id);
      if (slide.content) $('<div class="welcomescreen-content">' + slide.content + '</div>').appendTo($slide);
      else {
        if (slide.picture) $('<div class="welcomescreen-picture">' + slide.picture + '</div>').appendTo($slide);
        if (slide.text) $('<div class="welcomescreen-text">' + slide.text + '</div>').appendTo($slide); 
      }
      
    }
    
    if (options.pagination) $('<div class="welcomescreen-pagination swiper-pagination"></div>').appendTo($swiperContainer);
    
    return $welcomescreenContainer;
  }

  // Sets the options that were required
  function applyOptions() {
    var def;
    options = options || {};
    for (def in defaults) {
      if (typeof options[def] === 'undefined') {
        options[def] = defaults[def];
      }
    }
  }

  // Shows the welcome screen
  self.open = function () {
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

  // Initialize the instance
  $(document).ready(function () {
    compileTemplate();
    applyOptions();

    // Open on init
    if (options.open) {
      self.open();
    }
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