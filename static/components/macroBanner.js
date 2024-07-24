const macroBanner = {
    data() {
        return {
            message: this.$root.cookie['Message'],
        }
    },
    props: {
        cookie: Object,
        username: String,
    },
    template: `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <div class="column">
                    <h5> Macro Tracker - {{ username }} </h5> 

                    <div class="btn-group btn-group-lg btn-group-secondary">
                        <button id="profile" class="btn btn-outline-success" @click="$root.showProfile = true, $root.toggleButton('profile', true), $root.showCalender = false, $root.showAverageMacros = false, $root.toggleButton('average_macros', false), $root.toggleButton('calender', false)"> Profile </button>
                        <button disabled id="average_macros" class="btn btn-outline-success" @click="$root.showAverageMacros = true, $root.toggleButton('average_macros', true)"> Weekly Macros </button>
                        <button disabled id="calender" class="btn btn-outline-success" @click="$root.showCalender = true, $root.toggleButton('calender', true)"> Calender </button>
                    </div>
                </div>

                <button class="btn btn-outline-danger btn-lg float-right mt-2 text-light" id="logout" @click="$parent.$refs.ajax.logout(), $root.showAverageMacros = true, $root.showCalender = true, $root.showProfile = false, $root.showPersonalMeals = false, $root.showPersonalIngredients = false, $root.showDateInfo = false" > Log out </button>
            </div>
        </nav>

        <div id="alert" class="m-4 alert alert-dismissible alert-success" style="display: none;"></div>
    `
}