# STUDENT JOB FINDER

## Cover Page

**PROJECT REPORT**

**Title of Project:**  
STUDENT JOB FINDER

**Submitted by:**  
`<NAME OF THE CANDIDATE>`  
`<REGISTER NUMBER>`  

**In partial fulfilment for the award of the degree of**  
BACHELOR OF ENGINEERING / TECHNOLOGY

**in**  
`<BRANCH OF STUDY>`

**Institution:**  
BANNARI AMMAN INSTITUTE OF TECHNOLOGY  
(An Autonomous Institution Affiliated to Anna University, Chennai)  
Sathyamangalam - 638401  
Anna University: Chennai 600 025

**Month and Year:**  
`<MONTH YEAR>`

---

## Title Page

**STUDENT JOB FINDER**

Project report submitted by  
`<NAME OF THE CANDIDATE>`  
`<REGISTER NUMBER>`

in partial fulfilment for the award of the degree of  
BACHELOR OF ENGINEERING / TECHNOLOGY

in  
`<BRANCH OF STUDY>`

at  
BANNARI AMMAN INSTITUTE OF TECHNOLOGY  
Sathyamangalam - 638401

`<MONTH YEAR>`

---

## Bonafide Certificate

This is to certify that the project report entitled **"STUDENT JOB FINDER"** is a bonafide work carried out by **`<NAME OF THE CANDIDATE>`** bearing Register Number **`<REGISTER NUMBER>`** in partial fulfilment of the requirements for the award of the degree of **Bachelor of Engineering / Technology in `<BRANCH OF STUDY>`** of Anna University, Chennai during the academic year **`<ACADEMIC YEAR>`**.

**Project Guide**  
`<NAME OF THE GUIDE>`  
`<DESIGNATION>`

**Head of the Department**  
`<NAME OF THE HOD>`

**Submitted for the project viva-voce examination held on:** `__________`

**Internal Examiner** `__________`  
**External Examiner** `__________`

---

## Declaration

I declare that this project report entitled **"STUDENT JOB FINDER"** is the record of work carried out by me under the supervision of **`<GUIDE NAME>`**, **`<DEPARTMENT>`**, BANNARI AMMAN INSTITUTE OF TECHNOLOGY, Sathyamangalam. I further declare that this work has not formed the basis for the award of any degree, diploma, associate ship, fellowship, or any other similar title or recognition previously.

**Place:** `__________`  
**Date:** `__________`

**Signature of the Candidate**  
`<NAME OF THE CANDIDATE>`

---

## Acknowledgement

I express my sincere gratitude to the management of **BANNARI AMMAN INSTITUTE OF TECHNOLOGY** for providing the facilities and academic environment required for the successful completion of this project.

I extend my heartfelt thanks to the **Head of the Department**, **project guide**, faculty members, and all staff of the department for their valuable guidance, encouragement, and support throughout the course of this work.

I also thank my friends and classmates for their suggestions and cooperation during the development of this project. Finally, I express my gratitude to my family for their constant encouragement and moral support.

---

## Table of Contents

1. Abstract  
2. Chapter 1 - Introduction  
3. Chapter 2 - System Analysis  
4. Chapter 3 - System Design  
5. Chapter 4 - Modules and Features  
6. Chapter 5 - API Documentation  
7. Chapter 6 - Database Design  
8. Chapter 7 - Testing and Validation  
9. Chapter 8 - Limitations and Future Enhancements  
10. Chapter 9 - Conclusion  

---

## Abstract

Student Job Finder is a full-stack web application developed to simplify the interaction between students looking for job opportunities and recruiters who manage job postings and candidate selection. The system provides a role-based environment where students can create their profile, view available jobs, apply for suitable openings, and track the status of their applications. Recruiters can add and manage job postings, review applicants, and update selection decisions with comments.

The project is implemented using the MERN stack, where React is used for the client-side user interface, Express and Node.js are used for the server-side logic, and MongoDB is used for data storage. Authentication is handled using JWT and password hashing is implemented using bcrypt. The application demonstrates a complete workflow for student recruitment management with separate interfaces for students and recruiters.

The main objective of the project is to provide a simple, centralized, and efficient placement support platform. The project also serves as a practical demonstration of modern full-stack application development, role-based navigation, REST API integration, and CRUD-based data management.

---

# CHAPTER 1
# INTRODUCTION

## 1.1 Introduction

Campus recruitment and entry-level hiring often involve fragmented processes where job notices, applicant details, and recruiter decisions are managed manually or across disconnected tools. This leads to inefficiency, delays in communication, and poor visibility for students regarding available opportunities and application progress.

The Student Job Finder project addresses this issue by providing a dedicated platform for two primary user groups: students and recruiters. Students can create a profile with their skills and additional details, browse available jobs, and apply through a unified interface. Recruiters can publish job opportunities, monitor candidate applications, and mark candidates as selected or rejected with comments.

The application is designed as a role-based job portal with authentication, profile management, job management, application tracking, and status review. Its architecture supports clean separation between frontend presentation and backend business logic through REST APIs.

## 1.2 Problem Statement

Students often face difficulty in identifying suitable opportunities and tracking multiple applications. Recruiters also require a simple method to manage jobs and handle candidate records efficiently. Manual tracking methods are error-prone, time-consuming, and difficult to scale. Therefore, a centralized digital platform is required to streamline student job discovery and recruiter-side application management.

## 1.3 Objectives

1. To develop a role-based web application for students and recruiters.
2. To enable secure registration and login functionality.
3. To allow students to create and update their profile information.
4. To provide recruiters with job posting and management capabilities.
5. To allow students to search, filter, and apply for jobs.
6. To enable recruiters to review applications and update candidate status.
7. To maintain all records in a centralized MongoDB database.

## 1.4 Scope of the Project

The project supports:

1. User registration and login for students and recruiters.
2. Student profile creation and editing.
3. Job creation, editing, viewing, and deletion.
4. Job application submission by students.
5. Application review and status update by recruiters.
6. Display of recruiter comments and final status to students.

The current scope is limited to a basic hiring workflow and does not yet include advanced features such as resume upload, email notifications, analytics dashboards, interview scheduling, or backend authorization middleware.

## 1.5 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, React Bootstrap, Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JWT, bcrypt |
| Styling | CSS, Bootstrap |
| Deployment Reference | Vercel backend endpoint configured in frontend |

---

# CHAPTER 2
# SYSTEM ANALYSIS

## 2.1 Existing System

In a traditional setup, student recruitment information is managed manually using spreadsheets, messages, and separate forms. Such systems have the following drawbacks:

1. No centralized view of job opportunities.
2. Difficulty in tracking application history.
3. Delayed communication between students and recruiters.
4. Manual management of candidate status.
5. Poor data consistency and low scalability.

## 2.2 Proposed System

The proposed system is a centralized web portal where:

1. Students can register, maintain their profile, browse jobs, apply, and review their application status.
2. Recruiters can create jobs, manage job listings, review candidate applications, and update outcomes with comments.
3. The application uses role-based routing to separate student and recruiter views.
4. The frontend and backend communicate through REST APIs.

## 2.3 Advantages of the Proposed System

1. Better organization of jobs and applications.
2. Reduced manual effort in candidate tracking.
3. Improved student visibility into their application outcomes.
4. Faster recruiter-side decision management.
5. Clean separation of responsibilities using a full-stack architecture.

---

# CHAPTER 3
# SYSTEM DESIGN

## 3.1 System Architecture

The project follows a client-server architecture.

1. The React frontend handles UI rendering, routing, and API integration.
2. The Express backend provides REST endpoints for authentication, profile handling, jobs, and applications.
3. MongoDB stores users, student profiles, job records, and candidate applications.
4. Context APIs in the frontend manage shared authentication and data-fetching state.

## 3.2 Frontend Structure

| Component Area | Purpose |
|---|---|
| Landing Pages | Login and Signup |
| Student Pages | Profile creation, dashboard, job list, job review |
| Admin Pages | Recruiter dashboard and job management |
| Shared Components | Header, side navigation, route protection |
| Contexts | Auth state and shared data state |
| API Layer | Axios configuration and token attachment |

## 3.3 Backend Structure

| Backend Area | Purpose |
|---|---|
| Express App | API routing and middleware |
| Mongoose Models | User, Student, Job, Candidate schemas |
| Authentication Logic | Signup, login, password hash, JWT token creation |
| CRUD Routes | Student, Job, Candidate operations |

## 3.4 Route Protection

Role-based access on the frontend is implemented using a protected route wrapper. Pages are conditionally accessible based on the authenticated user's role:

1. Student-only routes for student profile, dashboard, jobs, and reviews.
2. Recruiter-only routes for recruiter dashboard and job management.

## 3.5 Data Flow Summary

1. User signs up and logs in.
2. Backend validates credentials and returns role plus redirect path.
3. Frontend stores token and user information locally.
4. Student profile is created or fetched.
5. Recruiter creates jobs and students fetch the available list.
6. Students apply for jobs and applications are stored.
7. Recruiters review and update application status.
8. Students later view updated status and comments.

---

# CHAPTER 4
# MODULES AND FEATURES

## 4.1 Module Summary

| Module | Description |
|---|---|
| Authentication Module | Registration, login, token storage, route access control |
| Student Profile Module | Create, fetch, update student details and skills |
| Student Dashboard Module | Display profile summary, skill count, applications count |
| Job Management Module | Create, edit, fetch, and delete job postings |
| Job Discovery Module | Search, filter, and apply for jobs |
| Application Review Module | Track application status and recruiter comments |
| Recruiter Dashboard Module | View applicants and update decision status |

## 4.2 Authentication Module

### Features

1. User signup with email, password, and role.
2. Duplicate user check.
3. Password hashing using bcrypt.
4. User login with credential validation.
5. JWT generation after successful login.
6. Persistent authentication using localStorage.
7. Route-level role restriction in the frontend.

### Related Files

| File | Purpose |
|---|---|
| `backend/server.js` | Signup and login endpoints |
| `frontend/src/landingpages/Login.js` | Login form and redirect |
| `frontend/src/landingpages/Signup.js` | Signup form |
| `frontend/src/context/AuthContext.js` | Auth state persistence |
| `frontend/src/components/ProtectedRoute.js` | Role-based route access |

## 4.3 Student Profile Module

### Features

1. Create a student profile after first login.
2. Add multiple skills dynamically.
3. Store additional profile details.
4. Retrieve profile by email.
5. Update profile from the dashboard modal.

### Inputs Captured

| Field | Type |
|---|---|
| Name | String |
| Skills | Array of strings |
| Email | String |
| Details | String |

## 4.4 Student Dashboard Module

### Features

1. Welcome message using student name.
2. Skill count display.
3. Applied jobs count display.
4. Editable profile information.
5. Quick navigation to job listings.

## 4.5 Job Management Module

### Features

1. Add job posting.
2. Edit existing job.
3. Delete job.
4. Assign work type.
5. Add multiple required skills.

### Job Data Fields

| Field | Type |
|---|---|
| Company Name | String |
| Job Role | String |
| CTC | String |
| Skills | Array of strings |
| Work Type | String |

## 4.6 Job Discovery Module

### Features

1. Display all available jobs.
2. Search jobs by company name.
3. Filter jobs by work type.
4. Show required skills and package.
5. Apply to a job using the student's profile.
6. Disable apply button when already applied in the current UI state.

## 4.7 Application Review Module

### Features

1. Display all applications submitted by the logged-in student.
2. Search application list by company name.
3. Display status using colored badges.
4. Show recruiter comments.
5. Allow deletion of non-pending applications.

## 4.8 Recruiter Dashboard Module

### Features

1. Display all candidate applications.
2. Show candidate skill set, company, and role.
3. Display total candidate count.
4. Update candidate status to Selected or Rejected.
5. Add recruiter comment during status update.

---

# CHAPTER 5
# API DOCUMENTATION

## 5.1 API Overview

The backend exposes REST endpoints for authentication, student profile management, job management, and job application workflow.

## 5.2 Authentication APIs

| Method | Endpoint | Purpose | Request Body | Response |
|---|---|---|---|---|
| POST | `/signup` | Register a new user | `email`, `password`, `role` | Success or duplicate user message |
| POST | `/login` | Authenticate user | `email`, `password` | `token`, `role`, `redirect` |

## 5.3 Student Profile APIs

| Method | Endpoint | Purpose | Request Body | Response |
|---|---|---|---|---|
| PUT | `/addstudent` | Create or update student profile | `name`, `skills`, `email`, `details` | Saved student profile |
| GET | `/getstudent/:email` | Fetch student profile by email | None | Student document |
| PUT | `/updatestudent/:id` | Update student by ID | Updated student fields | Updated student document |

## 5.4 Job APIs

| Method | Endpoint | Purpose | Request Body | Response |
|---|---|---|---|---|
| POST | `/addjob` | Add job posting | `companyName`, `jobRole`, `ctc`, `skills`, `workType` | Success message |
| GET | `/getjobs` | Fetch all jobs | None | Array of jobs |
| PUT | `/updatejob/:id` | Update job by ID | `companyName`, `jobRole`, `ctc`, `skills`, `workType` | Updated job |
| DELETE | `/deletejob/:id` | Delete job by ID | None | Success message |

## 5.5 Application APIs

| Method | Endpoint | Purpose | Request Body | Response |
|---|---|---|---|---|
| POST | `/applyjob` | Submit application | `studentName`, `studentSkills`, `companyName`, `role`, `workType`, `email` | Success message |
| GET | `/getapplications` | Fetch all applications | None | Array of applications |
| PUT | `/updatestatus/:id` | Update application status and comment | `status`, `comment` | Updated application |
| DELETE | `/deleteapplication/:id` | Delete application by ID | None | Success message |

## 5.6 API Notes

1. The frontend sends a bearer token through Axios interceptor.
2. The backend currently does not verify the JWT token on protected routes.
3. Recruiter-only restrictions are enforced on the frontend, not yet on the backend.

---

# CHAPTER 6
# DATABASE DESIGN

## 6.1 Database Overview

MongoDB is used as the database and Mongoose is used for schema definition and model interaction.

## 6.2 User Collection

| Field | Type | Description |
|---|---|---|
| email | String | Unique user email |
| password | String | Hashed password |
| role | String | User role: student or recruiter |

## 6.3 Student Collection

| Field | Type | Description |
|---|---|---|
| name | String | Student name |
| skills | Array | List of skills |
| email | String | Unique student email |
| details | String | Additional profile details |

## 6.4 Job Collection

| Field | Type | Description |
|---|---|---|
| companyName | String | Company offering the job |
| jobRole | String | Role title |
| ctc | String | Salary or package |
| skills | Array | Required skills |
| workType | String | Remote, On-site, or Hybrid |

## 6.5 Candidate Collection

| Field | Type | Description |
|---|---|---|
| studentName | String | Applicant name |
| studentSkills | Array | Skills of the student |
| companyName | String | Applied company |
| role | String | Applied role |
| workType | String | Job work type |
| appliedAt | Date | Timestamp of application |
| status | String | Pending, Selected, or Rejected |
| email | String | Student email |
| comment | String | Recruiter remarks |

---

# CHAPTER 7
# TESTING AND VALIDATION

## 7.1 Functional Validation Performed from Code Review

| Functionality | Status |
|---|---|
| Signup flow | Implemented |
| Login flow | Implemented |
| Student profile creation | Implemented |
| Student profile update | Implemented |
| Job add/edit/delete | Implemented |
| Job search/filter | Implemented |
| Job apply | Implemented |
| Application review | Implemented |
| Recruiter status update with comment | Implemented |

## 7.2 Testing Observations

1. Frontend includes the default CRA test file and does not contain meaningful project-specific tests.
2. Backend `test` script is still a placeholder.
3. Validation is primarily based on implemented code paths rather than automated test coverage.

## 7.3 Sample Test Cases

| Test Case | Input | Expected Result |
|---|---|---|
| Student signup | Valid email, password, role | User created successfully |
| Duplicate signup | Existing email | Conflict message returned |
| Student login | Valid credentials | Token and redirect returned |
| Incomplete job apply | Missing profile fields | Error message shown |
| Recruiter adds job | Valid job form | Job added successfully |
| Recruiter updates status | Selected or Rejected with comment | Application updated |

---

# CHAPTER 8
# LIMITATIONS AND FUTURE ENHANCEMENTS

## 8.1 Current Limitations

1. JWT verification is not enforced on backend routes.
2. Recruiter authorization is not validated server-side.
3. Secrets are hardcoded in the backend file.
4. Duplicate application prevention is mainly handled in the frontend.
5. The backend is written in a single file, reducing maintainability.
6. No resume upload or document management is included.
7. No email or notification system is integrated.
8. No advanced filtering, sorting, or analytics are available.

## 8.2 Future Enhancements

1. Add backend authentication middleware for token verification.
2. Add role-based backend authorization for recruiter-only routes.
3. Move secrets to environment variables.
4. Add resume upload and profile image support.
5. Add email notifications for status changes.
6. Add company-specific recruiter accounts and dashboards.
7. Add pagination and advanced search filters.
8. Add interview scheduling and shortlist workflow.
9. Add unit tests, integration tests, and API tests.
10. Refactor backend into controllers, routes, models, and middleware folders.

---

# CHAPTER 9
# CONCLUSION

The Student Job Finder project successfully demonstrates the design and implementation of a role-based job portal using the MERN stack. The system enables students to maintain their profile, discover job opportunities, apply for jobs, and monitor recruitment outcomes. It also enables recruiters to manage job openings and candidate decisions through a dedicated administrative interface.

The project meets its primary objective of creating a centralized platform for student recruitment workflow management. From a software engineering perspective, it showcases practical usage of authentication, CRUD operations, REST APIs, frontend routing, shared state management, and MongoDB-based persistence.

Although the project is functionally complete for a basic job portal, further improvements in security, scalability, and testing will strengthen it for real-world deployment. Overall, the project provides a strong foundation for future expansion into a production-grade recruitment management system.

---

## Appendix A - Source Modules

| Path | Description |
|---|---|
| `backend/server.js` | Express server, schemas, and all API endpoints |
| `frontend/src/App.js` | Route declarations |
| `frontend/src/context/AuthContext.js` | Authentication state |
| `frontend/src/context/DataContext.js` | Shared jobs/applications state |
| `frontend/src/landingpages/Login.js` | Login page |
| `frontend/src/landingpages/Signup.js` | Signup page |
| `frontend/src/studentpages/Studentdetails.js` | Student onboarding profile form |
| `frontend/src/studentpages/Studentdashboard.js` | Student dashboard |
| `frontend/src/studentpages/JobList.js` | Job browsing and application |
| `frontend/src/studentpages/JobReview.js` | Application review page |
| `frontend/src/adminpages/Admindashboard.js` | Recruiter dashboard |
| `frontend/src/adminpages/AddJob.js` | Job creation and management |

## Appendix B - Template Usage Notes

This file is structured using the section flow inferred from the provided templates:

1. Cover Page and Title Page template
2. Bonafide Certificate template
3. Declaration template
4. Acknowledgement template
5. Table of Contents template
6. Introduction chapter template

Before final submission, replace all placeholder values enclosed in angle brackets with your academic details and apply the formatting required by your department:

1. Font: Times New Roman
2. Title headings: as specified by the template
3. Body text: justified alignment
4. Spacing: one and a half line spacing where required
