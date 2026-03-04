# Venzia Datalinks Add-on

Datalinks lets you seamlessly link document properties with database values. No need for custom implementations, all is done in simple json configuration files.

## Repo Structure
The project consist in 3 folders:
- **App**: contains a Alfresco Content App with the [datalinks extension project](app/projects/venzia-datalink)

- **db mock**: Contains a simple nodejs server that emulates a database for easy setup

- **venzia-datalink**: Alfresco SDK project with custom metadata models and datalink config files

## Set up

1. Compile venzia-datalink project with `mvn clean install`, run `./run.sh build_start` (run.bat in windows) to start an alfresco instance.

    Access to alfresco in `http://localhost:8080/alfresco/` and default credentials admin/admin

2. Start Database mock up with `npm start`, node server listens in `localhost:3005`

3. Initialize ACA with `npm install`and start with `npm start`.Tailor your .env file to include your repo endpoint.

4. Link your files properties with right click → edit datalink

## Customization
Datalink add-on loads its configuration files from [docker/datalink folder](venzia-datalink/src/main/docker/datalink)

Each datalink is defined in one JSON file specifying its name, the aspect and aspect properties related to that datalink and the columns of the table, for example:

```JSON
{
  "name":"departments",
  "title":"Company Departments",
  "description":"Example to datalink demo",
  "aspectName":"dlnk:departm",
  "aspectPropertyName":"dlnk:departm",
  "order":20,
  "connectorRest": {
    "url": "http://localhost:3005/api/v1/private/departments/search",
    "authentication": {
      "type":"basic",
      "username":"",
      "password":""
    },
    "searchParam":"query"
  },
  "columns": [
    {
      "primaryKey":true,
      "name":"dept_no",
      "label":"Id",
      "type":"text",
      "hidden":true
    },
    {
      "primaryKey":false,
      "name":"dept_name",
      "label":"Name",
      "type":"text"
    }
  ]
}
```

On start alfresco will register the datalink for its later usage from ACA.

Aca will retrieve datalinks definitions and execute the petition to your endpoint (including auth header) defined in conector rest section of the json file

Your endpoint must return an array of objects with the same keys of the json 
```json
[
    {dept_no:1, dept_name:"marketing"}
    {dept_no:2, dept_name:"Human resources"}
]
```

Visit us at https://venzia.es and https://aqua.venzia.es or contact directly by email info@venzia.es
