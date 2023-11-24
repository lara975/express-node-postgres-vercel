const express = require('express');
const app = express();
const port = 3000;
const { Pool } = require('pg')

require('dotenv').config()

const pool = new Pool({
    user: 'default',
    host: 'ep-orange-smoke-08960365.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'bf3BTmnKYd4P',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

app.use(express.json());

const API_KEY =process.env.API_KEY

const apikeyvalidation=(req,res,next)=>{
    const userApiKey= req.get('x-api-key');
    if (userApiKey&&userApiKey===API_KEY){
        next();
    }else{
        res.status(401).send('Invalid API Key');
    }
};
app.use(apikeyvalidation)


app.get('/students', function (req, res) {
    res.status(201);
    const listUsersQuery = 'SELECT * FROM students;';


    pool.query(listUsersQuery)
        .then(data => {
            console.log("List students: ", data.rows);
            res.send(data.rows);

        })

        .catch(err => {
            console.error(err);
        });

});


app.get('/students/:id', function (req, res) {
    res.status(201);
    const index = req.params.id
    const listUsersQuery = `SELECT * FROM students where id=${index}`;




    pool.query(listUsersQuery)
        .then(data => {
            console.log("id", data.rows);
            res.send(data.rows);

        })

        .catch(err => {
            console.error(err);

        });

});
app.post('/students', function (req, res) {
    const insertUsersquery = `INSERT INTO students (id,name,lastname,notes) VALUES
        ('${req.body.id}','${req.body.name}','${req.body.lastname}','${req.body.notes}');`;

    pool.query(insertUsersquery)
        .then(() => {
            res.send('Add')
        })

        .catch(err => {
            console.error(err);
        });

})

app.put("/students/put/:id", (req, res) => {


    const updateData = `UPDATE students SET id = ${req.body.id}, name ='${req.body.name}', lastname = '${req.body.lastname}', notes = '${req.body.notes}' WHERE id IN (${req.params.id})`;

    pool.query(updateData)
        .then(respond => {
            console.log(respond.rows);
            res.send("SE HAN ACTUALIZADO LOS DATOS")

        })
        .catch(err => {

            res.send("page not found")

            console.error(err);
            //pool.end();
        });
})

app.delete("/students/delete/:id",(req,res)=>{

const borrarUsuario = `DELETE FROM students WHERE id = ${req.params.id}`
;
 pool.query(borrarUsuario)
 .then(respond=>{
    console.log(respond.rows);

 res.send("se ha borrado el usuario")

})
.catch(err => {
       
    res.send("page not found")
    console.error(err);
})
})


app.listen(port, function () {
    console.log(`The app is running`);

});