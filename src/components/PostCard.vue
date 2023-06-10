<template>
    <v-card
    class="mx-auto"
    max-width="344"
    variant="outlined"
  >
    <v-card-item>
      <div>
        <div class="text-overline mb-1">
          OVERLINE
        </div>
        <div>{{ workInfo.type }}</div>
        <div class="text-h6 mb-1">
          {{workInfo.title}}
        </div>
        <div>{{ workInfo.location }}</div>
        <div class="text-caption">{{ workInfo.description }}</div>
        <div>{{ workInfo.budget }}</div>
        <div>{{ workInfo.proposalCount }}</div>
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn variant="outlined">
        Button
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
    workInfo: Object
})

const emit = defineEmits(['editWork'])

</script>
<style scoped>

</style>