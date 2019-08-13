<template>
    <div>
        <Parent ></Parent>
    </div>
</template>
<script>
import Parent from './components/Parent'
export default {
    mounted() {
        this.$broadcast('say')
    },
    components:{
        Parent
    }
}
</script>