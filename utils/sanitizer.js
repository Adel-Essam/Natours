const sanitizeHtml = require("sanitize-html");

// data sanitization against html injection in the body
const sanitizer = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach((ele) => {
            if (typeof req.body[ele] == "object") {
                // will skip the data inside the brackets
                return;
            }
            if (typeof req.body[ele] === Array) {
                return;
            }
            req.body[ele] = sanitizeHtml(req.body[ele], {
                allowedTags: [],
                allowedAttributes: {},
            });
        });
    }
    next();
};

module.exports = sanitizer;
