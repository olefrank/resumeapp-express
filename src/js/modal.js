const $ = require('jquery');
const moment = require('moment');
require('moment/locale/da');
require('bootstrap');

exports = function() {

    $(function() {
        let modalContent = $('#modal-content'),
            modalBody = $('#modal-body'),
            classlist;

        const onModalShow = function (e) {
            let type = $(e.relatedTarget).data('panel-type');
            classlist = `modal-content panel-${type}`;
            modalContent.attr('class', classlist);

            //get data-id attribute of the clicked element
            let exp = $(e.relatedTarget).data('modal-data');

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
        };

        // triggered on modal 'show'
        $('#resume-modal').on('show.bs.modal', onModalShow);

        // kill modal on close
        $('body').on('hidden.bs.modal', '.modal', function () {
            $(this).removeData('bs.modal');
        });

    });

}();
