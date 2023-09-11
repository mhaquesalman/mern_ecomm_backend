require('dotenv/config');
const app = require('./app');
const mongoose = require('mongoose');

global.__basedir = __dirname;

const DB = process.env.MONGODB_CLOUD_URL.replace('<PASSWORD>', process.env.MONGODB_CLOUD_PASSWROD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
.then(() => console.log("Connected to MongoDB!"))
.catch((err) => console.log("Failed to Connect MongoDB: "  + err));

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`App is running on port ${port}!`)
})


