const $ = require('jquery');

let skills,
    arrow;

exports = function() {
    $(function () {
        skills = $('.skills-header-section');
        arrow = $('.skills-header-arrow');

        $(document).on('click', '.skills-header-section', skillsClickHandler);
    });
}();

const skillsClickHandler = function (e) {
    arrow.toggleClass('skills-more');
    arrow.toggleClass('skills-less');
};
