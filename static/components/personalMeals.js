const personalMeals = {
    data() {
        return {
            search_value: '',
            sort_value: 'Sort by',
            filtered_meals: [], 
        }
    },
    props: {
        personal_meals: Array,
        meal_ingredients: Array,
    },
    mounted() {
        let value = this.$root.cookie[`meal_sort_value_${this.$root.cookie['user_id']}`]
        if(value != undefined) {
            this.sort_value = value
        } 
    },
    methods: {
        checkMeals() {
            if(this.search_value.length == 0 && this.sort_value == 'Sort By') {
                return this.personal_meals
            } 

            if(this.sort_value != 'Sort By') {
                this.filtered_meals = this.$root.sortArray(this.personal_meals, this.sort_value)
            } 
            
            if(this.search_value.length > 0) {
                this.filtered_meals = this.$root.filterArrayByName(this.search_value, this.personal_meals)
            } 

            return this.filtered_meals
        },
    },
    template: `
        <section class="card mb-2 m-3">
            <div class="card-header">
                <button class="btn-danger btn btn-md float-right" @click="$root.showPersonalMeals = false, $root.toggleButton('personal_meals', false)"> 
                    <img class="icon" src="/static/Icons/close.png" alt="Close">
                </button>
                <h2 class="m-0"> Personal meals </h2>
            </div>

            <div id="personal_meal_alert" style="display: none;" class="mt-5 alert alert-dismissible alert-success"></div>

            <div class="card-body row ml-2">

                <div>
                    <input id="search_meal" @input="filtered_meals = $root.filterArrayByName(search_value, personal_meals)" type="text" placeholder="Search" v-model="search_value">
                </div>

                <div>
                    <select id="select_sort_meals" @change="$root.setSortCookie(sort_value, 'meal'), filtered_meals = $root.sortArray(personal_meals, sort_value)" v-model="sort_value">
                        <option disabled selected> Sort by </option>
                        <option value="name"> Name </option>
                        <option value="protein"> Protein </option>
                        <option value="calories"> Calories </option>
                        <option value="carbohydrates"> Carbohydrates </option>
                        <option value="fat"> Fat </option>
                        <option value="sugar"> Sugar </option>
                    </select>
                </div>
                
                <div>
                    <button class="create_button btn-success btn btn-sm" @click="$root.showCreateMeal = true"> 
                        Create Meal
                    </button>
                </div>

            </div>

            <div class="card">
                <div class="wrap">
                    <div v-for="meal in checkMeals()" :id="meal['meal_id']" class="border border-3 border-secondary m-2 p-4" style="width: 100%;">
                        <div class="float-right">
                            <button :id="'showAndHideIngredients_' + meal['meal_id']" @click="$root.showAndHideDivBody('ingredients_div_' + meal['meal_id'], 'showAndHideIngredients_' + meal['meal_id'], 'ingredients')" type="button" class="mr-2 btn btn-info btn-sm"> 
                                Show ingredients 
                            </button>

                            <button class="btn-info btn btn-sm" @click="$root.editMeal(meal['meal_id'])"> 
                                <img class="icon" src="/static/Icons/edit.png" alt="Edit">
                            </button>

                            <button @click="$parent.$refs.ajax.deleteEntity('/meal/' + meal['meal_id'], 'meal', 'personal_meal_alert')" class="btn-danger btn btn-sm"> 
                                <img class="icon" src="/static/Icons/delete.png" alt="Delete">
                            </button>
                        </div>
                        
                        <div class="card-body">
                            <h4 class="card-title"> Meal Name: {{ meal['name'] }} </h4>
                            <details class="ml-2">
                                <summary> Total Macros: </summary>
                                <h5 style="width: 200px;" class="border border-info border-1 m-2 p-2"> Carbohydrates: {{ meal['carbohydrates'] }}g </h5>
                                <h5 style="width: 200px;" class="border border-info border-1 m-2 p-2"> Calories: {{ meal['calories'] }}kcal </h5>
                                <h5 style="width: 200px;" class="border border-info border-1 m-2 p-2"> Protein: {{ meal['protein'] }}g </h5>
                                <h5 style="width: 200px;" class="border border-info border-1 m-2 p-2"> Fat: {{ meal['fat'] }}g </h5>
                                <h5 style="width: 200px;" class="border border-info border-1 m-2 p-2"> Sugar: {{ meal['sugar'] }}g </h5>
                            </details>

                            <div class="mt-2" :id="'ingredients_div_' + meal['meal_id']" style="display: none;">
                                <h5 style="text-decoration: underline"> Ingredients: </h5>
                                <div class="wrap mt-2">
                                    <div class="column" v-if="meal['ingredients'].length > 0" v-for="ingredient in meal['ingredients']">
                                        <ul class="list-group mt-4">
                                            <li class="list-group-item list-group-item-info mr-3"> {{ ingredient['name'] }}, {{ ingredient['amount'] }} </li>
                                            <li class="list-group-item mr-3"> Protein: {{ ingredient['protein'] }}g </li>
                                            <li class="list-group-item mr-3"> Calories: {{ ingredient['calories'] }}kcal </li> 
                                            <li class="list-group-item mr-3"> Carbohydrates: {{ ingredient['carbohydrates'] }}g </li>
                                            <li class="list-group-item mr-3"> Fat: {{ ingredient['fat'] }}g </li>
                                            <li class="list-group-item mr-3"> Sugar: {{ ingredient['sugar'] }}g </li>
                                        </ul>
                                        <div class="ml-2">
                                            <button @click="$parent.$refs.ajax.deleteEntity('/meal/' + ingredient['ingredient_id'] + '/' + meal['meal_id'], 'removing ingredient from meal', 'personal_meal_alert')" class="btn-outline-danger btn btn-md"> Remove </button>
                                            <button class="btn btn-outline-info btn-md" @click="$root.editIngredient(ingredient['ingredient_id'])"> 
                                                <img class="icon" src="/static/Icons/edit.png" alt="Edit">
                                            </button>
                                        </div>
                                    </div>
                                    <div v-if="meal['ingredients'].length == 0">
                                        <h6> The meal: {{ meal['name'] }} has zero ingredients </h6> 
                                        <button class="btn-outline-info btn btn-lg" @click="$root.editMeal(meal['meal_id'])"> 
                                            <img class="icon" src="/static/Icons/edit.png" alt="Edit"> {{ meal['name'] }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ml-5 mb-2 mt-2" v-if="personal_meals.length == 0">
                <h4 v-if="search_value == ''"> You don't have any personal meals </h4>
                <h4 v-if="search_value != ''"> You don't have any personal meals with name: {{ this.search_value }} </h4>
                <button class="create_button btn-success btn btn-sm" @click="$root.showCreateMeal = true"> 
                    <h5> Create a meal </h5>
                </button>
            </div>
        </section>
    `
}
