const express = require('express')
const app = express()
const port = 3005

app.get('/', (req, res) => {
  res.send('Venzia employee db mockup')
})

/**Public endpoint with no auth */
app.get("/api/v1/public/employees/search", (req,res) => {
    const employees = [
        {emp_no:1, first_name:"Adolfo", last_name:"Herrero", hire_date: new Date("2005-10-02")},
        {emp_no:2, first_name:"Lazslo", last_name:"Cravensworth", hire_date: new Date("1960-03-12")},
        {emp_no:3, first_name:"Anastasia", last_name:"Lopez", hire_date: new Date("1999-11-04")},
        {emp_no:4, first_name:"María", last_name:"Martinez", hire_date: new Date("1992-01-02")},
        {emp_no:5, first_name:"Jose", last_name:"Ramirez", hire_date: new Date("2003-03-11")},
        {emp_no:6, first_name:"Mario", last_name:"Gonzalez", hire_date: new Date("2002-02-12")},
        {emp_no:7, first_name:"Eduardo", last_name:"Lopez", hire_date: new Date("2005-01-16")},
        {emp_no:8, first_name:"Ana", last_name:"Cuesta", hire_date: new Date("2002-03-25")},
        {emp_no:9, first_name:"Luisa", last_name:"Rodriguez", hire_date: new Date("2010-02-22")},
        {emp_no:10, first_name:"Marta", last_name:"Boss", hire_date: new Date("2012-04-29")},
        {emp_no:11, first_name:"Elena", last_name:"Torroja", hire_date: new Date("2022-01-02")},
        {emp_no:12, first_name:"Eleazar", last_name:"Fuertes", hire_date: new Date("2023-02-11")},
        {emp_no:13, first_name:"Cristina", last_name:"Juvens", hire_date: new Date("2024-04-14")},
        {emp_no:14, first_name:"Carla", last_name:"Saña", hire_date: new Date("2025-03-22")},
        {emp_no:15, first_name:"Leonor", last_name:"Garcia", hire_date: new Date("2026-03-20")},
        {emp_no:16, first_name:"Jose luis", last_name:"Garcia", hire_date: new Date("2024-12-02")},
        {emp_no:17, first_name:"Rafael", last_name:"Montiel", hire_date: new Date("2003-12-02")},
        {emp_no:18, first_name:"Juan", last_name:"Perez", hire_date: new Date("2006-11-12")},
        {emp_no:19, first_name:"Juana", last_name:"Ruiz", hire_date: new Date("2004-11-06")},
        {emp_no:20, first_name:"Pablo", last_name:"Dolera", hire_date: new Date("2011-02-13")},
    ];
    res.setHeader('Content-Type', 'application/json');
    if(req.query && req.query.query){
        const filteredEmployees = employees.filter(emp => emp.first_name.toLowerCase().startsWith(req.query.query));
        res.send(JSON.stringify(filteredEmployees))
    }else{
        res.send(JSON.stringify(employees))
    }
})


/**Endpoint for departments with simulated basic auth */
app.get("/api/v1/private/departments/search", (req,res) => {
    if(!req.headers.authorization){
        res.status(401).json({error:"missing auth header"})
    }
    const EncodedAuth = req.headers.authorization.split(" ")[1];
    const decodedAuth = new Buffer(EncodedAuth, "base64").toString();
    const [user,pass] = decodedAuth.split(":");
    if(user != "user2019" || pass!="g3n3r4l"){
        res.status(401).json({error:"wrong auth "})
    }
    const departments = [
        {dept_no:1, dept_name:"Recursos Humanos"},
        {dept_no:2, dept_name:"Logística"},
        {dept_no:3, dept_name:"Compras"},
        {dept_no:4, dept_name:"Ventas"},
        {dept_no:5, dept_name:"Finanzas"},
        {dept_no:6, dept_name:"Marketing"}
    ];
    res.setHeader('Content-Type', 'application/json');
    if(req.query && req.query.query){
        const filteredDepartments = departments.filter(dep => dep.dept_name.toLowerCase().startsWith(req.query.query));
        res.send(JSON.stringify(filteredDepartments));
    }else{
        res.send(JSON.stringify(employees));
    }
})

app.listen(port, () => {
  console.log(`Mock db listening on port ${port}`)
})
