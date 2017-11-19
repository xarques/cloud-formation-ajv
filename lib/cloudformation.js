const Ajv = require('ajv');
const fs = require('fs');
// const ajv = new Ajv({allErrors: true});
const ajv = new Ajv();

const schema = {
  "properties": {
    "foo": { "type": "string" },
    "bar": { "type": "number", "maximum": 3 }
  }
};

const basicTypes = JSON.parse(fs.readFileSync('./schemas/basic_types.json', 'utf8'));
const resource = JSON.parse(fs.readFileSync('./schemas/resource.json', 'utf8'));
fs.readFile('./schemas/cloud-formation-schema.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  // console.log(data);
  ajv.addSchema(basicTypes);
  ajv.addSchema(resource);
  const validate = ajv.compile(JSON.parse(data));
  const test = ((data) => {
    const valid = validate(data);
    if (valid) {
      console.log('Valid!');
    }
    else {
      // console.log('Invalid: ' + ajv.errorsText(validate.errors));
      console.log('Invalid: ' + JSON.stringify(validate.errors[0]));
      console.log('Invalid: ' + JSON.stringify(validate.errors[0].params));
      if (validate.errors[0].params.additionalProperty) {
        console.log(`Unknown Property ${validate.errors[0].params.additionalProperty}`);
      }
      console.log('Invalid: ' + JSON.stringify(validate.errors[0].message));
    }
  });
  //test({"foo": "abc", "bar": 2});

  test(
    {"Resources" :
      { "MyXavierArquesBucket" :
        { "Type" : "AWS::S3::Bucket",
          "Properties": {
            "AccessControl": "PublicRead",
            "WebsiteConfiguration": {
                "IndexDocument": "index.html",
                "ErrorDocument": "error.html"
            }
          },
          "DeletionPolicy": "Retain"
        }
      }
    }
  );
  test(
    {"Resources" :
      { "MyXavierArquesBucket" :
        { "Type" : "AWS::S3::Bucket",
          "Properties": {
            "AccessControl2": "PublicRead",
            "WebsiteConfiguration": {
                "IndexDocument": "index.html",
                "ErrorDocument": "error.html"
            }
          },
          "DeletionPolicy": "Retain"
        }
      }
    }
  );
});




// const validate = ajv.compile(schema);

// test({"foo": "abc", "bar": 2});
// test({"foo": 2, "bar": 4});

// function test(data) {
//   const valid = validate(data);
//   if (valid) console.log('Valid!');
//   else console.log('Invalid: ' + ajv.errorsText(validate.errors));
// }
