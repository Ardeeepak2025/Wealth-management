"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const holdingsController_1 = require("../controllers/holdingsController");
const router = (0, express_1.Router)();
router.get("/", holdingsController_1.listHoldings);
router.get("/:id", holdingsController_1.getHolding);
exports.default = router;
