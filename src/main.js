import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const toastOptions = {
    // You can set your default options here
    timeout: 4000,
    maxToasts: 3,
    position: 'bottom-right'
};

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)

const vuetify = createVuetify({
    components,
    directives,
})

app.component('VueDatePicker', VueDatePicker)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Toast, toastOptions);
app.mixin({
    methods: {
        formatCurrency: money => money?.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}),
        formatDate: date => new Date(date).toLocaleString('vi-VN')
    }
})

app.mount('#app')
