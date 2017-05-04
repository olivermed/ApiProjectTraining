#Project Training Final Assignment

### Launch your local instance

> On MacOS or Linux
```
$ npm install
$ ./node_modules/nodemon/bin/nodemon.js server.js
```

## **Route**

Route origin : http://localhost:3000/

Add User
Parameters: FirstName, Surname, Login, Password, token

```
POST /addUser {"FirstName":"Olivier", "Surname":"Medec", "Login":"OlivierMedec", "Password":"azerty", "token": "token"}
```
> **HTTP/1.1 200 OK** {"results": {"ok": 1, "n": 1}}

Log user
Parameters: Login, Password

```
POST /login {"Login":"OlivierMedec", "Password":"azerty"}
```
> **HTTP/1.1 200 OK** {"token": "RfGte4g3"}

> **HTTP/1.1 400 Bad Request** {"message": "Authentication failed. Wrong password."}

> **HTTP/1.1 400 Bad Request** {"message": "Authentication failed. User not found."}

Get add user gcm Id
Parameters: id iser, gcm id, token

```
GET /api/addGcmId/ {"id":"1", "idGcm": "2", "token":"token"}
```
> **HTTP/1.1 200 OK** {"message": "ok"}

> **HTTP/1.1 200 OK** {"message": "User is already set"}

get user information
Parameters: id, token

```
GET /user {"id":"1", "token":"token"}
```
> **HTTP/1.1 200 OK** {"result":{"_id":"5909a3530c12fed028f8ea8f","FirstName":"Olivier","Surname":"Medec","Login":"OlivierMedec","Password": "azerty"}}

Get user list
Parameter: token

```
GET /getUsers {"token": "1"}
```
> **HTTP/1.1 200 OK** {
  "results": [
    {
      "_id": "590ae47b87ac1750b161b57b",
      "FirstName": "Olivier",
      "Surname": "Medec",
      "Login": "OlivierMedec",
      "Password": "azerty",
      "idGcm": "2",
      "lastModified": "2017-05-04T08:30:18.884Z"
    },
    {
      "_id": "590ae947165e19512158c5ce",
      "FirstName": "Edouard",
      "Surname": "Lefevre du pruy",
      "Login": "EDF",
      "Password": "azerty"
    }
  ]
}
