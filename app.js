const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');

const app = express();

// allow cross-origin requests
app.use(cors());

app.use('/api', graphqlHTTP({
  schema: schema
  //graphiql: true
}));

app.listen(4000, () => {
  console.log("now listening for requests on port 4000");
});
