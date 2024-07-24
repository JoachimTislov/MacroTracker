const selectMeal = {
    data() {
        return {
            minutes: "minutes",
            hour: "hour",
            selectedMealTime: "Choose meal time",
            isHourValid: false,
            isMinutesValid: false,
            alertMessage: "",
        }
    },
    props: {
        personal_meals: Array,

        calender_day: String,
        calender_date: String,
    },
    methods: {
        modifyTime() {
            for(const [key, value] of this.$root.schedule) {
                if(this.selectedMealTime == key) {
                    this.hour = value.Start
                    this.hour.ClassName = "form-control form-control-md is-valid"
                    this.minutes = 0

                    document.getElementById('select_meal_minutes_invalid').style.display = "none"
                    document.getElementById('select_meal_hour_invalid').style.display = "none"

                    this.isHourValid = true
                    this.isMinutesValid = true

                    document.getElementById('hourInput').className = "form-control form-control-md is-valid"
                    document.getElementById('minutesInput').className = "form-control form-control-md is-valid"
                }   
            }
        },
        updateTime() {
            for(const [key, value] of this.$root.schedule) {
                if(this.hour >= value.Start && this.hour <= value.End) {
                    this.selectedMealTime = key
                }
            }
        }
    },
    template: `
        <div class="modal" id="select_meal_modal">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title ml-1 mt-2"> Select meal for {{ calender_day }}, {{ calender_date }}: </h5>
                        <button class="m-2 btn btn-danger btn-sm float-right" @click="$root.showSelectMeal = false"> 
                            <img class="icon" src="/static/Icons/close.png" alt="Close">
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="m-4" v-if="personal_meals.length > 0">
                            <form id="meal_date_info">
                                <div id="add_meal_alert" class="m-1 alert alert-dismissible alert-danger" style="display: none;"> {{ alertMessage }} </div>
                                <h5> Please provide the time when you had the meal </h5>
                                <div class="row m-3">

                                    <select class="form-control form-control-md" name="meal_time" @change="modifyTime()" v-model="selectedMealTime">
                                        <option disabled selected> Choose meal time </option>
                                        <option value="Breakfast"> Breakfast </option>
                                        <option value="Lunch"> Lunch </option>
                                        <option value="Dinner"> Dinner </option>
                                        <option value="Supper"> Supper </option>
                                        <option value="Night"> Night </option>
                                    </select>
                                    
                                    <div class="input-group">
                                        <input id="hourInput" @input="updateTime(), isHourValid = $parent.$refs.validation.isHourValid('select_meal_hour_invalid', 'form-control form-control-md')" class="form-control form-control-md" type="number" min="0" max="23" name="hour" v-model="hour" placeholder="hour">
                                        <div id="select_meal_hour_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                        
                                        <input id="minutesInput" @input="isMinutesValid = $parent.$refs.validation.isMinutesValid('select_meal_minutes_invalid', 'form-control form-control-md')" class="form-control form-control-md" type="number" min="0" max="59" name="minutes" v-model="minutes" placeholder="minutes">
                                        <div id="select_meal_minutes_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>
                                    </div>
                                   
                                </div>
                            </form>

                            <h5> Select and click the meal you want to add </h5>
                            <div class="wrap">
                                <div v-for="meal in personal_meals">
                                    <button @click="$parent.$refs.ajax.addMealToGivenDate(meal['meal_id'], isHourValid, isMinutesValid, calender_date, hour, minutes)" class="btn btn-secondary btn-md m-2">
                                        <h6>{{ meal['name'] }}</h6>
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div class="ml-5" v-if="personal_meals.length == 0">
                            <h5> You don't have any personal meals </h5>
                            <button class="btn-success btn btn-sm" @click="$root.showCreateMeal = true"> 
                                <h5> Create a meal </h5>
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>
    `
}