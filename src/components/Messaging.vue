<template>
  <div v-show="show" class="messaging" style="display: none; position: fixed; z-index: 5000; bottom: 0; left: 20px; width: 600px; padding: 0; margin: 0;">
    <div class="card shadow">
      <div class="card-header py-3" style="padding: 5px !important;">
        <h6 class="m-0 font-weight-bold" style="text-align: center;">MESSAGES</h6>
        <button v-on:click.prevent="window.AppMessaging.close()" type="button" class="close" aria-label="Close" style="position: absolute; top: 4px; right: 8px;">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div style="padding: 0 20px;">
      </div>
      <div class="card-body" style="padding: 0; margin: 0; height: calc(100vh - 400px); position: relative;">
        <div v-if="!selectedGroupId">
          <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding-left: 200px; padding-bottom: 40px; background: #fff;">
            <div style="padding: 15px; border-bottom: 1px solid rgb(227, 230, 240);">
                <h6 style="margin: 0;">New Message</h6>
            </div>
            <div style="padding: 15px;">
                <div style="color: #c0c0c0; font-size: 13px;">You may select 1 user for private message or multiple users for group chat.</div>
                <multiselect v-model="userSelect.selected" id="ajax" label="name" track-by="uuid" placeholder="Select a user..." open-direction="bottom" :options="userSelect.rows" :multiple="true" :searchable="true" :loading="userSelect.isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :options-limit="300" :limit="3" :limit-text="userSelectLimitText" :max-height="600" :show-no-results="false" :hide-selected="true" @search-change="userSelectFind">
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag" style="float: left;cursor:default;background: rgb(73, 109, 125);line-height: 24px;padding: 0 8px;margin: 0;margin-left: 5px;border-radius: 5px;color: #fff;">
                      <span>{{ option.name }}</span>
                      <button @click="remove(option)" type="button" aria-label="Close" class="close" style="margin-left: 5px;color: #fff;font-size: 20px;"><span aria-hidden="true">×</span></button>
                    </span>
                  </template>
                  <template slot="clear" slot-scope="props">
                    <div class="multiselect__clear" v-if="userSelect.selected.length" @mousedown.prevent.stop="userSelectClearAll(props.search)"></div>
                  </template><span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
                </multiselect>
                <div v-if="userSelect.selected.length > 1" style="margin-top: 15px;">
                  <input v-model="userSelect.groupName" type="text" placeholder="Group Name" class="form-control" />
                </div>
                <div v-if="userSelect.selected.length > 0" style="margin-top: 15px;">
                  <button v-on:click="createGroupChat($event)" class="btn es-button-white btn-secondary">Next <i class="fa fa-arrow-right"></i></button>
                </div>
            </div>
          </div>
        </div>
        <div v-if="selectedGroupId">
          <div v-bind:id="chatContentId" style="position: absolute; right: 0; top: 0; width: calc(100% - 200px); height: calc(100% - 40px); padding: 15px; background: #fff; overflow-y: auto;">
            <div v-for="(gm, i) in messagesHistory" v-bind:key="'gmh-'+selectedGroupId+'-'+i" style="position: relative;">
              <div v-if="gm.author_uuid !== getAuthor.uuid" style="float: left; clear: both; color: #fff; border-radius: 10px; background: #496d7d; font-size: 13px; padding: 5px 15px; margin-bottom: 10px; margin-top: 20px;">
                {{gm.message}}
                <div style="position: absolute; left: 0; top: 5px; opacity: 0.3; font-size: 90%; color: #000;">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div v-if="gm.author_uuid === getAuthor.uuid" style="float: right; clear: both; color: #000; border-radius: 10px; background: rgb(227, 230, 240); font-size: 13px; padding: 5px 15px; margin-bottom: 10px; margin-top: 20px;">
                {{gm.message}}
                <div style="position: absolute; right: 0; top: 5px; opacity: 0.3; font-size: 90%;">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <div v-for="(gm, i) in groupMessages" v-bind:key="'gm-'+selectedGroupId+'-'+i" style="position: relative">
              <div v-if="gm.author_uuid !== getAuthor.uuid" style="float: left; clear: both; color: #fff; border-radius: 10px; background: #496d7d; font-size: 13px; padding: 5px 15px; margin-bottom: 10px; margin-top: 20px;">
                {{gm.message}}
                <div style="position: absolute; left: 0; top: 5px; opacity: 0.3; font-size: 90%; color: #000;">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div v-if="gm.author_uuid === getAuthor.uuid" style="float: right; clear: both; color: #000; border-radius: 10px; background: rgb(227, 230, 240); font-size: 13px; padding: 5px 15px; margin-bottom: 10px; margin-top: 20px;">
                {{gm.message}}
                <div style="position: absolute; right: 0; top: 5px; opacity: 0.3; font-size: 90%;">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <div style="clear: both;"></div>
          </div>
          <div style="position: absolute; padding-left: 200px; bottom: 0; width: 100%;">
            <div style="padding: 5px;">
              <textarea v-model="chatMessage" v-bind:id="textareaId" class="form-control" style="float: left; height: 30px; width: calc(100% - 65px); padding: 0 10px;" placeholder="Type a message..."></textarea>
              <button v-on:click="sendChatMessage()" class="btn es-button-white btn-secondary" style="float: left;margin-left: 5px;width: 60px;">Send</button>
            </div>
          </div>
        </div>
        <div style="position: absolute; left: 0; top: 0; height: 100%; width: 200px; background: #f5f8fa; border-right: 1px solid rgb(227, 230, 240);">
          <div style="padding: 5px;">
            <input type="text" class="form-control" placeholder="Search users &amp; groups..." />
          </div>
          <ul style="padding: 0; margin: 0;">
            <li v-for="(group, i) in sortedGroupChats" v-bind:key="'group-index-'+group.uuid" style="padding: 0; margin: 0;">
              <div v-bind:class="{active: selectedGroupId==group.uuid}" v-on:click.prevent="selectedGroupId=group.uuid" class="messaging-group-nav" style="font-size: 12px; padding: 8px 15px;">
                {{groupChatDisplayName(group)}}
              </div>
            </li>
          </ul>
          <div style="position: absolute; bottom: 0; left: 0; width: 100%; text-align: center; padding: 5px;">
            <button class="btn es-button-white btn-secondary" v-on:click.prevent="selectedGroupId=null"><i class="fa fa-plus"></i> New Message</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import socketIO from 'socket.io-client'

export default {
  name: 'Messaging',
  props: ['params'],
  data: function () {
    // var scope = this
    var data = {
      show: !false,
      userSelect: {
        groupName: '',
        selected: [],
        rows: [],
        isLoading: false
      },
      groupChats: {},
      selectedGroupId: null,
      window: window,
      socket: null,
      socketConnected: false,
      chatMessage: '',
      chatContentId: ('chat-content-').replace('.', ''),
      textareaId: ('txt-').replace('.', '')
    }
    return data
  },
  computed: {
    //
    currentGroup: function () {
      var currentGroup = this.groupChats[this.selectedGroupId]
      return currentGroup
    },
    messagesHistory: function () {
      return this.currentGroup.messagesHistory
    },
    groupMessages: function () {
      return this.currentGroup.messages
    },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    },
    sortedGroupChats: function () {
      var groups = []
      for (var x in this.groupChats) {
        groups.push(this.groupChats[x])
      }
      groups.sort(function (a, b) {
        console.log(a.last_activity + ' < ' + b.last_activity)
        return (''+a.last_activity).localeCompare(''+b.last_activity)
      })
      return groups
    }
  },
  watch: {
    selectedGroupId: function () {
      if (!this.selectedGroupId) {
        return
      }
      if (!this.socketConnected) {
        return
      }
      if (this.messagesHistoryLoaded) {
        return
      }
      this.socket.emit('group message history', {chat_group_uuid: this.selectedGroupId})
    }
  },
  methods: {
    //
    sendChatMessage: function () {
      if (!this.socketConnected) {
        return
      }
      if (this.chatMessage === '') {
        return
      }
      this.socket.emit('group message', {chat_group_uuid: this.selectedGroupId, message: this.chatMessage})
      var objDiv = document.getElementById(this.chatContentId)
      objDiv.scrollTop = objDiv.scrollHeight
      this.chatMessage = ''
    },
    displayChatTime: function (t) {
      var tm = moment(t)
      var tmNow = moment()
      if (tm.format('MM-DD-YYYY') === tmNow.format('MM-DD-YYYY')) {
        return tm.format('h:mma')
      }
      return tm.format('MM/DD/YYYY h:mma')
    },
    groupChatDisplayName: function (gc) {
      if (gc.uuid.indexOf('pm-') === 0) {
        var data = JSON.parse(gc.data)
        for (var x in data.members_cache) {
          var mc = data.members_cache[x]
          if (mc.author_uuid !== this.getAuthor.uuid) {
            return mc.author_alias
          }
        }
      }
      return gc.name
    },
    createGroupChat: function (e) {
      e.preventDefault()
      if (!this.socketConnected) {
        return
      }
      if (this.userSelect.selected.length < 1) {
        return
      }
      if (this.userSelect.selected.length > 1) {
        if (this.userSelect.groupName === '') {
          return
        }
      } else {
        this.userSelect.groupName = ''
      }
      this.socket.emit('group create', {name: this.userSelect.groupName, members: this.userSelect.selected})
    },
    userSelectLimitText (count) {
      return `and ${count} other users`
    },
    userSelectFind (q) {
      var scope = this
      scope.userSelect.isLoading = true

      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + scope.$store.getters.getUserToken
      }

      scope.axios
        .get('http://api.pilotleser.no/live/search/authors?q=' + escape(q) + '&limit=10',
          {
            'headers': headers
          })
        .then(response => {
          if (response.data && response.data.rows) {
            var rows = []
            for (var i = 0; i < response.data.rows.length; i++) {
              var row = response.data.rows[i]
              rows.push({uuid: row.uuid, name: row.alias})
            }
            scope.userSelect.rows = rows
            // console.log('rows', rows)
          }
        }).finally(function () {
          scope.userSelect.isLoading = false
        })
    },
    connect: function () {
      //
      var scope = this

      var socket = socketIO('http://dev.kunohay.com:3030')
      socket.on('connect', function () {
        scope.socket = socket
        scope.socketConnected = true
        socket.emit('authenticate', {
          token: scope.$store.getters.getUserToken
        })
      })
      socket.on('authenticate response', function (data) {
        console.log('authenticate response', data)
      })
      socket.on('group message', function (data) {
        console.log('group message: ', data)
        scope.groupChats[data.chat_group_uuid].messages.push(data)
        Vue.nextTick(function () {
          var objDiv = document.getElementById(scope.chatContentId)
          objDiv.scrollTop = objDiv.scrollHeight
        })
      })
      socket.on('group message history', function (data) {
        console.log('group message history ', data)
        if (scope.currentGroup && !scope.currentGroup.messagesHistoryLoaded) {
          scope.currentGroup.messagesHistory = data.messages
          scope.currentGroup.messagesHistoryLoaded = true
        }
      })
      socket.on('group chats', function (data) {
        console.log('group chats ', data)
        var list = {}
        for (var i = 0; i < data.length; i++) {
          var gc = data[i]
          if (!gc.messages) {
            gc.messages = []
          }
          if (!gc.messagesHistory) {
            gc.messagesHistory = []
          }
          list[gc.uuid] = gc
        }
        Vue.set(scope, 'groupChats', list)
      })
      socket.on('group chats update', function (groups) {
        console.log('group chats update ', groups)
        for (var i = 0; i < groups.length; i++) {
          var g = groups[i]
          if (!g.messages) {
            g.messages = []
          }
          if (!scope.groupChats[g.uuid]) {
            Vue.set(scope.groupChats, g.uuid, g)
          }
          if (g.select) {
            Vue.set(scope, 'selectedGroupId', g.uuid)
            delete g.select
          }
        }
      })
      socket.on('disconnect', function () {
        scope.socketConnected = false
      })
    },
    userSelectClearAll () {
      this.userSelect.rows = []
    },
    //
    open: function (params) {
      this.show = true
      if (!params) {
        this.selectedGroupId = null
      } else {
        this.selectedGroupId = params
      }
    },
    close: function () {
      this.show = false
    }
  },
  mounted: function () {
    var scope = this
    window.AppMessaging = scope
    this.connect()
  },
  beforeDestroy: function () {

  }
}
</script>

<style>
.messaging-group-nav{cursor: pointer;}
.messaging-group-nav.active{background-color: rgb(227, 230, 240);}
.messaging-group-nav:hover{opacity: 0.5;}
</style>
