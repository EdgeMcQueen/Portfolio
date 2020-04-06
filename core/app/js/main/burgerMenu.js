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
$((function () {
    var $burgerIcon = $(".burger-container");
    var $burgerMenu = $(".burger-menu");

    $burgerIcon.click(function () {
      $burgerMenu.toggleClass("burger-opened");
      $burgerIcon.toggleClass("burger-close");

      if ($burgerIcon.hasClass("burger-close") == true) {
        $(".go-to-top").css("display", "none");
      } else {
        $(".go-to-top").css("display", "block");
      }
    });
  })()
);
