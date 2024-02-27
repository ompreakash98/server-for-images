
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require("fs");
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(cors());
app.use(cors());
// // app.use(cors({ origin: "*" }));
// app.use(cors({ origin: 'http://192.168.137.85:7000'}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
const username = 'omprakashblackbull';
const password = 'Om@BlackBull';  // Update with your actual password
const clusterName = 'cluster0';
const databaseName = 'userImage';


// Connect to MongoDB
const uri = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${clusterName}.y7w6p9o.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

// Define a schema for image data
const imageSchema = new mongoose.Schema({
  email: String,
  imagePath: String
});

const Image = mongoose.model('Image', imageSchema);


// // Configure Multer for handling file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const formattedDate = `${(date.getMonth() + 1)}-${date.getDate()}-${date.getFullYear()}.jpg`;
//         const dynamicFilename = `${formattedDate}_nameOfEmployee_.jpg`;
//     cb(null, formattedDate +path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// // Set up middleware
// app.use(express.json());

// // Mock database of employees
// let employees = [];

// // Endpoint for uploading image
// app.post('/upload', upload.single('image'), (req, res) => {
//   try {
//     const { name } = req.body;
//     const image = req.file;
//     console.log(image)
//     employees.push({ name, image });
//     const data=Image.create({employees})
//     res.status(200).json({ message: 'Image uploaded successfully',data });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Endpoint for uploading image as Base64 data


// // Endpoint for fetching employees
// app.get('/getImageoFEmployees', (req, res) => {
//   try {
//     const imageData=Image.find();
//     res.status(200).json({ employees });
//   } catch (error) {
//     console.error('Error fetching employees:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Serve uploaded images statically
// app.use('/uploads', express.static('uploads'));

// // Start the server
// app.listen(7000, () => {
//   console.log(`Server is running on http://localhost:7000`);
// });

// Write buffer to a file

app.post('/upload', async (req, res) => {
  try {
    const imageData = req.body.imageData;
    const email = req.body.email
    const base64Data = imageData;
    const uploadFolderPath = './uploads';
    if (!fs.existsSync(uploadFolderPath)) {
      fs.mkdirSync(uploadFolderPath);
    }
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[date.getMonth()]; // Get the month name

    const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options).replace(/,/g, '').replace(/ /g, '-');
    const dynamicFilename = `${formattedDate}_${email}.jpg`;


    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const filePath = path.join(uploadFolderPath, dynamicFilename);


    const imageBuffer = Buffer.from(base64Image, 'base64');
    fs.writeFile(filePath, imageBuffer, 'base64', (err) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Image saved successfully');
      }
    });
    if (!imageData) {
      return res.status(400).send('Image data is missing');
    }

    // Store image path in MongoDB
    const newImage = await Image.create({ email: email, imagePath: filePath });
    // console.log("Image uploaded:", newImage);

    res.status(200).send('Image uploaded successfully!');
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Internal server error');
  }
});
app.get('/api/images', async (req, res) => {
  try {
    const image = await Image.find({});
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    // Assuming the image data is stored as a base64 string in the database
    res.send({ imageData: image });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).send(images)
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Fetch all images from MongoDB and serve their URLs
app.get('/imagestest', async (req, res) => {
  try {
    const images = await Image.find();
    if (!images) {
      return res.status(404).send('No images found');
    }

    const imageUrls = images.map(image => {
      return {
        id: image._id,
        url: `http://localhost:7000/images/${image._id}`
      };
    });

    res.json(imageUrls);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).send('Internal server error');
  }
});


const PORT = process.env.PORT || 7000;
app.listen(7000, () => {
  console.log(`Server is running on port ${PORT}`);
});
















// // MongoDB Schema
// const imageSchema = new mongoose.Schema({
//   data: Buffer,
//   contentType: String,
// });
// const Image = mongoose.model('Image', imageSchema);

// // Route to save image
// app.post('/api/save-image', async (req, res) => {
//   try {
//     const { data, contentType } = req.body;
//     const image = new Image({
//       data: Buffer.from(data, 'base64'),
//       contentType,
//     });
//     await image.save();
//     res.status(200).send('Image saved successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error saving image');
//   }
// });

// // Route to get all images
// app.get('/api/get-images', async (req, res) => {
//   try {
//     const images = await Image.find();
//     res.json(images);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching images');
//   }
// });

// const PORT = process.env.PORT || 7000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

























//defing the schema for image


// const imageSchema=new mongoose.Schema({
//   data:String
// })

// const Image=mongoose.model("Image",imageSchema)
// //now i am routing the image for uploade

// app.post('/upload', async (req,res)=>{

//   const {imageData}=req.body
//   if(!imageData){
//     res.status(200).send("image  data is missing");
//   }
//   const data= await Image.create({data:imageData})
//   console.log("data of iamge",data)

//   res.status(200).send("image is uploaded sucessfull")

// })