<template>
    <v-sheet class="pa-12 w-100" rounded>
    <v-card class="mx-auto px-6 py-8">
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
        validate-on="input"
      >
        <v-text-field
          v-model="fullName"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Họ và tên"
        ></v-text-field>

        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Email"
        ></v-text-field>

        <v-text-field
          v-model="phone"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Số điện thoại"
        ></v-text-field>

        <v-text-field
          v-model="address"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Địa chỉ"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          type="password"
          clearable
          label="Mật khẩu"
        ></v-text-field>

        <br>

        <v-btn
          :disabled="!form"
          :loading="loading"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Đăng ký
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue';
const email = ref('')
const password = ref('')
const fullName = ref('')
const address = ref('')
const phone = ref('')
const loading = ref(false)
const form = ref(false)

const onSubmit = () => {
    if (!form.value) return

    loading.value = true

    setTimeout(() => (loading.value = false), 2000)
}

const required = (v) => {
    return !!v
}
</script>

<style scoped></style>