const { Router } = require("express");
const { check } = require("express-validator");

const { createUser, login, renewToken } = require("../controllers/auth");
const { ValidateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

router.post("/", [
    check('password', 'password is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),

    ValidateFields
], login);

router.post("/new", [
    check('name', 'name is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),

    ValidateFields
], createUser);

router.get("/renew", validateJWT, renewToken);

module.exports = router;