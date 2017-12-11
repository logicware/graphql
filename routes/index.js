import express from 'express';

import db from '../db/models';
import bodyParser from "body-parser";
import {graphiqlExpress, graphqlExpress} from "graphql-server-express/dist/index";
import schema from "../schema";
import authenticate from './auth';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.json({
    title: 'Express'
  });
});


router.get('/test', (req, res) => {

  db.User.findAll().then(function(users) {
    res.json(users);
  });
});

const buildOptions = async (req, res) => {
  const user = await authenticate(req, db.User, db.Token);
  return {
    context: {db, user}, // This context object is passed to all resolvers.
    schema,
  };
};

router.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

router.use('/graphiql', graphiqlExpress(
  {
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoiVXNlciBGIiwiZXhwIjoxNTE4MTU5MTIzLCJpYXQiOjE1MTI5NzUxMjN9.8U2jnJliKovK8inYi47tX35-GzHY5Aua21MmCrJkH0I'`
  }
));



export default router;
