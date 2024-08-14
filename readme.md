# Library Management Service

## Here how to run this service
#### 1. Clone this repository.
#### 2. Use command `cd library-management` to get inside the project folder
#### 3. Please pay attention to `.env` file, and open it, inside there is `MONGO_URI` variable that empty.
#### 4. `MONGO_URI` variable are important since this service will be connected to atlas mongodb acted as database.
#### 5. Please ask **Fitria Rahmawati** for the `MONGO_URI` key, and paste into it.
#### 6. After that, please save the env file and make sure you already had docker daemon installed.
#### 7. Please run this command to build image for this project: `docker build -t library-management-app .`.
#### 8. And then please run this command to start the container: `docker run -p 9100:9100 library-management-app`.
#### 9. Then the service successfully running at `http://localhost:9100/`.
#### 10. For API documentation, there is built in swagger docs in the service, please visit `http://localhost:9100/api-docs`.
#### 11. For running the test cases just use command `npx jest`.

## If you have any follows up questions regarding this service, please contact me at anggiet.bracmatya@gmail.com

## Thankyou