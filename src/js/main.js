"use strict";

// skills click handler
$(function() {
    var btnSkillsMore = $('#btn-skills-more');
    var btnSkillsLess = $('#btn-skills-less');
    var skillsClickHandler = function(e) {
        btnSkillsMore.toggleClass('hidden');
        btnSkillsLess.toggleClass('hidden');
    };
    btnSkillsMore.on('click', skillsClickHandler);
    btnSkillsLess.on('click', skillsClickHandler);
});

// smooth scroll to anchor
$(function() {
    $('a[href*="#"]:not([href="#"])').on('click', function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);

            // switch active class
            $('.active').removeClass('active');
            target.parent().addClass('active');

            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
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
$(function() {

    var panelType;
    var modalContent;
    var modalBody;

    //triggered when modal is about to be shown
    $('#resume-modal').on('show.bs.modal', function(e) {

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

        if (exp.degree) modalContent.find('#degree').text(exp.degree).show();
        else modalContent.find('#degree').hide();

        if (exp.company) modalBody.find('#company').text(exp.company).show();
        else modalBody.find('#company').hide();

        if (exp.school) modalBody.find('#school').text(exp.school).show();
        else modalBody.find('#school').hide();

        if (exp.description) modalBody.find('#description').text(exp.description).show();
        else modalBody.find('#description').hide();

        if (exp.start) modalBody.find('#start').text(exp.start).show();
        else modalBody.find('#start').hide();

        if (exp.end) modalBody.find('#end').text(exp.end).show();
        else modalBody.find('#end').hide();
    });
});

// ofj: kill modal on close
$('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
});

// 'read more' slide down
$(function() {

    var $el, $p, $ps, $up, totalHeight;

    $("#profile .btn").on('click', function() {

        totalHeight = 0;

        $el = $(this);
        $p  = $el.parent();
        $up = $p.parent();
        $ps = $up.find("p:not('.read-more')");

        // measure how tall inside should be by adding together heights of all inside paragraphs (except read-more paragraph)
        $ps.each(function() {
            totalHeight += $(this).outerHeight();
        });

        $up
            .css({
                // Set height to prev   ent instant jumpdown when max height is removed
                "height": $up.height(),
                "max-height": 9999
            })
            .animate({
                "height": totalHeight
            },600);

        // fade out read-more
        $p.fadeOut();

        // prevent jump-down
        return false;

    });

});