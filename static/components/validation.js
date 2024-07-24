const validation = {
    methods: {

        linkToFunctions() {
            `${this.checkIfNameIsValid, this.checkIfGenderIsValid, this.checkIfActivityLvlIsValid, this.checkIfEmailIsValid, 
                this.checkIfWeightIsValid, this.checkIfHeightIsValid, this.checkIfAgeIsValid, this.isMealInputValid, this.checkIfNutrientIsValid,
                this.checkIfMealNameIsValid, this.checkIfIngredientNameIsValid, this.checkIfAmountIsValid, this.isHourValid, this.isMinutesValid,
                this.checkValidationArr }`
        },

        getDiv(identifier) {
            let div = document.getElementById(identifier)
            div.innerHTML = "" // Resetting the validation text
            return div
        },

        checkValidation(alertDiv, identifier, inputClassName) {
            if(alertDiv.innerHTML == "") {
                alertDiv.className = "ml-2 valid-feedback";
                alertDiv.innerHTML = "Valid " + identifier;

                event.target.className = inputClassName +  " is-valid";
                return true
            } else {
                return false
            }
        },

        changeAlertDivToInvalid(alertDiv, inputClassName) {
            alertDiv.className = "ml-2 invalid-feedback";
            event.target.className = inputClassName + " is-invalid";
        },

        checkIfUsernameIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier);
            let username = event.target.value;
            
            div.style.display = "block"
            if(username.trim().length <= 3 || username.trim().length > 12 || !(/^[A-zA-Z0-9]+$/.test(username))) {
                this.changeAlertDivToInvalid(div, inputClassName)
            
                if(username.trim().length < 3 || username.trim().length > 12) {
                    div.innerHTML = "Invalid length, 3 - 12 characters <br>"
                }
                if(!(/^[A-zA-Z0-9]+$/.test(username)) && username.trim().length > 0) {
                    div.innerHTML += "Only letters and numbers are allowed"
                }
            } 
            return this.checkValidation(div, 'username', inputClassName)
        },

        checkIfPasswordIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let password = event.target.value

            div.style.display = "block"
            if(password.trim().length < 9 || password.trim().length > 50 || !(/(?=.*[@$£<`'^])/.test(password))) {
                this.changeAlertDivToInvalid(div, inputClassName)
                
                if(password.trim().length < 9 || password.trim().length > 50) {
                    div.innerHTML = "Invalid length, 9 - 50 characters <br>"
                }

                if(!(/(?=.*[@$£<`'^:}])/.test(password)) && password.trim().length > 0) {
                    div.innerHTML += "One special character is needed"
                }
            }
            return this.checkValidation(div, 'password', inputClassName)
        },

        checkIfNameIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let name = event.target.value

            div.style.display = "block"
            if(name.trim().length < 3 || name.trim().length > 12 || !(/^[a-zA-Z0-9]+$/.test(name))) {
                this.changeAlertDivToInvalid(div, inputClassName)
            
                if(name.trim().length < 3 || name.trim().length > 12) {
                    div.innerHTML = "Invalid length, 3 - 12 characters <br>"
                }
                if(!(/^[A-zA-Z0-9]+$/.test(name)) && name.trim().length > 0) {
                    div.innerHTML += "Only letters are allowed"
                }
            } 
            return this.checkValidation(div, 'name', inputClassName)
        },

        checkIfGenderIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let gender = event.target.value

            div.style.display = "block"
            if(gender == 0) {
                div.innerHTML = "Gender is invalid"
                this.changeAlertDivToInvalid(div, inputClassName)
            }
            return this.checkValidation(div, 'gender', inputClassName)
        },

        checkIfActivityLvlIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let activityLvL = event.target.value

            div.style.display = "block"
            if(activityLvL == 0) {
                this.changeAlertDivToInvalid(div, inputClassName)
                div.innerHTML = "Activity lvl is invalid"
            } 
            return this.checkValidation(div, 'activity lvl', inputClassName)
        },

        checkIfEmailIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let email = event.target.value
            
            // see http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            div.style.display = "block"
            if(!(re.test(email))) {
                div.innerHTML = "Email is invalid"
                this.changeAlertDivToInvalid(div, inputClassName)
            } 
            return this.checkValidation(div, 'email', inputClassName)
        },

        checkIfWeightIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let weight = event.target.value

            div.style.display = "block"
            if(weight < 29 || weight > 635 || !(/^(0|[1-9]\d*)(\.\d+)?\s*[0-9]+(\.[0-9]+)?/.test(weight))) {
                this.changeAlertDivToInvalid(div, inputClassName)
                
                if(weight < 29) {
                    div.innerHTML = "Weight cant be less than 29 kg <br>"
                }
                if(weight > 635) {
                    div.innerHTML += "Weight cant be more than 635 kg <br>"
                }
                if(!(/^(0|[1-9]\d*)(\.\d+)?\s*[0-9]+(\.[0-9]+)?/.test(weight))) {
                    div.innerHTML += "Weight can only be defined by numbers and a period"
                }
            }
            return this.checkValidation(div, 'weight', inputClassName)
        }, 

        checkIfHeightIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let height = event.target.value

            div.style.display = "block"
            if(height < 50 || height > 275 || !(/^(0|[1-9]\d*)(\.\d+)?\s*[0-9]+(\.[0-9]+)?/.test(height))) {
                this.changeAlertDivToInvalid(div, inputClassName)
                
                if(height < 50) {
                    div.innerHTML = "Height cant be less than 50 cm <br>"
                }
                if(height > 275) {
                    div.innerHTML += "Height cant be more than 275 cm <br>"
                }
                if(!(/^(0|[1-9]\d*)(\.\d+)?\s*[0-9]+(\.[0-9]+)?/.test(height))) {
                    div.innerHTML += "Height can only be defined by numbers and a period"
                }
            } 
            return this.checkValidation(div, 'height', inputClassName)
        },

        checkIfAgeIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let age = event.target.value

            div.style.display = "block"
            if(age < 12 || age > 130 || !(/^[0-9]+(0|[1-9]\d*)(\.\d+)?$/.test(age))) {
                this.changeAlertDivToInvalid(div, inputClassName)
                
                if(age< 12) {
                    div.innerHTML = "Age cant be less than 12 <br>"
                }
                if(age > 130) {
                    div.innerHTML += "Age cant be more than 130"
                }
                if(!(/^[0-9]+(0|[1-9]\d*)(\.\d+)?$/.test(age))) {
                    div.innerHTML = "Age can only be defined by numbers"
                }
            } 
            return this.checkValidation(div, 'age', inputClassName)
        },

        // *Under* Used specifically for edit and create meal, since there are more than one of each nutrient and amount fields //

        isMealInputValid(mealNameIsValid, ingredients) {
            if(!mealNameIsValid) {
                return "The meal name does not meet the requirements"
            }
            
            for(let ingredient of ingredients) {
                for(const [key, nutrient] of Object.entries(ingredient)) {
                    if(key != 'amount' && key != 'name' && key != 'ingredient_id' && key != 'api_product_id') {
                        if(nutrient < 0 || nutrient > 1000 || !(/^(0|[1-9]\d*)(\.\d+)?$/).test(nutrient)) {
                            return `The nutrient ${key} in ${ingredient['name']} does not meet the requirements`
                        }
                    }
                    
                    if(key == 'amount') {
                        const amount = nutrient
                        if(amount <= 0 || amount > 1000 || !(/^(0|[1-9]\d*)(\.\d+)?\s*(g|kg|pounds|tsp|tbsp|oz|ml|L|can|cup)?$/.test(amount))) {
                            return `The field ${key} in ${ingredient['name']} does not meet the requirements`
                        }
                    }
                }
            }
            return true
        },

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        checkIfNutrientIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let nutrient = event.target.value

            div.style.display = "block"
            if(nutrient < 0 || nutrient > 1000 || !(/^(0|[1-9]\d*)(\.\d+)?$/.test(nutrient))) {
                this.changeAlertDivToInvalid(div, inputClassName)
                
                if(nutrient < 0) {
                    div.innerHTML = "Nutrient cant be less than zero <br>"
                }
                if(nutrient > 1000) {
                    div.innerHTML += "Nutrient cant be more than 1000 <br>"
                }
                if(!(/^(0|[1-9]\d*)(\.\d+)?$/.test(nutrient))) {
                    div.innerHTML += "Nutrient can only be defined by numbers and a period"
                }
            }
            return this.checkValidation(div, 'nutrient', inputClassName)
        },

        checkIfMealNameIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let meal_name = event.target.value

            div.style.display = "block"
            if(meal_name.trim().length < 8 || meal_name.trim().length > 30) {
                this.changeAlertDivToInvalid(div, inputClassName)
            
                if(meal_name.trim().length < 8 || meal_name.trim().length > 30) {
                    div.innerHTML = "Invalid length, 8 - 30 characters <br>"
                }
            } 
            return this.checkValidation(div, 'meal name', inputClassName)
        },

        checkIfIngredientNameIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let ingredient_name = event.target.value

            div.style.display = "block"
            if(ingredient_name.trim().length < 3 || ingredient_name.trim().length > 50) {
                this.changeAlertDivToInvalid(div, inputClassName)
            
                if(ingredient_name.trim().length < 3 || ingredient_name.trim().length > 50) {
                    div.innerHTML = "Invalid length, 3 - 50 characters <br>"
                }
            } 
            return this.checkValidation(div, 'ingredient name', inputClassName)
        },

        checkIfAmountIsValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let amount = event.target.value

            div.style.display = "block"
            if(amount <= 0 || amount > 1000 || !(/^(0|[1-9]\d*)(\.\d+)?\s*(g|kg|pounds|tsp|tbsp|oz|ml|L|can|cup)?$/.test(amount))) {
                this.changeAlertDivToInvalid(div, inputClassName)
                
                if(amount <= 0) {
                    div.innerHTML = "Amount cant be less than zero or equal <br>"
                }
                if(amount > 100) {
                    div.innerHTML = "Amount cant be more than 1000 <br>"
                }
                if(!(/^(0|[1-9]\d*)(\.\d+)?\s*(g|kg|pounds|tsp|tbsp|oz|ml|L|cup)?$/.test(amount))) {
                    div.innerHTML += "Amount can only be defined by numbers, a period and a unit"
                }
            } 
            return this.checkValidation(div, 'amount', inputClassName)
        },

        isHourValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let hour = event.target.value

            div.style.display = "block"
            if(hour < 0 || hour > 23 || !(/^[0-9]+$/.test(hour))) {
                this.changeAlertDivToInvalid(div, inputClassName)
                
                if(hour < 0) {
                    div.innerHTML = "Hour cant be less than zero <br>"
                }
                if(hour > 23) {
                    div.innerHTML = "Hour cant be more than 23 <br>"
                }
                if(!(/^[0-9]+$/.test(hour))) {
                    div.innerHTML += "Hour can only contain numbers"
                }
            } 
            return this.checkValidation(div, 'hour', inputClassName)
        },

        isMinutesValid(alert_div_identifier, inputClassName) {
            let div = this.getDiv(alert_div_identifier)
            let minutes = event.target.value

            div.style.display = "block"
            if(minutes < 0 || minutes > 59 || !(/^[0-9]+$/.test(minutes))) {
                this.changeAlertDivToInvalid(div, inputClassName)
                
                if(minutes < 0) {
                    div.innerHTML = "Minutes cant be less than zero <br>"
                }
                if(minutes > 59) {
                    div.innerHTML = "Minutes cant be more than 59"
                }
                if(!(/^[0-9]+$/.test(minutes))) {
                    div.innerHTML += "Minutes can only contain numbers"
                }
            } 
            return this.checkValidation(div, 'minutes', inputClassName)
        },

        checkValidationArr(validation_arr) {
            for(const key of Object.keys(validation_arr)) {
                if(validation_arr[key] === false) {
                    return false
                } 
            }
            return true
        }
    },
    template: `<h1 style="display: none;"> This wont be displayed anyway </h1>`, // This is only here to prevent a warning
}