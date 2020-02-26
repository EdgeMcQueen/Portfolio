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