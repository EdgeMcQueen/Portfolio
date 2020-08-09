// skills circle progress

function circle(el) {
  $(el)
    .circleProgress({ fill: { color: "#828282" } })
    .on("circle-animation-progress", function (event, progress, stepValue) {
      $(this)
        .find(".skills__percent")
        .text(String(stepValue.toFixed(2)).substr(2) + "%");
    });

  $(el).on("click", 'a[href="#skills"]', function (event) {
    event.preventDefault();
    return $(el).circleProgress({
      animate: {
        duration: 1200,
        easing: "circleProgressEasing"
      }
    });
  });
}
circle(".skills__round");

$(".skills__round").circleProgress({
  startAngle: Math.PI / -2
});

$.fn.isOnScreen = function () {
  var win = $(window);
  var viewport = {
    top: win.scrollTop(),
    left: win.scrollLeft()
  };
  viewport.right = viewport.left + win.width();
  viewport.bottom = viewport.top + win.height();
  var bounds = this.offset();
  bounds.right = bounds.left + this.outerWidth();
  bounds.bottom = bounds.top + this.outerHeight();
  return !(
    viewport.right < bounds.left ||
    viewport.left > bounds.right ||
    viewport.bottom < bounds.top ||
    viewport.top > bounds.bottom
  );
};

$(window).scroll(function () {
  if ($(".skills__wrap").isOnScreen()) {
    circle(".skills__round");
  }
});
