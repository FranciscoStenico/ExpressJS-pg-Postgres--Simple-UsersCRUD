import express from 'express';
import 'dotenv/config';
import userRoute from './routers/user.routes';
import sessionRoute from './routers/session.routes';
import { startDB } from './database';

const app = express();
app.use(express.json());
app.use('/users', userRoute);
app.use('/login', sessionRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  startDB();
  console.log(`server is running at port ${PORT}`);
});

export default app;
