#### INSERT (Add information) ####

from sqlite3 import Error

from encryption import get_hashed_password

def add_user_with_all_information(conn, name, username, password, email, age, profile_picture_link, weight, height, gender, activity_lvl):
    sql = ''' INSERT INTO users(name, username, password, email, age, profile_picture_link, weight, height, gender, activity_lvl)
              VALUES(?,?,?,?,?,?,?,?,?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (name, username, get_hashed_password(password), email, age, profile_picture_link, weight, height, gender, activity_lvl))
        conn.commit()
    except Error as err:
        print("Error, inserting add_user_with_all_information: {}".format(err))
    
def add_user(conn, username, password, gender, activity_lvl, email, name, weight, height, age):
    sql = ''' INSERT INTO users(
                username, 
                password, 
                gender, 
                activity_lvl, 
                email, 
                name, 
                weight, 
                height, 
                age)
        VALUES(?,?,?,?,?,?,?,?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (username, password, gender, activity_lvl, email, name, weight, height, age))
        conn.commit()
    except Error as err:
        print("Error, inserting add_user: {}".format(err))
    
def add_meal(conn, meal_name, user_no, protein, calories, carbohydrates, fat, sugar):
    sql = ''' INSERT INTO personal_meals(meal_name, user_no, protein, calories, carbohydrates, fat, sugar)
              VALUES(?,?,?,?,?,?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (meal_name, user_no, round(protein, 2), round(calories, 2), round(carbohydrates, 2), round(fat, 2), round(sugar, 2)))
        conn.commit()
        meal_id = cur.lastrowid

        return meal_id
    except Error as err:
        print("Error, inserting add_meal: {}".format(err))
    
def add_ingredient(conn, user_no, ingredient_name, amount, protein, calories, carbohydrates, fat, sugar):
    sql = ''' INSERT INTO personal_ingredients(
                    user_no, ingredient_name, 
                    amount, protein, calories, 
                    carbohydrates, fat, sugar)
              VALUES(?,?,?,?,?,?,?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (user_no, ingredient_name, amount, round(protein, 2), round(calories, 2), round(carbohydrates, 2), round(fat, 2), round(sugar, 2)))
        conn.commit()
        ingredient_id = cur.lastrowid

        return ingredient_id
    except Error as err:
        print("Error, inserting add_ingredient: {}".format(err))

def add_ingredient_to_meal(conn, personal_meal_no, personal_ingredient_no):
    sql = ''' INSERT INTO meal_ingredients(personal_meal_no, personal_ingredient_no)
              VALUES(?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (personal_meal_no, personal_ingredient_no))
        conn.commit()
    except Error as err:
        print("Error, inserting add_ingredient_to_meal: {}".format(err))
  
    
def add_meal_to_calender(conn, personal_meal_no, date, time_of_day):
    sql = ''' INSERT INTO meal_calender(personal_meal_no, date, time_of_day)
              VALUES(?,?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (personal_meal_no, date, time_of_day))
        conn.commit()
    except Error as err:
        print("Error, inserting add_meal_to_calender: {}".format(err))
 