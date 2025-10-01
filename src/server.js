import app from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port http://127.0.0.1:${port}`);
});
