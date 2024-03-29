
exports.getWeeklyClasses = function (userID, startDate, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Search by subject code
    connection.query('SELECT `W`.`weeklyClassID`, `sortName`, `subjectID`, `classTimeID`, `day`, `time`, `sisBuildingName`, buildingNumber, roomNumber, duration, startDate, `subjectName`, `subjectCode`, `A`.`state` AS `attended` FROM `UserClassTime` `U`  NATURAL JOIN `ClassTime` NATURAL JOIN `Class` NATURAL JOIN `WeeklyClass` `W` NATURAL JOIN `SemesterWeek` NATURAL JOIN `Subject` NATURAL JOIN `ClassSort` LEFT JOIN `Attended` `A` ON `A`.`weeklyClassID` = `W`.`weeklyClassID` WHERE `U`.`userID`=? AND `startDate` > DATE_SUB(?, INTERVAL 7 DAY) AND `startDate` <= ?;', [userID, startDate, startDate], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Release the connection
      connection.release();

      console.log(rows);

      // Convert to something useful
      var subjects = {};
      for(var key in rows) {
        // Grab a row
        var r = rows[key];

        // Ensure we have a store
        subjects[r.subjectID] = subjects[r.subjectID] || {
          subjectCode: r.subjectCode,
          subjectName: r.subjectName,
          classes: []
        };

        // Add a class
        subjects[r.subjectID].classes.push({
          sort: r.sortName,
          classTimeID: r.classTimeID,
          time: r.time,
          day: r.day,
          sisBuildingName: r.sisBuildingName,
          buildingNumber: r.buildingNumber,
          roomNumber: r.roomNumber,
          duration: r.duration,
          attended: r.attended,
          weeklyClassID: r.weeklyClassID
        });
      }

      // Create the array
      var output = [];
      for(var key in subjects) {
        output.push(subjects[key]);
      }

      // Run callback
      callback(null, { subject: output });
    });
  });
}

exports.addClass = function (userID, classTimeID, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Cleanup old registrations for this class
    connection.query('DELETE `UserClassTime` FROM `UserClassTime` NATURAL JOIN `ClassTime` WHERE `classID` = (SELECT `classID` FROM `ClassTime` WHERE `classTimeID`=? LIMIT 1) AND `userID`=?;', [classTimeID, userID], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Add new one
      connection.query('INSERT IGNORE INTO `UserClassTime` (`userID`, `classTimeID`) VALUES (?, ?)', [userID, classTimeID], function(err, result) {
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
}

exports.deleteClass = function (userID, classTimeID, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Cleanup old registrations for this class
    connection.query('DELETE FROM `UserClassTime` WHERE `userID`=? AND `classTimeID`=?;', [userID, classTimeID], function(err, rows) {
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
}
