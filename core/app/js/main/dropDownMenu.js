$(
  (function () {
    var $dropMenuIcon = $(".dropMenu-toggle");
    var $dropMenu = $(".nav");

    $dropMenuIcon.click(function () {
      $dropMenu.toggleClass("dropMenu-show");
      $dropMenuIcon.toggleClass("dropMenu-hide");
    });
  })()
);

// menu show on scroll

$(window).scroll(function () {
  scrollFunction();
});

function scrollFunction() {
  if ($("body").scrollTop() > 100 || $(document.documentElement).scrollTop() > 100) {
    $(".dropMenu-toggle").css("top", "0");
    $(".dropMenu-toggle__icon").css("display", "block");
  } else {
    $(".dropMenu-toggle").css("top", "-50px");

    $(".dropMenu-toggle__icon").css("display", "none");
    $(".nav").removeClass("dropMenu-show");
  }
}

// menu hide after click to link

$(document).ready(function () {
  $(".dropdown-nav-menu__link").click(function () {
    if ($(".nav").hasClass("dropMenu-show")) {
      $(".nav").removeClass("dropMenu-show");
    }
  });
  $(".nav-burger__link").click(function () {
    if (
      $(".burger-menu").hasClass("burger-opened") ||
      $(".burger-container").hasClass("burger-close")
    ) {
      $(".burger-menu").removeClass("burger-opened");
      $(".burger-container").removeClass("burger-close");
    }
  });
});
