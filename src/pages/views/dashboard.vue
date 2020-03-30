<template>
<div class="page-book-lising">
   <syncing v-if="syncing.open" :properties="{ fullscreen: syncing.fullscreen, autostart: syncing.autostart }"></syncing>
   <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <h4>Welcome John!</h4>
                <small>Last Login: January 01, 2020</small>
            </div>
            <div class="actions">
                <div style="display:none; height:30px; line-height:30px; background:red; padding:0px 10px;">
                    <span style="font-family:'Digital'; font-size:30px;">25:00</span>
                    <span style="font-family:'Digital'; font-size:30px;">START</span>
                    <span style="font-family:'Digital'; font-size:30px;">RESET</span>
                </div>
            </div>
        </div>
    </div>
    <div class="es-page-content">
        <div class="es-panel">
            <h4>Reports</h4>
            <hr/>
            <div class="container">
                <div class="row">
                    <div class="col-12 col-md-3">
                        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
                            <h3>260</h3>
                            <p style="margin:0px;">Daily Word Count</p>
                        </div>
                    </div>
                    <div class="col-12 col-md-3">
                        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
                            <h3>1,560</h3>
                            <p style="margin:0px;">Monthly Word Count</p>
                        </div>
                    </div>
                    <div class="col-12 col-md-3">
                        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
                            <h3>6,260</h3>
                            <p style="margin:0px;">Yearly Word Count</p>
                        </div>
                    </div>
                    <div class="col-12 col-md-3">
                        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
                            <h3>12,260</h3>
                            <p style="margin:0px;">All Time Word Count</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="es-panel">
            <h4>Your literary family</h4>
            <p>
                Do you want specific feedback on your text? Pilot Reader is a unique network where you can meet people who are interested in your project and experience with your genre. The service is free, secure and you can be completely anonymous.
            </p>
            <br/>
            <h4>How does this work?</h4>
            <p>
               Pilot Reader is a unique system where you can share your own texts for review, read and review other people's texts, or both.
            </p>
            <br/>
            <h4>About Pilot Reader</h4>
            <p>
               Pilot reader is under the umbrella of the Writers' School, and thus part of the literary family.
            </p>
        </div>

        <div class="es-panel">
            <h4>Your literary family</h4>
            <p>
                Do you want specific feedback on your text? Pilot Reader is a unique network where you can meet people who are interested in your project and experience with your genre. The service is free, secure and you can be completely anonymous.
            </p>
            <br/>
            <h4>How does this work?</h4>
            <p>
               Pilot Reader is a unique system where you can share your own texts for review, read and review other people's texts, or both.
            </p>
            <br/>
            <h4>About Pilot Reader</h4>
            <p>
               Pilot reader is under the umbrella of the Writers' School, and thus part of the literary family.
            </p>
        </div>
    </div>
</div>
</template>

<script>
import Syncing from '@/pages/views/syncing'

export default {
  name: 'dashboard',
  props: ['properties'],
  data: function () {
    return {
      syncing: {
        fullscreen: false,
        autostart: false,
        open: false
      }
    }
  },
  components: {
    'syncing': Syncing
  },
  methods: {
    closeSyncer: function () {
      var scope = this
      scope.syncing.open = false
    }
  },
  beforeMount () {
    var scope = this
    if (scope.properties !== null && scope.properties.autosync) {
      scope.syncing.fullscreen = true
      scope.syncing.autostart = true
      scope.syncing.open = true
    }
  },
  mounted () {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
