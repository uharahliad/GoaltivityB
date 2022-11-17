const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const db = require('./db/models');
const config = require('./config');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');

const usersRoutes = require('./routes/users');

const goalsRoutes = require('./routes/goals');

const goal_categoriesRoutes = require('./routes/goal_categories');

const success_criteriaRoutes = require('./routes/success_criteria');

const action_itemsRoutes = require('./routes/action_items');

const accountability_groupsRoutes = require('./routes/accountability_groups');

const messagesRoutes = require('./routes/messages');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Goaltivity',
      description:
        'Goaltivity Online REST API for Testing and Prototyping application. You can perform all major operations with your entities - create, delete and etc.',
    },
    servers: [
      {
        url: config.swaggerUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);
app.use(
  '/api-docs',
  function (req, res, next) {
    swaggerUI.host = req.get('host');
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(specs),
);

app.use(cors({ origin: true }));
require('./auth/auth');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);

app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRoutes,
);

app.use(
  '/api/goals',
  passport.authenticate('jwt', { session: false }),
  goalsRoutes,
);

app.use(
  '/api/goal_categories',
  passport.authenticate('jwt', { session: false }),
  goal_categoriesRoutes,
);

app.use(
  '/api/success_criteria',
  passport.authenticate('jwt', { session: false }),
  success_criteriaRoutes,
);

app.use(
  '/api/action_items',
  passport.authenticate('jwt', { session: false }),
  action_itemsRoutes,
);

app.use(
  '/api/accountability_groups',
  passport.authenticate('jwt', { session: false }),
  accountability_groupsRoutes,
);

app.use(
  '/api/messages',
  passport.authenticate('jwt', { session: false }),
  messagesRoutes,
);

const publicDir = path.join(__dirname, '../public');

if (fs.existsSync(publicDir)) {
  app.use('/', express.static(publicDir));

  app.get('*', function (request, response) {
    response.sendFile(path.resolve(publicDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = app;
