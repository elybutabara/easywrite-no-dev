<template>
    <div>
        <div v-if="!minimized" class="component-syncing-v2">
            <div class="component-syncing-v2-content">
                <div class="component-syncing-v2-header">
                    <h4>Sync Data</h4>
                    <div class="component-syncing-v2-actions">
                        <button @click="minimize()" class="btn-minimize"><i class="far fa-window-minimize"></i></button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="component-syncing-v2-minimize">
            <span>Syncing: <strong>The Wanno Arc Data</strong></span>
            <span><i class="fas fa-sync fa-spin"></i> Progress: 100/200 (50%)</span>
            <span style="cursor:pointer;" @click="maximize()"><i class="fas fa-window-maximize"></i></span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SyncerV2',
  data: function () {
    return {
        minimized: false
    }
  },
  methods: {
    minimize: function () {
       this.minimized = true
    },
    maximize: function () {
       this.minimized = false
    }
  },
  mounted () {
  
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .component-syncing-v2 { position:fixed; width:100%; height:100vh; z-index:9000; background:rgba(0,0,0,0.7); }
    .component-syncing-v2-content { width:650px; height:250px; background:#fff; margin:0px auto; margin-top:calc(50vh - 225px); border-radius: 5px; }
    .component-syncing-v2-header { padding:15px;  }
    .component-syncing-v2-header h4 { font-size:16px; margin-bottom:0px; color:#333; font-weight:900;  }
    .component-syncing-v2-actions { float:right; text-align:right; margin-top:-25px;  }
    .component-syncing-v2-actions .btn-minimize { border:none; padding:none; background:transparent;  }

    .component-syncing-v2-minimize { position:fixed; bottom:0px; left:0px; background:#007acc; padding:0px 20px; width:100%; height:25px; line-height:25px; color:#fff; text-align:right; z-index:9000; }
    .component-syncing-v2-minimize span { padding-left:8px; }
</style>
