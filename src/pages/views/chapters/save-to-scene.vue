<template>
    <div class="page-content">
        This is a test
        <div class="es-card">
            asdasdasd
            <button @click="CloseMe()">Close</button>
        </div>
    </div>
</template>

<script>
export default {
  methods: {
    CloseMe: function () {
      var scope = this
      scope.$parent.closeSaveToScene()
    }
  }
}
</script>

<style scoped>
    .page-content {  position: fixed; top: 0px; left: 0px;  background: rgba(31,46,58,0.8); width: 100%; height: 100vh; z-index: 999; }
    .page-content .es-card { margin-top:100px; }
</style>
