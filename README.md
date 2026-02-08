# FlowBoard — Team & Work Management Platform

FlowBoard is a modern team and task management platform designed to help teams plan, track, and analyze work efficiently across projects, tasks, and members.

The application enables structured project workflows, task ownership, team collaboration, and insightful reports — all built on a scalable MERN-stack architecture with a clean, responsive UI.

---

## Demo Links

**Live Application**  
https://flow-board-ten-gold.vercel.app/

**Backend API**  
https://flow-board-backend-phi.vercel.app/

---

## Repositories

- **Frontend Repository**  
  https://github.com/jeeveshmahajan7/FlowBoard_Frontend.git

- **Backend Repository**  
  https://github.com/jeeveshmahajan7/FlowBoard_Backend.git

---

## Quick Start

```
git clone https://github.com/jeeveshmahajan7/FlowBoard_Frontend.git
cd FlowBoard_Frontend
npm install
npm run dev
```

---

---

## Technologies

### Frontend

- React JS
- React Router
- Recharts (Data Visualization)
- Tailwind CSS
- DaisyUI

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Chart.js

---

## Features

**Authentication**

- Secure user signup and login using JWT.
- Automatic logout on token expiry.
- Protected routes for authenticated users only.

**Projects**

- Create and manage multiple projects.
- Track project status and descriptions.
- Navigate to project-specific task views.

**Tasks**

- Create, edit, and update tasks within projects.
- Assign tasks to teams and owners.
- Manage task status, due dates, tags, and estimated completion time.
- Mark tasks as completed and track progress.

**Teams**

- Create teams with automatic creator assignment as a member.
- Add and remove team members.
- View complete team member details (name & email).
- Prevent duplicate members and manage team composition.

**Reports & Analytics**

- Total Work Done Last Week — visualized using charts.
- Total Days of Work Pending — aggregated workload insights.
- Tasks Closed by Team — team-wise performance tracking.
- Tasks Closed by Owner — individual contribution analysis.
- Fully responsive dashboards built using Recharts.

**UI & UX**

- Fully responsive layout for desktop and mobile.
- Clean, minimal design focused on usability.
- Component-based architecture.
- Graceful handling of empty and loading states.

---

## API Reference

### GET /projects

Get all projects<br>
Sample response:<br>

```
{ "message": "", "projects": [{ "_id": "", "name": "", "status": "" }] }
```

### POST /tasks

Create a new task<br>
Sample response:<br>

```
{ "name": "", "project": "", "team": "", "owners": [], "status": "" }
```

### GET /teams/:teamId

Fetch team details with members<br>
Sample response:<br>

```
{ "message": "", "team": { "name": "", "members": [{ "name": "", "email": "" }] } }
```

### GET /report/last-week

Tasks completed in the last 7 days<br>
Sample response:<br>

```
{ "message": "", "count": 0, "tasks": [] }
```

### GET /report/pending

Total pending work days<br>
Sample response:<br>

```
{ "message": "", "pendingDaysOfWork": 0 }
```

### GET /report/closed-tasks

Closed tasks grouped by team or owner<br>
Sample response:<br>

```
{ "message": "", "data": [{ "id": "", "count": 0 }] }
```

---

## Contact

For bugs or feature requests, please reach out to **jeeveshmahajan00@gmail.com**
