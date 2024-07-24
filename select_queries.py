import sqlite3

#### SELECT QUERIES, Retrieving data####
def run_select_query(conn, sql_query, identifier):
    cur = conn.cursor()
    try:
        cur.execute(sql_query, (identifier,))
        result = cur.fetchone()

        if result:
            return result
        else:
            return None
    except sqlite3.Error as err:
        print("Error: {}. When running the query: {}".format(err, sql_query))


#### FetchOne ####
def select_user_by_id(conn, user_id):
    sql = "SELECT user_no, username FROM users WHERE user_no=?"
    return run_select_query(conn, sql, user_id)

def select_info_for_user_by_id(conn, user_id):
    sql = "SELECT name, username, password, email, age, profile_picture_link, weight, height, gender, activity_lvl FROM users WHERE user_no=?"
    return run_select_query(conn, sql, user_id)

def select_user_no_by_username(conn, username):
    sql = "SELECT user_no FROM users WHERE username=?"
    return run_select_query(conn, sql, username)[0] #Indexing the tuple

def select_password_for_given_user(conn, username):
    sql = "SELECT password FROM users WHERE username=?"
    return run_select_query(conn, sql, username)

def select_user_id_and_username(conn, username):
    sql = "SELECT user_no, username FROM users WHERE username=?"
    return run_select_query(conn, sql, username)

##### fetchAll #####
def select_all_users_username(conn):
    cur = conn.cursor()
    try:
        cur.execute("SELECT username FROM users")

        result = cur.fetchall()

        if result:
            return result
        else:
            return None
    except sqlite3.Error as err:
        print("Error, selecting all_users_username: {}".format(err))

def select_all_users_emails(conn):
    cur = conn.cursor()
    try:
        result = []
        cur.execute("SELECT email FROM users")
        result = [row[0] for row in cur.fetchall()]

        if result:
            return result
        else:
            return None
    except sqlite3.Error as err:
        print("Error, selecting all_users_emails: {}".format(err))

def select_all_users_username_except_one(conn, user_id):
    cur = conn.cursor()
    try:
        cur.execute("SELECT username FROM users WHERE user_no != ?", (user_id,))

        result = cur.fetchall()

        if result:
            return result
        else:
            return None
    except sqlite3.Error as err:
        print("Error, selecting all_users_username_except_one: {}".format(err))


def select_all_users_emails_except_one(conn, user_id):
    cur = conn.cursor()
    try:
        cur.execute("SELECT email FROM users WHERE user_no != ?", (user_id,))

        result = cur.fetchall()

        if result:
            return result
        else:
            return None
    except sqlite3.Error as err:
        print("Error, selecting all_users_emails_except_one: {}".format(err))

def select_meal_ingredients_by_id(conn, id):
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM personal_ingredients WHERE personal_meal_no=?", (id,))

        result = cur.fetchall()

        if result:
            return result
        else:
            return None
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    
def select_personal_meals_with_ingredients(conn, user_no):
    cur = conn.cursor()
    try:
        personal_meals_with_ingredients = []
        cur.execute("""SELECT mi.personal_meal_no, pi.personal_ingredient_no, pi.ingredient_name, 
                    pi.amount, pi.protein, pi.calories, pi.carbohydrates, pi.fat, pi.sugar
                    FROM meal_ingredients mi 
                    RIGHT JOIN personal_ingredients pi ON mi.personal_ingredient_no == pi.personal_ingredient_no
                    WHERE mi.personal_meal_no IN 
                    (SELECT pm.personal_meal_no 
                    FROM personal_meals pm 
                    WHERE pm.user_no =?) """, (user_no,))
        personal_meals_with_ingredients += [list(row) for row in cur.fetchall()]

        personal_meals = []
        cur.execute("SELECT * FROM personal_meals pm WHERE pm.user_no = ?", (user_no,))
        personal_meals += [list(row) for row in cur.fetchall()]

        meals_with_ingredients = []
        for i, entry in enumerate(personal_meals):
            meals_with_ingredients.append({
                "meal_id": entry[0], 
                "name": entry[1], 
                "user_id": entry[2], 
                "protein": entry[3], 
                "calories": entry[4],
                "carbohydrates": entry[5],
                "fat": entry[6],
                "sugar": entry[7],
                "ingredients": []
            })
            
            for ingredient in personal_meals_with_ingredients:
                if(ingredient[0] == entry[0]):
                    meals_with_ingredients[i]['ingredients'].append(
                    {"ingredient_id": ingredient[1],
                    "name": ingredient[2], 
                    "amount": ingredient[3], 
                    "protein": ingredient[4],
                    "calories": ingredient[5],
                    "carbohydrates": ingredient[6],
                    "fat": ingredient[7],
                    "sugar": ingredient[8]})

        return meals_with_ingredients
    except sqlite3.Error as err:
        print("Error, selecting personal_meals_with_ingredients: {},".format(err))

def select_personal_ingredients(conn, user_no):
    cur = conn.cursor()
    try:
        ingredients_data = []
        cur.execute("SELECT * FROM personal_ingredients pi WHERE pi.user_no =?", (user_no,))
        ingredients_data += [list(row) for row in cur.fetchall()]

        ingredients_arr = []
        for ingredient in ingredients_data:
            ingredients_arr.append(
                    {"ingredient_id": ingredient[0],
                    "name": ingredient[2], 
                    "amount": ingredient[3], 
                    "protein": ingredient[4],
                    "calories": ingredient[5],
                    "carbohydrates": ingredient[6],
                    "fat": ingredient[7],
                    "sugar": ingredient[8]})

       
        return ingredients_arr
    except sqlite3.Error as err:
        print("Error, selecting personal_ingredients: {}".format(err))

def select_meal_calender(conn, user_no, date):
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT personal_meal_no, meal_name FROM personal_meals pm WHERE pm.user_no =?", (user_no,))
        meal_data = [list(row) for row in cur.fetchall()] #Converting tuples to lists
        
        calender = []
        for entry in meal_data:
            cur.execute("SELECT * FROM meal_calender WHERE personal_meal_no = ? AND date = ?", (entry[0], date,)) 
            calender += [list(row) for row in cur.fetchall()]

        for entry in calender:
            for row in meal_data:
                if(entry[1] == row[0]):
                    entry.append(row[1])

        return calender
    except sqlite3.Error as err:
        print("Error, selecting meal calender: {}".format(err))
  
        
def select_average_macros(conn, user_no):
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM personal_meals pm WHERE pm.user_no =?", (user_no,))
        meal_data = [list(row) for row in cur.fetchall()] #Converting tuples to lists
        
        calender = []
        for entry in meal_data:
            cur.execute("SELECT * FROM meal_calender WHERE personal_meal_no = ?", (entry[0],)) 
            calender += [list(row) for row in cur.fetchall()]

        for entry in calender:
            for row in meal_data:
                if(entry[1] == row[0]):
                    entry[1] = row
        
        return calender
    
    except sqlite3.Error as err:
        print("Error, selecting average macros: {}".format(err))

def select_meals_the_ingredient_were_in(conn, ingredient_id):
    cur = conn.cursor()
    try:
        cur.execute("SELECT personal_meal_no FROM meal_ingredients mi WHERE mi.personal_ingredient_no =?", (ingredient_id,))
        meal_ids = [row[0] for row in cur.fetchall()]

        return meal_ids
    except sqlite3.Error as err:
        print("Error, selecting meals the ingredient were in: {}".format(err))

def select_users_meals(conn, user_id):
    cur = conn.cursor()
    try:
        cur.execute("SELECT personal_meal_no FROM personal_meals pm WHERE pm.user_no =?", (user_id,))
        meal_ids = [row[0] for row in cur.fetchall()]

        return meal_ids
    except sqlite3.Error as err:
        print("Error, selecting users meals the ingredient were in: {}".format(err))

def select_users_ingredients(conn, user_id):
    cur = conn.cursor()
    try:
        cur.execute("SELECT personal_ingredient_no FROM personal_ingredients pm WHERE pm.user_no =?", (user_id,))
        meal_ids = [row[0] for row in cur.fetchall()]

        return meal_ids
    except sqlite3.Error as err:
        print("Error, selecting users meals the ingredient were in: {}".format(err))

def select_users_calender_entries(conn, meal_id):
    cur = conn.cursor()
    try:
        cur.execute("SELECT calender_id FROM meal_calender pm WHERE pm.personal_meal_no =?", (meal_id,))
        meal_ids = [row[0] for row in cur.fetchall()]

        return meal_ids
    except sqlite3.Error as err:
        print("Error, selecting users meals the ingredient were in: {}".format(err))
                                  
def select_ingredient_by_id(conn, id):
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM personal_ingredients pi WHERE pi.personal_ingredient_no =?", (id,))
        ingredient = list(cur.fetchone())

        return ingredient
    except sqlite3.Error as err:
        print("Error, selecting ingredient by id: Error --- {}".format(err))
    
def select_meal_by_id(conn, id):
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM personal_meals pm WHERE pm.personal_meal_no =?", (id,))
        meal = list(cur.fetchone())

        return meal
    except sqlite3.Error as err:
        print("Error, selecting ingredient by id: {}".format(err))
   
def select_password_by_id(conn, id):
    cur = conn.cursor()
    try:
        cur.execute("SELECT password FROM users u WHERE u.user_no =?", (id,))
        return cur.fetchone()[0]
    except sqlite3.Error as err:
        print("Error, selecting password by user id: {}".format(err))

def select_user_profile_picture_path (conn, user_no):
    cur = conn.cursor()
    try:
        cur.execute("SELECT profile_picture_link FROM users WHERE user_no = ?", (user_no,))
        return cur.fetchone()[0]
    except sqlite3.Error as err:
        print("Error, selecting profile picture link: {}". format(err))

