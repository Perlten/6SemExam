const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'neo4j://localhost',
  neo4j.auth.basic('neo4j', 'admin')
)

async function runDijkstra(city1, city2) {
  return new Promise(async (resolve, reject) => {
    const session = driver.session({
      database: "citydenmark.db"
    });
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
      console.log(nodes);
    })


  })
  resolve("LOL");
}


async function main() {
  await runDijkstra("Copenhagen", "Hillerød");
}

main();





