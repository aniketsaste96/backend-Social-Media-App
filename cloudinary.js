const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: 'dhzs7woaz',
    api_key: '559714519844697',
    api_secret: '8wOhGCBGhSvvFAsosF9Ro8yLIRQ'
});

module.exports = { cloudinary }
//export this in {}