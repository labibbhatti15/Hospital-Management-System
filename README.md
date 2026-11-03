# MediCare — Hospital Management System
A responsive full-stack university demo using HTML, CSS, JavaScript, Java Spring Boot, and persistent H2 SQL database.

## Requirements
- Java JDK **17 or newer** (`java -version`)
- Apache Maven 3.9+ (`mvn -version`)
- Internet connection **for first run** to download Maven dependencies

## Folder structure
- `pom.xml` — Maven dependencies
- `src/main/java/com/hospital/` — Java backend, entities, repositories and API
- `src/main/resources/static/index.html` — HTML
- `src/main/resources/static/style.css` — responsive CSS
- `src/main/resources/static/app.js` — JavaScript and API calls
- `src/main/resources/application.properties` — database settings
- `data/` — H2 database files created automatically when running

## Run in VS Code (Windows)
1. Extract the ZIP. In VS Code use File > Open Folder and select `HospitalManagementSystem`.
2. Install VS Code extensions: **Extension Pack for Java** and **Spring Boot Extension Pack**.
3. Install JDK 17+ and Maven, then reopen VS Code.
4. Open Terminal > New Terminal. Run `java -version` and `mvn -version`.
5. In the project root run: `mvn spring-boot:run`
6. Wait until the terminal reports `Started HospitalApplication`.
7. Open **http://localhost:8080** in your browser. Do **not** open `index.html` directly.
8. Add patients and doctors, then book appointments. Changes persist between restarts.

To stop the server, press Ctrl+C in the terminal.
To start it next time, run `mvn spring-boot:run` again.

## Database
The embedded H2 database is a real SQL database saved to `data/hospitaldb.mv.db`. It does not require MySQL installation.
Optional database console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:file:./data/hospitaldb;DB_CLOSE_ON_EXIT=FALSE`
- User: `sa`
- Password: blank

## REST endpoints
`GET/POST /api/patients`, `PUT/DELETE /api/patients/{id}`
`GET/POST /api/doctors`, `PUT/DELETE /api/doctors/{id}`
`GET/POST /api/appointments`, `PUT/DELETE /api/appointments/{id}`
`GET /api/stats`

## Limitations
This is a **local educational demo**, not production hospital software. It has no login, roles, encryption for sensitive records, backups, or audit logging. Use fake patient data only; do not deploy publicly.
