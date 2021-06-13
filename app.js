const http = require('http');
var express = require('express');
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
  //res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control');
  next();
}

app.use(allowCrossDomain);

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
    var status = "200"
    // var obj = [{ "route(1)": "ROOT" }, { "route(2)": "/file" }]
    var obj = [{ "route(3)": "/save" }, { "route(4)": "/upload" }]
    // res.status(status).json(obj)
    res.status(status).send(req.body)

});

app.put('/save', (req, res, next) => {
// console.log(`indexjs: put /save JSON.stringify(req.body[0]) = ${JSON.stringify(req.body[0])}`)
  var status = "200"
  var obj = [{ "route(3)": "/save" }, { "route(4)": "/upload" }]
  res.status(status).send(req.body)
  
  });

  app.post('/save', (req, res, next) => {
    // console.log(`indexjs: put /save JSON.stringify(req.body[0]) = ${JSON.stringify(req.body[0])}`)
      var status = "200"
      var obj = [{ "route(5)": "/image" }, { "route(6)": "/edit" }]
      res.status(status).send(req.body)
      
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
app.listen(port,  () => console.log(`RUNNING on port ${port}`));