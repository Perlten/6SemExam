const fs = require("fs");

function readData(path){
    return JSON.parse(fs.readFileSync(path));
}

function createCitiesData(){
    let data = readData("cities.json")
    for (let i = 0; i < data.length; i++) {
        let city = data[i]

        if(city["population"] == "") city["population"] = "unknown"

        createCity(city["city"], city["population"], city["admin"])
    }
}

function createCity(name, population, region) {
    let data = `CREATE(c:City {name: "${name}", population:${population}, region:"${region}"});\n`;
    saveData("citiesNeo4jRelations.txt", data)
}

function createRelationBetweenCities(city1, city2, time) {
    let data = `MATCH(c:City), (c1:City) WHERE c.name = "${city1}" AND c1.name = "${city2}" CREATE(c)-[:Road{time:${time}}]->(c1);\n`;
    saveData("citiesNeo4jRelations.txt", data)
}


function saveData(path, data) {
    fs.appendFileSync(path, data);
}


let regionsConnected = {
    Hovedstaden:"Sjælland",
    Sjælland:"Syddanmark",
    Syddanmark:"Midtjylland",
    Midtjylland:"Nordjylland"
}

function createRelationsBetweenCitiesBasedOnRegions(){
    let data = readData("cities.json")
    for (let i = 0; i < data.length; i++) {
        let counter = 0;
        let city = data[i]
        
        while(counter != 3){
            console.log("hejsa")
            let cityFound = getRandomElement(data)
            console.log("hejsa2")
            if(city["admin"] == cityFound["admin"]){
                console.log("hejsa3")
                createRelationBetweenCities(city["name"], cityFound["name"], getRandomNumber(10, 90))
                counter++;
            }
        }
        
        // counter = 0;
        
        // while(counter != 2){
        //     let cityFound = getRandomElement(data)
        //     if(regionsConnected[city["admin"]] == cityFound["admin"]){
        //         createRelationBetweenCities(city["name"], cityFound["name"], getRandomNumber(90, 200))
        //         counter++;
        //     }
        // }
        
    }
}

function getRandomElement(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function getRandomNumber(min, max){
    return Math.round(Math.random() * (max - min) + min)
}
// createCitiesData();
createRelationsBetweenCitiesBasedOnRegions();