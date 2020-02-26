$(function(){
//Скрипты:

	// Включаем Aos.js
	AOS.init();

	AOS.init({
	  // Настройки, которые могут быть переопределены для каждого элемента с помощью атрибутов data-aos- *:
	  delay: 0, // значения от 0 до 3000 с шагом 50 мс
	  duration: 400, // значения от 0 до 3000 с шагом 50 мс
	  easing: 'ease', // ослабление по умолчанию для анимации AOS
	  once: true, // должна ли анимация происходить только один раз - при прокрутке вниз
	  mirror: true, // должны ли элементы анимироваться при прокрутке мимо них
	  anchorPlacement: 'top-bottom', // определяет, какая позиция элемента относительно окна должна вызывать анимацию

	});
});

// burger menu

(function(){
	var burgerIcon = document.querySelector('.burger-container'),
		burgerMenu = document.querySelector('.burger-menu');

	burgerIcon.onclick = function() {
		burgerMenu.classList.toggle('burger-opened');
		burgerIcon.classList.toggle('burger-close');
	}
}());

// dropDown menu show/hide

(function(){
	var dropMenuIcon = document.querySelector('.dropMenu-toggle'),
		dropMenu = document.querySelector('.nav');

	dropMenuIcon.onclick = function() {
		dropMenu.classList.toggle('dropMenu-show');
		dropMenuIcon.classList.toggle('dropMenu-hide');
	}
}());

// slide down menu

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
	if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
		document.querySelector(".dropMenu-toggle").style.top = "0";
		document.querySelector(".nav-menu").style.top = "0";
	} else {
		document.querySelector(".dropMenu-toggle").style.top = "-50px";
		document.querySelector(".nav").classList.remove("dropMenu-show");
	}
}

// menu hide after click to link

$(document).ready(function() {
	$('.nav-menu__link').click(function() {
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