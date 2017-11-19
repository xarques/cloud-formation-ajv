const Ajv = require('ajv');
const fs = require('fs');
const ajv = new Ajv({allErrors: true});

const schema = {
  "properties": {
    "foo": { "type": "string" },
    "bar": { "type": "number", "maximum": 3 }
  }
};

fs.readFile('./schemas/cloud-formation-schema.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  // console.log(data);
  const validate = ajv.compile(JSON.parse(data));
  const test = ((data) => {
    const valid = validate(data);
    if (valid) console.log('Valid!');
    else console.log('Invalid: ' + ajv.errorsText(validate.errors));
  });
  test({"foo": "abc", "bar": 2});
});



// const validate = ajv.compile(schema);

// test({"foo": "abc", "bar": 2});
// test({"foo": 2, "bar": 4});

// function test(data) {
//   const valid = validate(data);
//   if (valid) console.log('Valid!');
//   else console.log('Invalid: ' + ajv.errorsText(validate.errors));
// }
