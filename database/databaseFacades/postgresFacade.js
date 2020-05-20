const { Pool, Client } = require('pg')


const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'jePerltRandomWebshop',
  password: '',
  port: 5432,
})


async function createPerson(person) {
  client.connect()
  let query = "INSERT INTO accounts(phonenumber, name) VALUES($1, $2)";
  const values = [person["phonenumber"], person["name"]];
  await client.query(query, values);
  client.end()
}

async function createCreditcard(creditCard) {
  try {
    let query = "INSERT INTO creditcards(cardnumber, verificationcode, expirationdate, fk_account) VALUES($1, $2, $3, $4)";
    const values = [creditCard["cardNumber"], creditCard["verificationCode"], creditCard["expirationDate"], creditCard["phoneNumber"]];
    await client.query(query, values);
  } catch (e) {
    throw "Could not create creditcard"
  }
}

/*
  {
    creditCard: {
      phoneNumber,
      verificationCode,
      cardNumber,
      expirationDate
    }
    amount
    orderId
  }
*/
async function createTransaction(transaction) {
  client.connect();
  let cd = transaction.creditCard;
  let checkCreditcardQuery = "SELECT * FROM creditcards WHERE cardnumber = $1";
  let response = await client.query(checkCreditcardQuery, [cd.cardNumber]);
  if (response.rowCount == 0) {
    await createCreditcard(cd);
  } else {
    let rc = response.rows[0];
    if (
      rc.verificationcode != cd.verificationCode ||
      rc.fk_account != cd.phoneNumber ||
      rc.expirationdate != cd.expirationDate) {
      console.log("false")
      throw "Creditcard does not have the right information";
    }
  }
  try {

    let createTransactionQuery = "INSERT INTO transactions(amount, fk_creditcards) values($1, $2)";
    let createTransactionValues = [transaction.amount, cd.cardNumber];
    await client.query(createTransactionQuery, createTransactionValues);
  } catch (e) {
    throw "Could not create transaction";
  }

  client.end();
}

createTransaction({
  creditCard: {
    phoneNumber: 28940903,
    verificationCode: 123,
    cardNumber: 1111111111111199,
    expirationDate: "11-11"
  },
  amount: 100
});

module.exports = { createPerson };