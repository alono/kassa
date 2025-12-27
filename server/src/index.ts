import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import routes from './routes/index.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// HTTP Request Logging
app.use(pinoHttp({
  logger,
  // Remove the full request and response objects from the logs
  serializers: {
    req: () => undefined,
    res: () => undefined,
  },
  // Customizing request logging to be more concise
  customProps: (req, res) => ({
    context: 'http'
  })
}));

// API Routes
app.use('/api', routes);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
