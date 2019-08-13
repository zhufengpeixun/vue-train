<template>
    <div>
        孙子二 {{$attrs}}
    </div>
</template>

<script>
export default {
    mounted(){
        this.$listeners.son()
    }
}
</script>