const $ = require('jquery');
const toastr = require('toastr');

exports = function() {

    $(function () {
        $(document).on('click', '.btn-admin-save', btnSaveHandler);
    });

}();

// 'click' listen on Save button
const btnSaveHandler = function (e) {
    e.preventDefault();

    let data;

    // parent form
    let form = $(this).closest('form');

    // elem id
    let id = form.attr('id');

    // create new elem
    if (!id) {
        if (confirm('Vil du gemme elementet?')) {
            // collect data
            data = getData(form, false);

            $.ajax({
                method: 'POST',
                url: "/admin",
                data: data,
                contentType: 'application/json'
            }).done(function (data, textStatus, jqXHR) {
                toastr.success(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                toastr.error(jqXHR.responseText);
            });
        }
    }
    // update existing
    else {
        if (confirm('Vil du gemme ændringerne?')) {
            // collect data
            data = getData(form, true);

            $.ajax({
                method: 'PUT',
                url: "/admin",
                data: data,
                contentType: 'application/json'
            }).done(function (data, textStatus, jqXHR) {
                toastr.success(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                toastr.error(jqXHR.responseText);
            });
        }
    }
};

// collect data from form into JSON object
const getData = function(form, expandProps) {
    let item;
    let data = {};

    const id = form.attr('id');
    const section = form.data('section');
    let path;
    let val;

    if (id) data._id = id;
    if (section) data.section = section;

    // collect data from each field
    $(form).find('.resume-form-field').each(function () {
        item = $(this)[0];
        path = item.dataset.prop;
        val = item.innerHTML || item.checked || item.value;

        // create nested structure
        if (expandProps) {
            expandObject(data, path, val);
        }
        // create flat structure
        else {
            data[path] = val;
        }
    });
    return JSON.stringify(data);
};

const expandObject = function(obj, path, value) {
    let schema = obj;  // a moving reference to internal objects within obj
    const arr = path.split('.');
    const len = arr.length;
    let elem;

    for (let i = 0; i < len - 1; i++) {
         elem = arr[i];
        if (!schema[elem]) schema[elem] = {};
        schema = schema[elem];
    }
    schema[arr[len - 1]] = value;
    return schema;
}