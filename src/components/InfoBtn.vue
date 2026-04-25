<template>
    <Button :label="label" :icon="icon" :class="class" severity="info" size="small" @click="$emit('click')" raised />
</template>

<script setup>
const props = defineProps({
    label: {
        type: String
    },
    icon: {
        type: String
    },
    class: {
        type: String
    }
})

const emit = defineEmits(['click'])
</script>

<style scoped></style>
