AOS.init();

// You can also pass an optional settings object
// below listed default settings
AOS.init({
	// Global settings:
	disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
	startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
	initClassName: 'aos-init', // class applied after initialization
	animatedClassName: 'aos-animate', // class applied on animation
	useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
	disableMutationObserver: false, // disables automatic mutations' detections (advanced)
	debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
	throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


	// Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
	offset: 120, // offset (in px) from the original trigger point
	delay: 0, // values from 0 to 3000, with step 50ms
	duration: 400, // values from 0 to 3000, with step 50ms
	easing: 'ease', // default easing for AOS animations
	once: false, // whether animation should happen only once - while scrolling down
	mirror: false, // whether elements should animate out while scrolling past them
	anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});

// burger menu

/*
(function(){
	var burgerIcon = document.querySelector('.burger-container'),
		burgerMenu = document.querySelector('.burger-menu');

	burgerIcon.onclick = function() {
		burgerMenu.classList.toggle('burger-opened');
		burgerIcon.classList.toggle('burger-close');
	}
}());
*/

$(function(){
	$burgerIcon = $('.burger-container');
	$burgerMenu = $('.burger-menu');

	$burgerIcon.click(function() {
		$burgerMenu.toggleClass('burger-opened');
		$burgerIcon.toggleClass('burger-close');

		if ($burgerIcon.hasClass('burger-close') == true) {
			$('.go-to-top').css("display", "none");
		}
		else {
			$('.go-to-top').css("display", "block");
		}
	})
}());

// dropDown menu show/hide

/*
(function(){
	var dropMenuIcon = document.querySelector('.dropMenu-toggle'),
		dropMenu = document.querySelector('.nav');

	dropMenuIcon.onclick = function() {
		dropMenu.classList.toggle('dropMenu-show');
		dropMenuIcon.classList.toggle('dropMenu-hide');
	}
}());
*/

$(function(){
	$dropMenuIcon = $('.dropMenu-toggle');
	$dropMenu = $('.nav');

	$dropMenuIcon.click(function() {
		$dropMenu.toggleClass('dropMenu-show');
		$dropMenuIcon.toggleClass('dropMenu-hide');
	})
}());

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

$(window).scroll(function() {scrollFunction()});

function scrollFunction() {
	if ($('body').scrollTop() > 100 || $(document.documentElement).scrollTop() > 100) {
		$('.dropMenu-toggle').css({
			"top": "0",
			"display": "block"
		});
		$('.dropMenu-toggle__icon').css("display", "block");
	}
	else {
		$('.dropMenu-toggle').css({
			"top": "-50"
		});
		$('.dropMenu-toggle__icon').css("display", "none");
		$(".nav").removeClass("dropMenu-show");
	}
}

// menu hide after click to link

$(document).ready(function() {
	$('.dropdown-nav-menu__link').click(function() {
		if ( $('.nav').hasClass('dropMenu-show')) {
			$('.nav').removeClass('dropMenu-show');
		}
	})
	$('.nav-burger__link').click(function() {
		if ( $('.burger-menu').hasClass('burger-opened') || $('.burger-container').hasClass('burger-close')) {
			$('.burger-menu').removeClass('burger-opened');
			$('.burger-container').removeClass('burger-close');
		}
	})
});

// smooth anchor scroll
$(document).on('click', 'a[href^="#"]', function (event) {

	event.preventDefault();

	$('html, body').animate({
		scrollTop: $($.attr(this, 'href')).offset().top
	}, 1000);
});

// skills circle progress

function circle(el){
	$(el).circleProgress({fill: {color: '#828282'}})
		.on('circle-animation-progress', function(event, progress, stepValue){
			$(this).find('.skills__percent').text(String(stepValue.toFixed(2)).substr(2)+'%');
		});
};
circle('.skills__round');


$('.skills__round').circleProgress({
	startAngle: Math.PI / -2,
});