const editIngredient = {
    data() {
        return {
            validation_arr: {
                "isIngredientNameValid": true,
                "isAmountValid": true,
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
    props: {
       ingredient_to_edit: Object,
    },
    methods: {
        resetEditForm() {
            this._arr.forEach(string => {
                document.getElementById(`edit_ingredient_${string}_invalid`).style.display = "none"
            })
        },
        async editIngredient() {
            if(this.$parent.$refs.ajax.editIngredient(this.ingredient_to_edit['ingredient_id'], this.validation_arr) == true)  {
                this.resetEditForm()
            }
        },
    },
    template: `
        <div class="modal" id="ingredient_edit_modal">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content" id="modal-ingredient-size">
                    <div class="modal-header">
                        <h3 class="modal-title m-2"> Edit: {{ ingredient_to_edit['name'] }} </h3>
                        <button class="btn btn-danger btn-md float-right" @click="$root.showEditIngredient = false, resetEditForm()"> 
                            <img class="icon" src="/static/Icons/close.png" alt="Close">
                        </button>
                    </div>

                    <div class="modal-body">
                        <div id="edit_ingredient_alert" class="m-1 alert alert-dismissible alert-danger" style="display: none;"></div>
                        <form id="edit_ingredient_form">
                            <div class="form-group mt-2">
                                <label for="name" class="form-label"> Name: </label>
                                <input @input="this.validation_arr['isIngredientNameValid'] = $parent.$refs.validation.checkIfIngredientNameIsValid('edit_ingredient_name_invalid', 'form-control form-control-md')" class="form-control form-control-md is-valid" name="name" type="text" :value="ingredient_to_edit['name']">
                                <div id="edit_ingredient_name_invalid" class="ml-3 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label" for="amount"> Amount: </label>
                                <input @input="this.validation_arr['isAmountValid'] = $parent.$refs.validation.checkIfAmountIsValid('edit_ingredient_amount_invalid', 'form-control form-control-md')" class="form-control form-control-md is-valid" name="amount" type="text" :value="ingredient_to_edit['amount']">
                                <div id="edit_ingredient_amount_invalid" class="ml-3 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label" for="protein"> Protein: </label>
                                <input @input="this.validation_arr['isProteinValid'] = $parent.$refs.validation.checkIfNutrientIsValid('edit_ingredient_protein_invalid', 'form-control form-control-md')" class="form-control form-control-md is-valid" name="protein" type="number" step="any" :value="ingredient_to_edit['protein']">
                                <div id="edit_ingredient_protein_invalid" class="ml-3 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label" for="calories"> Calories: </label>
                                <input @input="this.validation_arr['isCaloriesValid'] = $parent.$refs.validation.checkIfNutrientIsValid('edit_ingredient_calories_invalid', 'form-control form-control-md')" class="form-control form-control-md is-valid" name="calories" type="number" step="any" :value="ingredient_to_edit['calories']">
                                <div id="edit_ingredient_calories_invalid" class="ml-3 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label" for="carbohydrates"> Carbohydrates: </label>
                                <input @input="this.validation_arr['isCarbohydratesValid'] = $parent.$refs.validation.checkIfNutrientIsValid('edit_ingredient_carbohydrates_invalid', 'form-control form-control-md')"  class="form-control form-control-md is-valid" name="carbohydrates" type="number" step="any" :value="ingredient_to_edit['carbohydrates']">
                                <div id="edit_ingredient_carbohydrates_invalid" class="ml-3 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label" for="fat"> Fat: </label>
                                <input @input="this.validation_arr['isFatValid'] = $parent.$refs.validation.checkIfNutrientIsValid('edit_ingredient_fat_invalid', 'form-control form-control-md')"  class="form-control form-control-md is-valid" name="fat" type="number" step="any" :value="ingredient_to_edit['fat']">
                                <div id="edit_ingredient_fat_invalid" class="ml-3 invalid-feedback"></div>
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label" for="sugar"> Sugar: </label>
                                <input @input="this.validation_arr['isSugarValid'] = $parent.$refs.validation.checkIfNutrientIsValid('edit_ingredient_sugar_invalid', 'form-control form-control-md')"  class="form-control form-control-md is-valid" name="sugar" type="number" step="any" :value="ingredient_to_edit['sugar']">
                                <div id="edit_ingredient_sugar_invalid" class="ml-3 invalid-feedback"></div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="editIngredient()" class="btn btn-success btn-lg ml-1"> Update Ingredient </button>
                    </div>
                </div>
            </div>
        </div>
    `
}