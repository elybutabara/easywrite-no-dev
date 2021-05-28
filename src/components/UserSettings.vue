<template>
    <div class="user-settings">
        <div class="user-settings-content">
            <div class="user-settings-header">
                <h4>User Settings</h4>
                <div class="user-settings-actions">
                    <button @click="$parent.toggleUserSettings()" class="btn-minimize"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="user-settings-body">
                <div v-if="response == 'success'" class="alert alert-success text-left">
                    <strong>Updated!</strong>
                </div>
                <div v-if="response == 'error'" class="alert alert-danger text-left">
                    <strong>Error</strong> An error occur while updating...
                </div>
                <div style="text-align:left; margin-bottom:20px;">
                    Enable Auto Sync:
                    <a class="nav-toggle mr-auto bx-shadow-1" href="javascript:void(0)" style="padding-top: 8px;">
                    <div class="switch-wrapper">
                        <label style="margin:5px;" class="switch">
                            <input v-model="auto_sync" type="checkbox">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    </a>
                </div>
                <div style="text-align:left; margin-bottom:10px;">
                    <label>Start Date:</label> 
                    <b-form-datepicker v-model="synced_date" @context="onSyncDateChange" id="birthdate-datepicker" :placeholder="$t('NO_SELECTED_DATE')" class="mb-2" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"></b-form-datepicker>
                </div>
            </div>
            <div class="user-settings-footer">
                <button @click="updateUserSyncingSettings()" style="border:1px solid var(--navy); background: var(--navy); color:#fff; font-weight:600; font-size:12px; padding:8px 20px; border-radius:4px;">Update</button>
                <button @click="$parent.toggleUserSettings()" style="border:1px solid #ccc; background: #efefef; font-weight:600; font-size:12px; padding:8px 20px; border-radius:4px;">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'UserSettings',
  data: function () {
    return {
        synced_date: null,
        auto_sync: false,
        response: 'none'
    }
  },
  computed: {
  },
  watch: {
      
  },
  methods: {
    onSyncDateChange: function (ctx) {
      var scope = this
      scope.synced_date = ctx.selectedYMD
    },
    updateUserSyncingSettings: function () {
      var scope = this
      var userID = this.$store.getters.getUserID
      var date = scope.synced_date

      scope.axios
        .post('http://localhost:3000/users/synced', { uuid: userID, date: date, autosync: scope.auto_sync})
        .then(function (response) {
            var data = response.data

            scope.$store.commit('updateSyncedAt', {
                syncedAt: data.synced_at
            })

            scope.$store.commit('updateAutoSync', {
                autosync: data.auto_sync
            })
            scope.response = 'success'
            setTimeout(function () {
                scope.response = 'none'
            }, 3000)
        })
        .catch(function (error) {
            scope.response = 'success'
            setTimeout(function () {
                scope.response = 'none'
            }, 3000)
        })
    },
  },
  mounted () {
    const scope = this
    scope.synced_date = scope.$store.getters.getUserSyncedDate
    scope.auto_sync = scope.$store.getters.getUserSyncedAutoSync
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .user-settings { position:fixed; width:100%; height:100vh; z-index:9000; background:rgba(0,0,0,0.7); }
    .user-settings-content { width:650px; min-height:280px; background:#fff; margin:0px auto; margin-top:calc(50vh - 225px); border-radius: 5px; }
    .user-settings-header { padding:15px;  }
    .user-settings-header h4 { font-size:16px; margin-bottom:0px; color:#333; font-weight:900;  }
    .user-settings-actions { float:right; text-align:right; margin-top:-25px;  }
    .user-settings-actions .btn-minimize { border:none;  background:transparent;  }

    .user-settings-body { padding:10px 30px; text-align:center;  }
    .user-settings-footer {padding-top:10px; padding-bottom:20px; text-align:center;  }
</style>
