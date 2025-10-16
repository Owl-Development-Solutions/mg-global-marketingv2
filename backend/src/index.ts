import express from 'express';

//routes import
import geonology from './routes/geonology';
import bodyParser from 'body-parser';

const app = express();

//middleware
app.use(bodyParser.json());

//routes
app.use('/api/geonology', geonology);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
