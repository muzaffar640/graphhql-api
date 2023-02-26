const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./server/schema/schema");
const mongoose = require("mongoose");
const port = process.env.PORT || 8000;
const cors = require("cors");

const app = express();

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphqlcluster.wrgriau.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen({ port: port }, () => {
      console.log("App is live on port " + port);
    });
  })
  .catch((e) => {
    console.log("Error::" + e);
  });
