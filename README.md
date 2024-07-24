# DreamDuo

## Instructions For Setting Up, Running And Testing The Flask Application

### How to start the flask application

#### Run the command, in specific directory

* */DreamDuo $ python app.py*

### How to create database (and add example data)

* */DreamDuo $ python setup_db.py*

### User with example data

* Username: Peddi
* Password: peder@123

## Required resources

Python, we recommend 3.11.9 or later.

Flask, flask-login and bcrypt;

Relevant Commands:

* $ pip install Flask

* $ pip install flask-login
  
* $ pip install bcrypt

## Projects vision

We developed a website which tracks the amount of macros a user consumes. The website is meant to be a tool for people to easily track and view their intake. This is useful for people who want to gain, lose or maintain weight, and these people are bodybuilders, over- or underweight and also regular people. The website is made for everyone, and can be a helpful way to track your nutrients, meals and health.

## GOAL

The goal of this project is to initially develop a website for personal use, with the potential to publish it later. We also want the user to have the freedom to add, delete and edit all of their meals, ingredients, and their profile information.

## The Plan

We are going to use an API to gather relevant data for the meals users will create. This will further be used to present an overview of all the macros which each meal contain. The API is from the kassal.app website, and is helpful tool in this project.

A simple authentication system for people to register and also login into their accounts. This is useful, since we need a decent amount of information about the user and have to separate the data for each user. Relevant information is of course what they eat, weight, height, age, activity level and etc.

## Website's functionality

### Authentication

The user can register and login to their account, and afterwards logout, if they want to. The user information is stored in the database, and cookies are used to tell client that user is authenticated and make the users experience better. This is for example messages about creating, deleting, editing different things on the website.

### Vue child components

Each component has their own display system. The button in the top right corner in each module is used to hide the component and the user can display them again with specific buttons, for example "Calender" with a green outline.

### Validation

All of the user input is validated and errors are displayed if the input fails validation. The validation is both client and server side.

### User profile

The user has their own profile where they can edit and update their information, and change their password. The user is able to upload and delete their own picture, retrieve dynamic feedback about recommended calories per day, depending on their activity level. Read more about activity level in the extra features section.

### Personal Meals

Personal meals are stored in the database, and is presented in a list with;

* Meal name
* Total Macros
* All ingredients used in the meal
  
The ingredients can be modified and removed from the meal.

The display of the ingredients is toggled with the button "Show ingredients"

The user is able to create, edit and delete meals.

#### Creation of a meal

The user can add a empty ingredient, a ingredient from the kassal app API or a ingredient from their own personal list of ingredients.

The user has the freedom to delete or reset the ingredients in the meal.

### Personal Ingredients

Personal ingredients are stored in the database, and is presented in a list with;

* Ingredient name and amount
* Nutrition information

The display of the nutrients is toggled with the button "Show nutrients"
  
The user is able to create, edit and delete ingredient

#### Creation of an ingredient

The can create an ingredient with name, amount and the five nutrients: calories, protein, carbohydrates, fat and sugar

### Search And Sort

Search and sort is used in both personal meals and ingredients lists. This makes the search for an ingredient or a meal much easier.

Search input for the list of ingredients and meals filters them alphabetically.

Sort, sorts in an ascending order: high to low. For meals it checks the total nutrient amount, and in ingredients it checks the nutrient amount

#### Sort value stored

The sort value picked by a user is stored with cookies, ready for future use. These are presented if the user revisits the page. Removed if the users either deletes cookies or ends the session.

## Extra features

These extra features makes the use of the website smoother. Since instead of manually creating ingredients, the user can pick ingredients from a search with the API and construct their meal. Meals are stored and the user can navigate to their personal meals and include them in their daily list of consumed meals.

### Vue code separation

The project is developed with the framework which makes coding a bit easier. Vue gives us the opportunity to split the code into different components, called child components. We have a lot of them, and it separates our code.

We moved all of the ajax and validation functions into their own child component and use the method "ref" to execute functions in the ajax and validation child components from anywhere in the code.

### Meal calender

The macro tracker has an inbuilt calender system that tracks when you ate your meals. A user can add, delete and edit meals from the calender. They decide the content of the calender.

The calender functions are; the possibility to choose a specific date, choose a specific day of the week and loop through the weeks.

The system is fairly complex, consisting of multiple algorithms which use the inbuilt date function in javascript to determine the days of the week and afterwards logically predict or determine the past and the future. The algorithms follow the logic of the normal date system we use.

* Which currently is only used to retrieve the day of specific date

If the user selects a specific date, the calender system will use the next and previous algorithms to find the week which the date is in. Then the user can freely explore the past and future from that week. This enables the user the freedom to choose which week, date or day they want to edit.

### Profile Picture

The user has the opportunity to upload an image, and afterwards they have the possibility to delete it.

### Kassal app API

The usage of an API makes the creation of a meal much smoother and saves time. The kassal app API can be used in both edit and create meal, with a search field. The user can search and select and add specific ingredients to their meal.

The ingredients added to the meal, will automatically be added to their personal ingredients list. They can then later use those personal ingredients in their future meals.

### Activity level, calorie calculation, and recommendation

The user can select an activity lvl and we then calculate the recommended amount of calories the user should consume to preserve the weight.

Activity levels:

* Sedentary
* Lightly active
* Moderately active
* Very active
* Super Active

The calculations are done on the client side, and therefore instantly updates the recommended calorie consumption when activity level is modified.

### Average macros

The data in each week is used to calculate the average amount of nutrients the user has consumed per day.

This is updated every time the user clicks either previous week or next week.

### Stored data

User information; Username, password, personal name, email, weight, height, their activity lvl, age, gender and a profile picture.

Meals, ingredients and a meal calender: overview of when the user consumed certain meals

Five main nutrients:
    -Calories
    -Carbohydrates
    -Protein
    -Fat
    -Sugar

### Database structure

#### Tables

* Users
* Personal meals
* Ingredients for meals (Two foreign keys, composite key)
* Personal ingredients
* Meal calender

### Utilization of user data

The user data: weight, height, activity lvl, age, gender is used to calculate the recommended amount of nutrition a user should consume over a specific time period.

## Programming languages and tools

### Backend

Python, Flask, Flask-login and a SQLite database.

### Frontend

Vue and markup language html

### Layout

CSS - Cascading Style Sheets
Bootstrap - theme: <https://bootswatch.com/darkly/#top>

## Kassal.app

Kassal.app is developed by Helge Sverre and is a norwegian website and app which compares groceries prices in norway. The website offers the use of an API for free, 60 requests per minutes, meant for students, hobby projects, and hackathons.

Relevante links:
<https://helgesver.re/>
<https://www.kode24.no/artikkel/helge-lager-prisjakt-for-mat-hittil-har-jeg-tjent-400-kroner/79095962>

## Sources

Vue -- <https://unpkg.com/vue@3.0.5/dist/vue.global.js>

Bootstrap -- <https://getbootstrap.com/>, <https://cdn.jsdelivr.net/npm/bootswatch@4.5.2/dist/darkly/bootstrap.min.css> we used the theme: <https://bootswatch.com/darkly/#top>

Cookies -- <https://www.tutorialspoint.com/flask/flask_cookies.htm#:~:text=In%20Flask%2C%20cookies%20are%20set,back%20a%20cookie%20is%20easy>.

Fav Icon bug -- <https://stackoverflow.com/questions/31075893/how-to-fix-favicon-ico-error-failed-to-load-resource-neterr-empty-response>

Kassal App API -- <https://Kassal.app/>

Validation in javascript -- <https://www.tutorialrepublic.com/javascript-tutorial/javascript-regular-expressions.php>, <https://www.w3schools.com/jsref/jsref_regexp_test.asp>, <http://stackoverflow.com/questions/46155/validate-email-address-in-javascript>

Python validation -- <https://docs.python.org/3/library/re.html>, <https://www.hackerrank.com/challenges/string-validators/problem#:~:text=Python%20has%20built%2Din%20string,alphanumeric%20characters%2C%20digits%2C%20etc.&text=This%20method%20checks%20if%20all,A%2DZ%20and%200%2D9>

CHATgpt -- OpenAI. (2024). ChatGPT (fra 14.april versjon) [Stor språkmodell]. <https://chat.openai.com/>
