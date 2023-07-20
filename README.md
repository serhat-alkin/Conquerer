# Conquerer


# Setup

Start by cloning this repository<br />
`git clone https://github.com/serhat-alkin/Conquerer` <br />

You need to have postgresql installed on your local machine and create a local DB named "conquerer"

To ensure the security of the API Key and secrets, it is important to follow these steps:

On the root folder of the project, create a new file named .env.
Copy and paste the following information into the .env file. I sent JWT_SECRET and ELASTIC_SEARCH_API_KEY via email. ELASTIC_SEARCH_API_KEY belongs to my temporary user for elastic.co  <br />
```
HOST=localhost
DB_USER=YOUR_POSTGRES_USER
DB_HOST=localhost
DB_NAME=conquerer
DB_PASSWORD=YOUR_DB_PASSWORD
DB_PORT=5432
JWT_SECRET=YOUR_SECRET
ELASTIC_SEARCH_HOST=https://f8c33563218548c3add7df9134c36c75.us-central1.gcp.cloud.es.io:443
ELASTIC_SEARCH_API_KEY=API_KEY
```

Execute `npm install` to install dependencies. <br />

Execute `npm run setup`  to setup and initialize db. It may take a a while to init db. Please wait until seeing both Tables cread and Data created log. <br />

Execute `npm start` to run the application. Server is going to start running at http://localhost:3000. <br />

Execute `npm test` to run tests. <br />

Here's the table with the related Method, Endpoint, Description, Token and Parameter information:

| Method   | Endpoint                            | Description                           | Token Needed | Param Needed        |
| -------- | ----------------------------------- | ------------------------------------- | ------------ | ------------------- |
| `POST`   | `/users/register`                   | Register a new user                    | No           | No                  |
| `POST`   | `/users/login`                      | User login                            | No           | No                  |
| `POST`   | `/users/:userId/changePassword`     | Change user password                  | Yes          | `userId`            |
| `DELETE` | `/users/:userId`                    | Delete user                           | Yes          | `userId`            |
| `POST`   | `/posts/create`                     | Create a new blog post                 | Yes          | No                  |
| `PATCH`  | `/posts/update/:postId`             | Update a blog post                     | Yes          | `postId`            |
| `PATCH`  | `/posts/delete/:postId`             | Soft Delete a blog post                | Yes          | `postId`            |
| `POST`   | `/comments/create/`                 | Create a new comment                   | Yes          | No                  |
| `GET`    | `/users/:userId/comments`           | Get comments by user ID                | Yes          | `userId`            |
| `GET`    | `/users/:userId/posts`              | Get posts by user ID                   | Yes          | `userId`            |
| `GET`    | `/posts`                            | Get last posts                         | Yes          | No                  |
| `GET`    | `/posts/by_category`                | Get posts by category                  | Yes          | No                  |
| `GET`    | `/search/category_rates`            | Get category rates                     | Yes          | No                  |
| `GET`    | `/search/user_stats`                | Get user statistics                    | Yes          | No                  |
| `GET`    | `/search/posts/this_week`           | Get posts from this week               | Yes          | No                  |
| `GET`    | `/search/posts/this_month`          | Get posts from this month              | Yes          | No                  |
| `GET`    | `/search/posts/this_year`           | Get posts from this year               | Yes          | No                  |


The last 5 GET requests in the table above belong to Part 2 of the project (Elastic search).

Please note that the JWT token received upon login must be included in the Authorization header of all subsequent requests as stated in "Token Needed" column. Also "Param Needed" column specifies any additional parameters that are required for the request. 


You can check this [postman collection](https://drive.google.com/file/d/15B8PFmctI3yRvspfHyRSQ6ZfYqpM3OcB/view?usp=sharing) and see sample requests for each enpoint.


TDD and SOLID principles were followed during the development of this project.
