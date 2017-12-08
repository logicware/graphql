import express from 'express';

import db from '../db/models';
import bodyParser from "body-parser";
import {graphiqlExpress, graphqlExpress} from "graphql-server-express/dist/index";
import schema from "../schema";

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



router.use('/graphql', bodyParser.json(), graphqlExpress({context: {db}, schema}));

router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql'}));



export default router;
