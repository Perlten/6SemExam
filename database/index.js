const express = require('express');
const bodyParser = require('body-parser')

const neo4jFacade = require("./databaseFacades/neo4jFacade")
const mongoFacade = require("./databaseFacades/mongoFacade")
const redisFacade = require("./databaseFacades/redisFacade")

const app = express();

app.use(bodyParser.json());

const PORT = 3000;

/*
  {
    name,
    products,
    phonenumber,
    cityTo
  }
*/
app.post('/createOrder', async function (request, response) {
  let order = request.body;
  // TODO: check that payment is okay 
  try {
    order["cityFrom"] = "Copenhagen";
    order["date"] = new Date();
    order["isDelivered"] = false;
    order["route"] = await neo4jFacade.runDijkstra(order["cityFrom"], order["cityTo"]);
    await mongoFacade.createOne(order, "orders");
    response.json(order);
  } catch (e) {
    response.json(e);
  }
})


/*
  {
    from,
    to,
    time
  }
*/
app.put("/updateRoad", async function (request, response) {
  try {
    let { from, to, time } = request.body;
    await neo4jFacade.updateRoad(from, to, time);
    let orderList = await mongoFacade.findOrdersWithCityConnection(to);

    for (let order of orderList) {
      let route = await neo4jFacade.runDijkstra(order["cityFrom"], order["cityTo"]);
      await mongoFacade.update({ _id: order["_id"] }, { $set: { route } }, "orders");
    }
    response.json(orderList);
  } catch (e) {
    response.json(e);
  }
})

/*
  {
    key,
    value
  }
*/
app.post("/createBasket", async function (request, response) {
  try {
    let { basket, key } = request.body;
    await redisFacade.write(key, basket);
    response.json({ basket, key });
  } catch (e) {
    response.json(e);
  }
});

/*
{
  key
}
*/
app.get("/getBasket", async function (request, response) {
  try {
    let { key } = request.body;
    response.json(await redisFacade.get(key));
  } catch (e) {
    response.json(e);
  }
});



app.listen(PORT, () => {
  console.log("Server listen on port: " + PORT);
});