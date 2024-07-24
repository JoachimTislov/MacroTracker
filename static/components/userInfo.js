const userInfo = {
    data() {
        return {
            currentActivityLvl: "",
            calories: 0,
            message: "",
            validation_arr: {
                "isUsernameValid": true,
                "isPasswordValid": true,
                "isEmailValid": true,
                "isWeightValid": true,
                "isHeightValid": true,
                "isAgeValid": true,
                "isNameValid": true
            },
            file: "",
            show_upload_button: false,
            profilePictureUrl: this.user_info.profile_picture_link || 'static/Icons/user-icon.png' 
        }
    },
    props: {
        activity_lvl: Number,
        recommended_calories: Number,
        gender: String,
        user_info: Object,
        calories_needed: Object,
    },
    watch: {
        user_info: {
            handler(newVal) {
                this.currentActivityLvl = this.user_info.activity_lvl
                this.profilePictureUrl = newVal.profile_picture_link || 'static/Icons/user-icon.png';
            },
            immediate: true,
            deep: true
        },
        recommended_calories: {
            handler(val) {
                this.calories = val
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        setCalc() {
            if (this.activity_lvl != 0) {
                if (this.calories_needed.length > 1) {
                    let select_value = 0
                    if(document.getElementById('activity_lvl')) {
                        select_value = document.getElementById('activity_lvl').value

                        const selectedText = document.getElementById('activity_lvl').options[document.getElementById('activity_lvl').selectedIndex].text;
                        console.log(selectedText)

                        this.currentActivityLvl = selectedText
                    }

                    for(const entry of this.calories_needed) {
                        if(entry['lvl'] == select_value) {
                            this.calories = entry.calories
                        }
                    }

                } else if(this.calories_needed[this.activity_lvl] != 0) {
                    this.calories = this.calories_needed[this.activity_lvl].calories
                }
            } 
        },

        handleFileUpload() {
            this.show_upload_button = true
            this.file = event.target.files[0];
            const URL = window.URL || window.webkitURL;
            if (URL) {
                this.profilePictureUrl = URL.createObjectURL(this.file);
            } else {
                console.error("URL.createObjectURL is not supported in this browser.");
            }
        },
    },
    template: `
    <section class="card p-3 mb-2">
    <div class="container">
        <button class="btn btn-danger btn-md float-right" @click="$root.showProfile = false, $root.toggleButton('profile', false), $root.showCalender = true, $root.showAverageMacros = true, $root.toggleButton('average_macros', true), $root.toggleButton('calender', true)">
            <img class="icon" src="/static/Icons/close.png" alt="Close">
        </button>
        <form id="new_user_information" @submit.prevent>
            <strong><h3>Your Profile</h3></strong>
            <div id="user_alert" style="display: none;" class="mt-5 alert alert-dismissible alert-success">
                <h4>{{ message }}</h4>
            </div>
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="card bg-secondary center">

                        <section class="card-body">
                            <label for="pictureInput" class="form-label"> 
                                <h5 class="card-title"> Your Profile Picture </h5> 
                                </label>
                            <div class="mb-4">
                                <img :src="profilePictureUrl" alt="static/Icons/user-icon.png" class="rounded" style="width: 150px; height: 150px; object-fit: cover;">
                            </div>
                            <div class ="mt-2">
                                <input type="file" class="input-group input-group-sm" id="pictureInput" @change="handleFileUpload()">
                                <div class="input-group-append mt-2">
                                    <h6 v-show="!show_upload_button && profilePictureUrl == 'static/Icons/user-icon.png'"> Select a picture </h6>
                                    <button v-show="show_upload_button" type="button" class="btn btn-sm btn-outline-success" @click="$parent.$refs.ajax.uploadProfilePicture(file), show_upload_button = false">Upload</button>
                                    <button v-if="profilePictureUrl != 'static/Icons/user-icon.png'" type="button" class="btn btn-sm btn-outline-danger" @click="$parent.$refs.ajax.deleteProfilePicture()">Delete</button>
                                </div>
                            </div>
                        </section>

                    </div>

                    <div class="card bg-secondary mt-2">
                        <div class="card-body">

                            <h5 class="card-title"> Your Activity Level - {{ currentActivityLvl }} </h5>

                            <div class="form-group">
                                <label for="activity_lvl"> Switch activity lvl: </label>
                                <select class="form-control form-control-md is-valid" @change="setCalc()" id="activity_lvl" name="activity_lvl">
                                    <option v-for="arr in calories_needed" :value="arr['lvl']"> {{ arr.activity }} </option>
                                </select>
                            </div>

                            <h6 class="ml-2" v-if="calories != 0"> We recommended: {{ calories }} kcal, per day </h6>

                        </div>
                    </div>
                </div>

                <div class="col-md-8 ">
                    <div class="card bg-secondary">
                        <div class="card-body">

                            <h5 class="card-title">Profile Information</h5>
                            <div class="form-group">
                                <label for="name">Name:</label>
                                <input @input="this.validation_arr['isNameValid'] = $parent.$refs.validation.checkIfNameIsValid('profile_name_invalid', 'form-control form-control-md')" class="form-control form-control-md is-valid" type="text" name="name" :value="user_info.name || ''" required>
                                <div id="profile_name_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                            </div>
                            <div class="form-group">
                                <label for="username">Username:</label>
                                <input @input="this.validation_arr['isUsernameValid'] = $parent.$refs.validation.checkIfUsernameIsValid('profile_username_invalid', 'form-control form-control-md')" class="form-control form-control-md is-valid" type="text" name="username" :value="user_info.username" required>
                                <div id="profile_username_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input @input="this.validation_arr['isEmailValid'] = $parent.$refs.validation.checkIfEmailIsValid('profile_email_invalid', 'form-control form-control-md')" class="form-control form-control-md is-valid" type="text" name="email" :value="user_info.email" required>
                                <div id="profile_email_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                            </div>

                        </div>
                    </div>

                    <div class="card bg-secondary mt-2">
                        <div class="card-body">

                            <h5 class="card-title">Personal Information</h5>
                            <div class="form-group">
                                <label for="age">Age:</label>
                                <input @input="this.validation_arr['isAgeValid'] = $parent.$refs.validation.checkIfAgeIsValid('profile_age_invalid', 'form-control form-control-md')" class="form-control form-control-md is-valid" type="number" name="age" :value="user_info.age || ''" required>
                                <div id="profile_age_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                            </div>
                            <div class="form-group">
                                <label for="height">Height:</label>
                                <input @input="this.validation_arr['isHeightValid'] = $parent.$refs.validation.checkIfHeightIsValid('profile_height_invalid', 'form-control form-control-md')" class="form-control form-control-md is-valid" type="number" name="height" :value="user_info.height || ''" required>
                                <div id="profile_height_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                            </div>
                            <div class="form-group">
                                <label for="gender">Gender:</label>
                                <select class="form-control form-control-md is-valid" name="gender">
                                    <option :value="user_info.gender" selected>{{ gender }}</option>
                                    <option value="1" v-if="gender == 'Female'">Male</option>
                                    <option value="2" v-if="gender == 'Male'">Female</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="weight">Weight:</label>
                                <input @input="this.validation_arr['isWeightValid'] = $parent.$refs.validation.checkIfWeightIsValid('profile_weight_invalid', 'form-control form-control-md')" class="form-control form-control-md is-valid" type="number" name="weight" :value="user_info.weight || ''" required>
                                <div id="profile_weight_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                            </div>

                        </div>
                    </div>

                    <div class="mt-4 btn-group btn-group-lg" style="width: 100%">
                        <button id="update_information_button" type="submit" class="btn btn-outline-success" @click="$parent.$refs.ajax.updateUserInfo(this.validation_arr)">Update Information</button>
                        <button id="change_password_button" type="button" class="btn btn-outline-info" @click="$root.changePassword = true">Change Password?</button>
                    </div>
                </div>
            </div>
            
        </form>
    </div>
</section>

    `
}
