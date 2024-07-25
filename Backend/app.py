from flask import Flask, request, render_template, g, make_response
import os
from werkzeug.utils import secure_filename

import sqlite3

from setup_db import create_connection

from Queries.insert_queries import add_user, add_meal_to_calender, add_ingredient, add_ingredient_to_meal, add_meal

from Queries.delete_queries import delete_meal, delete_meal_from_calender, delete_ingredient, delete_ingredient_from_specific_meal_with_ingredient_and_meal_id, delete_ingredient_from_meals_with_ingredient_id, delete_ingredients_from_meal_with_meal_id

from Queries.select_queries import (select_user_by_id, select_all_users_username, select_password_for_given_user, select_user_id_and_username, select_all_users_username_except_one, select_all_users_emails_except_one,
select_meal_calender, select_personal_meals_with_ingredients, select_user_no_by_username, select_meals_the_ingredient_were_in, select_users_meals, select_users_ingredients, select_users_calender_entries,
select_info_for_user_by_id, select_average_macros, select_personal_ingredients, select_ingredient_by_id, select_password_by_id, select_user_profile_picture_path, select_all_users_emails)

from Queries.update_queries import (update_user_info, update_personal_meal, update_password_by_user_id,
							update_ingredient, update_personal_meal_name, update_total_macros_of_meal_ingredient_was_used_for, UPDATE_reCalcMacrosForMeals, update_user_profile_picture)

from inputValidation import isUsernameValid, isPasswordValid, validateUserInfo, isIngredientValid, isMealNameValid, validateIngredients_for_meal, validateOwnership, isCalenderDateAndTimeValid, validatePicture

from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

from encryption import get_hashed_password, check_password

picture_folder = "../static/users_pictures"

app = Flask(__name__, template_folder='../templates', static_folder='../static')
app.secret_key = 'secret_key'
app.config['picture_folder'] = picture_folder

app.config.update(SESSION_COOKIE_SECURE = True, SESSION_COOKIE_HTTPONLY = True, SESSION_COOKIE_SAMESITE = 'Strict')

login_manager = LoginManager()
login_manager.init_app(app)

def get_db():
    if 'db' not in g:
        g.db = create_connection(r"./database.db")  
    return g.db

class User(UserMixin):
	def __init__(self, user_id, username):
		self.id = user_id
		self.username = username
	def get_id(self):
		return select_user_no_by_username(get_db(), self.username)

@login_manager.user_loader
def load_user(user_id):
	user_row = select_user_by_id(get_db(), user_id)

	# This fixed some bug
	if not user_row:
		return None

	return User(user_id=user_row[0], username=user_row[1])
		
@app.route('/', methods=["GET"])
def mainPage():
	if current_user.is_authenticated:
		return render_template('main-page.html'), 200
	else:
		return mainPage_not_authenticated("Welcome to the Macro Tracker's Login Page")

@app.route('/login', methods=["POST"])
def loginPage():
	username = request.json['username']
	password = request.json['password']

	users_password = select_password_for_given_user(get_db(), username) #Indexing the tuple

	response = make_response(render_template('main-page.html'))

	if not isUsernameValid(username) or users_password is None:
		response.set_cookie('username_input', 'False', samesite='None', secure='/')
		response.set_cookie('Message', 'Invalid username', samesite='None', secure='/')

		return response, 400
	else:
		if isPasswordValid(password) and check_password(password, users_password[0]):

			user_id_and_username = select_user_id_and_username(get_db(), username) # Getting the unique user_id from the database

			login_user(User(user_id=user_id_and_username[0], username=user_id_and_username[1])) # Login in user, for flask-login

			#https://www.tutorialspoint.com/flask/flask_cookies.htm#:~:text=In%20Flask%2C%20cookies%20are%20set,back%20a%20cookie%20is%20easy.

			response.set_cookie('Message', 'Successfully logged into your account', samesite='None', secure='/')
			response.set_cookie('user_id', str(user_id_and_username[0]), samesite='None', secure='/')
			response.set_cookie('Authorized', 'True', samesite='None', secure='/')

		 	#Removing unnecessary cookie entries, if they are there ofc
			response.set_cookie('username_input', expires=0, samesite='None', secure='/')

			return response, 200
		else:
			response.set_cookie('username_input', 'True', samesite='None', secure='/')
			response.set_cookie('Message', 'Invalid password. Please try again', samesite='None', secure='/')

			return response, 500


@app.route('/logout', methods=["GET"])
@login_required
def logout():
	logout_user()
	return mainPage_not_authenticated('Successfully logged you out')

def mainPage_not_authenticated(message):
	response = make_response(render_template('main-page.html'))

	response.set_cookie('Message', message, samesite='None', secure='/')
	response.set_cookie('Authorized', 'False', samesite='None', secure='/')

	if(request.cookies.get('user_id')):
		response.set_cookie('user_id', expires=0, samesite='None', secure='/')

	if(request.cookies.get('username')):	
		response.set_cookie('username', expires=0, samesite='None', secure='/')

	return response, 200

@app.route('/register', methods=["GET","POST"])
def register():
	response = make_response('response')

	username = request.json['register_username']
	usernames = select_all_users_username(get_db())

	for nickname in usernames:
		if username == nickname[0]:
			response.set_cookie('Message', 'Username is already taken', samesite='None', secure='/')
			return response, 500

	password = request.json['register_password']
	confirm_password = request.json['confirm_password']

	if(isPasswordValid(password) is not True):
		response.set_cookie('Message', isPasswordValid(password), samesite='None', secure='/')
		return response, 400
	
	if(isPasswordValid(confirm_password) is not True):
		response.set_cookie('Message', isPasswordValid(confirm_password), samesite='None', secure='/')
		return response, 400

	if(password != confirm_password):
		response.set_cookie('Message', 'Please make the passwords match', samesite='None', secure='/')
		return response, 500
	
	gender = int(request.json['_gender'])
	activity_lvl = int(request.json['_activity_lvl'])

	email = request.json['register_email']
	emails = select_all_users_emails(get_db())

	for user_email in emails:
		if email == user_email:
			response.set_cookie('Message', 'Email is already taken', samesite='None', secure='/')
			return response, 500
		
	name = request.json['register_name']
	weight = float(request.json['register_weight'])
	height = float(request.json['register_height'])
	age = int(request.json['register_age'])

	register_validation = validateUserInfo(username, gender, activity_lvl, email, name, weight, height, age)

	if(register_validation is not True): 
		response.set_cookie('Message', register_validation, samesite='None', secure='/')
		return response, 400
	
	hashedPassword = get_hashed_password(password)
	
	## Adding a new user ##
	add_user(get_db(), username, hashedPassword, gender, activity_lvl, email, name, weight, height, age)

	response.set_cookie('Message', 'Registration was successful. Login', samesite='None', secure='/')
	return response, 200

@app.route('/password', methods=["PUT"])
@login_required
def change_password():
	old_password = request.json['old_password']
	new_password = request.json['new_password']
	confirm_new_password = request.json['confirm_new_password']

	arr = [old_password, new_password, confirm_new_password]

	response = make_response('response')
	for password in arr:
		value = isPasswordValid(password)
		if value is not True:
			response.set_cookie('Message', value, samesite='None', secure='/')
			return response, 400

	user_id = current_user.get_id()

	if not check_password(old_password, select_password_by_id(get_db(), user_id)):
		response.set_cookie('Message', 'Old password is incorrect', samesite='None', secure='/')
		return response, 400
	
	if new_password != confirm_new_password:
		response.set_cookie('Message', 'The new passwords does not match', samesite='None', secure='/')
		return response, 400
	
	if new_password == old_password:
		response.set_cookie('Message', 'The new password cant be the same as your old password', samesite='None', secure='/')
		return response, 400

	update_password_by_user_id(get_db(), get_hashed_password(new_password), user_id)
	response.set_cookie('Message', 'Successfully changed your password', samesite='None', secure='/')
	return response, 200

@app.route('/user_info', methods=["PUT"])
@login_required
def update_user_information():
	if current_user.is_authenticated:
		try:
			user_id = current_user.get_id()

			name = request.json['name']
			username = request.json['username']
			age = int(request.json['age'])
			email = request.json['email']
			height = float(request.json['height'])
			weight = float(request.json['weight'])
			gender = int(request.json['gender'])
			activity_lvl = int(request.json['activity_lvl'])
			email = request.json['email']

			response = make_response('response')

			usernames = select_all_users_username_except_one(get_db(), user_id)

			for nickname in usernames:
				if username == nickname[0]:
					response.set_cookie('Message', 'Username is already taken', samesite='None', secure='/')
					return response, 500
				
			emails = select_all_users_emails_except_one(get_db(), user_id)

			for user_email in emails:
				if email == user_email[0]:
					response.set_cookie('Message', 'Email is already taken', samesite='None', secure='/')
					return response, 500

			user_info_validation = validateUserInfo(username, gender, activity_lvl, email, name, weight, height, age)

			if(user_info_validation is not True): 
				response.set_cookie('Message', user_info_validation, samesite='None', secure='/')
				return response, 400

			update_user_info(get_db(), user_id, name, username, age, email, height, weight, gender, activity_lvl)
			response.set_cookie('Message', 'Successfully updated your user information', samesite='None', secure='/')
			return response, 200
		
		except sqlite3.Error as err:
        		print("Error: {}".format(err))

@app.route('/profile_picture', methods=['POST'])
@login_required
def upload_profile_picture():
	if current_user.is_authenticated:
		try:
			file = request.files['file']

			response = make_response('response')

			if validatePicture(file.filename) is not True:
				response.set_cookie('Message', 'File format is not accepted', samesite='None', secure='/')
				return response, 406

			if file:
				user_id = current_user.get_id()
				filename = secure_filename(f"{user_id}_{file.filename}")
				file_path = os.path.join(app.config['picture_folder'], filename)
				file.save(file_path)

				update_user_profile_picture(get_db(), file_path, user_id)

				response.set_cookie('Message', 'Profile picture uploaded successfully', samesite='None', secure='/')

				return response, 200
		except Exception as e:
			print('Error uploading profile picture:', e)
			return 'Error uploading profile picture', 500
		
@app.route('/sort_value/<identifier>', methods=["POST"])
@login_required
def set_sort_value(identifier):
	if current_user.is_authenticated:

		sort_value = request.json.get('sort_value', 'Sort by')
		user_id = current_user.get_id()
		response = make_response({'message': 'Sort value set in cookie'})
		response.set_cookie( f'{identifier}_sort_value_{user_id}', sort_value, samesite='None', secure=True)
		return response, 200
	
@app.route('/profile_picture', methods=['DELETE'])
@login_required
def delete_profile_picture():
    if current_user.is_authenticated:
        try:
            user_id = current_user.get_id()
            db = get_db()
            file_path = select_user_profile_picture_path(db, user_id)

            response = make_response('response')

            if file_path and os.path.exists(file_path):
                os.remove(file_path)

            update_user_profile_picture(db, None, user_id)

            response.set_cookie('Message', 'Profile picture deleted successfully', samesite='None', secure=True)
            return response, 200

        except Exception as e:
            print('Error deleting profile picture:', e)
            response.set_cookie('Message', 'Error deleting profile picture', samesite='None', secure=True)
            return response, 500
    else:
        return 'User not authenticated', 401

@app.route('/meal/<meal_id>', methods=["DELETE"])
@login_required
def deleteMeal(meal_id):
	if current_user.is_authenticated:
		try:
			user_id = current_user.get_id()

			response = make_response('response')
			meal_ids = select_users_meals(get_db(), user_id)
			if validateOwnership(meal_id, meal_ids) is True:

				delete_ingredients_from_meal_with_meal_id(get_db(), meal_id)
				delete_meal(get_db(), meal_id)

				response.set_cookie('Message', 'Successfully deleted the meal', samesite='None', secure=True)
			
				return response, 200
			else:
				return 'User cant delete others meals', 401

		except sqlite3.Error as err:
        		print("Error: {}".format(err))
		
@app.route('/ingredient/<ingredient_id>', methods=["DELETE"])
@login_required
def deleteIngredient(ingredient_id):
	if current_user.is_authenticated:
		try:
			user_id = current_user.get_id()

			response = make_response('response')
			ingredient_ids = select_users_ingredients(get_db(), user_id)
			if validateOwnership(ingredient_id, ingredient_ids) is True:
				
				ingredient_info = select_ingredient_by_id(get_db(), ingredient_id)
				meals_the_ingredient_were_in = select_meals_the_ingredient_were_in(get_db(), ingredient_id)

				update_total_macros_of_meal_ingredient_was_used_for(get_db(), meals_the_ingredient_were_in, ingredient_info)

				if(len(meals_the_ingredient_were_in) >= 1):
					delete_ingredient_from_meals_with_ingredient_id(get_db(), ingredient_id)

			
				delete_ingredient(get_db(), ingredient_id)

				response.set_cookie('Message', 'Successfully deleted the ingredient', samesite='None', secure=True)
			
				return response, 200
			else:
				return 'User cant delete others ingredient', 401
			
		except sqlite3.Error as err:
        		print("Error: {}".format(err))

@app.route('/meal/<ingredient_id>/<meal_id>', methods=["DELETE"])
@login_required
def delete_ingredient_from_meal(ingredient_id, meal_id):
	if current_user.is_authenticated:
		try:
			user_id = current_user.get_id()
			response = make_response('response')

			ingredient_ids = select_users_ingredients(get_db(), user_id)
			meal_ids = select_users_meals(get_db(), user_id)
			if validateOwnership(ingredient_id, ingredient_ids) is True and validateOwnership(meal_id, meal_ids) is True:

				ingredient_info = select_ingredient_by_id(get_db(), ingredient_id)
			
				update_total_macros_of_meal_ingredient_was_used_for(get_db(), meal_id, ingredient_info)
				
				delete_ingredient_from_specific_meal_with_ingredient_and_meal_id(get_db(), ingredient_id, meal_id)

				response.set_cookie('Message', 'Successfully deleted the ingredient from meal', samesite='None', secure=True)

				return response, 200
			else:
				return 'User cant delete others ingredient from  others meals', 401
		
		except sqlite3.Error as err:
			print("Error: {}".format(err))

@app.route('/calender/<calender_id>', methods=["DELETE"])
@login_required
def delete_meal_fromCalender(calender_id):
	if current_user.is_authenticated:
		try:
			user_id = current_user.get_id()

			response = make_response('response')
			meal_ids = select_users_meals(get_db(), user_id)

			calender_ids = []
			for id in meal_ids:
				calender_ids += select_users_calender_entries(get_db(), id)

			if validateOwnership(calender_id, calender_ids) is True:
				delete_meal_from_calender(get_db(), calender_id)

				response.set_cookie('Message', 'Successfully deleted meal from calender', samesite='None', secure=True)

				return response, 200
		
			else:
				return 'User cant delete others calender entries', 401
			
		except sqlite3.Error as err:
			print("Error: {}".format(err))
		
def findIngredients_for_meal(data):
	ingredients_for_meal = []
	for index in range(int(len(data)/8)):
		ingredients_for_meal.append({
			"ingredient_id": data[str(index) + '-ingredient_id'],
			"name": data[str(index) + '-name'],
			"amount": data[str(index) + '-amount'],
			"protein": float(data[str(index) + '-protein']),
			"calories": float(data[str(index) + '-calories']),
			"carbohydrates": float(data[str(index) + '-carbohydrates']),
			"fat": float(data[str(index) + '-fat']),
			"sugar": float(data[str(index) + '-sugar'])
		})

	return ingredients_for_meal

def addNewIngredientsAndUpdateOldOnes(ingredients_for_meal, meal_id):
	user_id = current_user.get_id()

	for ingredient in ingredients_for_meal:
		if(ingredient['ingredient_id'] == ''):
			ingredient_id = add_ingredient(get_db(),
					user_id,
					ingredient['name'], 
					ingredient['amount'],
					ingredient['protein'], 
					ingredient['calories'], 
					ingredient['carbohydrates'],
					ingredient['fat'],
					ingredient['sugar'])
			add_ingredient_to_meal(get_db(), meal_id, ingredient_id)
		else:	
			update_ingredient(get_db(), 
					ingredient['ingredient_id'], 
					ingredient['name'], 
					ingredient['amount'],
					ingredient['protein'], 
					ingredient['calories'], 
					ingredient['carbohydrates'],
					ingredient['fat'],
					ingredient['sugar'])
			add_ingredient_to_meal(get_db(), meal_id, ingredient['ingredient_id'])

def updatePersonalMeal(ingredients_for_meal, meal_name, isMealInDatabase, meal_id):
	user_id = current_user.get_id()

	meal_info = {
				"name": meal_name,
				"protein": 0,
				"calories": 0,
				"carbohydrates": 0,
				"fat": 0,
				"sugar": 0
			}

	#calculating total nutrients
	for nutrient in ingredients_for_meal:
		meal_info['protein'] += nutrient['protein']
		meal_info['calories'] += nutrient['calories']
		meal_info['carbohydrates'] += nutrient['carbohydrates']
		meal_info['fat'] += nutrient['fat']
		meal_info['sugar'] += nutrient['sugar']


	if(isMealInDatabase):
		update_personal_meal(get_db(), meal_id, meal_name, meal_info['protein'], meal_info['calories'], 
					meal_info['carbohydrates'], meal_info['fat'], meal_info['sugar'])
	else:
		return add_meal(get_db(), meal_name, user_id, round(meal_info['protein'], 2),round(meal_info['calories'], 2), 
					round(meal_info['carbohydrates'], 2), round(meal_info['fat'], 2), round(meal_info['sugar'], 2))


@app.route('/meal', methods=["POST"])
@login_required
def addMeal():
	if current_user.is_authenticated:
		try:
			data = request.get_json()

			response = make_response('response')
			meal_name = data['meal_name']

			if isMealNameValid(meal_name) is not True:
				response.set_cookie('Message', isMealNameValid(meal_name), samesite='None', secure='/')
				return response, 400

			data.pop('meal_name')
			ingredients_for_meal = findIngredients_for_meal(data)

			if validateIngredients_for_meal(ingredients_for_meal, response) is not True:
				return validateIngredients_for_meal(ingredients_for_meal, response)

			meal_id = updatePersonalMeal(ingredients_for_meal, meal_name, False, None)
			
			addNewIngredientsAndUpdateOldOnes(ingredients_for_meal, meal_id)

			response.set_cookie('Message', "Successfully created meal", samesite='None', secure='/')
			return response, 200
		except sqlite3.Error as err:
        		print("Error: {}".format(err))

@app.route('/meal/<meal_id>', methods=["PUT"])
@login_required
def editMeal(meal_id):
	if current_user.is_authenticated:
		try:
			user_id = current_user.get_id()
			meal_ids = select_users_meals(get_db(), user_id)
			if validateOwnership(meal_id, meal_ids) is not True:
				return 'User cant edit others meals', 401

			data = request.get_json()
			response = make_response('response')
			if(len(data) == 1):
				update_personal_meal_name(get_db(), meal_id, data['meal_name'])
				response.set_cookie('Message', "Successfully updated meal", samesite='None', secure='/')
				return response, 200
			
			response = make_response('response')

			meal_name = data['meal_name']
			if isMealNameValid(meal_name) is not True:
				response.set_cookie('Message', isMealNameValid(meal_name), samesite='None', secure='/')
				return response, 500

			data.pop('meal_name')

			ingredients_for_meal = findIngredients_for_meal(data)

			if validateIngredients_for_meal(ingredients_for_meal, response) is not True:
				return validateIngredients_for_meal(ingredients_for_meal, response)

			updatePersonalMeal(ingredients_for_meal, meal_name, True, meal_id)
			addNewIngredientsAndUpdateOldOnes(ingredients_for_meal, meal_id)

			response.set_cookie('Message', 'Successfully updated meal', samesite='None', secure='/')
			return response, 200
		except sqlite3.Error as err:
        		print("Error: {}".format(err))
		
@app.route('/calender/', methods=["POST"])
@login_required
def add_meal_to_given_date():
	if current_user.is_authenticated:
		try:
			data = request.json

			response = make_response('response')

			if isCalenderDateAndTimeValid(data['date'], data['time']) is not True:
				response.set_cookie('Message', isCalenderDateAndTimeValid(data['date'], data['time']), samesite='None', secure='/')
				return response, 406

			add_meal_to_calender(get_db(), data['id'], data['date'], data['time'])

			response.set_cookie('Message', 'Successfully added meal to the calender', samesite='None', secure='/')
			return response, 200
		except sqlite3.Error as err:
			print("Error: {}".format(err))
		

@app.route('/ingredient', methods=["POST"])
@login_required
def addIngredient():
	if current_user.is_authenticated:
		data = request.json

		name = data['name']
		amount = data['amount']
		protein = float(data['protein'])
		calories = float(data['calories'])
		carbohydrates = float(data['carbohydrates'])
		fat = float(data['fat'])
		sugar = float(data['sugar'])

		response = make_response('response')
		validate_ingredient = isIngredientValid(name, amount, protein, calories, carbohydrates, fat, sugar)

		if validate_ingredient is not True:
			response.set_cookie('Message', validate_ingredient, samesite='None', secure='/')
			return response, 500
		
		add_ingredient(
			get_db(), 
			current_user.get_id(), 
			name, 
			amount, 
			protein, 
			calories,
			carbohydrates, 
			fat,
			sugar)
		
		response.set_cookie('Message', 'Successfully created an ingredient', samesite='None', secure='/')
		return response, 200
	
@app.route('/ingredient/<ingredient_id>', methods=["PUT"])
@login_required
def editIngredient(ingredient_id):
	if current_user.is_authenticated:
		user_id = current_user.get_id()
		ingredient_ids = select_users_ingredients(get_db(), user_id)
		if validateOwnership(ingredient_id, ingredient_ids) is not True:
			return 'User cant edit others ingredients', 401

		new_data = request.json 

		old_ingredient_info = select_ingredient_by_id(get_db(), ingredient_id)

		name = new_data['name']
		amount = new_data['amount']
		protein = float(new_data['protein'])
		calories = float(new_data['calories'])
		carbohydrates = float(new_data['carbohydrates'])
		fat = float(new_data['fat'])
		sugar = float(new_data['sugar'])

		response = make_response('response')
		validate_ingredient = isIngredientValid(name, amount, protein, calories, carbohydrates, fat, sugar)

		if validate_ingredient is not True:
			response.set_cookie('Message', validate_ingredient, samesite='None', secure='/')
			return response, 500
		
		update_ingredient(get_db(),
						ingredient_id,
						name,
						amount,
						protein, calories,
						carbohydrates,fat,
						sugar)
		
		macros_diff = {
			"protein": old_ingredient_info[4] - protein,
			"calories": old_ingredient_info[5] - calories,
			"carbohydrates": old_ingredient_info[6] - carbohydrates,
			"fat": old_ingredient_info[7] - fat,
			"sugar": old_ingredient_info[8] - sugar
		}

		personal_meal_ids = select_meals_the_ingredient_were_in(get_db(), ingredient_id)

		UPDATE_reCalcMacrosForMeals(get_db(), personal_meal_ids, macros_diff)

		response.set_cookie('Message', 'Successfully updated the ingredient', samesite='None', secure='/')
		return response, 200

##### GET #####
@app.route('/user_info/<user_id>', methods=["GET"])
@login_required
def user_info(user_id):
	if current_user.is_authenticated:
		if int(user_id) == current_user.get_id():
			tuple = select_info_for_user_by_id(get_db(), user_id)

			arr = {
				"name": tuple[0],
				"username": tuple[1],
				"email": tuple[3],
				"age": tuple[4],
				"profile_picture_link": tuple[5],
				"weight": tuple[6],
				"height": tuple[7],
				"gender": tuple[8],
				"activity_lvl": tuple[9],
			}
			return arr, 200
		else:
			return 'Unauthorized', 401

@app.route('/personal_meals/<user_id>', methods=["GET"])
@login_required
def personal_meals(user_id):
	if current_user.is_authenticated:
		if int(user_id) == current_user.get_id():
			return select_personal_meals_with_ingredients(get_db(), user_id), 200
		else:
			return 'Unauthorized', 401

@app.route('/personal_ingredients/<user_id>', methods=["GET"])
@login_required
def personal_ingredients(user_id):
	if current_user.is_authenticated:
		if int(user_id) == current_user.get_id():
			return select_personal_ingredients(get_db(), user_id), 200
		else:
			return 'Unauthorized', 401
	
@app.route('/meal_calender/<user_id>/<date>', methods=["GET"])
@login_required
def meal_calender(user_id, date):
	if current_user.is_authenticated:
		if int(user_id) == current_user.get_id():
			return select_meal_calender(get_db(), user_id, date), 200
		else:
			return 'Unauthorized', 401

@app.route('/average_macros/<user_id>', methods=["GET"])
@login_required
def average_macros(user_id):
	if current_user.is_authenticated:
		if int(user_id) == current_user.get_id():
			return select_average_macros(get_db(), user_id), 200
		else:
			return 'Unauthorized', 401
		
if __name__ == '__main__':
	app.run(debug=True)


