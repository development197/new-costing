"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: 'digitalipsum',
    api_key: '467941342795696',
    api_secret: 'zM7ZBuXF22qw4YKMdIXNDXGAl8Q',
});
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinaryService.js.map