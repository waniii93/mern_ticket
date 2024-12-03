# Ticket CRUD with MERN stack
CRUD functionalities for Ticketing module using MERN stack

**Technologies:**
- Frontend: React
- Backend: Node.js
- Database: MongoDB

**Features**
- **Authentication & Authorization**: Secure login with role-based access (Admin, Agent, Customer)
- **CRUD Operations**: Create, Read, Update, and Delete tickets
- **Basic CSS UI**: User-friendly interface for managing tickets

**CRUD Topic**
- Title: Ticket Management System
- Objective: To manage and track support tickets based on user roles, allowing different access permissions and CRUD operations

**1. Login page**
   - Secure login system with role-based access.
![image](https://github.com/user-attachments/assets/8afddabc-b206-4bed-9173-b651249cf144)

**2. Ticket List page**
   - **Admin** user group can view all tickets.
   - **Agent** user group can view tickets assigned to them or created by them.
   - **Customer** user group can view tickets they created only.
   - Able to filter ticket listing by **Priority**, **Status**, **Category**, **Name**, **Email**, and **Subject**.
   ![image](https://github.com/user-attachments/assets/d55b7901-0fc4-4ffb-8246-475c986c428f)

**3. Add Ticket Form**
   ![image](https://github.com/user-attachments/assets/8bfea33e-d105-41e5-a854-a943e971baf3)
   ![image](https://github.com/user-attachments/assets/61f413f7-678a-4565-9b5c-144c2ddde9a2)
   ![image](https://github.com/user-attachments/assets/d493a113-b8d4-4ae0-8da1-61dddc9d5028)

**4. View/Update Ticket page**
   - Able to view information about a ticket
   - Able to update existing ticket by selecting Status and Assigned To user
   - Able to add reply/comment to existing ticket
   ![image](https://github.com/user-attachments/assets/c1a9d627-6d68-4e2c-b552-f0da15f4edaa)

**5. Delete Ticket**
   - Delete tickets with confirmation prompt.
   ![image](https://github.com/user-attachments/assets/400d599c-ae4c-4407-a342-5949cd0ea5fa)

## Conclusion
This Ticket Management System implemented using the MERN stack allows users to efficiently manage tickets. It provides role-based access control, CRUD functionality, and a simple UI for smooth user interaction.

**Future enhancements:**
- Allow users to upload file attachments to tickets
- Add sorting functionality on ticket listing table

