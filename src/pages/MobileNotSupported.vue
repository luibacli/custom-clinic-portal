<template>
    <div
        class="h-screen w-full flex-col flex items-center justify-center gap-3 p-10 bg-gradient-to-br from-white via-blue-50 to-blue-200">
        <p class="text-2xl text-blue-900"> Opps! Mobile not supported pa po, try laptop and desktop muna for now!
            Hehehehe</p>
        <Button asChild v-slot="slotProps" size="small">
            <RouterLink to="/login" :class="slotProps.class">GO BACK TO LOGIN</RouterLink>
        </Button>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>