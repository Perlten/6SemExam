const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'bolt://localhost',
  //Insert password
  //Perlt: admin
  //Jesper: Jeppe123#
  neo4j.auth.basic('neo4j', 'admin'),

)

async function runDijkstra(city1, city2) {
  return new Promise(async (resolve, reject) => {
    try {
      const session = driver.session();
      let res = await session.run(`
      MATCH(from: City{ name: $city1 }), (to: City{ name: $city2})
      CALL apoc.algo.dijkstra(from, to, 'Road', 'time') yield path as path, weight as weight
      RETURN path, weight
      `, {
        city1, city2
      });
      res.records.forEach(record => {
        let segments = record.get("path")["segments"];
        let nodes = segments.map(e => {
          let { name, population, region } = e["start"]["properties"];
          return {
            name, population, region
          };
        })
        let { name, population, region } = segments[segments.length - 1]["end"]["properties"];
        nodes.push({ name, population, region })
        resolve(nodes);
      })
    } catch (e) {
      reject(e);
    }
  })
}

// async function sickOfThisShit(){
//   var driver = neo4j.driver(
//     'neo4j://localhost',
//     neo4j.auth.basic('neo4j', 'Jeppe123#')
//   )
//   var session = driver.session({
//   })
//   return new Promise(async (resolve, reject) => {
//     let city1 = "Allerød"
//     let city2 = "Hillerød"

//     session
//   .run(`CREATE (user:User { username: "@xxxxbestulo" })`)
//   .then(r => {
//     console.log("r: ", r);
//     session.close();
//     driver.close();
//   })

//     resolve("LOL");
//   })


//   // Close the driver when application exits.
//   // This closes all used network connections.
//   await driver.close()
// }


async function main() {
  let res = await runDijkstra("Copenhagen", "Frederikssund")
  let resx = await runDijkstra("Copenhagen", "Aalborg")
  console.log(res)
  console.log(resx)
}

main();





