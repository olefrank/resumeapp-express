const $ = require('jquery');
const toastr = require('toastr');
const url = "/resume/admin";

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
            data = getData(form);

            $.ajax({
                method: 'POST',
                url: url,
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
                url: url,
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
    const id = form.attr('id');
    const section = form.data('section');
    let data;
    let path;
    let val;

    data = {};
    if (id) data._id = id;
    if (section) data.section = section;

    // collect data from each field
    $(form).find('.resume-form-field').each(function () {
        path = $(this).data('prop');
        val = $(this).val() || $(this).text() || $(this).attr('checked');

        console.log($(this));

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