const express = require('express')
const app = express()

// MULTER
const multer = require('multer')

const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})

// POST ROUTE
app.post('/upload', (req, res, next) => {
  const upload = multer({ storage }).single('name-of-input-key')
  console.log('aaaaaaaaa a upload -------------'+upload.length)

  upload(req, res, function(err) {
    console.log('aaaaaaaaa a upload -------------'+req.file.path)

    if (err) {
      return res.send(err)
    }
    console.log('storage>>>>>>>>> '+storage.json);

    console.log('storage>>>>>>>>> '+upload.toString);

    console.log('file uploaded to server')
    console.log(req.file)

    // SEND FILE TO CLOUDINARY
    const cloudinary = require('cloudinary').v2
    cloudinary.config({
      cloud_name: 'dfdy5e4tt',
      api_key: '541229384356133',
      api_secret: 'sgi-YHV5MPbsVwoOhmIto323kao'
    })

    const path = req.file.path
    const uniqueFilename = new Date().toISOString()

    cloudinary.uploader.upload(
      path,
      { public_id: `blog/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
      function(err, image) {
        if (err) return res.send(err)
        console.log('file uploaded to Cloudinary')

        var fs = require('fs')
        fs.unlinkSync(path)

        res.json(image)
      }
    )
  })
})

app.listen(3001)
