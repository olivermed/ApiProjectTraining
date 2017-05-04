#Project Training Final Assignment
## **Route**

Add User
Parameters: FirstName, Surname, Surname
```
POST /addUser {"FirstName":"Olivier", "Surname":"Medec", "Login":"OlivierMedec", "Password":"azerty", "token": "token"}
```
> **HTTP/1.1 200 OK** {"results": {"ok": 1, "n": 1}}

Log user
```
POST /login {"Login":"OlivierMedec", "Password":"azerty"}
```
> **HTTP/1.1 200 OK** {"token": "RfGte4g3"}

> **HTTP/1.1 400 Bad Request** {"message": "Authentication failed. Wrong password."}
> **HTTP/1.1 400 Bad Request** {"message": "Authentication failed. User not found."}
