const mysql = require('mysql');


//connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
  });


//VIEW USERS
exports.view =(req, res) => {

  pool.getConnection((err, connection) => {
    if(err) throw err; // not connected
    console.log('connected as ID' + connection.threadId);

    // user connection
    connection.query('SELECT * FROM user WHERE status = "active"',(err,rows) => {
        //when done with connection, release it
        connection.release();
        if(!err){
          let removedUser = req.query.removed
            res.render('home', {rows, removedUser });
        } else{
            console.log(err);
        }
        console.log('the data from user table: \n', rows);
    });
  });
} 

//find user by search
exports.find =(req, res) => {

  pool.getConnection((err, connection) => {
    if(err) throw err; // not connected
    console.log('connected as ID' + connection.threadId);

    let searchTerm = req.body.search;

    // user connection
    connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?',['%' + searchTerm + '%', '%' + searchTerm + '%'], (err,rows) => {
        //when done with connection, release it
        connection.release();

        if(!err){
            res.render('home', {rows});
        } else{
            console.log(err);
        }
        console.log('the data from user table: \n', rows);
    });
  });
} 

exports.form=(req, res) => {
res.render('add-user');
}

//add new user 
exports.create=(req, res) => {
  const{ first_name, last_name, email, phone, comment} =req.body;
  // res.render('add-user');

  pool.getConnection((err, connection) => {
    if(err) throw err; // not connected
    console.log('connected as ID' + connection.threadId);
    let searchTerm = req.body.search;

    // user connection
    connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email= ?, phone= ?, Comment= ?',[first_name, last_name, email, phone, comment],(err,rows) => {
        //when done with connection, release it
        connection.release();

        if(!err){
            res.render('add-user', { alert: 'User added successfully.' });
        } else{
            console.log(err);
        }
        console.log('the data from user table: \n', rows);
    });

  });
}

//edit  user 
exports.edit=(req, res) => {
  pool.getConnection((err, connection) => {
    if(err) throw err; // not connected
    console.log('connected as ID' + connection.threadId);
    // user connection
    connection.query('SELECT * FROM user WHERE Id = ?', [req.params.Id], (err,rows) => {
        //when done with connection, release it
        connection.release();

        if(!err){
            res.render('edit-user', {rows});
        } else{
            console.log(err);
        }
        console.log('the data from user table: \n', rows);
    });
  });
} 

//update  user 
exports.update=(req, res) => {
  const{ first_name, last_name, email, phone, comment} =req.body;


  pool.getConnection((err, connection) => {
    if(err) throw err; // not connected
    console.log('connected as ID' + connection.threadId);
    // user connection
    connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comment = ? WHERE Id = ?', [first_name, last_name, email, phone, comment, req.params.Id], (err,rows) => {
        //when done with connection, release it
        connection.release();
        if(!err){

          pool.getConnection((err, connection) => {
            if(err) throw err; // not connected
            console.log('connected as ID' + connection.threadId);
            // user connection
            connection.query('SELECT * FROM user WHERE Id = ?', [req.params.Id], (err,rows) => {
                //when done with connection, release it
                connection.release();
        
                if(!err){
                    res.render('edit-user', {rows, alert:`${first_name} has been updated.`});
                } else{
                    console.log(err);
                }
                console.log('the data from user table: \n', rows);
            });
          });

        } else{
            console.log(err);
        }
        console.log('the data from user table: \n', rows);
    });
  });
} 

//delete  user 
exports.delete=(req, res) => {
  // pool.getConnection((err, connection) => {
  //   if(err) throw err; // not connected
  //   console.log('connected as ID' + connection.threadId);
  //   // user connection
  //   connection.query('DELETE  FROM user WHERE Id = ?', [req.params.Id], (err,rows) => {
  //       //when done with connection, release it
  //       connection.release();

  //       if(!err){
  //           res.redirect('/');
  //       } else{
  //           console.log(err);
  //       }
  //       console.log('the data from user table: \n', rows);
  //   });
  // });

  pool.getConnection((err, connection) => {
    if(err) throw err; // not connected
    console.log('connected as ID' + connection.threadId);
    // user connection
    connection.query('UPDATE user SET status = ? WHERE Id = ?', ['removed', req.params.Id], (err,rows) => {
        //when done with connection, release it
        connection.release(); //return the connection to pool
        if(!err){
          let removedUser = encodeURIComponent('User successfully removed.');
            res.redirect('/?removed=' + removedUser);
        } else{
            console.log(err);
        }
        console.log('the data from user table: \n', rows);
    });
  });
} 

//VIEW USERS
exports.viewall =(req, res) => {

  pool.getConnection((err, connection) => {
    if(err) throw err; // not connected
    console.log('connected as ID' + connection.threadId);

    // user connection
    connection.query('SELECT * FROM user WHERE Id = ?', [req.params.Id], (err,rows) => {
        //when done with connection, release it
        connection.release();

        if(!err){
            res.render('view-user', {rows});
        } else{
            console.log(err);
        }
        console.log('the data from user table: \n', rows);
    });
  });
} 


