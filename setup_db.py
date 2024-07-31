import sqlite3
from sqlite3 import Error

from example_data import meal_calender_data, personal_ingredients_data, ingredients_for_each_meal_data, personal_meals_data, users_data

from insert_queries import add_user_with_all_information, add_meal, add_ingredient, add_ingredient_to_meal, add_meal_to_calender

import os

database = r"./database.db"

def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as err:
        print("Error: {}".format(err))

###### TABLES ######
sql_create_users_table = """CREATE TABLE IF NOT EXISTS users (
                             user_no INTEGER PRIMARY KEY,
                             name TEXT,
                             username TEXT UNIQUE NOT NULL,
                             password TEXT,
                             email TEXT UNIQUE,
                             age INTEGER,
                             profile_picture_link TEXT, 
                             weight INTEGER,
                             height INTEGER,
                             gender INTEGER CHECK (gender IN (1, 2)), -- 1 for Male, 2 for Female
                             activity_lvl INTEGER CHECK (activity_lvl IN (1, 2, 3, 4, 5)) -- 1 for Sedentary, 2 for Lightly Active, 3 for Moderately Active, 4 for Very Active, 5 for Super Active
                         );"""

sql_create_personal_meals_table = """CREATE TABLE IF NOT EXISTS personal_meals (
                                      personal_meal_no INTEGER PRIMARY KEY,
                                      meal_name TEXT NOT NULL,
                                      user_no INTEGER NOT NULL, 
                                      protein INTEGER NOT NULL,
                                      calories INTEGER NOT NULL,
                                      carbohydrates INTEGER NOT NULL,
                                      fat INTEGER NOT NULL,
                                      sugar INTEGER NOT NULL,
                                      FOREIGN KEY (user_no) REFERENCES students (user_no)
                                  );"""

sql_create_meal_ingredients_table = """CREATE TABLE IF NOT EXISTS meal_ingredients (
                                        personal_meal_no INTEGER,
                                        personal_ingredient_no INTEGER,
                                        PRIMARY KEY (personal_meal_no, personal_ingredient_no),
                                        FOREIGN KEY (personal_ingredient_no) REFERENCES personal_ingredients (personal_ingredient_no),
                                        FOREIGN KEY (personal_meal_no) REFERENCES personal_meals (personal_meal_no)
                                    );"""

sql_create_personal_ingredients_table = """CREATE TABLE IF NOT EXISTS personal_ingredients (
                                        personal_ingredient_no INTEGER PRIMARY KEY,
                                        user_no INTEGER NOT NULL,
                                        ingredient_name TEXT NOT NULL,
                                        amount TEXT NOT NULL,
                                        protein INTEGER NOT NULL,
                                        calories INTEGER NOT NULL,
                                        carbohydrates INTEGER NOT NULL,
                                        fat INTEGER NOT NULL,
                                        sugar INTEGER NOT NULL,
                                        FOREIGN KEY (user_no) REFERENCES students (user_no)
                                    );"""

sql_create_meal_calender_table = """CREATE TABLE IF NOT EXISTS meal_calender (
                                     calender_id INTEGER PRIMARY KEY,
                                     personal_meal_no INTEGER NOT NULL,
                                     date DATE NOT NULL,
                                     time_of_day TIME NOT NULL,
                                     FOREIGN KEY (personal_meal_no) REFERENCES personal_meals (personal_meal_no)
                                    );"""


def run_sql_query(conn, sql_query):
    try:
        c = conn.cursor()
        c.execute(sql_query)
    except Error as err:
        print("Error: {}, when running query: {}".format(err, sql_query))

#### INIT DATABASE ####
def init_users(conn, users_data):
    for u in users_data:
        add_user_with_all_information(conn, u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7], u[8], u[9])
        
def init_personal_meals(conn, personal_meals_data):
    for u in personal_meals_data:
        add_meal(conn, u[0], u[1], u[2], u[3], u[4], u[5], u[6])

def int_personal_ingredients(conn, personal_ingredient_data):
     for u in personal_ingredient_data:
        add_ingredient(conn, u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7])

def init_meal_ingredients(conn, ingredients_for_each_meal_data):
    for u in ingredients_for_each_meal_data:
        add_ingredient_to_meal(conn, u[0], u[1])

def init_meal_calender(conn, meal_calender_data):
    for d in meal_calender_data:
        add_meal_to_calender(conn, d[0], d[1], d[2])

#### SETUP ####

def setup():
    # Deleting database to prevent duplicate of example code...
    if os.path.exists(database):
        os.remove(database)

    conn = create_connection(database)
    if conn is not None:

        run_sql_query(conn, sql_create_meal_ingredients_table)
        run_sql_query(conn, sql_create_meal_calender_table)

        run_sql_query(conn, sql_create_users_table)

        run_sql_query(conn, sql_create_personal_meals_table)
        run_sql_query(conn, sql_create_personal_ingredients_table)

        init_users(conn, users_data)
        init_personal_meals(conn, personal_meals_data)
        int_personal_ingredients(conn, personal_ingredients_data)
        init_meal_ingredients(conn, ingredients_for_each_meal_data)
        init_meal_calender(conn, meal_calender_data)
     
        conn.close()

if __name__ == '__main__':
    # If executed as main, this will create tables and insert initial data
    setup()