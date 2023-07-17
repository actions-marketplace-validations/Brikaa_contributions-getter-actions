const inputs = JSON.parse(process.argv[2]);
const keys = Object.keys(inputs);
if (process.argv.length === 3) console.log(keys.length);
else
  console.log(
    keys.map((key) => `${key.toUpperCase().replace(/-/g, "_")}=${inputs[key]}`)[
      parseInt(process.argv[3]) - 1
    ],
  );
