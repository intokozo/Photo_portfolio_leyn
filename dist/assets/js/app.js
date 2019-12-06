document.onreadystatechange = function(){
  if(document.readyState === 'complete'){
    slider();
    fade();
  }
}

// ----------- Slider -----------
function slider() {
    var sliders = document.getElementsByClassName('slider');
    (function iterate(i = 0) {
        let slides = sliders[i].children;
        slides[0].style = 'opacity: 1';
        slideInterval(slides, 1, 5000)
        if (i < sliders.length - 1) {
            setTimeout(function() { iterate(i + 1); }, 300);
        }
    })(0);
};

function slideInterval(arrSlides, current, timeout) {
    return setInterval(function() {
        current == 0 ? arrSlides[arrSlides.length - 1].style = 'opacity: 0' : arrSlides[current - 1].style = 'opacity: 0'
        arrSlides[current].style = 'opacity: 1';
        current >= arrSlides.length - 1 ? current = 0 : current++;
    }, timeout);
}

// ------------ Fade ------------
function fade() {
  var elements = document.getElementsByClassName('cat');

  var visible = function (target) {
    var targetPosition = {
      top: window.pageYOffset + target.getBoundingClientRect().top,
      bottom: window.pageYOffset + target.getBoundingClientRect().bottom
      },
      windowPosition = {
      top: window.pageYOffset,
      bottom: window.pageYOffset + document.documentElement.clientHeight
      };

    if (targetPosition.bottom > windowPosition.top &&
        targetPosition.top < windowPosition.bottom) {
        if(target.num % 2 == 0) {
        target.classList.add('fadeInRight');
        } else {
          target.classList.add('fadeInLeft');
        }
    } else {
    };
  };

  window.addEventListener('scroll', function() {
    for(let i = 0; i < elements.length; i++) {
      elements[i].num = i;
      visible (elements[i]);
    }
  });
};

// ---------- Sliding -----------
// собираем все якоря; устанавливаем время анимации и количество кадров
const anchors = [].slice.call(document.querySelectorAll('a[href*="#"]')),
      animationTime = 300,
      framesCount = 20;

anchors.forEach(function(item) {
  // каждому якорю присваиваем обработчик события
  item.addEventListener('click', function(e) {
    // убираем стандартное поведение
    e.preventDefault();
    
    // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
    let coordY = document.querySelector(item.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset;
    
    // запускаем интервал, в котором
    let scroller = setInterval(function() {
      // считаем на сколько скроллить за 1 такт
      let scrollBy = coordY / framesCount;
      
      // если к-во пикселей для скролла за 1 такт больше расстояния до элемента
      // и дно страницы не достигнуто
      if(scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
        // то скроллим на к-во пикселей, которое соответствует одному такту
        window.scrollBy(0, scrollBy);
      } else {
        // иначе добираемся до элемента и выходим из интервала
        window.scrollTo(0, coordY);
        clearInterval(scroller);
      }
    // время интервала равняется частному от времени анимации и к-ва кадров
    }, animationTime / framesCount);
  });
});

// ---------- Button Up ----------

window.top = {};
var sc = window.top;

sc.time = 12; // время прокручивания

sc.goTop = function (time, acceleration) {
	acceleration = acceleration || 0.1;
	time = time || sc.time;

	var dx = 0;
	var dy = 0;
	var bx = 0;
	var by = 0;
	var wx = 0;
	var wy = 0;

	if (document.documentElement) {
		dx = document.documentElement.scrollLeft || 0;
		dy = document.documentElement.scrollTop || 0;
	}
	if (document.body) {
		bx = document.body.scrollLeft || 0;
		by = document.body.scrollTop || 0;
	}
	var wx = window.scrollX || 0;
	var wy = window.scrollY || 0;

	var x = Math.max(wx, Math.max(bx, dx));
	var y = Math.max(wy, Math.max(by, dy));

	var speed = 1 + acceleration;
	window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));
	if(x > 0 || y > 0) {
		var invokeFunction = "window.top.goTop("+ time +")"
		window.setTimeout(invokeFunction, time);
	}
	return false;
}

sc.showHide = function (){
	var a = document.getElementById('gotop');

	if( ! a ){
		// если нет элемента добавляем его
		var a = document.createElement('a');
		a.id = "gotop";
		a.className = "scrollTop";
		a.href = "#";
		a.style.display = "none";
		a.style.position = "fixed";
		a.style.zIndex = "9999";
		a.onclick = function(e){ e.preventDefault(); window.top.goTop(); }
		document.body.appendChild(a);
	}

	var stop = (document.body.scrollTop || document.documentElement.scrollTop);
	if( stop > 300 ){
		a.style.display = 'block';
		sc.smoothopaque(a, 'show', 30, false);
	} else {
		sc.smoothopaque(a, 'hide', 30, function(){a.style.display = 'none';});
	}

	return false;
}

// Плавная смена прозрачности
sc.smoothopaque = function (el, todo, speed, endFunc){
	var 
	startop = Math.round( el.style.opacity * 100 ),
	op = startop,
	endop = (todo == 'show') ? 100 : 0;

	clearTimeout( window['top'].timeout );

	window['top'].timeout = setTimeout(slowopacity, 30);

	function slowopacity(){
		if( startop < endop ){
			op += 5;
			if( op < endop )
				window['top'].timeout = setTimeout(slowopacity, speed);
			else
				(endFunc) && endFunc();
		}
		else {
			op -= 5;
			if( op > endop ){
				window['top'].timeout = setTimeout(slowopacity, speed);
			}
			else
				(endFunc) && endFunc();
		}

		// установка opacity
		el.style.opacity = (op/100);
		el.style.filter = 'alpha(opacity=' + op + ')';
	}
}

if (window.addEventListener){
	window.addEventListener("scroll", sc.showHide, false);
	window.addEventListener("load", sc.showHide, false);
}
else if (window.attachEvent){
	window.attachEvent("onscroll", sc.showHide);
	window.attachEvent("onload", sc.showHide);
}