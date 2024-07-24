##### Input Validation #####

## Sources: 
#https://www.hackerrank.com/challenges/string-validators/problem#:~:text=Python%20has%20built%2Din%20string,alphanumeric%20characters%2C%20digits%2C%20etc.&text=This%20method%20checks%20if%20all,A%2DZ%20and%200%2D9).
#https://docs.python.org/3/library/re.html
import re

def stripString(string):
    return string.strip()

def validateOwnership(id_to_delete, ids):
    for id in ids:
        if int(id) == int(id_to_delete):
            return True

    return False

def validatePicture(filename):
    ALLOWED_FORMAT = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_FORMAT

def validateUserInfo(username, gender, activity_lvl, email, name, weight, height, age):
    arr = [
        isUsernameValid(username),
        isGenderValid(gender),
        isActivity_Lvl_Valid(activity_lvl),
        isEmailValid(email),
        isNameValid(name),
        isWeightValid(weight),
        isHeightValid(height),
        isAgeValid(age)
    ]

    for entry in arr:
        if(entry is not True):
            return entry
    
    return True

def isIngredientValid(name, amount, protein, calories, carbohydrates, fat, sugar):

    nutrient_arr = [
        isNutrientValid(protein, 'protein'),
        isNutrientValid(calories, 'calories'),
        isNutrientValid(carbohydrates, 'carbohydrates'),
        isNutrientValid(fat, 'fat'),
        isNutrientValid(sugar, 'sugar')
    ]

    for nutrient in nutrient_arr:
        if(nutrient is not True):
            return nutrient
        
    if isIngredientNameValid(name) is not True:
        return isIngredientNameValid(name)
    
    if isAmountValid(amount) is not True:
        return isAmountValid(amount)
    
    return True

def validateIngredients_for_meal(ingredients_for_meal, response):
    for ingredient in ingredients_for_meal:
        validate_ingredient = isIngredientValid(
                    ingredient['name'], 
                    ingredient['amount'],
                    ingredient['protein'], 
                    ingredient['calories'], 
                    ingredient['carbohydrates'],
                    ingredient['fat'],
                    ingredient['sugar'])

        if validate_ingredient is not True:
            response.set_cookie('Message', validate_ingredient, samesite='None', secure='/')
            return response, 500
    
    return True

def isUsernameValid(string):
    string = stripString(string)
    if(len(string) < 3 or len(string) > 12):
        return 'Username length is invalid'
    
    if(not string.isalnum()):
        return 'Username can only contain numbers and letters'
    
    return True

def isPasswordValid(string):
    string = stripString(string)
    if len(string) < 9 or len(string) > 50:
        return 'Password length is invalid'
    
    if not re.match(r'^(?=.*[!@#$%^&*(),.?":{}|<>]).*$', string):
       return 'Password does not have a special character'
    
    return True
    
def isNameValid(string):
    string = stripString(string)
    if len(string) < 3 or len(string) > 12:
        return 'Name length is invalid' 
    
    if not string.isalnum():
        return 'Name can only be contain numbers and letters'
    
    return True

def isGenderValid(gender):
    if (gender < 1 or gender > 2):
        return 'Gender is invalid'
    
    return True

def isActivity_Lvl_Valid(activity_LvL):
    if (activity_LvL < 1 or activity_LvL > 5):
        return 'Activity Lvl is invalid'
    
    return True

def isEmailValid(string):
    string = stripString(string)

    ## see http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    if not re.match(r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))', string):
       return 'Email is invalid'
    
    return True
   
def isWeightValid(weight):
    if (weight < 29 or  weight > 635):
        return 'Weight cant be less than 29kg or hight than 635kg'
    
    if(not isinstance(weight, float)):
        return 'Weight is not defined by numbers, (in kg)'
    
    return True

def isHeightValid(height):
    if (height < 50 or height > 275):
        return 'Height cant be more than 275cm or less than 50cm' 
    
    if(not isinstance(height, float)):
        return 'Height is not defined by numbers, (in cm)'
    
    return True

def isAgeValid(age): 
    if (age < 12 or age > 130):
        return 'Age cant be less than 12 or higher than 130'
    
    if(not isinstance(age, int)):
        return 'Age is not defined by numbers'

    return True

def isNutrientValid(nutrient, identifier):
    if (nutrient < 0 or nutrient > 1000):
        return identifier + ' cant be less than zero or higher than 1000'
    
    if(not isinstance(nutrient, float)):
        return identifier + ' is not defined by numbers'
    
    if not re.match(r'^(0|[1-9]\d*)(\.\d+)', str(nutrient)):
        return identifier + ' is not valid'
    
    return True

def isAmountValid(amount):
    amount = stripString(amount)
    if (len(amount) <= 0 or len(amount) > 10):
        return 'Amount length is invalid, 1-10 characters'
    
    if not re.match(r'^(0|[1-9]\d*)(\.\d+)?\s*(g|kg|pounds|tsp|tbsp|oz|ml|L|can|cup)?$', amount):
        return 'Amount is not defined by numbers, a unit or a with period'
    
    return True

def isMealNameValid(string):
    string = stripString(string)
    if (len(string) < 8 or len(string) > 30):
        return 'Meal name length is invalid' 
    
    return True
         
def isIngredientNameValid(string):
    string = stripString(string)        
    if (len(string) < 3 or len(string) > 50):
        return 'Ingredient name length is invalid'
    
    return True

def isDateValid(string):
    string = stripString(string)

    print(len(string))

    if (len(string) != 10):
        return 'Date is invalid'
    
    day = int(string.split('-')[0])
    month = int(string.split('-')[1])
    year = int(string.split('-')[2])

    if day < 1 or month < 1 or year < 0:
        return 'Date cant be negative or 0'
    
    if day > 31:
        return 'Day is to large'
    
    if month > 12:
        return 'Day is to large'
    
    return True
    
def isTimeValid(string):
    string = (stripString(string))
    hours = int(string.split(':')[0])
    minutes = int(string.split(':')[1])

    if(len(string) != 5):
        return 'Time format is invalid'

    if hours < 0 or minutes < 0:
        return  'Time cant be negative'
    
    if minutes > 60:
        return  'Minute inputed is too high'
    
    if hours > 24:
        return 'Hour inputed is to high'
    
    return True


def isCalenderDateAndTimeValid(date, time):

    if isDateValid(date) is not True:
        return isDateValid(date)
    
    if isTimeValid(time) is not True:
        return isTimeValid(time)
   
    return True

       
