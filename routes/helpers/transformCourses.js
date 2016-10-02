
exports.addNewline = function(educations) {
    if (educations) {
        educations = educations.map(function(edu) {
            edu.courses.da = edu.courses.da.map(function(c) {
                return c + "\n";
            });
            edu.courses.en = edu.courses.en.map(function(c) {
                return c + "\n";
            });
            return edu;
        });
    }
    return educations;
};

exports.toArray = function(education) {
    if (education) {
        education.courses.da = education.courses.da.split("\n");
        education.courses.en = education.courses.en.split("\n");
    }
    return education;
};
