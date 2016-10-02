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

            // grab item data
            let item = $(e.relatedTarget).data('modal-data');

            // title
            if (item.title) modalContent.find('#title').text(item.title).show();
            else modalContent.find('#title').hide();

            // company/school/organization
            if (item.company) modalBody.find('#company').text(item.company.name).show();
            else modalBody.find('#company').hide();

            // description
            if (item.description) modalBody.find('#description').html(item.description).show();
            else modalBody.find('#description').hide();

            // start/end
            if (item.start) modalBody.find('#start').text(moment(item.start).format('MMMM YYYY')).show();
            else modalBody.find('#start').hide();
            if (item.end) modalBody.find('#end').text(moment(item.end).format('MMMM YYYY')).show();
            else modalBody.find('#end').hide();

            // courses
            let courseList = document.getElementById('courses');
            if (item.courses) {
                item.courses.forEach(function(title) {
                    let course = document.createElement('li');
                    course.textContent = title;
                    courseList.appendChild(course);
                });
            }
            else
                modalBody.find('#courses, #courses-heading').hide();
        };

        // triggered on modal 'show'
        $('#resume-modal').on('show.bs.modal', onModalShow);

        // kill modal on close
        $('body').on('hidden.bs.modal', '.modal', function () {
            $(this).removeData('bs.modal');
        });

    });

}();
