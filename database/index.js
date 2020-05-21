const express = require('express');
const bodyParser = require('body-parser')

const neo4jFacade = require("./databaseFacades/neo4jFacade")
const mongoFacade = require("./databaseFacades/mongoFacade")
const redisFacade = require("./databaseFacades/redisFacade")
const postgresFacade = require("./databaseFacades/postgresFacade")

const app = express();

app.use(bodyParser.json());

const PORT = 3000;

/*
  order: {
    name,
    products,
    cityTo
  }
  creditCardInfo:  {
    creditCard: {
      phoneNumber,
      verificationCode,
      cardNumber,
      expirationDate
    }
  }
*/
app.post('/createOrder', async function (request, response) {
  let { order, creditCardInfo } = request.body;
  try {
    order["phoneNumber"] = creditCardInfo["phoneNumber"];
    order["cityFrom"] = "Copenhagen";
    order["paymentConfirmed"] = false;
    order["date"] = new Date();
    order["isDelivered"] = false;
    order["route"] = await neo4jFacade.runDijkstra(order["cityFrom"], order["cityTo"]);
    let amount = order.products.reduce((total, e) => total + e.price, 0);
    let webShopOrderId = await mongoFacade.createOne(order, "orders");
    await postgresFacade.createTransaction({
      creditCard: creditCardInfo,
      amount,
      webShopOrderId
    })
    response.json(order);
  } catch (e) {
    // If user is not valid delete the order that was created
    response.json(e).status(400);
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
    response.json(e).status(400);
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
    response.json(e).status(400);
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
    response.json(e).status(400);
  }
});


async function syncConfirmedPayment() {
  let query = { paymentConfirmed: false };
  let orders = await mongoFacade.get(query, "orders");
  let transactions = await postgresFacade.getAllApprovedTransactions();
  let transactionsSet = new Set(transactions);
  for (let order of orders) {
    if (transactionsSet.has(order["_id"].toHexString())) {
      await mongoFacade.update({ _id: order["_id"] }, { $set: { paymentConfirmed: true } }, "orders");
    }
  }
}

// syncConfirmedPayment();
// Check every 10 min
setInterval(syncConfirmedPayment, 1000 * 60 * 10);


app.listen(PORT, () => {
  console.log("Server listen on port: " + PORT);
});