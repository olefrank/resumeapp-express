const $ = require('jquery');
const toastr = require('toastr');
const url = "/resume/admin";

exports = function() {

    $(function () {
        $(document).on('click', '.btn-admin-delete', btnDeleteHandler);
    });

}();

// 'click' listen on Delete button
const btnDeleteHandler = function (e) {
    e.preventDefault();

    let btn = $(this);

    // parent form
    let form = $(this).closest('form');

    // get section/id
    let data = {};
    data.section = form.data('section');
    data._id = form.attr('id');

    // new element - not in database yet
    if (!data._id) {
        removeElement(btn, $(this));
    }
    // http DELETE
    else {
        if (confirm('Vil du slette elementet?')) {
            $.ajax({
                method: "DELETE",
                url: url,
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).done(function (data, textStatus, jqXHR) {
                removeElement(btn, $(this));
                toastr.success(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                toastr.error(jqXHR.responseText);
            });
        }
    }
};

// remove dom element
const removeElement = function(context, elem) {
    context.closest('.admin-element').hide('normal', function () {
        elem.remove();
    });
};