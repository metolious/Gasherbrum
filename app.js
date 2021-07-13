const http = require('http');
var express = require('express')
//  app = express.createServer();
const app = express();
const { Pool, Client } = require('pg');
const router = express.Router();

var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
// var conn = "postgres://postgres:NAS@localhost:5432/k2";
var conn = "postgres://postgres:NAS@localhost:5432/postgres";
var db = pgp(conn);

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // res.header('Access-Control-Allow-Headers', 'Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control');
  next();
}

app.use(allowCrossDomain);
// app.use(express.bodyparser());

const client = new Client();
// add peice of middleware to parse json in body of request 
// (not enabled by default in express)
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

var config = {
    host: 'localhost',
    user: 'postgres',
    password: 'NAS',
    database: 'k2'
}

var pool = new Pool(config);

app.get('/', (req, res, next) => {
  console.log(`indexjs: get /get-routes returns obj = [{ "route(3)": "/" }, { "route(4)": "/upload" }]`)
    var status = "200"
    var jsonObject = [{ "route(3)": "/" }, { "route(4)": "/upload" }]
    res.status(status).send(jsonObject)
  });

app.get('/mie/resources/vessel/getforupdate/sconum/:sconum', (req, res, next) => {
// console.log(`indexjs: put /get-routes JSON.stringify(req.body[0]) = ${JSON.stringify(req.body[0])}`)
console.log(`indexjs: put /get-routes req.params.sconum = ${req.params.sconum}`)
  var status = "200"
  // var jsonObject = [{ "route(3)": "/get-routes" }, { "route(4)": "/upload" }]
  // var jsonObject = [{"label":"sconums","value":[req.params.sconum]},{"label":"securityLabel","value":"CONFIDENTIAL_REL_TO_USA_FVEY"},{"label":"aspect","value":"BROADSIDE"},{"label":"imageSource","value":"OPMARINE"},{"label":"iirNumbers","value":["22222"]},{"label":"otherSources","value":["33333"]},{"label":"imageDate","value":""},{"label":"amidshipsId","value":["11111"]},{"label":"primeImage","value":{"name":"True","value":1}},{"label":"distribution","value":{"name":"False","value":2}},{"label":"pageSize","value":{"name":"250","value":250}},{"label":"sortSelect","value":""},{"label":"sortOrder","value":{"name":"Ascending","value":"ASC"}},{"label":"sortField","value":"Image_Source"},{"label":"valCheck","value":[null]},{"label":"imoNumber","value":["55555"]},{"label":"mmsiNumber","value":["77777"]},{"label":"callSign","value":["SOS"]},{"label":"vesselName","value":[]},{"label":"modifiedBy","value":"JMORIARTY"},{"label":"approvedBy","value":"JWATSON"},{"label":"uploadedBy","value":"JMORIARTY"}]
  var jsonData = {"DataSteward": "test", "Organization": "Nimitz OIC, ONI","Service": "Authoritative Maritime Service", "Database": "MSCDB", "DateExtracted": "2021-07-08T16:09:48Z", "VesselCloud": "test", "Link": "[http://www.oni.navy.mil<http://www.oni.navy.mil/]http://www.oni.navy.mil<http://www.oni.navy.mil/>", "Sconum": "M99999", "Imo": "6922975", "Mmsi": "574176166", "CallSign": "SOS", "VesselName": "MARKII", "ActiveIndicator": "ACTIVE", "ActiveIndicatorCode": "A", "VesselFlag": "NOR", "HomePort": "KINGSTOWN", "VesselFunctionType": "MERCHANT VESSEL", "VesselFunctionTypeCode": "M", "VesselType": "CARGO", "VesselTypeCode": "CGO", "VesselTypeDesignator": "DRY CARGO, BREAKBULK, GENERAL, MULTI-DECK", "VesselTypeDesignatorCode": "100", "VesselClass": "AMGUYEMA", "HullNumber": "616", "PrimaryImageAspect": "BDSD", "PrimaryImageGuid": "5FC17B1C59A611EAB950DF8C555979E4", "PrimaryImageUrlThumb": "https://samples:7443/mie/resources/msc/mscdb/file?id=M99999&guid=5FC17B1C59A611EAB950DF8C555979E4rendition=THUMB&extension=JPG", "PrimaryImageUrlProd": "https://samples:7443/mie/resources/msc/mscdb/file?id=M99999&guid=5FC17B1C59A611EAB950DF8C555979E4&rendition=PRODextension=JPG", "PrimaryImageSecurityLabel": "Secret", "GrossTons": 7684, "DeadWeightTons": 9573, "OverallLengthMeters": 133.1, "MaxBeamMeters": 18.8, "MaxDraftMeters": 9.1, "FunnelLocation": "AMIDSHIPS", "FunnelLocationCode": "2", "HullType": "RAISED1", "HullTypeCode": "5", "UprightSequence": "KMFK", "SuperstructureLocation": "AMIDNOTMULTI", "SuperstructureLocationCode": "20", "VesselSecurityLabel": "UNCLASSIFIED", "CommonDataTags": "test", "Identifier": "M99999", "CreatedDateTime": "1974-05-01T00:00:00Z", "ModifiedDateTime": "2021-07-04T11:34:47Z", "CreatedBy": "ZED2MSC_UPD", "ModifiedBy": "MSCDB", "SecurityLabel": "Unclassified", "Declassification": "20280410", "SiteId": "J0001", "Speed": 15, "FuelCapacity": 1016, "FuelConsumptionRate": 31, "OfficialRegistryNumber": "692205", "TrawlerType": "REFRIGERATEDFISH TRANSPORT", "TrawlerTypeCode": "TR", "MerchantPendant": "PT", "NumberSuperstructures": "ONE", "SternType": "ROUNDED", "SternTypeCode": "R", "LengthBetweenPerpendiculars": 118.4, "YearBuilt": 1968, "CountryBuilt": "SWE", "BuilderShipyard": "USR020017", "InactiveDate": "2008-09-19T15:04:33Z", "DisplacementFull": 18110, "DisplacementLight": 5570, "TpcmImmersion": 15, "NumberOfHolds": 3, "NumberOfCargoTanks": 40, "NumberOfRamps": 5, "RampLocation": "PORTONLY", "RampLocationCode": "PORT", "MaximumLaneLength": 15, "NumberOfPumps": 3, "NumberOfLifts": 2, "NumberOfHatches": 6, "NumberOfHatchesAbreast": 4, "LengthOfLargestHatch": 10.8, "WidthOfLargestHatch": 7.6, "AircraftFacilitiesType": "HELODECK", "AircraftFacilitiesTypeCode": "D", "DaysToProvision": 1, "NaturalGasTanks": 3, "NaturalGasDomes": 5, "MaximumLiftCapacity": 35, "CargoCapacityDwt": 5106, "UnfueledRange": 4, "CrewSize": 56, "PassengerBerth": 72, "GrainCapacity": 1060, "BaleCapacity": 8193, "ContainerCapacityTeu": 70, "NumberOfContainers": 1118, "RampCapacity": 20, "CumulativeLiquidCapacity": 50, "GasCapacity": 40, "RefrigeratedCapacity": 60, "PumpRate": 100, "NumberOfAutos": 3, "DeckSpace": 54310, "DieselFuelCapacity": 10, "OilCapacity": 80721}
  var jsonData2 = {"sconum":"M00007","Imo":"123456","Mmsi":"23456","CallSign":"SOS","Name":"Nimitz","Flag":"Italy","Speed":55555,"EngineName":"PrattWhitney","EngineModel":"V8","EngineSerialNumber":"45678","FuelConsumptionRate":67895,"EngineType":"V6","EngineTypeCode":"A75","EngineCylinders":32,"NumberOfEngines":10,"PropellorHorsePower":396,"ShaftRpm":6701,"ScrewsType":"Phillips","ScrewsTypeCode":"A45","NumberOfScrews":6823,"BladesPerScrew":400,"NumberOfThrusters":1000,"GeneratorKilowatts":2000,"ElectricalFrequency":60,"ElectricalVoltage":110,"ElectricalCurrentType":"DC","NumberOfGenerators":226,"EquipmentCode":"Z660","NaturalGasDomes":30302,"NaturalGasTanks":20,"UpdateVesselStatus":"Active","VesselFunctionType":"Full","VesselFunctionTypeCode":"R67","UpdateVesselImo":"T3947","UpdateVesselType":"Partial","NavalVesselCategory":"NEW","NavalVesselCategoryCode":"D8374","VesselDescription":"Battleship","VesselType":"E4728","VesselTypeCode":"J9933","VesselTypeDesignator":"Ng449","VesselTypeDesignatorCode":"7nG999","VesselClass":"Titan","YearMonthBuilt":"07/10/2021","KeelLaidDate":"07/10/2021","LaunchDate":"07/10/2021","InserviceDate":"07/10/2021","LaidUpDate":"07/10/2021","InactiveDate":"07/10/2021","UpdateTimestamp":"07/10/2021","AnalystLockTimestamp":"07/10/2021","SailedAsDate":"07/10/2021","CreatedDateTime":"07/10/2021","ModifiedDateTime":"07/10/2021","CapacityPlan":20499958,"FuelCapacity":10385,"RefrigeratedCapacity":506070,"CumulativeLiquidCapacity":699978,"MaximumLiftCapacity":30004,"GrainCapacity":395995,"BaleCapacity":29948,"DieselFuelCapacity":588873,"OilCapacity":49900450,"RampCapacity":993884,"GasCapacity":2203009,"CargoCapacityDwt":883774,"ContainerCapacityTeu":449995,"NumberOfContainers":33,"NumberOfHolds":400,"NumberOfCargoTanks":98,"NumberOfRamps":200,"NumberOfPumps":21,"NumberOfLifts":600,"NumberOfHatches":34,"NumberOfHatchesAbreast":3372,"NumberOfAutos":988,"PumpRate":9090,"UnfueledRange":6464,"DaysToProvision":500,"MaximumLaneLength":890,"OverallLengthMeters":5848,"LengthBetweenPerpendiculars":"lattitude","LengthOfLargestHatch":50,"WidthOfLargestHatch":77,"RampLength":99,"MaxBeamMeters":56788,"MaxDraftMeters":43467,"GrossTons":9977,"DeadWeightTons":335566,"DisplacementFull":111345,"DisplacementLight":4567888,"DeadweightScale":"Metric","RampLocation":"Side","RampLocationCode":"a99nn","DeckSpace":4966994,"UprightSequence":"ng77d5d","PhoneNumber":"48856638","ImsiNumber":"59996004","ImeiNumber":"n488d773","PhoneBrand":"Samsung","PhoneModel":"Droid","PhoneType":"Cell","SimSerialNumber":"c7d7r6","SimManufacturer":"Qualcomm","LocationFound":"Virginia","PrimaryImageAspect":"Angle","PrimaryImageGuid":"8d7s6j47d","PrimaryImageUrl":"http","PrimaryImageClassification":"Secret","DoubleHull":"Yes","HullType":"Circle","HullNumber":"n444ndd7","HullColor":"Green","SuperStructureColor":"Yellow","SuperstructureLocationCode":"n7777d","NumberSuperstructures":"599mdn","SuperStructureOffCenter":"Yes","SuperStructureLocation":"Bottom","FunnelColor":"Blue","FunnelLocation":"l44lldu","FunnelLocationCode":"a666d66","FunnelOffCenter":"d999dd","TwinAbreastFunnels":"Double","SternType":"Large","SternTypeCode":"n88dnn","SternAFrame":"xhhh3","DoubleSides":"Yes","DoubleBottom":"No","DispositionSconum":"M0033","updateId":"kc888f","ProcessState":"Inactive","Identifier":"7cchy6","Iir":"m88d88","TypeGroup":"j5555","Declassification":"Operational","OpsDesignation":"Active","SecurityLabel":"Secret","OfficialRegistryNumber":"n888f8","ZedRegistryNumber":9959996,"ActiveIndicator":"Yes","ActiveIndicatorCode":"z994","SatelliteAntenna":"Hexagonal","BridgeWings":"Pair","DroppedPoop":"Horizontal","RaisedForecastle":"Vertical","TpcmImmersion":22994,"WaterWashDownFittings":"No","SelfSustaining":"Yes","AircraftFacilitiesType":"Airport","AircraftFacilitiesTypeCode":"PHP","Disposition":"Docker","AnalystLock":"Master","RejectionReason":"fail","NavalPennant":"France","ControlSet":"z8949","TrawlerType":"Faster","TrawlerTypeCode":"Fast","MerchantPendant":"USA","GeneralArrangementPlan":"Agile","CrewSize":3000,"PassengerBerths":3019,"SailedAsType":"Ocean","SailedAsValue":"693459","Text":"dddd999","TextSequence":"xoxoxoxo","HatchesSameSize":"multiple","ShipManagerCountry":"France","ShipManager":"Wink","RegisteredOwner":"Shaquile","BeneficialOwner":483922,"HomePort":"Jersey","SiteId":"N9999","CountryBuilt":"Italy","BuilderShipyard":"Maine","CreatedBy":"Moriarty","ModifiedBy":"Watson","source":"Boston"}
  // res.status(status).send(req.body)
  res.status(status).send(jsonData2)
});

app.post('/mie/resources/vessel/save', (req, res, next) => {
  console.log(`app.js: post /save JSON.stringify(req.body[0]) = ${JSON.stringify(req.body[0])}`)
    var status = "200"
    var jsonObject = [{ "post(5)": "/image" }, { "post(6)": "/edit" }]
    res.status(status).send(req.body) 
    // res.status(status).send(jsonObject) 
  });

  app.post('/save', (req, res, next) => {
  console.log(`app.js: post /save JSON.stringify(req.body[0]) = ${JSON.stringify(req.body[0])}`)
    var status = "200"
    var jsonObject = [{ "post(5)": "/image" }, { "post(6)": "/edit" }]
    res.status(status).send(req.body) 
    // res.status(status).send(jsonObject) 
  });

  app.put('/save', (req, res, next) => {
    console.log(`app.js: put /save JSON.stringify(req.body[0]) = ${JSON.stringify(req.body[0])}`)
      var status = "200"
      var jsonObject = [{ "put(5)": "/image" }, { "put(6)": "/edit" }]
      res.status(status).send(req.body) 
      // res.status(status).send(jsonObject) 
    });

app.get('/cases-callback', (request, response) => {
  pool.query('select * from cases', (error, result) => {
    if (error) {
      throw error
    }
    console.log('/cases-callback result.rows: ' +result.rows)
    //response.status(200).json(result.rows)
    response.json(result.rows)
  });
});

app.put('/file/:id/:approval', (req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
  // res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  // next()
    db.any('update files set case_status=${approval} where id=${id}', req.params)
  .then(function () {
    res.status(200)
    .json({
      status: 'success',
      message: 'Updated one file'
    });
    })
    .catch(function (err) {
      return next(err);
    });
  });

  app.post('/viper/resources/upload', (req, res, next) => {
    console.log(`indexjs/viper/resources/upload req.body.url = ${req.body.url}`);
    
    db.none('INSERT INTO files (file_subject, file_location, file_type_id, file_detail, file_origin_id, case_id, case_status, poc_user, author)' +
    // 'VALUES (6, \'aa\', \'bb\', 30, \'cc\', 29);',
    'VALUES (${file_subject}, ${file_location}, ${file_type_id}, ${file_detail}, ${file_origin_id}, ${case_id}, \'Inactive\', ${poc_user}, ${author})',
    req.body)
    .then(function () {
      res.status(200)
      .json({
        status: 'success',
        message: 'Inserted one file'
      });
      })
      .catch(function (err) {
        return next(err);
      });
    });

    app.post('/file', (req, res, next) => {
      // req.body.file_type_id = parseInt(req.body.file_type_id);
      console.log(`indexjs/file uploadFiles.file.name = ${req.body.name}`);
      
      res.send(req.body.name)
      .then(function () {
        res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one file'
        });
        })
        .catch(function (err) {
          return next(err);
        });
      });

app.post('/files', (req, res, next) => {
  // req.body.file_origin_id = parseInt(req.body.file_origin_id);
  console.log(`indexjs uploadFiles.file.name = ${req.body.name}`);
  
  db.none('INSERT INTO files (file_subject, file_location, file_type_id, file_detail, file_origin_id, case_id, case_status, poc_user, author)' +
  // 'VALUES (6, \'cc\', \'aa\', 30, \'bb\', 29);',
  'VALUES (${file_subject}, ${file_location}, ${file_type_id}, ${file_detail}, ${file_origin_id}, ${case_id}, \'Inactive\', ${poc_user}, ${author})',
  req.body)
  .then(function () {
    res.status(200)
    .json({
      status: 'success',
      message: 'Inserted one file'
    });
    })
    .catch(function (err) {
      return next(err);
    });
  });

app.get('/files-promise', (req, res, next) => {
  console.log(`indexjs./files-promise JSON.stringify(req.body) = ${JSON.stringify(req.body)}`);
  db.any('select * from files')
  .then(function (data) {
    res.status(200)
    .json({
      data
    });
  })
  .catch(function(err) {
    return next(err);
  });
});

app.get('/file/:id', (req, res, next) => {
  db.any('select * from files where file_id=${id}', req.params)
  .then(function (data) {
    res.status(200)
    .json({
      data
    });
  })
  .catch(function (err) {
    return next(err);
  });
});

app.get('/role/:user/:pwd', (req, res, next) => {
  console.log('/role/:username = ' + req.params.user);
  db.any('select k2_role from k2_user inner join k2_role on k2_user.role_id = k2_role.role_id where k2_user.username = ${user} and k2_user.k2_password = ${pwd};', req.params)
  .then(function (data) {
  res.status(200)
  .json({
    data
  });
  })
  .catch(function(err) {
    return next(err)
  });
});

app.get('/files/author/:login_user', (req, res, next) => {
  db.any('select * from files where author=${login_user} and (case_status=\'Inactive\' or case_status=\'Approved\' or case_status=\'Rejected\')', req.params)
  .then(function (data) {
    res.status(200)
    .json({
      data
    });
  })
  .catch(function(err) {
    return next(err);
  });
});

app.get('/files/poc/:login_user', (req, res, next) => {
  console.log('/files/user/ req.params.login_user = ' + req.params.login_user);
  db.any('select * from files where poc_user=${login_user} and (case_status=\'Inactive\' or case_status=\'Approved\' or case_status=\'Rejected\')', req.params)
  .then(function (data) {
    res.status(200)
    .json({
      data
    });
  })
  .catch(function(err) {
    return next(err);
  });
});

app.get('/cases-promise', (req, res, next) => {
  db.any('select * from cases')
    .then(function (data) {
      // res.writeHead(200, {
      //   'Content-Type': 'application/json',
      //   'Access-Control-Allow-Origin' : '*',
      //   'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
      // })
      res.status(200) //res
        .json({
          //status: 'success',
          data
          //message: 'Retrieved ALL Cases ' 
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

app.get('/cases/:id', (req, res) => {
    pool.connect()
    .then(client => {
      return client.query(`SELECT * FROM cases WHERE id = ${req.params.id}`)
        .then(res => {
          console.log(res.rows)
          client.release()       
        })
        .catch(e => {
          client.release()
        })
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`RUNNING on port ${port}`));