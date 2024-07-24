const loginForm = {
    data() {
        return {
            message: this.cookie['Message'],
            username: '',
            password: '',
            isUsernameValid: false,
            isPasswordValid: false,
        }
    },
    props: {
        cookie: Object,
    },
    created() {
        this.$root.hideAlertDiv('login_alert')
    },
    template: `
        <main>
            <div class="d-flex align-items-center vh-100">
                <div class="container">
                    <div class="card mx-auto" style="max-width: 500px">
                        <div class="card-body">
                            <div id="login_alert" class="alert alert-success"> <h5> <strong> {{ message }} </strong> </h5>  </div>
                            <h1 class="card-title">Macro Tracker </h1>
                            
                            <form @submit.prevent>
                                <div class="form-group">
                                    <input @input="isUsernameValid = $parent.$refs.validation.checkIfUsernameIsValid('username_invalid', 'form-control form-control-lg')" class="form-control form-control-lg" type="text" v-model="username" placeholder="Username" required>
                                    <div id="username_invalid" class="ml-3 invalid-feedback" style="display: none;"></div>
                                </div>

                                <div class="form-group">
                                    <input @input="isPasswordValid = $parent.$refs.validation.checkIfPasswordIsValid('password_invalid', 'mt-2 form-control form-control-lg')" class="mt-2 form-control form-control-lg" type="password" v-model="password" placeholder="Password" required>
                                    <div id="password_invalid" class="ml-3 mb-1 invalid-feedback" style="display: none;"></div>
                                </div>

                                <div class="form-group"> 
                                    <a class="btn btn-link" @click="$root.user_login = false, $root.user_register = true"> Register an account </a>
                                </div>
                                <div class="form-group">
                                    <button type="submit" class="btn btn-lg btn-outline-primary btn-block" @click="$parent.$refs.ajax.login(isUsernameValid, isPasswordValid, username, password)"> Login </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `
}


    



      

           
        