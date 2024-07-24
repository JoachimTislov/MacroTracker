/// AJAX ------ Asynchronous JavaScript and XML /////////////

const ajax = {
    methods: {

        linkToFunctions() {
            `${this.register, this.changePassword, this.updateUserInfo, this.uploadProfilePicture, this.deleteProfilePicture, this.logout, this.createMeal, this.addMealToGivenDate, this.editMeal,
                this.createIngredient, this.editIngredient, this.load_products_from_api_search, this.deleteEntity, this.fetchResource, 
                this.fetchWithMethodAndJson
            }`
        },

        ///////// Login, register, change password, update user info and logout ////////////////////////

        async login(isUsernameValid, isPasswordValid, username, password) {
            if(isUsernameValid && isPasswordValid) {
                try {
                    const json = JSON.stringify({"username": username,"password": password});
                    const response = await this.fetchWithMethodAndJson('/login', 'POST', json)
                    
                    this.$root.setCookie() // Update cookie
                    if (response.status != 200){
                        console.log("Error when logging in user.")

                        this.$root.alertUserWithMessage('login_alert', this.$root.cookie['Message'], "red")
                        return false;
                    }
                } catch (error) {
                    console.log(error)
                    alert(`Network error: ${error}`)
                }
            } else {
                this.$root.alertUserWithMessage('login_alert', "Login fields are invalid", "red")
            }
            return true
        },

        async register(validation_arr) {
            let validation = this.$parent.$refs.validation.checkValidationArr(validation_arr)

            if(validation) {
                try {
                    const json = this.getFormDataInJSONFormat('register_form')
                    const response = await this.fetchWithMethodAndJson('/register', 'POST', json)
                    
                    this.$root.setCookie()
                    if (response.status != 200){
                        console.log("Error when registering a user")

                        this.$root.alertUserWithMessage('register_alert', this.$root.cookie['Message'], "red")
                        return false;
                    }
                    if (response.ok) {
                        this.$root.user_register = false
                        this.$root.user_login = true

                        this.$root.alertUserWithMessage('login_alert', this.$root.cookie['Message'], "green")

                        return true
                    }
                } catch (error) {
                    console.log(error)
                    alert(`Network error: ${error}`)
                }
            } else {
                this.$root.alertUserWithMessage('register_alert', "Please fill out the fields correctly", "red")
            }
        },

        async changePassword(validation_arr) {
            let validation = this.$parent.$refs.validation.checkValidationArr(validation_arr)

            if(validation) {
                try {
                    const json = this.getFormDataInJSONFormat('passwords')
                    const response = await this.fetchWithMethodAndJson('/password', 'PUT', json)
                    
                    this.$root.setCookie()
                    if (response.status != 200){
                        console.log("Error when changing password.")
                        this.$root.alertUserWithMessage('change_password_alert', this.$root.cookie['Message'], "red")
                        return false;
                    }
                    if (response.ok) {
                        this.$root.changePassword = false

                        this.$root.alertUserWithMessage('user_alert', this.$root.cookie['Message'], "green")
                    }
                } catch (error) {
                    console.log(error)
                    alert(`Network error: ${error}`)
                }
            } else {
                this.$root.alertUserWithMessage('change_password_alert', "Please fill out the passwords correctly", "red")
            }
        },

        async uploadProfilePicture(file) {
            if (!file) {
                this.$root.alertUserWithMessage('user_alert', "No file selected", "red")
                return;
            }
            
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                await fetch('/profile_picture', {
                    method: 'DELETE',
                });

                const response = await fetch('/profile_picture', {
                    method: 'POST',
                    body: formData
                });

                this.$root.setCookie()
                if (response.status != 200) {
                    console.log("Error when uploading picture.")
                    this.$root.alertUserWithMessage('user_alert', this.$root.cookie['Message'], "red")
                    return false;
                }

                if (response.ok) {
                    this.$root.load_user_info(); 

                    this.$root.alertUserWithMessage('user_alert', this.$root.cookie['Message'], "green")
                    file = null;
                }
            } catch (error) {
                console.error('Error when uploading profile picture: ', error);
            }
        },

        async deleteProfilePicture() {  
            try {
                const response = await fetch('/profile_picture', {
                    method: 'DELETE',
                });

                this.$root.setCookie()
                if(response != 200) {
                    console.log("Error when deleting picture.")
                    this.$root.alertUserWithMessage('user_alert', this.$root.cookie['Message'], "red");
                    return false;
                }
                
                if (response.ok) {
                    this.$root.load_user_info();
                    this.$root.alertUserWithMessage('user_alert', this.$root.cookie['Message'], "green");
                    this.file = null; 
                } 

            } catch (error) {
                console.error('Error deleting profile picture:', error);
            }
        },
        
        async updateUserInfo(validation_arr) {
            try {
                let validation = this.$parent.$refs.validation.checkValidationArr(validation_arr)

                if(validation) {
                    const json = this.getFormDataInJSONFormat('new_user_information')
                    const response = await this.fetchWithMethodAndJson('/user_info', 'PUT', json)
             
                    this.$root.setCookie()
                    if (response.status != 200){
                        console.log("Error when updating user info.")
                        this.$root.alertUserWithMessage('user_alert', this.$root.cookie['Message'], "red")
                        return false;
                    }
                    if (response.ok) {
                        // Refreshing
                        this.$root.load_user_info()

                        this.$root.alertUserWithMessage('user_alert', this.$root.cookie['Message'], "green")
                    }
                } else {
                    this.$root.alertUserWithMessage('user_alert', "Some fields are invalid", "red")
                }
            } catch (error) {
                console.log(error)
                alert(`Network error: ${error}`)
            }
        },

        async logout() {
            try {
                let response = await fetch('/logout')
                
                if (response.status != 200){
                    console.log("Error when logging user out.")
                    return false;
                }

                this.$root.setCookie()
                if(response != 200) {
                    this.$root.alertUserWithMessage('login_alert', this.$root.cookie['Message'], "red")
                }
                if (response.ok) {
                    this.$root.alertUserWithMessage('login_alert', this.$root.cookie['Message'], "green")
                }
            } catch (error) {
                console.log(error)
                alert(`Network error: ${error}`)
            }
            return true
        },

        //////////////////////////////////////////////////////////////////

        async createMeal(mealNameIsValid, meal_ingredients) {
            if(!(meal_ingredients.length < 3)) {
                if(this.$parent.$refs.validation.isMealInputValid(mealNameIsValid, meal_ingredients) == true) {
                    try {
                        const json = this.getFormDataInJSONFormat('create_meal_form')
                        const response = await this.fetchWithMethodAndJson('/meal', 'POST', json)
                        
                        this.$root.setCookie()
                        if (response.status != 200){
                            console.log("Error creating meal")
                            this.$root.alertUserWithMessage('create_meal_alert', this.$root.cookie['Message'], "red")
                            return false;
                        }
                        if (response.ok) {
                            this.$root.showCreateMeal = false

                            this.$root.alertUserWithMessage('personal_meal_alert', this.$root.cookie['Message'], "green")
        
                            // Refresh data
                            this.$root.refreshData()
                        }
                    } catch (error) {
                        console.log(error)
                        alert(`Network error: ${error}`)
                    }
              } else {
                    this.$root.alertUserWithMessage('create_meal_alert', this.$parent.$refs.validation.isMealInputValid(mealNameIsValid, meal_ingredients), "red")
                    return false;
              }
            } else {
                this.$root.alertUserWithMessage('create_meal_alert', "Please add at least three ingredients", "red")
                return false;
            }
            return true
        },

        async addMealToGivenDate(meal_id, isHourValid, isMinutesValid, calender_date, hour, minutes) {
            if(isHourValid && isMinutesValid) {
                try {
                    console.log(calender_date)

                    const time = `${this.$root.check_if_number_is_less_than_10(parseInt(hour))}:${this.$root.check_if_number_is_less_than_10(parseInt(minutes))}`
                    const json = JSON.stringify({"id": meal_id, "date": calender_date, "time": time})
                    const response = await this.fetchWithMethodAndJson('/calender/', 'POST', json)
                   
                    this.$root.setCookie()
                    if (response.status != 200){
                        console.log("Error adding meal to given date: " + calender_date)
                        this.$root.alertUserWithMessage('add_meal_alert', this.$root.cookie['Message'], "red")
                        return false;
                    }
                    
                    if (response.ok) {
                        // Update information
                        this.$root.refreshData()

                        this.$root.showSelectMeal = false

                        this.$root.alertUserWithMessage('select_meal_alert', this.$root.cookie['Message'], "green")
                    }
                } catch (error) {
                    alert(`Network error: ${error}`)
                }
            } else {
                this.$root.alertUserWithMessage('add_meal_alert', "Time input is invalid", "red")
            }
        },

        async editMeal(mealNameIsValid, meal_to_edit_ingredients, meal_id) {
            if(!(meal_to_edit_ingredients.length < 3)) {
                if(this.$parent.$refs.validation.isMealInputValid(mealNameIsValid, meal_to_edit_ingredients) == true) {
                    try {
                        const json = this.getFormDataInJSONFormat('edit_meal_form')
                        const response = await this.fetchWithMethodAndJson(`/meal/${meal_id}`, 'PUT', json)

                        this.$root.setCookie()
                        if (response.status != 200){
                            console.log("Error saving changes.")
                            this.$root.alertUserWithMessage('edit_meal_alert', this.$root.cookie['Message'], "red")
                            return false;
                        }
                        if (response.ok) {
                            this.$root.showEditMeal = false

                            this.$root.alertUserWithMessage('personal_meal_alert', this.$root.cookie['Message'], "green")

                            // Refresh data
                            this.$root.refreshData()
                        }
                    } catch (error) {
                        console.log(error)
                        alert(`Network error: ${error}`)
                    }
                    return true
                } else {
                    this.$root.alertUserWithMessage('edit_meal_alert', this.$parent.$refs.validation.isMealInputValid(mealNameIsValid, meal_to_edit_ingredients), "red")
                }
            } else {
                this.$root.alertUserWithMessage('edit_meal_alert', "Please add at least three ingredients", "red")
            }
        },

        async createIngredient(validation_arr) {
            try {
                let validation = this.$parent.$refs.validation.checkValidationArr(validation_arr)

                if(validation) {
                    const json = this.getFormDataInJSONFormat('create_ingredient_form')
                    const response = await this.fetchWithMethodAndJson('/ingredient', 'POST', json)
                    
                    this.$root.setCookie()
                    if (response.status != 200){
                        console.log("Error creating ingredient")
                        this.$root.alertUserWithMessage('create_ingredient_alert', this.$root.cookie['Message'], "red")
                        return false;
                    }
                    if (response.ok) {
                        this.$root.showCreateIngredient = false

                        this.$root.alertUserWithMessage('personal_ingredient_alert', this.$root.cookie['Message'], "green")

                        // Refresh data
                        this.$root.refreshData()
                    }
                } else {
                    this.$root.alertUserWithMessage('create_ingredient_alert', 'Some fields are invalid', "red")
                }
            } catch (error) {
                console.log(error)
                alert(`Network error: ${error}`)
            }
            return true
        },

        async editIngredient(ingredient_id, validation_arr) {
            try {
                let validation = this.$parent.$refs.validation.checkValidationArr(validation_arr)

                if(validation) {
                    const json = this.getFormDataInJSONFormat('edit_ingredient_form')
                    const response = await this.fetchWithMethodAndJson(`/ingredient/${ingredient_id}`, 'PUT', json)
                    
                    this.$root.setCookie()
                    if (response.status != 200){
                        console.log("Error when updating ingredient")
                        this.$root.alertUserWithMessage('personal_ingredient_alert', this.$root.cookie['Message'], "red")
                        return false;
                    }
                    if (response.ok) {
                        this.$root.showEditIngredient = false

                        this.$root.alertUserWithMessage('personal_ingredient_alert', this.$root.cookie['Message'], "green")

                        // Refresh data
                        this.$root.refreshData()
                    }
                } else {
                    this.$root.alertUserWithMessage('edit_ingredient_alert', 'Some fields are invalid', "red")
                    return false;
                }
            } catch (error) {
                console.log(error)
                alert(`Network error: ${error}`)
            }
            return true
        },

        async load_products_from_api_search(api_search) {
            try {
                const url = `https://kassal.app/api/v1/products?search=${api_search}`
                const headers = { 'Authorization': 'Bearer sSGbP5T0KxfbtmlpKsHawPgVcvt6eUPA4dvWUpz8'}
            
                const _response = await fetch(url, {"headers": headers});
                const api_search_data = await _response.json();

                // Filtering out the products which does not have nutrition information
                for(let product of api_search_data['data']) {
                    if(product['nutrition'].length > 0) {
                        arr = []
                        for(let nutrition of product['nutrition']) {
                            if(['Protein', 'Sukkerarter', 'Karbohydrater', 'Fett', 'Kalorier'].includes(nutrition['display_name']) && nutrition['amount'] >= 0) {
                                arr.push(nutrition)
                            }
                        }
                        product['nutrition'] = arr
                    }
                }

                return api_search_data['data']
            } catch(error) {
                console.log(error)
                alert(`Network error: ${error}`)
            }
        },

        /// GENERIC AJAX DELETION ///
        async deleteEntity(url, type, alert_identifier) {
            if(confirm('Are you sure?')) {
                try {
                    let response = await fetch(url, {
                        method: "DELETE",
                    })
                    
                    this.$root.setCookie()
                    if (response.status != 200){
                        this.$root.alertUserWithMessage(alert_identifier, this.$root.cookie['Message'], "red")
                        console.log(`Error saving changes, when deleting ${type}`)
                        return false;
                    }

                    if (response.ok) {
                        this.$root.refreshData()
                        this.$root.alertUserWithMessage(alert_identifier, this.$root.cookie['Message'], "green")
                    }
                } catch (error) {
                    console.log(error)
                    alert(`Network error: ${error}`)
                }
            }
        },
        ////////////////////////////

        //// GENERIC FETCH FUNCTION ////
        async fetchResource(url) {
            try {
                const response = await fetch(url);
                const data = await response.json();

                return data

            } catch (error) {
                console.log('Error loading user information:' + error);
                alert(`Network error: ${error}`)
            }
        }, 
        /////////////////////////////////

        //// GENERIC FETCH FUNCTION WITH METHOD AND JSON ////
        async fetchWithMethodAndJson(url, method, json) {
            return await fetch(url, {method: method, headers: {"Content-Type": "application/json",}, body: json})
        }, 
        /////////////////////////////////

        getFormDataInJSONFormat(identifier) {
            const form = document.getElementById(identifier)
            const formData = new FormData(form);

            const jsonData = {};
            for (const [key, value] of formData.entries()) {
                jsonData[key] = value;
            }

            return JSON.stringify(jsonData);
        },
    },
    template: `<h1 style="display: none;"> This wont be displayed anyway </h1>`, // This is only here to prevent a warning
}