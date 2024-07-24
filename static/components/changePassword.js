const changePassword = {
    data() {
        return {
            message: "",
            validation_arr: {
                "isOldPasswordValid": false,
                "isNewPasswordValid": false,
                "isConfirmNewPasswordValid": false,
            },
        }
    },
    template: `
    <div class="container">
        <div class="modal" id="change_password_modal">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title m-2"> Change Password: </h3>
                        <button class="btn btn-danger btn-md float-right" @click="$root.changePassword = false"> 
                            <img class="icon" src="/static/Icons/close.png" alt="Close">
                        </button>
                    </div>

                    <div class="modal-body">
                        <div id="change_password_alert" class="m-1 alert alert-dismissible alert-danger" style="display: none;"> <h4> {{ message }} </h4> </div>

                        <form id="passwords" @submit.prevent>
                            <label for="old_password" class="form-label"> Old Password: </label>
                            <input @input="validation_arr['isOldPasswordValid'] = $parent.$refs.validation.checkIfPasswordIsValid('changePassword_old_password_invalid', 'form-control form-control-md')" class="form-control form-control-md" name="old_password" type="password">
                            <div id="changePassword_old_password_invalid" class="ml-3 invalid-feedback"></div>

                            <label for="new_password" class="form-label"> New Password: </label>
                            <input @input="validation_arr['isNewPasswordValid'] = $parent.$refs.validation.checkIfPasswordIsValid('changePassword_new_password_invalid', 'form-control form-control-md')" class="form-control form-control-md" name="new_password" type="password">
                            <div id="changePassword_new_password_invalid" class="ml-3 invalid-feedback"></div>
                        
                            <label for="confirm_new_password" class="form-label"> Confirm New Password: </label>
                            <input @input="validation_arr['isConfirmNewPasswordValid'] = $parent.$refs.validation.checkIfPasswordIsValid('changePassword_confirm_new_password_invalid', 'form-control form-control-md')" class="form-control form-control-md" name="confirm_new_password" type="password">
                            <div id="changePassword_confirm_new_password_invalid" class="ml-3 invalid-feedback"></div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" @click="$parent.$refs.ajax.changePassword(this.validation_arr)" class="btn btn-success btn-lg ml-1"> Change Password </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}