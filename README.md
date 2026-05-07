# Contact Management System (Role-Based Project)

## Project Overview

The Contact Management System is a role-based web application designed to help users manage their contacts efficiently.
It supports multiple user roles (`ROLE_USER` and `ROLE_ADMIN`) with role-based access control.
Users can manage personal contacts and groups, while admins have additional privileges to manage users and system data.

---

## User Roles

| Role       | Description                        | Privileges                                                                                |
| ---------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| ROLE_USER  | Default role assigned to new users | Can add, edit, delete, and search personal contacts; create and manage groups             |
| ROLE_ADMIN | Administrative role                | Can edit user information, soft delete users, search and filter contacts across all users |

**Promote a user to admin using SQL:**

```sql
-- Promote the user with email inaamm@gmail.com to ROLE_ADMIN
UPDATE users
SET role_id = 2
WHERE email = 'inaamm@gmail.com';
```

---

## User Features

| Feature             | Description                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Add Contact         | Users can add contacts with email, phone number, and a label                                    |
| Edit/Delete Contact | Users can edit or delete their existing contacts                                                |
| Search Contact      | Users can search for contacts only in the contact list, by first name, last name, or email                                                |
| Sorting             | Contacts can be sorted by first name or last name in ascending (ASC) or descending (DESC) order |
| Pagination          | Users can navigate through contact lists using Next and Previous buttons                        |
| Group Management    | Users can create groups, add multiple contacts to a group, and view group details               |

---

## Admin Features

| Feature                  | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| Edit Users               | Admin can edit user information                              |
| Soft Delete Users        | Admin can perform soft deletions of users                    |
| Search & Filter Contacts | Admin can search contacts and apply filters across all users |

---

## Database Structure

| Table          | Key Columns                                   | Description                                       |
| -------------- | --------------------------------------------- | ------------------------------------------------- |
| users          | id, email, password, role_id                  | Stores user account information and roles         |
| contacts       | id, user_id, name, email, phone_number, label | Stores contacts linked to individual users        |
| groups         | id, user_id, group_name                       | Stores groups created by users                    |
| group_contacts | id, group_id, contact_id                      | Maps multiple contacts to their respective groups |

---

## Usage Instructions

1. Sign up as a new user. By default, the user will have the role `ROLE_USER`.
2. Add, edit, or delete your contacts.
3. Create groups and add multiple contacts to each group.
4. Search and filter contacts as needed; use sorting options to organize contacts.
5. Navigate contact lists using pagination controls.
6. Admin users can manage other users, perform soft deletions, and have access to all contacts.
7. To promote a user to `ROLE_ADMIN`, run the provided SQL query.
