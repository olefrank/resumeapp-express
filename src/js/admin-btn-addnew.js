const $ = require('jquery');

exports = function() {

    $(function () {
        $(document).on('click', '.btn-admin-addnew', btnAddNewHandler);
    });

}();

// 'click' listen on Add New button
const btnAddNewHandler = function (e) {
    e.preventDefault();

    let btn = $(this).closest('.add-new-element');

    // parent form
    let form = btn.next().find('form');

    // get section
    let section = form.data('section');

    // get template
    $.get('/templates/' + section).then(function (html) {
        // insert
        $(html).hide().prependTo(".element-list-" + section).fadeIn("normal");
    });
};