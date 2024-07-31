import sqlite3

######## UPDATE QUERIES ########
def delete_meal(conn, meal_id):
    cur = conn.cursor()
    try: 
        cur.execute("DELETE FROM personal_meals WHERE personal_meal_no =?", (int(meal_id),))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    
def delete_ingredient(conn, ingredient_id):
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM personal_ingredients WHERE personal_ingredient_no =?", (ingredient_id,))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))

def delete_ingredient_from_specific_meal_with_ingredient_and_meal_id(conn, ingredient_id, meal_id):
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM meal_ingredients WHERE personal_ingredient_no =? AND personal_meal_no =?", (ingredient_id, meal_id,))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))

def delete_ingredient_from_meals_with_ingredient_id(conn, ingredient_id):
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM meal_ingredients WHERE personal_ingredient_no =?", (ingredient_id,))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))

def delete_ingredients_from_meal_with_meal_id(conn, meal_id):
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM meal_ingredients WHERE personal_meal_no =?", (meal_id,))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
        
def delete_meal_from_calender(conn, calender_id):
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM meal_calender WHERE calender_id =?", (calender_id,))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
        
    
