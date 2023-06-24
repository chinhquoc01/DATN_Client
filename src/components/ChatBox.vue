<template>
    <div class="w-100 d-flex" @mouseup="endResize">
        <div class="user-list mt-3 flex-column" :style="{width: `${userListWidth}%`}">
            <div v-for="(user, index) in listUser" :key="index" class="user-item pt-1 pb-1" @click="selectChat(user)">
                <v-list-item :prepend-avatar="`https://ui-avatars.com/api/?name=${user.name}`">
                    <template v-slot:title>
                        {{user.name}}
                    </template>
                    <template v-slot:subtitle>
                        <span>to Alex, Scott, Jennifer</span>
                    </template>

                </v-list-item>
            </div>
        </div>
        <v-divider vertical :thickness="4" class="divider" @mousedown="startResize"></v-divider>
        <div class="chat-section flex-column d-flex" :style="{width: `calc(100% - ${userListWidth}%)`}">
            <div class="message-history">
                <div>{{ receiverInfo.name }}</div>
                <div class="d-flex flex-column">
                    <div v-for="(message, index) in messageList" :key="index" class="message-group" :class="{'my-message-group': message.senderId == senderId, 'their-message-group': message.senderId == receiverId}">
                        <div class="message">
                            {{ message.content }}
                            <v-tooltip activator="parent">
                                {{ handleDateTime(message.createdDate) }}
                            </v-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex align-end chat-input">
                <v-textarea v-model="messageText" class="" placeholder="Nhập tin nhắn" @keyup.enter.prevent="sendMessage" auto-grow rows="1"></v-textarea>
                <v-btn @click="sendMessage">Gửi</v-btn>
            </div>
    

        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useCommonUltilities } from '@/services/commonUlti';
import { useAuthStore } from '@/stores/authStore';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr'
import messageApi from '@/apis/messageApi';

const { route } = useCommonUltilities()
const authStore = useAuthStore()


const connection = new HubConnectionBuilder().withUrl(`${import.meta.env.VITE_BASE_URL}/chatHub`, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets
}).withAutomaticReconnect().build()
const messageList = ref([])
const messageText = ref('')
const senderId = ref(authStore.userInfo.id)
const receiverId = ref(route.query.userId)
const receiverInfo = ref({})

const selectChat = async (user) => {
    receiverInfo.value = user
    receiverId.value = user.id
    messageList.value = await getChatHistory(senderId.value, receiverId.value)
    if (channel.value) {
        connection.off(channel.value)
    }
    await connection.stop()
    initConnection()
    startConnection()
}
const channel = ref('')
const initConnection = () => {
    channel.value = 'Message-' + senderId.value + '/' + receiverId.value 
    connection.on(channel.value, function (message) {
        messageList.value.push(message)
    })
}
const startConnection = () => {
    connection.start().then(() => {
        console.log('start');
    }).catch((error) => {
        console.log(error);
    })
}
const sendMessage = async () => {
    try {
        if (messageText.value) {
            messageText.value = messageText.value.replace(/(\r\n|\n|\r)/gm, "")
            let workId = route.query.workId
            await connection.invoke("SendMessage", messageText.value, senderId.value, receiverId.value, workId)
            messageText.value = ''
        }
        
    } catch (error) {
        console.log(error);
        messageText.value = ''
    }
}

const getChatHistory = async (senderId, receiverId) => {
    let res = await messageApi.getChatHistory(senderId, receiverId)
    if (res.status == 200) {
        return res.data
    } return []
}

const listUser = ref([])
const getListUserMessage = async (userId) => {
    let res = await messageApi.getUserMessage(userId)
    if (res.status == 200) {
        listUser.value = res.data 
    } else {
        listUser.value = []
    }  
}
getListUserMessage(senderId.value)



const userListWidth = ref(25)
const handleResize = (e) => {
    console.log(e);
    const percentage = (e.pageX / window.innerWidth) * 100

    // if (percentage >= 10 && percentage <= 90) {
        userListWidth.value = percentage.toFixed(2)
    // }
}
const startResize = () => {
    document.addEventListener('mousemove', handleResize)
}
const endResize = () => {
    document.removeEventListener('mousemove', handleResize)
}

const handleDateTime = (isoDatetime) => {
    let dateTime = new Date(isoDatetime)
    return dateTime.toLocaleString('vi')
}
</script>

<style scoped lang="scss">
.user-list {
    min-width: 250px;
}
.user-item :hover {
    cursor: pointer;
    background-color: rgb(209, 208, 208);
}
.chat-section {
    flex-grow: 1;
    min-width: 50%;
}
.divider {
    cursor: ew-resize;
}
.message-history {
    flex-grow: 1;
    padding: 8px;
}
.chat-input {
    height: 60px;
    padding: 8px 0;
}
:deep(.v-input__details) {
    display: none;
}
.my-message-group {
    align-self: flex-end;
    .message {
        background-color: rgb(7, 145, 7);
        color: white;
    }
}
.their-message-group {
    align-self: flex-start;
    .message {
        background-color: rgb(209, 208, 208);
    }
}
.message-group {
    max-width: 60%;
}
.message {
    margin-top: 2px;
    padding: 4px 12px;
    border-radius: 16px;
}
</style>