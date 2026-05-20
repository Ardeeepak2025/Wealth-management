"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const summaryController_1 = require("../controllers/summaryController");
const router = (0, express_1.Router)();
router.get("/:userId", summaryController_1.getSummary);
exports.default = router;
