# Fauxica E-Shop
Fauxica is an online shop inspired by the design created in this video: https://youtu.be/Kl3nOXQjVnQ.



## About the project

I made this project to practice with frontend, backend and database management. To code this website I used:

- Frontend: HTML5, CSS3, JS and JQuery to communicate with the backend and animate the user side.

- Backend: Java Spring Boot (3) to communicate with the database and send and receive data from the frontend;
    Python 3.9 with Tensorflow, NumPy and Pandas to create a recommendation system with Machine Learning.

- Database: MongoDB local.



## Prerequisites
To run the project you need the following:

- A web browser (e.g. Chrome, Firefox, Edge, ...);
- Java (at least 20);
- Python 3.9 with the following packages: pymongo, numpy, pandas,sentence_transformers, scikit-learn;
- MongoDB installed locally (MongoDB Compass is recommended for a simpler use).



## Installation
Now you can clone my repository
```
git clone https://github.com/MattBerna17/Fauxica.git
```

To set up the database, start the mongod service and run the following commands:
```
mongosh
use fauxica
db.createCollection("Users")
db.createCollection("Products")
db.createCollection("CreditCards")
```
Then you have to copy the content of the .json files in the backend/MongoDB/ directory and run the command
```
db.<Collection>.insertMany(<content>)
```
Where <Collection> is the name of the collection and <content> is the content copied from selected collection's file .json



## Running the project
Now you can run the project by just executing the Main.java (starting the backend on localhost:8080) and starting the live server for the frontend.
