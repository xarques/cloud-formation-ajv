const Ajv = require('ajv');
const fs = require('fs');
const ajv = new Ajv({allErrors: true});

const addDependencies = (() => {
  // Synchronous read
  const basicTypes = JSON.parse(fs.readFileSync('./schemas/basic_types.json', 'utf8'));
  // Synchronous read
  const resource = JSON.parse(fs.readFileSync('./schemas/resource.json', 'utf8'));
  // Add basic_types schema
  ajv.addSchema(basicTypes);
  // Add resource schema
  ajv.addSchema(resource);
});

const compile = ((jsonSchemaFile) => {
  addDependencies();
  // Synchronous read
  const jsonSchema = JSON.parse(fs.readFileSync(jsonSchemaFile, 'utf8'));
  // Compile cloud-formation-schema
  return ajv.compile(jsonSchema);
});

// Compile cloud-formation-schema
// const validate = compile('./schemas/cloud-formation-schema.json');
const validate = compile('./schemas/s3-creation-schema.json');

// Define test function
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
        }
      }
    }
  }
);

test(
  {"Resources" :
    { "MyXavierArquesBucket" :
      { "Type" : "AWS::S3::Bucket",
      }
    }
  }
);

// test(
//   {"Resources" :
//     { "MyXavierArquesBucket" :
//       { "Type" : "AWS::S3::Bucket",
//         "Properties": {
//           "AccessControl": "PublicRead",
//           "WebsiteConfiguration": {
//               "IndexDocument": "index.html",
//               "ErrorDocument": "error.html"
//           }
//         },
//         "DeletionPolicy": "Retain"
//       }
//     }
//   }
// );
// test(
//   {"Resources" :
//     { "MyXavierArquesBucket" :
//       { "Type" : "AWS::S3::Bucket",
//         "Properties": {
//           "AccessControl2": "PublicRead",
//           "WebsiteConfiguration": {
//               "IndexDocument": "index.html",
//               "ErrorDocument": "error.html"
//           }
//         },
//         "DeletionPolicy": "Retain"
//       }
//     }
//   }
// );
