var $ = require('jquery');

exports = function() {

    $(function () {
        $('a[href*="#"]:not([href="#"])').on('click', function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {

                // target id
                var target = $(this.hash);

                // switch active class
                $('.active').removeClass('active');
                //$('.navbar').find(`a[href*='${this.hash}']`).closest('li').addClass('active');
                target.parent().addClass('active');

                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 20
                    }, 600);
                    return false;
                }
            }
        });
    });

}();
