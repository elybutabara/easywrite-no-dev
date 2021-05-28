<template>
    <div class="animated flash notify-sync">
        <div>Would you like to sync your data with web?</div>
        <div class="notify-sync-actions">
            <button @click="sync()" type="button" style="background:#007bff; color:#fff; border: 1px solid #007bff; padding: 1px 15px; font-size: 12px;">Yes</button>
            <button @click="closeSyncingNotification()" type="button" style="background:#fff; color:#303030; border: 1px solid #cbd6e2; padding: 1px 15px; font-size: 12px;">No</button>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'NotifySync',
  data: function () {
    return {
    }
  },
  computed: {
  },
  watch: {  
  },
  methods: {
    sync: function () {
        this.$parent.startSync();
        this.$parent.closeSyncingNotification();
    },
    closeSyncingNotification: function () {
        this.$parent.closeSyncingNotification();
    }
  },
  mounted () {
    var scope = this
    var audio = new Audio(require('../assets/ding.mp3')); // path to file
    audio.play();
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .notify-sync { bottom:10px; right:10px; position:fixed; width:300px; padding:10px; background:#fff; border:1px solid #cbd6e2; z-index:6000; }
    .notify-sync-actions { text-align:right; }
</style>
