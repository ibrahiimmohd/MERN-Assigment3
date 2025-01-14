const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Student = mongoose.model('Student');

//
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
}
//
exports.create = function (req, res) {
    Student.findOne({ _id: req.body.creator }, (err, user) => {
        if (err) {
            return getErrorMessage(err);
        }
        //
        req.id = user._id;
        console.log('user._id', req.id);
    }).then(function () {
        console.log('in the then function');
        let course = new Course(req.body);
        course.creator = req.id;

        course.save((err) => {
            if (err) {
                console.log('error', getErrorMessage(err));

                return res.status(400).send({
                    message: getErrorMessage(err),
                });
            } else {
                res.status(200).json(course);
            }
        });
    });
};
//
exports.list = function (req, res) {
    Course.find({})
        // .sort('-created')
        // .populate('creator', 'firstName lastName fullName')
        .exec((err, articles) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err),
                });
            } else {
                res.status(200).json(articles);
            }
        });
};
//
exports.articleByID = function (req, res, next, id) {
    Article.findById(id)
        .populate('creator', 'firstName lastName fullName')
        .exec((err, article) => {
            if (err) return next(err);
            if (!article)
                return next(new Error('Failed to load article ' + id));
            req.article = article;
            console.log('in articleById:', req.article);
            next();
        });
};
//
exports.read = function (req, res) {
    res.status(200).json(req.article);
};
//
// exports.update = function (req, res) {
//     console.log('in update:', req.article);
//     const article = req.article;
//     article.title = req.body.title;
//     article.content = req.body.content;
//     article.save((err) => {
//         if (err) {
//             return res.status(400).send({
//                 message: getErrorMessage(err),
//             });
//         } else {
//             res.status(200).json(article);
//         }
//     });
// };
// //
// exports.delete = function (req, res) {
//     const article = req.article;
//     article.remove((err) => {
//         if (err) {
//             return res.status(400).send({
//                 message: getErrorMessage(err),
//             });
//         } else {
//             res.status(200).json(article);
//         }
//     });
// };
// //The hasAuthorization() middleware uses the req.article and req.user objects
// //to verify that the current user is the creator of the current article
// exports.hasAuthorization = function (req, res, next) {
//     console.log('in hasAuthorization - creator: ', req.article.creator);
//     console.log('in hasAuthorization - user: ', req.id);
//     //console.log('in hasAuthorization - user: ',req.user._id)

//     if (req.article.creator.id !== req.id) {
//         return res.status(403).send({
//             message: 'User is not authorized',
//         });
//     }
//     next();
// };
