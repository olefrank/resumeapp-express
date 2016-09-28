var $ = require('jquery');

exports = function() {

    let $el,
        $parent,
        $paragraphs,
        totalHeight;

    // 'click' listen on Read More button
    $(document).on('click', '#profile .read-more', function () {
        totalHeight = 0;

        $el = $(this);
        $parent = $el.parent();
        $paragraphs = $parent.find("p");

        // measure how tall inside should be by adding together heights of all inside paragraphs (except read-more paragraph)
        $paragraphs.each(function () {
            totalHeight += $(this).outerHeight();
        });

        $parent.css({
                // Set height to prevent instant jumpdown when max height is removed
                "height": $parent.height(),
                "max-height": 9999
            })
            .animate({
                "height": totalHeight
            }, 400);

        // fade out read-more
        $el.css({"display": "none"});

        // prevent jump-down
        return false;
    });

}();
