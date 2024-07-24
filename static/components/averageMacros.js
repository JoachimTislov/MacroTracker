const averageMacros = {
    props: {
        average_macros_this_week: Object,
    },
    template: `
        <section class="card mb-2">
            <header class="card-header">
                <button class="mb-2 btn btn-danger btn-md float-right" @click="$root.showAverageMacros = false, $root.toggleButton('average_macros', false)"> 
                    <img class="icon" src="/static/Icons/close.png" alt="Close">
                </button>
                <h4> Average macros per day: </h4>   
            </header>
            <article class="card-body ml-3">  
                <h5> <strong> This week </strong> </h5>
                <div class="row">
                    <h5 style="width: 200px;" class="border border-info border-1 p-2" v-for="(value, name) in average_macros_this_week"> 
                        <strong> 
                            <template v-if="name == 'Calories'">{{ name }}: {{ value }} kcal </template>
                            <template v-if="name != 'Calories'">{{ name }}: {{ value }} g </template>
                        </strong>
                    </h5>
                </div>
            </article>
        </section>
    `
}