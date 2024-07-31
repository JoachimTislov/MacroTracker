import sqlite3

from select_queries import select_meal_by_id

######## UPDATE QUERIES ########
def update_user_info(conn, user_id, name, username, age, email, height, weight, gender, activity_lvl):
    cur = conn.cursor()
    try:
        cur.execute("""
                    UPDATE users SET 
                    name = ?, 
                    username = ?,  
                    age = ?, 
                    email = ?,
                    height = ?,
                    weight = ?,  
                    gender = ?,
                    activity_lvl = ?
                    WHERE user_no = ?
                    """, (name, username, age, email, height, weight, gender, activity_lvl, user_id,))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))

def update_personal_meal(conn, personal_meal_no, meal_name, protein, calories, carbohydrates , fat, sugar):
    cur = conn.cursor()
    try:
        cur.execute("""
                    UPDATE personal_meals SET 
                    personal_meal_no = ?, 
                    meal_name = ?, 
                    protein = ?, 
                    calories = ?,  
                    carbohydrates = ?, 
                    fat = ?,
                    sugar = ?
                    WHERE personal_meal_no = ?
                    """, (personal_meal_no, meal_name, round(protein, 2), round(calories, 2), round(carbohydrates, 2), round(fat, 2), round(sugar, 2), personal_meal_no,))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))

def update_personal_meal_total_macros(conn, personal_meal_no, protein, calories, carbohydrates, fat, sugar):
    cur = conn.cursor()
    try:
        cur.execute("""
                    UPDATE personal_meals SET 
                    personal_meal_no = ?, 
                    protein = ?, 
                    calories = ?,  
                    carbohydrates = ?, 
                    fat = ?,
                    sugar = ?
                    WHERE personal_meal_no = ?
                    """, (personal_meal_no, round(protein, 2), round(calories, 2), round(carbohydrates, 2), round(fat, 2), round(sugar, 2), personal_meal_no,))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))

def update_personal_meal_name(conn, personal_meal_no, meal_name):
    cur = conn.cursor()
    try:
        cur.execute("""
                    UPDATE personal_meals SET 
                    personal_meal_no = ?, 
                    meal_name = ?
                    WHERE personal_meal_no = ?
                    """, (personal_meal_no, meal_name, personal_meal_no,))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))

def update_total_macros_of_meal_ingredient_was_used_for(conn, meal_ids, ingredient_info):
    try:
        if isinstance(meal_ids, str):
            meal = select_meal_by_id(conn, meal_ids)
            calcMacrosAndUpdateMeal(meal, ingredient_info, meal_ids, conn)

        else: 
            for id in meal_ids:
                meal = select_meal_by_id(conn, id)
                calcMacrosAndUpdateMeal(meal, ingredient_info, id, conn)

    except sqlite3.Error as err:
        print("Error: {}".format(err))

def calcMacrosAndUpdateMeal(meal, ingredient_info, meal_id, conn):
    meal[3] -= ingredient_info[4] 
    meal[4] -= ingredient_info[5] 
    meal[5] -= ingredient_info[6] 
    meal[6] -= ingredient_info[7] 
    meal[7] -= ingredient_info[8] 

    update_personal_meal_total_macros(
                conn, meal_id, meal[3], meal[4], 
                meal[5], meal[6], meal[7])

def update_ingredient(conn, ingredient_id, ingredient_name, amount, protein, calories, carbohydrates, fat, sugar):
    cur = conn.cursor()
    try:
        cur.execute("""
                    UPDATE personal_ingredients SET 
                    ingredient_name = ?, 
                    amount = ?,
                    protein = ?, 
                    calories = ?,
                    carbohydrates = ?, 
                    fat = ?, 
                    sugar = ?
                    WHERE personal_ingredient_no = ? 
                    """, (ingredient_name, amount, round(protein, 2), round(calories, 2), round(carbohydrates, 2), round(fat, 2), round(sugar, 2), ingredient_id,))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))


def UPDATE_reCalcMacrosForMeals(conn,personal_meal_ids, macrosDiff):
    cur = conn.cursor()
    try:
        for id in personal_meal_ids:
            cur.execute("SELECT pm.protein, pm.calories, pm.carbohydrates, pm.fat, pm.sugar FROM personal_meals pm WHERE pm.personal_meal_no =?", (id,))
            meal_total_macros = list(cur.fetchone()) 

            new_total_macros = {
                "protein": meal_total_macros[0] - macrosDiff['protein'],
                "calories": meal_total_macros[1] - macrosDiff['calories'],
                "carbohydrates": meal_total_macros[2] - macrosDiff['carbohydrates'],
                "fat": meal_total_macros[3] - macrosDiff['fat'],
                "sugar": meal_total_macros[4] - macrosDiff['sugar']
            }

            update_personal_meal_total_macros(conn, id, 
                        new_total_macros['protein'],
                        new_total_macros['calories'],
                        new_total_macros['carbohydrates'],
                        new_total_macros['fat'],
                        new_total_macros['sugar'])
    except sqlite3.Error as err:
        print("Error: {}".format(err))
        


def update_password_by_user_id(conn, password, user_id):
    cur = conn.cursor()
    try:
        cur.execute("UPDATE users SET password =? WHERE user_no =?", (password, user_id))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    
def update_user_profile_picture(conn, file_path, user_id):
    cur = conn.cursor()
    try:
        cur.execute("UPDATE users SET profile_picture_link = ? WHERE user_no = ?", (file_path, user_id))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))

