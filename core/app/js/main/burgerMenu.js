var $burgerContainer = $(".burger-container");
var $burgerIcon = $(".burger-icon");
var $burgerMenu = $(".burger-menu");
var $goToTop = $(".go-to-top");

$(
  (function () {
    $burgerIcon.click(function () {
      $burgerMenu.toggleClass("burger-opened");
      $burgerContainer.toggleClass("burger-close");

      if ($burgerMenu.hasClass("burger-opened") === true) {
        $goToTop.delay(1000).queue(function (next) {
          $(this).css({
            display: "none"
          });
          next();
        });
        $goToTop.children().css({
          bottom: "-200px"
        });
        $burgerMenu.removeClass("menu-closed");
      } else {
        $goToTop.css({
          display: "block"
        });
        $goToTop.children().css({
          bottom: "1.875em"
        });
        $burgerMenu.addClass("menu-closed");
      }
    });
  })()
);

$(window).swipe({
  swipeLeft: function (event, direction, distance, duration, fingerCount) {
    //distance = 100;
    $burgerMenu.addClass("burger-opened").removeClass("menu-closed");
    $burgerContainer.addClass("burger-close");
    $goToTop.delay(1000).queue(function (next) {
      $(this).css({
        display: "none"
      });
      next();
    });
    $goToTop.children().css({
      bottom: "-200px"
    });
  },
  swipeRight: function (event, direction, distance, duration, fingerCount) {
    $burgerMenu.removeClass("burger-opened").addClass("menu-closed");
    $burgerContainer.removeClass("burger-close");
    $goToTop.css({
      display: "block"
    });
    $goToTop.children().css({
      bottom: "1.875em"
    });
  }
});
