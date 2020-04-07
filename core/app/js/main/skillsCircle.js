// skills circle progress

function circle(el) {
  $(el)
    .circleProgress({ fill: { color: "#828282" } })
    .on("circle-animation-progress", function (event, progress, stepValue) {
      $(this)
        .find(".skills__percent")
        .text(String(stepValue.toFixed(2)).substr(2) + "%");
    });

  // function scrollTracking(){
  //     var wt = $(window).scrollTop();
  //     var wh = $(window).height();
  //     var et = $(".skills__wrap").offset().top;
  //     var eh = $(".skills__wrap").outerHeight();
  //
  //     if (et >= wt && et + eh <= wh + wt){
  //         if (block_show == null || block_show == false) {
  //             $(".skills__percent").show;
  //         }
  //         block_show = true;
  //     }
  //     else {
  //         if (block_show == null || block_show == true) {
  //             $(".skills__percent").hide;
  //         }
  //
  //         block_show = false;
  //     }
  // }
  //
  // $(window).scroll(function(){
  //     scrollTracking();
  // });
  //
  // $(document).ready(function(){
  //     scrollTracking();
  // });
}
circle(".skills__round");

$(".skills__round").circleProgress({
  startAngle: Math.PI / -2
});
