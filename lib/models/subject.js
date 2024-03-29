var sql = require('./../config/sql.js');

exports.getSubject = function (subjectID, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Search by subject code
    connection.query('SELECT * FROM `Subject` NATURAL JOIN `Class` NATURAL JOIN `ClassTime` NATURAL JOIN `ClassSort` WHERE `subjectID`=?', [subjectID], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Build something useful
      var classes = {};

      // Loop over all the data
      for(var key in rows) {
        // Grab a row
        var r = rows[key];

        // Create the store
        classes[r.classID] = classes[r.classID] || {
          classTimes: [],
          sort: r.sortName,
          duration: r.duration,
          classID: r.classID
        };

        classes[r.classID].classTimes.push({
          classTimeID: r.classTimeID,
          time: r.time,
          day: r.day,
          sisBuildingName: r.sisBuildingName,
          buildingNumber: r.buildingNumber,
          roomNumber: r.roomNumber
        });
      }

      var output = [];
      for(var c in classes) {
        output.push(classes[c]);
      }

      data = {
        class: output
      }

      // Attempt to add subject specific stuff
      var r = rows[0];
      if(r) {
        data.subjectName = r.subjectName;
        data.subjectCode = r.subjectCode;
        data.semesterID = r.semesterID;
        data.echoLink = r.echoLink;

        // Pull handbook data
        connection.query('SELECT `handbookData` FROM `Handbook` WHERE `subjectCode`=?', [r.subjectCode], function(err, rows) {
          if(err) {
            connection.release();
            return callback(err);
          }

          // Attempt to stick handbook data in
          if(rows.length > 0) {
            try {
              data.handbookData = JSON.parse(rows[0].handbookData);
            } catch(e) {}
          }

          // Release the connection
          connection.release();

          // Run callback
          callback(null, data);
        });
      } else {
        // Run callback
        callback(null, data);
      }
    });
  });
};

exports.search = function (query, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Turn it into a mysql matching query
    query = '%'+query+'%';

    // Search by subject code
    connection.query('SELECT subjectID, subjectName, semesterID, semesterName, subjectCode FROM `Subject` NATURAL JOIN `Semester` WHERE `subjectCode` LIKE ? OR `subjectName` LIKE ? LIMIT 10;', [query, query], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Release the connection
      connection.release();

      // Run callback
      callback(null, rows);
    });
  });
};

exports.addClasses = function(userID, subjectID, classTimes, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Ensure they are enrolled into this subject
    connection.query('INSERT IGNORE INTO `UserSubject` (`userID`, `subjectID`) VALUES(?, ?);', [userID, subjectID], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Drop all old classtimes
      connection.query('DELETE `UserClassTime` FROM `UserClassTime` NATURAL JOIN `ClassTime` NATURAL JOIN `Class` WHERE `userID`=? AND `subjectID`=?;', [userID, subjectID], function(err, rows) {
        if(err) {
          connection.release();
          return callback(err);
        }

        // Check if we need to do any inserts
        if(!classTimes || classTimes.length <= 0) {
          connection.release();
          return callback(null);
        }

        // Create list of values to insert
        var values = [];
        for(var key in classTimes) {
          values.push([
            userID,
            classTimes[key]
          ]);
        }

        // Do the actual insert
        connection.query('INSERT IGNORE INTO `UserClassTime` (`userID`, `classTimeID`) VALUES ?', [values], function(err, result) {
          if(err) {
            connection.release();
            return callback(err);
          }

          // Release the connection
          connection.release();

          // Run callback
          callback(null);
        });
      });
    });
  });
};

exports.deleteClasses = function(userID, subjectID, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Drop all old classtimes
    connection.query('DELETE `UserClassTime` FROM `UserClassTime` NATURAL JOIN `ClassTime` NATURAL JOIN `Class` WHERE `userID`=? AND `subjectID`=?;', [userID, subjectID], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Delete the subject from their list
      connection.query('DELETE FROM `UserSubject` WHERE `userID`=? AND `subjectID`=?;', [userID, subjectID], function(err, rows) {
        if(err) {
          connection.release();
          return callback(err);
        }

        // Run the callback
        callback(null);
      });
    });
  });
}