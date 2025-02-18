# BoardKan – Real-Time Collaborative Kanban Board

## Overview
BoardKan is a real-time Kanban board designed for seamless task management and team collaboration. It features user authentication, drag-and-drop task management, and real-time updates powered by WebSockets. Users can create, edit, delete, and move tasks across columns, with changes instantly reflected for all logged-in users.

## Features
- Real-Time Collaboration – WebSockets ensure instant task updates across all users.
- Drag-and-Drop Functionality – Move tasks effortlessly between columns.
- User Authentication & Security – Secure login with JWT authentication.
- Filtering & Sorting – Easily manage tasks with dynamic filtering and sorting options.
- Task Management – Create, edit, delete, and update task status with ease.
- Modern UI – Built with Angular Material for a smooth user experience.

## Tech Stack
### Backend:
- Spring Boot (Web, Security, Data JPA, WebSockets)
- JWT Authentication
- MySQL (Relational database)
- Maven (Build tool)

### Frontend:
- Angular 16 (Core, Router, Forms)
- Angular Material & CDK (UI components & utilities)
- RxJS (Reactive programming)
- STOMP.js & SockJS Client (WebSockets for real-time updates)

## Installation & Setup
### Backend Setup
1. Clone this repository:
   ```sh
   git clone https://github.com/maxxweldmello/BoardKan.git
   cd BoardKan/BoardKan-SpringB
   ```
2. Configure application.properties for MySQL:
   ```sh
   spring.datasource.url=jdbc:mysql://localhost:3306/boardkan
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```
3. Build the backend:
   ```sh
   mvn clean install
   mvn spring-boot:run
   ```
4. Run the Backend in your IDE

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd ../BoardKan-Angular
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Angular application:
   ```sh
   ng serve
   ```
