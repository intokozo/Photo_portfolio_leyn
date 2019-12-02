(function() {
    var sliders = document.getElementsByClassName('slider');
    for (let i = 0; i < sliders.length; i++) {
        let slides = sliders[i].children;
        slides[0].style = 'opacity: 1';
        setTimeout(slideInterval(slides, 0, 6000), 1000);
    }
}());

function slideInterval(arrSlides, current, timeout) {
    return setInterval(function() {
        current == 0 ? arrSlides[arrSlides.length - 1].style = 'opacity: 0' : arrSlides[current - 1].style = 'opacity: 0'
        arrSlides[current].style = 'opacity: 1';
        console.log(current);
        current >= arrSlides.length - 1 ? current = 0 : current++;
    }, timeout);
}