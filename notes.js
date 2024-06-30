// any argument we pass into next(), express assume that it is an error

// global middleware for not found routes [it has to be after all working middwares]

// when give 4 params to middleware, express automatically assume that it is error handler
// ex: app.use((err, req, res, next)) the error has to be the first

// the global route handler middle ware has to be after the working middlewares in the code

// let response = `Result:\n{\n  startLocation: {\n    description: 'Miami, USA',\n    type: 'Point',\n    coordinates: [ -80.185942, 25.774772 ],\n    address: '301 Biscayne Blvd, Miami, FL 33132, USA'\n  },\n  _id: new ObjectId('65f074468c67cb3c5230cb60'),\n}`;

// // Step 1: Preprocess the string
// // Remove the leading "Result:\n" part and fix known JavaScript-specific syntax issues.
// response = response.substring(8); // Remove "Result:\n"

// response = response.replace(/new ObjectId\('([^']+)'\)/g, '"$1"'); // Convert ObjectId to string
// // console.log('response2 :>> ', response);
// response = response.replace(/'/g, '"'); // Convert single quotes to double quotes
// // console.log('response3 :>> ', response);
// // Assume [Array] can be replaced with [], or more specific handling as needed
// response = response.replace(/\[Array\]/g, "[]");

// // Step 2: Convert to a JavaScript object
// // This uses new Function() to avoid the risks associated with eval()
// // Note: This is still risky if the content of `response` is not controlled or sanitized
// const obj = new Function("return " + response)();

// // Step 3: Serialize to JSON
// const json = JSON.stringify(obj, null, 2); // Pretty print the JSON
// or let out = eval(`[${text}]`);

// console.log(json);
