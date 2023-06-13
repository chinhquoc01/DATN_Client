<template>
	<v-card class="mx-auto" max-width="344" variant="outlined">
		<v-card-item>
			<div>
				<div class="d-flex justify-space-between">
					<div class="text-overline d-flex justify-start">
						<div>{{ getWorkType(workInfo.type) }} </div>
						<div v-if="workInfo.type != enums.workType.online && workInfo.location" class="ml-2">
							<v-icon icon="mdi-map-marker"></v-icon>
							<span>{{ workInfo.location }}</span>
						</div>
					</div>
					
				</div>
				<div class="text-h5 mb-1" @click="viewWorkDetail(workInfo)">
					{{ workInfo.title }}
				</div>
				<div class="text-caption">{{ workInfo.description }}</div>
				<div><v-icon icon="mdi-cash"></v-icon>{{ workInfo.budget }} VND</div>
				<v-chip-group>
					<v-chip v-for="field in fieldTag">{{ field }}</v-chip>
				</v-chip-group>
				<div>{{ workInfo.proposalCount }}</div>
				<v-btn :to="{name: 'workDetail', params: { workId: workInfo.id }}">Ứng tuyển</v-btn>
			</div>
		</v-card-item>

	</v-card>
	
</template>

<script setup>
import enums from '@/constants/enums';
import { ref } from 'vue';


const props = defineProps({
	workInfo: Object
})

const fieldTag = ref(JSON.parse(props.workInfo.fieldTag))

const emit = defineEmits(['editWork', 'removeWork'])

const getWorkType = (workType) => {
	switch (workType) {
		case 0:
			return 'Online'
		case 1:
			return 'Offline'
		case 2:
			return 'Hybrid'
		default:
			return ''
	}
}

const viewWorkDetail = (workInfo) => {

}

</script>
<style scoped>
.menu-item {
	cursor: pointer;
}

.menu-item:hover {
	background-color: rgb(207, 206, 206);
}

.menu-btn {
	height: 25px !important;
	width: 25px !important;
}
</style>