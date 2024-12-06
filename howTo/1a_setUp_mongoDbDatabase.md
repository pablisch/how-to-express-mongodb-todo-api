# Setting up the MongoDB database

Go to [MongoDB](https://www.mongodb.com/) and log in.

| <img src="howToImages/step1Images_mongoDb/1.mongoDbStartScreen.png" alt="MongoDB overview" width="900" /> |
| --------------------------------------------------------------------------------------------------------- |

There are several ways to add a `new project` but one of the easiest to find is going to the cluster project page and pressing the `new project` button there.

| <img src="howToImages/step1Images_mongoDb/2.mongoDbProjectPage.png" alt="Create new project in MongoDB" width="900" /> |
| ---------------------------------------------------------------------------------------------------------------------- |

Enter the new project's name and click next...

| <img src="howToImages/step1Images_mongoDb/3.mongoDbCreateAProject.png" alt="Create a project page" width="900" /> |
| ----------------------------------------------------------------------------------------------------------------- |

The next screen adds is an opportunity to add new members. I left myself as the owner and assumed that this would make me the database user but it is a little confusing exactly what this means in effect.

| <img src="howToImages/step1Images_mongoDb/4.mongoDbSetMembers.png" alt="Set members screen" width="900" /> |
| ---------------------------------------------------------------------------------------------------------- |

Previously, I thought this project would naturally be in the one cluster that I have, but I was prompted to Create a new cluster which I did not really understand. It did however all work out fine, and it did become a part of my single Cluster 0.

| <img src="howToImages/step1Images_mongoDb/5.mongoDbCreateCluster.png" alt="Create a cluster screen" width="900" /> |
| ------------------------------------------------------------------------------------------------------------------ |

I completed this choosing the free option and left the rest as default using the nearby Ireland region and the default AWS.

| <img src="howToImages/step1Images_mongoDb/6.mongoDbDeployCluster.png" alt="Deploy a cluster screen" width="900" /> |
| ------------------------------------------------------------------------------------------------------------------ |

Next come the connection options. Obviously I changed the password from the one shown here. Later on force me to create a new Database User.

| <img src="howToImages/step1Images_mongoDb/7.mongoDbConnectCluster.png" alt="Connect to cluster screen" width="900" /> |
| --------------------------------------------------------------------------------------------------------------------- |

Not quite sure why this screen came up. Just another screen to plow through to get to the connection strings.

| <img src="howToImages/step1Images_mongoDb/8.mongoDbGetConnectionString.png" alt="Get connection string screen" width="900" /> |
| ----------------------------------------------------------------------------------------------------------------------------- |

Here is the point where I was forced to create a new database user to continue though it is not shown in the screenshot.

| <img src="howToImages/step1Images_mongoDb/9.mongoDbCChooseConnectionString.png" alt="Choose connection string options" width="900" /> |
| ------------------------------------------------------------------------------------------------------------------------------------- |

The list to select the connection string needed. I have only ever needed `Drivers` for the API connection and `Compass` obviously to Compass.

| <img src="howToImages/step1Images_mongoDb/10.mongoDbConnectionList.png" alt="Connection list" width="900" /> |
| ------------------------------------------------------------------------------------------------------------ |

The `Drivers` page for the API connection string:

| <img src="howToImages/step1Images_mongoDb/11.mongoDbApiConnectionString.png" alt="API connection string screen" width="900" /> |
| ------------------------------------------------------------------------------------------------------------------------------ |

The `Compass` page for connecting to MongoDB Compass:

| <img src="howToImages/step1Images_mongoDb/12.mongoDbCompassConnectionString.png" alt="MongoDB Compass connection string screen" width="900" /> |
| ---------------------------------------------------------------------------------------------------------------------------------------------- |

## MongoDB Compass

Start the app and choose `New connection`.

Enter the connection string provided by MongoDB from your account and add in the correct password.

Give the project a name to avoid the horrible default shown in the screenshot and click `Save and Connect`.

| <img src="howToImages/step1Images_mongoDb/13.mongoDbCompassNewConnection.png" alt="MongoDB Complass new connection" width="900" /> |
| ---------------------------------------------------------------------------------------------------------------------------------- |

Find this project in the list and click `+` to add a new database.

| <img src="howToImages/step1Images_mongoDb/14.mongoDbCompassAddDatabase.png" alt="Add database in Compass" width="900" /> |
| ------------------------------------------------------------------------------------------------------------------------ |

Give it an appropriate name and first collection name.

**NOTE:** If you plan to have different databases to dev, production, test, etc. then this is a good time to think about that in your naming, e.g. this example is called `todo_DEV` rather than simply `todo`.

| <img src="howToImages/step1Images_mongoDb/15.mongoDbCreateDatabase.png" alt="Create database in Compass" width="900" /> |
| ----------------------------------------------------------------------------------------------------------------------- |

Click on that database to see the database which of course, will be empty.

| <img src="howToImages/step1Images_mongoDb/16.mongoDbViewNewDatabase.png" alt="New database view" width="900" /> |
| --------------------------------------------------------------------------------------------------------------- |

[NEXT: Setting up the repository](1b_setUp_repository.md)
