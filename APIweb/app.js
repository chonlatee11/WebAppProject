var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const secret = "LoginWeb";

app.use(cors());

var mysql = require("mysql");
var poolCluster = mysql.createPoolCluster();
poolCluster.add("node0", {
  host: "192.168.1.22",
  port: "3306",
  database: "mymariaDB",
  user: "devchon",
  password: "devchon101",
  charset: "utf8mb4",
});

app.listen(3031, function () {
  console.log("CORS-enabled web server listening on port 3031");
});

app.post("/loginADMIN", jsonParser, function (req, res, next) {
  console.log(req.body);
  poolCluster.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        "SELECT * FROM Admin WHERE email = ?",
        [req.body.email],
        function (err, rows) {
          if (err) {
            console.log(err);
          } else {
            for (let index = 0; index < rows.length; index++) {
              const element = rows[index];
              if (req.body.email == "admin" && req.body.password == "admin") {
                var token = jwt.sign({ email: element.email }, secret, {
                  expiresIn: "1h",
                });
                console.log(element.Email);
                res.json({
                  status: "AdminLogin",
                  token,
                  email: element.Email,
                });
                connection.release();
              } else {
                bcrypt.compare(
                  req.body.password,
                  element.passWord,
                  function (err, result) {
                    if (err) {
                      console.log(err);
                    }
                    if (result == true) {
                      console.log("password match");
                      var token = jwt.sign({ email: element.Email }, secret, {
                        expiresIn: "1h",
                      });
                      res.json({
                        email: element.Email,
                        status: "AdminLogin",
                        token,
                      });

                      connection.release();
                    } else {
                      console.log("password not match");
                      // res.status==401;
                      res.json({ data: "notmatch", status: 402 });
                      connection.release();
                    }
                  }
                );
              }
            }
          }

          if (rows.length == 0 || rows == undefined) {
            res.json({ data: "Not found", status: 401 });

            connection.release();
          }
        }
      );
    }
  });
});

app.put("/AddAdmin", jsonParser, function (req, res, next) {
  console.log(req.body);
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    console.log(hash);
    if (err) {
      console.log(err);
    } else {
      poolCluster.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query(
            "INSERT INTO `Admin` (`Email`, `passWord`, `fName`, `lName`) VALUES ( ?, ?, ?, ?);",
            [req.body.email, hash, req.body.fname, req.body.lname],
            function (err) {
              if (err) {
                res.json({ err });
              } else {
                res.json({ status: "success" });
                connection.release();
              }
            }
          );
        }
      });
    }
  });
});

app.delete("/deleteAdmin", jsonParser, function (req, res, next) {
  console.log(req.body);
  poolCluster.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        "DELETE FROM `Admin` WHERE `Admin`.`Email` = ?",
        [req.body.email],
        function (err) {
          if (err) {
            res.json({ err });
          } else {
            console.log("delete success");
            res.json({ status: "success" });
            connection.release();
          }
        }
      );
    }
  });
});

app.patch("/updateAdmin", jsonParser, function (req, res, next) {
  console.log(req.body);
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    console.log(hash);
    if (err) {
      console.log(err);
    } else {
      poolCluster.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query(
            "UPDATE `Admin` SET `fName` = ?, `lName` = ?, `Email` = ?, `passWord` = ?, `modifydate` = ? WHERE `Admin`.`Email` = ?",
            [
              req.body.fname,
              req.body.lname,
              req.body.emailupdate,
              hash,
              req.body.modifydate,
              req.body.email,
            ],
            function (err) {
              if (err) {
                res.json({ err });
              } else {
                console.log("update success");
                res.json({ status: "success" });
                connection.release();
              }
            }
          );
        }
      });
    }
  });
});


app.get("/getAdmin", jsonParser, function (req, res) {
  console.log(req.body);
  poolCluster.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        "SELECT * FROM Admin",
        [req.body.userID],
        function (err, data) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            console.log(data.length);
            res.json({ data });
            // connection.end();
            connection.release();
          }
        }
      );
    }
  });
});

app.put("/AddResearch", jsonParser, function (req, res, next) {
  console.log(req.body);
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    console.log(hash);
    if (err) {
      console.log(err);
    } else {
      poolCluster.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query(
            "INSERT INTO `Researcher` (`Email`, `passWord`, `fName`, `lName`, `phoneNumber`) VALUES ( ?, ?, ?, ?, ?);",
            [req.body.email, hash, req.body.fname, req.body.lname, req.body.phoneNumber],
            function (err) {
              if (err) {
                res.json({ err });
              } else {
                res.json({ status: "success" });
                connection.release();
              }
            }
          );
        }
      });
    }
  });
});

app.delete("/deleteResearch", jsonParser, function (req, res, next) {
  console.log(req.body);
  poolCluster.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        "DELETE FROM `Researcher` WHERE `Researcher`.`Email` = ?",
        [req.body.email],
        function (err) {
          if (err) {
            res.json({ err });
          } else {
            console.log("delete success");
            res.json({ status: "success" });
            connection.release();
          }
        }
      );
    }
  });
});

app.patch("/updateResearch", jsonParser, function (req, res, next) {
  console.log(req.body);
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    console.log(hash);
    if (err) {
      console.log(err);
    } else {
      poolCluster.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query(
            "UPDATE `Researcher` SET `fName` = ?, `lName` = ?, `Email` = ?, `passWord` = ?, `Modifydate` = ? WHERE `Researcher`.`Email` = ?",
            [
              req.body.fname,
              req.body.lname,
              req.body.emailupdate,
              hash,
              req.body.modifydate,
              req.body.email,
            ],
            function (err) {
              if (err) {
                res.json({ err });
              } else {
                console.log("update success");
                res.json({ status: "success" });
                connection.release();
              }
            }
          );
        }
      });
    }
  });
});


app.get("/getResearch", jsonParser, function (req, res) {
  console.log(req.body);
  poolCluster.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        "SELECT * FROM Researcher",
        [req.body.userID],
        function (err, data) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            console.log(data.length);
            res.json({ data });
            // connection.end();
            connection.release();
          }
        }
      );
    }
  });
});

app.put("/HistoryDiseaseModify", jsonParser, function (req, res, next) {
 poolCluster.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        "INSERT INTO `HistoryDiseaseModify` (`DiseaseID`, `DiseaseName`, `AdminID`, `AdminEmail`, `ModifyDate`, `Detail`) VALUES ( ?, ?, ?, ?, ?, ?);",
        [req.body.DiseaseID, req.body.DiseaseName, req.body.AdminID, req.body.AdminEmail, req.body.ModifyDate, req.body.Detail],
        function (err) {
          if (err) {
            res.json({ err });
          } else {
            res.json({ status: "success" });
            connection.release();
          }
        }
      );
    }
  }
 );
}
);

app.get("/HistoryDiseaseModify", jsonParser, function (req, res, next) {
  poolCluster.getConnection(function (err, connection) {
     if (err) {
       console.log(err);
     } else {
       connection.query(
         "SELECT * FROM `HistoryDiseaseModify`;",
         function (err, data) {
           if (err) {
             res.json({ err });
           } else {
             res.json({ status: "success",
             data: data });
             connection.release();
           }
         }
       );
     }
   }
  );
 }
 );

// app.post('/login', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;

//     poolCluster.query(
//         "SELECT * FROM Admin WHERE email = ? AND password = ?",
//         [email, password],
//         (err, result) =>{
//             if(err){
//                 res.send({err: err})
//             }

//             if (result){
//                     res.send(result);
//             }else{
//                     res.send({message: "Wrong email/password"});
//             }
//         }
//     );
// });

// app.post('/insertAdmin',  jsonParser, function (req, res, next) {
//     bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//         poolCluster.getConnection(function (err, connection) {
//             if (err) {
//               console.log(err);
//             } else {
//               connection.query("INSERT INTO Admin (name, email, password) VALUES (?,?,?);",
//             [req.body.name, req.body.email, hash], function (err, rows) {
//                 if (err) {
//               res.json({err})
//                 } else {
//                   connection.release();
//               res.json({rows})
//                 }
//               });
//             }
//           });
//     });
// })

// app.post('/insertResearcher',  jsonParser, function (req, res, next) {
//   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//       poolCluster.getConnection(function (err, connection) {
//           if (err) {
//             console.log(err);
//           } else {
//             connection.query("INSERT INTO Researcher (name, email, password, phonenumber) VALUES (?,?,?,?);",
//           [req.body.name, req.body.email, hash, req.body.phonenumber], function (err, rows) {
//               if (err) {
//             res.json({err})
//               } else {
//                 connection.release();
//             res.json({rows})
//               }
//             });
//           }
//         });
//   });
// })
