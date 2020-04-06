// smooth anchor scroll
$(document).on("click", 'a[href^="#"]', function (event) {
  event.preventDefault();

  $("html, body").animate(
    {
      scrollTop: $($.attr(this, "href")).offset().top
    },
    1000
  );
});

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

// dropDown menu show/hide
/*
(function () {
  var dropMenuIcon = document.querySelector(".dropMenu-toggle"),
    dropMenu = document.querySelector(".nav");

  dropMenuIcon.onclick = function () {
    dropMenu.classList.toggle("dropMenu-show");
    dropMenuIcon.classList.toggle("dropMenu-hide");
  };
})();
*/

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

// slide down menu

/*
$(window).scroll(function() {scrollFunction()});

function scrollFunction() {
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		document.querySelector(".dropMenu-toggle").style.top = "0";
		document.querySelector(".dropMenu-toggle").style.display = "block";

	} else {
		document.querySelector(".dropMenu-toggle").style.top = "-50px";
		document.querySelector(".nav").classList.remove("dropMenu-show");
	}
}
*/

$(window).scroll(function () {
  scrollFunction();
});

function scrollFunction() {
  if ($("body").scrollTop() > 100 || $(document.documentElement).scrollTop() > 100) {
    $(".dropMenu-toggle").css({
      top: "0",
      display: "block"
    });
    $(".dropMenu-toggle__icon").css("display", "block");
  } else {
    $(".dropMenu-toggle").css({
      top: "-50"
    });
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

// skills circle progress

function circle(el) {
  $(el)
    .circleProgress({ fill: { color: "#828282" } })
    .on("circle-animation-progress", function (event, progress, stepValue) {
      $(this)
        .find(".skills__percent")
        .text(String(stepValue.toFixed(2)).substr(2) + "%");
    });
}
circle(".skills__round");

$(".skills__round").circleProgress({
  startAngle: Math.PI / -2
});
