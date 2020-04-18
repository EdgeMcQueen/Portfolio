// burger menu
/*
(function () {
  var burgerIcon = document.querySelector(".burger-container"),
    burgerMenu = document.querySelector(".burger-menu");

  burgerIcon.onclick = function () {
    burgerMenu.classList.toggle("burger-opened");
    burgerIcon.classList.toggle("burger-close");
  };
})();
*/
$(
  (function () {
    var $burgerContainer = $(".burger-container");
    var $burgerIcon = $(".burger-icon");
    var $burgerMenu = $(".burger-menu");

    $burgerIcon.click(function () {
      $burgerMenu.toggleClass("burger-opened");
      $burgerContainer.toggleClass("burger-close");

      if ($burgerMenu.hasClass("burger-opened") === true) {
        // $(".go-to-top").css({
        //   "display": "none",
        // });
        $(".go-to-top")
        .delay(1000)
        .queue(function (next) {
          $(this).css({
            "display": "none",
          });
          next();
        });
        $(".go-to-top__arrow").css({
          "bottom": "-200px",
        });
        $burgerMenu.removeClass("menu-closed");
      } else {
        $(".go-to-top").css({
          "display": "block",
        });
        $(".go-to-top__arrow").css({
          "bottom": "1.875em",
        });
        $burgerMenu.addClass("menu-closed");
      }
    });

    $burgerContainer.swipe({
      swipeLeft: function (event, direction, distance, duration, fingerCount) {
        $(".burger-menu").addClass("burger-opened");
        $(".burger-container").addClass("burger-close");
      }
    });
    $burgerMenu.swipe({
      swipeRight: function (event, direction, distance, duration, fingerCount) {
        $(".burger-menu").removeClass("burger-opened");
        $(".burger-container").removeClass("burger-close");
      }
    });
  })()
);
