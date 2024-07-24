const personalIngredients = {
    data() {
        return {
            search_value: '',
            sort_value: 'Sort by',
            filtered_ingredients: [], 
        }
    },
    props: {
        personal_ingredients: Array
    },
    mounted() {
        let value = this.$root.cookie[`ingredient_sort_value_${this.$root.cookie['user_id']}`]
        if(value != undefined) {
            this.sort_value = value
        } 
    },
    methods: {
        checkIngredients() {
            if(this.search_value.length == 0 && this.sort_value == 'Sort By') {
                return this.personal_ingredients
            }

            if(this.sort_value != 'Sort By') {
                this.filtered_ingredients = this.$root.sortArray(this.personal_ingredients, this.sort_value)
            }
            if(this.search_value.length > 0) {
                this.filtered_ingredients = this.$root.filterArrayByName(this.search_value.toLowerCase(), this.personal_ingredients)
            } 

            return this.filtered_ingredients
        },
    },
    template: `
        <section class="card mb-2 m-3">
            <div class="card-header">
                <button class="btn-danger btn btn-md float-right" @click="$root.showPersonalIngredients = false, $root.toggleButton('personal_ingredients', false)"> 
                    <img class="icon" src="/static/Icons/close.png" alt="Close">
                </button>
                <h2 class="m-0"> Personal ingredients </h2>
            </div>

            <div id="personal_ingredient_alert" style="display: none;" class="mt-5 alert alert-dismissible alert-success"></div>
               
            <div class="card-body row ml-2">
                <div>
                    <input @input="filtered_ingredients = $root.filterArrayByName(search_value.toLowerCase(), personal_ingredients)" type="text"  id="search_ingredients" placeholder="Search" v-model="search_value">
                </div>

                <div>
                    <select id="select_sort_ingredients" @change="$root.setSortCookie(sort_value, 'ingredient'), filtered_ingredients = $root.sortArray(personal_ingredients, sort_value)" v-model="sort_value">
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
                    <button class="create_button btn-success btn btn-sm" @click="$root.showCreateIngredient = true"> 
                        Create Ingredient 
                    </button>
                </div>

            </div>

            <div class="card">
                <div class="wrap">
                    <div v-for="ingredient in checkIngredients()" :id="ingredient['ingredient_id']" class="border border-3 border-secondary m-2 p-4" style="width: 100%;">

                    <div class="float-right">
                        <button class="mr-2 btn btn-info btn-sm" :id="'showAndHideNutrients_' + ingredient['ingredient_id']" @click="$root.showAndHideDivBody('info_div_' + ingredient['ingredient_id'], 'showAndHideNutrients_' + ingredient['ingredient_id'], 'nutrients')" type="button"> 
                            Show nutrients 
                        </button>
                        <button class="btn-info btn btn-sm" @click="$root.editIngredient(ingredient['ingredient_id'])"> 
                            <img class="icon" src="/static/Icons/edit.png" alt="Edit">
                        </button>
                        <button @click="$parent.$refs.ajax.deleteEntity('/ingredient/' + ingredient['ingredient_id'], 'ingredient', 'personal_ingredient_alert')" class="btn-danger btn btn-sm"> 
                            <img class="icon" src="/static/Icons/delete.png" alt="Delete">
                        </button>
                    </div>
                        

                    <div>
                        <div class="row">
                            <h4 class="mt-1 card-title">{{ ingredient['name'] }}, {{ ingredient['amount'] }} </h4>

                        </div>

                        <div class="wrap mt-2">
                            <div class="column" :id="'info_div_' + ingredient['ingredient_id']" style="display: none;">
                                <ul class="list-group">
                                    <li class="list-group-item"> Protein: {{ ingredient['protein'] }}g </li>
                                    <li class="list-group-item"> Calories: {{ ingredient['calories'] }}kcal </li> 
                                    <li class="list-group-item"> Carbohydrates: {{ ingredient['carbohydrates'] }}g </li>
                                    <li class="list-group-item"> Fat: {{ ingredient['fat'] }}g </li>
                                    <li class="list-group-item"> Sugar: {{ ingredient['sugar'] }}g </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
                
            <div class="ml-5 mb-2 mt-2" v-if="personal_ingredients.length == 0">
                <h4 v-if="search_value == ''"> You don't have any personal ingredients </h4>
                <h4 v-if="search_value != ''"> You don't have any personal ingredients with name: {{ this.search_value }} </h4>
                <button class="create_button btn-success btn btn-sm" @click="$root.showCreateIngredient = true"> 
                    <h5> Create ingredient </h5>
                </button>
            </div>
    </section>
    `
}