# Fintrack

##### Application for tracking finances and splitting bills

<div align="center">
	<a href="https://github.com/domiotek/ztp/actions/workflows/frontend.yml">
		<img src="https://github.com/domiotek/ztp/actions/workflows/frontend.yml/badge.svg" alt="Angular Frontend">
	</a>
	<a href="https://github.com/domiotek/ztp/actions/workflows/docker.yml">
		<img src="https://github.com/domiotek/ztp/actions/workflows/docker.yml/badge.svg" alt="Docker Containerization">
	</a>
	<a href="https://github.com/domiotek/ztp/actions/workflows/backend.yml">
		<img src="https://github.com/domiotek/ztp/actions/workflows/backend.yml/badge.svg" alt="Java Backend workflow">
	</a>
</div>

Project created for _Zaawansowane Technologie Programowania_ class on Cracow University of Technology.

### Technology stack

- Java 21 with Maven Spring Boot
- PostgreSQL
- Docker
- Node.js
- Angular 19

### Features

- Track personal and shared expenses
- Split bills among multiple users
- Generate detailed financial reports
- User authentication and role management

### Quick launch

To quickly launch the application follow these steps:

1. Clone the repository and navigate to it:
   ```bash
   git clone https://github.com/your-username/fintrack.git
   ```
   ```bash
   cd fintrack
   ```
2. Ensure Docker and Docker Compose are installed on your system.
3. Run the following command in the project directory:
   ```bash
   docker-compose up
   ```
4. Once the containers are up and running, navigate to `http://localhost` in your web browser (port 80 is used by default).

This will start the application and make it accessible on your local machine.

### Development

To make changes in this project you will need to set-up your environment.

1. Ensure all required tools listed in the technology stack are installed.

2. Clone the repository and navigate to it:
   ```bash
   git clone https://github.com/your-username/fintrack.git
   ```
   ```bash
   cd fintrack
   ```
3. Start up database container
   ```bash
   docker-compose up fintrack_database
   ```
4. In backend subdirectory, build and launch java api application:
   ```bash
   mvn clean install
   ```
   ```bash
   java -jar target/fintrack-0.0.1-SNAPSHOT.jar
   ```
5. In front subdirectory, install depenencies and launch dev server:
   ```bash
   npm install
   ```
   ```bash
   npm start
   ```
6. Navigate to `http://localhost:4200` to visit the application.

This is showcase, for development use proper IDEs like **IntelliJ IDEA** for backend and **Visual Studio Code** for frontend.
