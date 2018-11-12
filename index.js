const config = require('./common/config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {connectToDatabase} = require('./common/services/db.connection.service');
const OrdersRouter = require('./orders/routes.config');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const HTTP_SERVER_ERROR = 500;
const options = {
  explorer : true
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// connect to our database
connectToDatabase();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  res.header('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

app.use(bodyParser.json());



app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || HTTP_SERVER_ERROR).render('500');
});

OrdersRouter.routesConfig(app);

app.listen(config.port, function () {
  console.log('app listening at port %s', config.port);
});
