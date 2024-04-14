# Payten Internship Project

## Project Overview
This project was developed as part of an internship program with Payten. It is designed to manage users and projects, enabling CRUD operations on both. Each project can have multiple versions, and whenever a new version is released, all users associated with that project receive an email notification.

### Technologies Used
- **Frontend:** React
- **Backend:** .NET Core
- **Database:** MySQL

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- [.NET Core SDK](https://dotnet.microsoft.com/download)
- [Node.js and npm](https://nodejs.org/en/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### Configuration
1. **Database Connection**
   - Navigate to the `WebApplication` directory.
   - Locate the `appsettings.json` file and configure your MySQL connection string:
     ```json
     {
       "Logging": {
         "LogLevel": {
           "Default": "Information",
           "Microsoft.AspNetCore": "Warning"
         }
       },
       "AllowedHosts": "*",
       "ConnectionStrings": {
         "MySqlConn": "Server=localhost;DataBase=IsActive;User=YOUR_USERNAME;password=YOUR_PASSWORD;"
       }
     }
     ```
   - Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual MySQL credentials.

### Setting Up the Database
2. Open your terminal and navigate to the `WebApplication` directory:
3. To set up the initial database schema, run the following commands:
```bash
add-migration init
update-database
```
4. Then open my-app and write this command to start the project
```bash
npm i
npm start

