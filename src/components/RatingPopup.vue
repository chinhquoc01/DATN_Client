<template>
    <v-dialog v-model="props.isShow" width="auto" persistent class="">

        <v-card>
            <v-card-title>
                Đánh giá {{ getUserType(userInfo) }}
            </v-card-title>
            <v-list-item :prepend-avatar="`https://ui-avatars.com/api/?name=${userInfo.name}`">
                <template v-slot:title>
                    {{userInfo.name}}
                </template>
                <template v-slot:subtitle>
                    <span>{{ userInfo.email }}</span>
                </template>

            </v-list-item>
            <v-rating
                v-model="rating"
                bg-color="orange-lighten-1"
                color="blue"
            ></v-rating>
            <v-card-actions class="justify-end">
                <v-btn color="primary" @click="closeDialog">Đóng</v-btn>
                <v-btn color="primary" @click="confirm">Đánh giá</v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import userApi from '@/apis/userApi';
import enums from '@/constants/enums';
import { useCommonUltilities } from '@/services/commonUlti';
import { ref } from 'vue';

const { toast, router } = useCommonUltilities()
const props = defineProps({
    userInfo: Object,
    isShow: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:isShow'])

const closeDialog = () => {
    emit('update:isShow', false)
}

const rating = ref(3)
const confirm = async () => {
    if (rating.value && rating.value !== 0) {
        let res = await userApi.rateUser(props.userInfo.id, rating.value)
        if (res && res.status == 200) {
            closeDialog()
            toast.success('Đánh giá người dùng thành công')
            router.push({name: 'home'})
        }
    }
}

const getUserType = () => {
    if (props.userInfo.type == enums.userType.client) {
        return 'Khách hàng'
    } else {
        return 'Freelancer'
    }
}

</script>