const createIngredient = {
    data() {
        return {
            validation_arr: {
                "isIngredientNameValid": false,
                "isAmountValid": false,
                "isProteinValid": true,
                "isCaloriesValid": true,
                "isCarbohydratesValid": true,
                "isFatValid": true,
                "isSugarValid": true,
               },
            _arr: [
                "name",
                "amount",
                "protein",
                "calories",
                "carbohydrates",
                "fat",
                "sugar"
            ]
        }
    },
    methods: {
        resetEditForm() {
            this._arr.forEach(string => {
                document.getElementById(`create_ingredient_${string}_invalid`).style.display = "none"
                document.getElementById(`create_ingredient_${string}_input`).className = "form-control form-control-md"

                if(string == "amount" || string == "name") {
                    document.getElementById(`create_ingredient_${string}_input`).value = ''
                } else {
                    document.getElementById(`create_ingredient_${string}_input`).value = 0
                }   
            })
        },
        async createIngredient() {
            if(this.$parent.$refs.ajax.createIngredient(this.validation_arr) == true) {
                this.resetEditForm()
            }
        },
    },
    template: `
        <div class="modal" id="create_ingredient_modal">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content" id="modal-ingredient-size">
                    <div class="modal-header">
                        <h3 class="modal-title mr-2"> Create Ingredient: </h3>
                    </div>

                    <div class="modal-body">
                        <div id="create_ingredient_alert" class="m-1 alert alert-dismissible alert-danger" style="display: none;"></div>
                        <form id="create_ingredient_form">

                            <div class="form-group mt-2">
                                <label for="name" class="form-label"> Name: </label><br>
                                <input id="create_ingredient_name_input" @input="this.validation_arr['isIngredientNameValid'] = $parent.$refs.validation.checkIfIngredientNameIsValid('create_ingredient_name_invalid', 'form-control form-control-md')" class="form-control form-control-md" name="name" type="text">
                                <div id="create_ingredient_name_invalid" class="ml-2 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label" for="amount"> Amount: </label>
                                <input id="create_ingredient_amount_input" @input="this.validation_arr['isAmountValid'] = $parent.$refs.validation.checkIfAmountIsValid('create_ingredient_amount_invalid', 'form-control form-control-md')" class="form-control form-control-md" name="amount" type="text">
                                <div id="create_ingredient_amount_invalid" class="ml-2 invalid-feedback"></div>
                            </div>
                            
                            <div class="form-group mt-2">
                                <label class="form-label" for="protein"> Protein: </label>
                                <input id="create_ingredient_protein_input" @input="this.validation_arr['isProteinValid'] = $parent.$refs.validation.checkIfNutrientIsValid('create_ingredient_protein_invalid', 'form-control form-control-md')" class="form-control form-control-md" name="protein" type="number" step="any" value=0>
                                <div id="create_ingredient_protein_invalid" class="ml-2 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">

                                <label class="form-label" for="calories"> Calories: </label>
                                <input id="create_ingredient_calories_input" @input="this.validation_arr['isCaloriesValid'] = $parent.$refs.validation.checkIfNutrientIsValid('create_ingredient_calories_invalid', 'form-control form-control-md')" class="form-control form-control-md" name="calories" type="number" step="any" value=0>
                                <div id="create_ingredient_calories_invalid" class="ml-2 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label" for="carbohydrates"> Carbohydrates: </label>
                                <input id="create_ingredient_carbohydrates_input" @input="this.validation_arr['isCarbohydratesValid'] = $parent.$refs.validation.checkIfNutrientIsValid('create_ingredient_carbohydrates_invalid', 'form-control form-control-md')"  class="form-control form-control-md" name="carbohydrates" type="number" step="any" value=0>
                                <div id="create_ingredient_carbohydrates_invalid" class="ml-2 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label" for="fat"> Fat: </label>
                                <input id="create_ingredient_fat_input" @input="this.validation_arr['isFatValid'] = $parent.$refs.validation.checkIfNutrientIsValid('create_ingredient_fat_invalid', 'form-control form-control-md')"  class="form-control form-control-md" name="fat" type="number" step="any" value=0> 
                                <div id="create_ingredient_fat_invalid" class="ml-2 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label" for="sugar"> Sugar: </label>
                                <input id="create_ingredient_sugar_input" @input="this.validation_arr['isSugarValid'] = $parent.$refs.validation.checkIfNutrientIsValid('create_ingredient_sugar_invalid', 'form-control form-control-md')"  class="form-control form-control-md" name="sugar" type="number" step="any" value=0>
                                <div id="create_ingredient_sugar_invalid" class="ml-2 invalid-feedback"></div>
                            </div>

                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-danger btn-lg ml-1" @click="$root.showCreateIngredient = false, resetEditForm()"> Cancel </button>
                        <button type="button" @click="createIngredient()" class="btn btn-success btn-lg ml-1"> Create Ingredient </button>
                    </div>
                </div>
            </div>
        </div>
    `
}