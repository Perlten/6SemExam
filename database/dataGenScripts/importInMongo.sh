node generateProductData.js
node generateOrderData.js

mongo < deleteCollections.txt

mongoimport --jsonArray --db jePerltRandomWebshop --collection products --file productData.json
mongoimport --jsonArray --db jePerltRandomWebshop --collection orders --file orderData.json
