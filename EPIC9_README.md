Task: Update admin header
1. **Admin Header Component:**
   - Display the logged-in user's username or avatar on the right side.
   - **Interaction:** When the user clicks the username/avatar, open a Dropdown Menu.
   - **Menu Items:**
     - "My Profile" (Links to `/admin/profile`)
     - "Logout" (Mock function)

2. **Profile Page (`/admin/profile`):**
   - Create a layout with a clear structure (e.g., a sidebar or tabs for different sections, or a single page with distinct cards).
   - **Section 1: General Information**
     - Fields: Full Name, Email (Read-only), Phone Number.
     - Action: "Save Changes" button.
   - **Section 2: Security**
     - Fields: Current Password, New Password, Confirm New Password.
     - Action: "Change Password" button.
   - **Section 3: Profile Photo**
     - UI: Display current avatar (circle).
     - Action: Button to upload/select a new image (simulate the upload process).

**Implementation Details:**
- Use client-side components (`"use client"`) where necessary.
- Ensure the Dropdown menu is accessible.
- Add mock handlers for form submissions (e.g., `console.log` data and show a toast notification on success).
- Ensure the UI is responsive and looks professional.

Please provide the full code for the `AdminHeader` component and the `ProfilePage` component.