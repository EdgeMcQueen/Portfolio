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
        $(".go-to-top").css("display", "none");
        $burgerMenu.removeClass("menu-closed");
      } else {
        $(".go-to-top").css("display", "block");
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
