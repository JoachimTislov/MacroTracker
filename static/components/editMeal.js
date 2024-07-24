const editMeal = {
    data() {
        return {
            mealNameIsValid: true,
            api_search: '',
            api_search_data: [],
        }
    },
    props: {
       meal_to_edit_ingredients: Object,
       meal_to_edit_meal_info: Object,
       personal_ingredients: Object
    },
    methods: {
        addEmptyIngredient() {
            this.meal_to_edit_ingredients.push({
                "amount": "",
                "calories": 0,
                "carbohydrates": 0,
                "fat": 0,
                "sugar": 0,
                "ingredient_id": undefined,
                "name": "",
                "protein": 0,
            })
        },
        resetIngredient(index) {
            this.meal_to_edit_ingredients[index] = {
                "amount": "",
                "calories": 0,
                "carbohydrates": 0,
                "fat": 0,
                "sugar": 0,
                "ingredient_id": undefined,
                "name": "",
                "protein": 0,
            };
        },
        addIngredientToMeal(ingredient) {

            console.log("Addding ingredient" + ingredient)
                
            if(!this.$root.checkIfIngredientIsAlreadyAdded('edit_meal_alert', this.meal_to_edit_ingredients, ingredient['ingredient_id'], 'ingredient_id')) {
                return false
            }

            this.meal_to_edit_ingredients.push(ingredient)
        },
        addAPIProductToMeal(product, index) {
            if(!this.$root.checkIfIngredientIsAlreadyAdded('edit_meal_alert', this.meal_to_edit_ingredients, product['id'], 'api_product_id')) {
                return false
            }

            this.api_search_data.splice(index, 1)

            this.meal_to_edit_ingredients.push({
                "amount": `${product['weight']} ${product['weight_unit']}`,
                "calories": product['nutrition'][0]['amount'],
                "carbohydrates": product['nutrition'][2]['amount'],
                "fat": product['nutrition'][1]['amount'],
                "sugar": product['nutrition'][4]['amount'],
                "ingredient_id": undefined,
                "api_product_id": product['id'],
                "name": product['name'],
                "protein": product['nutrition'][3]['amount'] 
            })

            this.$root.alertUserWithMessage('edit_meal_alert', "Successfully added ingredient from API search to meal", "green")
        },
        async search_with_api() {
            if(this.api_search.length > 2) {
                this.api_search_data = await this.$parent.$refs.ajax.load_products_from_api_search(this.api_search)
            }
        }
    },
    template: `
        <div class="modal" id="meal_edit_modal">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content" id="modal-size">
                    <div class="modal-header">
                        <h3 class="modal-title"> Edit meal: {{ meal_to_edit_meal_info['name'] }} </h3>
                        <button class="btn btn-danger btn-md float-right" @click="$root.showEditMeal = false"> 
                            <img class="icon" src="/static/Icons/close.png" alt="Close">
                        </button>
                    </div>

                    <div class="modal-body">
                        <form id="edit_meal_form">
                            <div id="edit_meal_alert" class="m-1 alert alert-dismissible alert-danger" style="display: none;"></div>
                            <label for="meal_name"> Meal name: </label><br>
                            <input style="width: 30%;" @input="this.mealNameIsValid = $parent.$refs.validation.checkIfMealNameIsValid('editMeal_meal_name_invalid', 'form-control form-control-md')" class="form-control form-control-md" name="meal_name" type="text" :value="meal_to_edit_meal_info['name']">
                            <div id="editMeal_meal_name_invalid" class="ml-2 invalid-feedback" style="display: none;"></div>

                            <div class="mt-2 mb-1">
                                <h5> Ingredients </h5>
                            </div>
                            <h6 class="ml-3" v-if="meal_to_edit_ingredients.length == 0"> Zero ingredients </h6>
                            <div class="column mt-2">
                                <div class="row">
                                    <div class="column ml-4" :id="'meal_to_edit_ingredient_' + index" v-if="meal_to_edit_ingredients.length > 0" v-for="(element, index) in meal_to_edit_ingredients" :key="index">
                                        <input :name="index + '-ingredient_id'" type="text" :value="element['ingredient_id']" style="display: none;">

                                        <div class="form-group mt-2">
                                            <label class="m-0 form-label" :for="index + '-name'"> Name: </label><br>
                                            <input class="m-0 form-control form-control-sm" @input="$parent.$refs.validation.checkIfIngredientNameIsValid('editMeal_ingredient_name_invalid' + index, 'm-0 form-control form-control-sm')"  :name="index + '-name'" type="text" :value="element['name']">
                                            <div :id="'editMeal_ingredient_name_invalid' + index" class="ml-2 invalid-feedback" style="display: none;"></div>
                                        </div>
                                        
                                        <div class="form-group mt-2">
                                            <label class="m-0 form-label" :for="index + '-amount'"> Amount: </label><br>
                                            <input class="m-0 form-control form-control-sm" @input="$parent.$refs.validation.checkIfAmountIsValid('editMeal_amount_invalid' + index, 'm-0 form-control form-control-sm')"  :name="index + '-amount'" type="text" v-model="meal_to_edit_ingredients[index]['amount']">
                                            <div :id="'editMeal_amount_invalid' + index" class="ml-2 invalid-feedback" style="display: none;"></div>
                                        </div>
                                        
                                        <div class="form-group mt-2">
                                            <label class="m-0 form-label" :for="index + '-calories'"> Calories in kcal: </label><br>
                                            <input class="m-0 form-control form-control-sm" @input="$parent.$refs.validation.checkIfNutrientIsValid('editMeal_calories_invalid' + index, 'm-0 form-control form-control-sm')"  :name="index + '-calories'" type="number" step="any" v-model="meal_to_edit_ingredients[index]['calories']">
                                            <div :id="'editMeal_calories_invalid' + index" class="ml-2 invalid-feedback" style="display: none;"></div>
                                        </div>

                                        <div class="form-group mt-2">
                                            <label class="m-0 form-label" :for="index + '-protein'"> Protein in g: </label><br>
                                            <input class="m-0 form-control form-control-sm" @input="$parent.$refs.validation.checkIfNutrientIsValid('editMeal_protein_invalid' + index, 'm-0 form-control form-control-sm')"  :name="index + '-protein'" type="number" step="any" v-model="meal_to_edit_ingredients[index]['protein']">
                                            <div :id="'editMeal_protein_invalid' + index" class="ml-2 invalid-feedback" style="display: none;"></div>
                                        </div>

                                        <div class="form-group mt-2">
                                            <label class="m-0 form-label" :for="index + '-carbohydrates'"> Carbohydrates in g: </label><br>
                                            <input class="m-0 form-control form-control-sm" @input="$parent.$refs.validation.checkIfNutrientIsValid('editMeal_carbohydrates_invalid' + index, 'm-0 form-control form-control-sm')"  :name="index + '-carbohydrates'" type="number" step="any" v-model="meal_to_edit_ingredients[index]['carbohydrates']">
                                            <div :id="'editMeal_carbohydrates_invalid' + index" class="ml-2 invalid-feedback" style="display: none;"></div>
                                        </div>

                                        <div class="form-group mt-2">
                                            <label class="m-0 form-label" :for="index + '-fat'"> Fat in g: </label><br>
                                            <input class="m-0 form-control form-control-sm" @input="$parent.$refs.validation.checkIfNutrientIsValid('editMeal_fat_invalid' + index, 'm-0 form-control form-control-sm')"  :name="index + '-fat'" type="number" step="any" v-model="meal_to_edit_ingredients[index]['fat']">
                                            <div :id="'editMeal_fat_invalid' + index" class="ml-2 invalid-feedback" style="display: none;"></div>
                                        </div>

                                        <div class="form-group mt-2">
                                            <label class="m-0 form-label" :for="index + '-sugar'"> Sugar in g: </label><br>
                                            <input class="m-0 form-control form-control-sm" @input="$parent.$refs.validation.checkIfNutrientIsValid('editMeal_sugar_invalid' + index, 'm-0 form-control form-control-sm')" :name="index + '-sugar'" type="number" step="any" v-model="meal_to_edit_ingredients[index]['sugar']">
                                            <div :id="'editMeal_sugar_invalid' + index" class="ml-2 invalid-feedback" style="display: none;"></div>
                                        </div>
                                        
                                        <button type="button" class="btn-danger btn btn-sm m-1" v-if="element['ingredient_id'] == undefined" @click="meal_to_edit_ingredients.splice(index, 1)"> 
                                            <img class="icon" src="/static/Icons/delete.png" alt="Delete"> 
                                        </button>

                                        <button type="button" class="btn-danger btn btn-sm m-1" v-if="element['ingredient_id'] != undefined" @click="meal_to_edit_ingredients.splice(index, 1), $parent.$refs.ajax.deleteEntity('/meal/' + element['ingredient_id'] + '/' + meal_to_edit_meal_info['meal_id'], 'ingredient from meal', 'edit_meal_alert')"> 
                                            <img class="icon" src="/static/Icons/delete.png" alt="Delete"> 
                                        </button>
                                        <button type="button" class="btn-danger btn btn-sm m-1" v-if="meal_to_edit_ingredients.length > 0" @click="resetIngredient(index)"> 
                                            <img class="icon" src="/static/Icons/reset.png" alt="Reset"> 
                                        </button>
                                    </div>
                                </div>
                                <div class="ml-3" id="personal_ingredients_to_add">
                                    <h5> Select and click the ingredient you want to add </h5>
                                    <div class="wrap">
                                        <div v-for="ingredient in personal_ingredients">
                                            <button type="button" @click="addIngredientToMeal(ingredient)" class="btn btn-secondary btn-md m-2">
                                                <h6>{{ ingredient['name'] }} </h6>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="ml-3" v-if="personal_ingredients.length == 0">
                                        <h6> You don't have any personal ingredients </h6>
                                        <button type="button" class="btn-success btn btn-sm" @click="$root.showEditMeal = false, $root.showCreateIngredient = true"> 
                                            <h6> Create ingredient </h6>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <section class="m-2">
                                <h4> Find ingredients with Kassal.app API </h4>
                                    
                                <form @submit.prevent>
                                    <div class="input-group m-1">
                                        <input class="form-control" v-model="api_search" placeholder="Search for ingredient" type="text">
                                        <button type="submit" class="btn btn-primary" @click="search_with_api()"> Find product </button>
                                    </div>
                                </form>
                                
                                <div v-if="api_search_data.length > 0">
                                    <h4> Ingredients from your search: (Click to add) </h4>
                                    <div class="wrap">
                                        <div class="m-2" @click="addAPIProductToMeal(product, index)" v-for="(product, index) in api_search_data" :key="index" style="width: 30%;">
                                            <h5> {{ product['name'] }} </h5>
                                            <h6> Price: {{ product['current_price'] }} kr </h6>

                                            <img id="api_search_img" class="float-right" :src="product['image']" :alt="product['name']">
                                            <ul>
                                                <li v-for="nutrient in product['nutrition']"> 
                                                    
                                                    {{ nutrient['display_name'] }}: {{ nutrient['amount'] }} {{ nutrient['unit'] }}
                                                
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <h5 class="ml-4" v-if="api_search_data.length == 0 && api_search.length > 2"> Please click enter or button *Find product*, if already done, sorry did not find any products with your search: {{ api_search }} </h5>
                                <h5 class="ml-4" v-if="api_search.length != 0 && api_search.length < 3"> Your search: {{ api_search }} is too short. Minium 3 letters </h5>
                            </section>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="addEmptyIngredient()" class="btn btn-primary btn-lg ml-1">
                            <img class="icon" src="/static/Icons/add.png" alt="Add"> Empty Ingredient 
                        </button>
                        <button type="button" @click="$parent.$refs.ajax.editMeal(mealNameIsValid, meal_to_edit_ingredients, meal_to_edit_meal_info['meal_id'])" class="btn btn-success btn-lg ml-1"> Update Meal </button>
                    </div>
                </div>
            </div>
        </div>
    `
}