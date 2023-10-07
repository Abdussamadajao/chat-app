const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: 'abdussamad',
    api_key: '313691848412826',
    api_secret: 'pT_OW5B7yd1wMEqCMRVAkMHB4vc'
})


uploadToCloundinary = (path, folder) => {
    return cloudinary.v2.uploader.upload(path, {
        folder
    }).then((data) => {
        return { url: data.url, public_id: data.public_id };
    }).catch((error) => {
        console.log(error);
    })
}



removeFromCloudinary = async (public_id) => {
    await cloudinary.v2.uploader.destroy(public_id, function (error, result) {
      console.log(result, error);
  })
}

module.exports = {uploadToCloundinary, removeFromCloudinary}
