"use strict";

// skills click handler
$(function () {
    var btnMore = $('#btn-skills-more');

    var skillsClickHandler = function (e) {
        btnMore.toggleClass('skills-more');
        btnMore.toggleClass('skills-less');
    };

    $(document).on('click', '#btn-skills-more', skillsClickHandler);
});


// smooth scroll to anchor
$(function () {
    $('a[href*="#"]:not([href="#"])').on('click', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);

            // switch active class
            $('.active').removeClass('active');
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


// modal
$(function () {

    var panelType;
    var modalContent;
    var modalBody;

    //triggered when modal is about to be shown
    $('#resume-modal').on('show.bs.modal', function (e) {

        modalContent = $('#modal-content');
        modalBody = $('#modal-body');

        var type = $(e.relatedTarget).data('panel-type');
        if (type !== panelType) {
            modalContent.addClass('panel-' + type);
            modalContent.removeClass('panel-' + panelType);
            panelType = type;
        }

        //get data-id attribute of the clicked element
        var exp = $(e.relatedTarget).data('modal-data');

        if (exp.title) modalContent.find('#title').text(exp.title).show();
        else modalContent.find('#title').hide();

        //if (exp.degree) modalContent.find('#degree').text(exp.degree).show();
        //else modalContent.find('#degree').hide();

        if (exp.company) modalBody.find('#company').text(exp.company.name).show();
        else modalBody.find('#company').hide();

        //if (exp.school) modalBody.find('#school').text(exp.school).show();
        //else modalBody.find('#school').hide();

        if (exp.description) modalBody.find('#description').text(exp.description).show();
        else modalBody.find('#description').hide();

        if (exp.start) modalBody.find('#start').text(moment(exp.start).format('MMMM YYYY')).show();
        else modalBody.find('#start').hide();

        if (exp.end) modalBody.find('#end').text(moment(exp.end).format('MMMM YYYY')).show();
        else modalBody.find('#end').hide();
    });
});


// kill modal on close
$('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
});


// 'read more' slide down
$(function () {

    var $el, $p, $ps, $up, totalHeight;

    $("#profile .read-more").on('click', function () {
        totalHeight = 0;

        $el = $(this);
        $p = $el.parent();
        $ps = $p.find("p");

        // measure how tall inside should be by adding together heights of all inside paragraphs (except read-more paragraph)
        $ps.each(function () {
            totalHeight += $(this).outerHeight();
        });

        $p.css({
                // Set height to prevent instant jumpdown when max height is removed
                "height": $p.height(),
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
});


// admin btns
$(function () {

    var btnSaveHandler = function (e) {
        e.preventDefault();

        var data;

        // parent form
        var form = $(this).closest('form');

        // elem id
        var id = form.attr('id');

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

    function getData(form, expandProps) {
        var item;
        var data = {};

        var id = form.attr('id');
        var section = form.data('section');

        if (id) data._id = id;
        if (section) data.section = section;

        // collect data from each field
        $(form).find('.resume-form-field').each(function () {
            item = $(this)[0];
            var path = item.dataset.prop;
            var val = item.innerHTML || item.checked || item.value;

            // create nested structure
            if (expandProps) {
                set(data, path, val);
            }
            // create flat structure
            else {
                data[path] = val;
            }
        });
        return JSON.stringify(data);
    }

    function set(obj, path, value) {
        var schema = obj;  // a moving reference to internal objects within obj
        var arr = path.split('.');
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var elem = arr[i];
            if (!schema[elem]) schema[elem] = {};
            schema = schema[elem];
        }
        schema[arr[len - 1]] = value;
        return schema;
    }

    var btnDeleteHandler = function (e) {
        e.preventDefault();

        var btn = $(this);
        // parent form
        var form = btn.closest('form');

        // get section/id
        var data = {};
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
                    url: "/admin",
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
    var removeElement = function(context, elem) {
        context.closest('.admin-element').hide('normal', function () {
            elem.remove();
        });
    };

    var btnAddNewHandler = function (e) {
        e.preventDefault();

        var btn = $(this).closest('.add-new-element');

        // parent form
        var form = btn.next().find('form');

        // get section
        var section = form.data('section');

        // get template
        $.get('/templates/' + section).then(function (html) {
            // insert
            $(html).hide().prependTo(".element-list-" + section).fadeIn("normal");
        });
    };

    // admin SAVE data
    $(document).on('click', '.btn-admin-save', btnSaveHandler);

    // admin DELETE data
    $(document).on('click', '.btn-admin-delete', btnDeleteHandler);

    // show 'add new' template
    $(document).on('click', '.btn-admin-addnew', btnAddNewHandler);
});


// admin tabs
$(function () {
    $('#admin-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
});