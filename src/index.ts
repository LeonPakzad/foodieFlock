import path from 'path';
import express from "express";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/public', express.static(path.join(__dirname, "public")));

app.use('/', require('./controllers/routes'));

app.set('view engine', 'ejs');
  
app.listen(3000, () =>
  console.log('ElementKit ready at: http://localhost:3000'),
)