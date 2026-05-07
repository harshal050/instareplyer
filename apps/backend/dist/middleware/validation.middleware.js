"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
exports.validateParams = validateParams;
function validate(schema, target = 'body') {
    return (req, _res, next) => {
        try {
            const data = target === 'body' ? req.body : target === 'query' ? req.query : req.params;
            const validated = schema.parse(data);
            if (target === 'body') {
                req.body = validated;
            }
            else if (target === 'query') {
                req.query = validated;
            }
            else {
                req.params = validated;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
function validateBody(schema) {
    return validate(schema, 'body');
}
function validateQuery(schema) {
    return validate(schema, 'query');
}
function validateParams(schema) {
    return validate(schema, 'params');
}
//# sourceMappingURL=validation.middleware.js.map