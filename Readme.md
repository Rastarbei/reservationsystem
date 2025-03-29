Airline reservation System
Overview
This is a full-stack flight management system built with Django (backend), React (frontend), and PostgreSQL (database). It allows users to 
1.	view flight details,
2.	make reservations, 
3.	manage bookings
4.	manage users

Features
1.	View available flights 
2.	Book a flight 
3.	Manage reservations
4.	User authentication

Screenshots
Home page (homepage.png)
Admin page/Manage flights (addflights.png)
       
Backend(Database) Setup (Django)
Install postgresql in the local machine and setup correctly. Use following command to login to the psql shell as postgres user.Use the following command on terminal:
    psql -U postgres
Login to pgAdmin (Search on start) using the username and password used in the installation process of postgres.

Pip install the following Django dependencies:
    Django
    Djangorestframework
    psycopg2
    django-cors-headers

Then run this:

    cd backend
    python manage.py migrate
    python manage.py runserver


Frontend Setup (React)
    cd frontend
    npm install
    npm start
API Endpoints
    Method 	Endpoint		Description
    GET	    	/api/flights/		Fetch all flights
    POST		/api/reservations/ 	Create a reservation
    GET		/api/reservations/:id/	Get reservation details
