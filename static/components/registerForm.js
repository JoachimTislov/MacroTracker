const registerForm = {
    data() {
        return {
            message: this.cookie['Message'],
            validation_arr: {
                "isUsernameValid": false,
                "isPasswordValid": false,
                "isConfirmPasswordValid": false,
                "isGenderValid": false,
                "isActivityLvlValid": false,
                "isEmailValid": false,
                "isWeightValid": false,
                "isHeightValid": false,
                "isAgeValid": false,
                "isNameValid": false
            },
        }
    },
    props: {
        cookie: Object,
    },
    created() {
        this.$root.hideAlertDiv('register_alert')
    },
    template: `
          <main>
            <div class="container">
                <div class="card mx-auto" style="max-width: 550px">
                    <div class="card-body">
                        <h1 class="card-title"> Register: Macro Tracker </h1>
                        <form id="register_form" @submit.prevent>
                                <div class="form-group">
                                    <input @input="this.validation_arr['isUsernameValid'] = $parent.$refs.validation.checkIfUsernameIsValid('register_username_invalid', 'form-control form-control-md')" class="form-control form-control-md" type="text" name="register_username" placeholder="Username" required>
                                    <div id="register_username_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                </div>
                                <div class="form-group">
                                    <input @input="this.validation_arr['isPasswordValid'] = $parent.$refs.validation.checkIfPasswordIsValid('register_password_invalid', 'form-control form-control-md')" class="form-control form-control-md" type="password" name="register_password" placeholder="Password" required>
                                    <div id="register_password_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                </div>
                                <div class="form-group">    
                                    <input @input="this.validation_arr['isConfirmPasswordValid'] = $parent.$refs.validation.checkIfPasswordIsValid('confirm_password_invalid', 'form-control form-control-md')" class="form-control form-control-md" type="password" name="confirm_password" placeholder="Repeat password" required>
                                    <div id="confirm_password_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                </div>

                                
                                <div class="row">
                                    <div class="col-6">
                                        <select @change="this.validation_arr['isGenderValid'] = $parent.$refs.validation.checkIfGenderIsValid('_gender_invalid', 'form-control form-control-md')" class="form-control form-control-md" name="_gender" required>
                                            <option value="0" selected> Choose Gender </option>
                                            <option value="1"> Male </option>
                                            <option value="2"> Female </option>
                                        </select>
                                        <div id="_gender_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                    </div>

                                    <div class="form-group col-6">
                                        <select @change="this.validation_arr['isActivityLvlValid'] = $parent.$refs.validation.checkIfActivityLvlIsValid('_activity_lvl_invalid', 'form-control form-control-md')" class="form-control form-control-md" name="_activity_lvl" required>
                                            <option value="0" selected> Choose Activity Lvl </option>
                                            <option value="1"> Sedentary </option>
                                            <option value="2"> Lightly Active </option>
                                            <option value="3"> Moderately Active </option>
                                            <option value="4"> Very Active </option>
                                            <option value="5"> Super Active </option>
                                        </select>
                                        <div id="_activity_lvl_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <input @input="this.validation_arr['isNameValid'] = $parent.$refs.validation.checkIfNameIsValid('register_name_invalid', 'form-control form-control-md')" class="form-control form-control-md" type="text" name="register_name" placeholder="Name" required>
                                    <div id="register_name_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                </div>
                                <div class="form-group">
                                    <input @input="this.validation_arr['isEmailValid'] = $parent.$refs.validation.checkIfEmailIsValid('register_email_invalid', 'form-control form-control-md')" class="form-control form-control-md" type="email" name="register_email" placeholder="Email" required>
                                    <div id="register_email_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                </div>
                                <div class="form-group">
                                    <input @input="this.validation_arr['isAgeValid'] = $parent.$refs.validation.checkIfAgeIsValid('register_age_invalid', 'form-control form-control-md')" class="form-control form-control-md" type="number" name="register_age" placeholder="Age" required>
                                    <div id="register_age_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                </div>
                                <div class="form-group">
                                    <input @input="this.validation_arr['isHeightValid'] = $parent.$refs.validation.checkIfHeightIsValid('register_height_invalid', 'form-control form-control-md')" class="form-control form-control-md" type="number" name="register_height" placeholder="Height in cm" required> 
                                    <div id="register_height_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                </div>
                                <div class="form-group">
                                    <input @input="this.validation_arr['isWeightValid'] = $parent.$refs.validation.checkIfWeightIsValid('register_weight_invalid', 'form-control form-control-md')" class="form-control form-control-md" type="number" name="register_weight" placeholder="Weight in kg" required> 
                                    <div id="register_weight_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                </div>

                            
                            <div id="register_alert" class="alert alert-dismissible alert-danger" style="display: none;"></div>
                                
                            <div class="form-group">
                                <a class="btn btn-link" @click="$root.user_register = false, $root.user_login = true"> Back to login page </a>
                            </div>
                            
                            <div form-group>
                                <button type="submit" class="btn btn-lg btn-outline-primary btn-block" @click="$parent.$refs.ajax.register(this.validation_arr)"> Register </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
            
        </main>
    `
}