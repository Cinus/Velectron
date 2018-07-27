<template>
    <v-layout column justify-center>
        <v-flex>
            <div v-for="user of userList" :key="user.id">
                {{user.name}} - {{user.email}}
            </div>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    created () {
        this.$store.dispatch('getUserList')
    },
    computed: {
        userList () {
            return this.$store.state.userList
        }
    }
}
</script>

<style scoped>
  img {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
</style>