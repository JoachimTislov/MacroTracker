const mealCalender = {
    data() {
        return {
            message: this.$root.cookie['Message'],
            array_of_dates_for_week: [],
            month: (new Date()).getMonth(), 
            year: (new Date()).getFullYear(),
            j: 7,
            init_date: 0, 
            chosenDate: "2024-06-10",
            leapYear: 4, /*Every fourth year, 2024 is a leap year, therefore we start at 4*/
            dayForChosenDate: "",
        }
    },
    props: {
        zero_meals_to_show: Boolean,
        meals_for_given_date: Object,
        
        number_of_days_in_each_month: Array,
        days_in_week: Array,

        calender_day: String,
        calender_date: String,
    },
    methods: {
        getDaysForGivenMonth(month) {
            if(month == 1) {
                if(this.leapYear % 4 == 0 || this.leapYear == 0) {
                    return 29 
                } else {    
                    return 28 
                }
            } else {
                return this.number_of_days_in_each_month[month]['Days']  
            }
        },
        previousWeek(searchingWithButton) {
            /* monday */
            this.init_date = parseInt(this.days_in_week[0]['Date'].split('-')[0]) - this.j 

            if(this.init_date < 1) {

                if(this.month == 0) {
                    this.month = 11
                    this.year -= 1
                    this.leapYear -= 1
                } else {
                    this.month -= 1  
                }

                this.init_date += this.getDaysForGivenMonth(this.month) 
            } 

            this.setDaysForTheWeek(searchingWithButton)
        },
        nextWeek(searchingWithButton) {
            /* monday */
            this.init_date = parseInt(this.days_in_week[0]['Date'].split('-')[0]) + this.j 

            if(this.init_date > this.getDaysForGivenMonth(this.month)) {

                this.init_date -= this.getDaysForGivenMonth(this.month)
                
                if(this.month == 11) {
                    this.month = 0
                    this.year += 1
                    this.leapYear += 1
                } else {
                    this.month += 1
                }
            }

            this.setDaysForTheWeek(searchingWithButton)
        },
        setDaysForTheWeek(searchingWithButton) {
            let month = this.month
            let year = this.year
            let date = this.init_date

            for(let i = 0; i < this.days_in_week.length; i++) {
                this.days_in_week[i]['Date'] = this.$root.check_if_number_is_less_than_10(date) + '-' 
                + this.$root.check_if_number_is_less_than_10(month + 1) + '-' + year

                if(date == this.getDaysForGivenMonth(month)) {
                    date = 0
                    month += 1

                    if(month == 12) {
                        month = 0
                        year += 1
                    }
                }
                date++
            }

            if(searchingWithButton) {
                this.$root.load_average_macros()
            }
        },
        findWeekForDate() {
            const splitDate = this.chosenDate.split('-')
            const wantedYear = splitDate[0]
            const wantedMonth = splitDate[1]
            const wantedDay = splitDate[2]

            const wantedDate = `${wantedDay}-${wantedMonth}-${wantedYear}`

            const currentDate = this.days_in_week[3].Date // 3 could be any number between 0 and 6, i think. 

            let loop = true

            let pastORfuture = undefined /* False is past and opposite */
            
            ///// Determining if the date is in the future or the past /////
            if(currentDate.split('-')[2] == wantedYear) {
                if(currentDate.split('-')[1] == wantedMonth) {
                    if(currentDate.split('-')[0] < wantedDay) {
                        pastORfuture = true
                    } else {
                        pastORfuture = false
                    }

                    if(currentDate.split('-')[0] == wantedDay) {
                        return;
                    }
                } else if(currentDate.split('-')[1] < wantedMonth) {
                    pastORfuture = true
                } else {
                    pastORfuture = false
                }
            } else if(currentDate.split('-')[2] < wantedYear) {
                pastORfuture = true
            } else {
                pastORfuture = false
            }
            /////////////////////////////////////////////////////////////////

            let counter = 0
            while(loop) {
                for(const day of this.days_in_week) {
                    if(wantedDate == day.Date) {
                        this.dayForChosenDate = day.Day
                        
                        this.$root.calender_day = this.dayForChosenDate
                        this.$root.calender_date = this.chosenDate.split('-')[2] + '-' + this.chosenDate.split('-')[1] + '-' + this.chosenDate.split('-')[0]

                        this.$root.load_meals_for_given_date()

                        this.$root.load_average_macros()
                        
                        loop = false
                    }
                }

                if(loop) {
                    if(pastORfuture) {
                        this.nextWeek(false)
                    } else {
                        this.previousWeek(false)
                    }
                }

                // Fail safe mechanism 
                counter += 1
                if(counter == 10000) {
                    break
                }
            }
        },
        showDiv(identifier) {
            document.getElementById(identifier).style.display = "block";
        }
    },
    template: `
        <section class="card" id="meals_for_given_date">
            <div class="card-header">
                <button class="btn-danger btn-md btn float-right" @click="$root.showCalender = false, $root.toggleButton('calender', false)">
                    <img class="icon" src="/static/Icons/close.png" alt="Close">
                </button>
                
                <div class="row">
                    <h4 class="mt-1"> Meal Calender - </h4> 
                    <div class="ml-2"><input type="date" class="form-control form-control-md" v-model="chosenDate" @change="findWeekForDate(), showDiv('date_info')"></div>
                </div>
               
            </div>

            <div class="card-body" id="date_info">
                <div id="select_meal_alert" style="display: none;" class="m-3 alert alert-dismissible alert-success"></div>

                <div class="card-header">

                    <div class="ml-1 row">
                        <h5 class="mt-1"> {{ calender_day }}, {{ calender_date }} </h5>
                        
                        <button class="ml-2 btn-success btn btn-sm" @click="$root.showSelectMeal = true">
                            Add Meal
                        </button>
                    </div>

                </div>
                <div class="wrap">
                    <div class="m-2" v-for="(meals, meal_time) in meals_for_given_date" :key="meal_time" v-show="meals.length > 0">
                        <div class="list-group-item list-group-item-info"> <h4> {{ meal_time }} </h4> </div>
                        <div class="column">
                            <div :id="meal[0]" v-for="meal in meals">
                                <div class="mt-1 list-group-item"> 
                                <button class="float-right btn-danger btn btn-sm" @click="$parent.$refs.ajax.deleteEntity('/calender/' + meal[0], 'a calender entry', 'select_meal_alert')"> 
                                        <img class="icon" src="/static/Icons/delete.png" alt="Delete">
                                    </button>
                                    <h5> {{ meal[3] }}, {{ meal[4] }} </h5> 
                                </div>
                            </div>
                        </div>
                    </div>
                
                    <div v-if="zero_meals_to_show" class="ml-3">
                        <h5 class="mt-2"> You don't have any meals for the this date </h5>
                    </div>
                </div>
            </div>
        </section>
    `
}