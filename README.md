> [!NOTE]  
> This App is currently in development. We plan to deploy it soon. We appreciate your patience and feedback as we continue to improve the app.

# Cinema Booking App
> An app for cinema-goers to browse and book movies, with an admin dashboard for cinema management.

## Description
The Cinema Booking App is a React web application designed to offer cinema-goers an immersive and effortless experience. Users can browse a wide selection of movies, view detailed descriptions, and book tickets for specific shows with just a few clicks. The visually engaging interface ensures smooth and enjoyable navigation.

For cinema management, the app provides a comprehensive admin dashboard. Admins can easily add new movies, configure screens, schedule shows, and monitor user activity. The dashboard also offers real-time insights into bookings, user interactions, and overall cinema performance, allowing administrators to manage every detail efficiently.

## Interface
### User Interface
![User Interface](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW0wMmZ6aXNwcDFybmo5eWJiZTQwYmU0MzdzOGlkc2ltMXFpZG9saSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/onqE8rvm2iht9IYD0h/giphy.gif "User Pages")

### Admin Interface
![Admin Interface](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzQzYndvOGpnc3BjdmFoenFzY241MnB0Zzhqd3Y4eWhvemt2MGdtdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LBiIYakOPmpbcQPEKG/giphy.gif "Admin Pages")

## Features

- User-friendly web interface.
- Fast and easy booking experience.
- Full control and cinema management for admins.
- Dynamic admin dashboard for tracking cinema updates.
- Authentication system for secure access for both users and admins.

## Getting Started
### Server Setup
1. Clone the repository to your local machine:
    `git clone https://github.com/mohammedshady/cinema-booking.git`
2. Navigate to the server directory:
    `cd server`
3. Install the required dependencies:
    `npm install`
4. Create the database `cinema` in MongoDB.
5. Create the `.env` file in the server directory and add the following details:
    ```env
    PORT=5000
    DB_URL=mongodb://127.0.0.1:27017/cinema
    BASE_URL=http://localhost:5000
    ```
6. Start the Node server:
    `npm run dev`

### Client Setup
1. Navigate to the client directory:
    `cd client`
2. Install the required dependencies:
    `npm install`
3. Start the React development server:
    `npm run dev`
4. Access the application in your web browser at `http://localhost:3000`.

## Future Updates

We are committed to improving the Cinema Booking App to enhance its functionality and user experience. Planned updates include:
- [ ] Implement secure payment processing for ticket bookings.
- [ ] Expand to support multiple cinema locations.
- [ ] Enhance the user interface for improved usability and design.
- [ ] Fix responsiveness issues to ensure proper display on all devices.

## Authors

- **Mohammed Shady** - _GitHub Profile_: [mohammedshady](https://github.com/mohammedshady) | _Email_: mohatech777@gmail.com
- **Mohammed AbdelNasser** - _GitHub Profile_: [mohamedabdelnasser](https://github.com/M-AbdelNasser)

If you encounter any issues or have suggestions for improvements, please reach out via email. Your feedback is valuable and helps us enhance the app for everyone.


