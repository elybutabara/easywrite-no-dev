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
              <div v-if="gm.author_uuid !== getAuthor.uuid" class="messaging-msg">{{gm.message}}
                <div class="messaging-msg-name">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div v-if="gm.author_uuid === getAuthor.uuid" class="messaging-msg own">{{gm.message}}
                <div class="messaging-msg-name own">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div style="clear: both;"></div>
              <div v-bind:style="{float: gm.author_uuid !== getAuthor.uuid?'left':'right'}" style="float: right;font-size: 9px;opacity: 0.4;margin-top: -9px;margin-bottom: 5px;">Seen by {{messageSeenBy(gm, i)}}</div>
              <div style="clear: both;"></div>
            </div>
            <div v-for="(gm, i) in groupMessages" v-bind:key="'gm-'+selectedGroupId+'-'+i" style="position: relative">
              <div v-if="gm.author_uuid !== getAuthor.uuid" class="messaging-msg">{{gm.message}}
                <div class="messaging-msg-name">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div v-if="gm.author_uuid === getAuthor.uuid" class="messaging-msg own">{{gm.message}}
                <div class="messaging-msg-name own">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div style="clear: both;"></div>
              <div v-bind:style="{float: gm.author_uuid !== getAuthor.uuid?'left':'right'}" style="float: right;font-size: 9px;opacity: 0.4;margin-top: -9px;margin-bottom: 5px;">Seen by {{messageSeenBy(gm, i)}}</div>
              <div style="clear: both;"></div>
            </div>
            <div style="clear: both;"></div>
          </div>
          <div style="position: absolute; padding-left: 200px; bottom: 0; width: 100%;">
            <div style="padding: 5px;">
              <textarea v-model="chatMessage" @keydown.enter.exact.prevent @keyup.enter.exact="sendChatMessage()" @keydown.enter.shift.exact="newline()" v-bind:id="textareaId" class="form-control" style="float: left; height: 30px; width: calc(100% - 65px); padding: 0 10px;" placeholder="Type a message..."></textarea>
              <button v-on:click="sendChatMessage()" class="btn es-button-white btn-secondary" style="float: left;margin-left: 5px;width: 60px;">Send</button>
            </div>
          </div>
          <div v-show="!showMembers" style="position: absolute; left: 210px; top: 10px; background: #000; color: #fff; width: 16px; height: 16px; border-radius: 50%; text-align: center; line-height: 16px; font-size: 10px;">
            <i v-on:click.prevent="showMembers=true" class="fa fa-users" title="View Members" style="cursor: pointer;"></i>
          </div>
          <div v-show="showMembers" style="position: absolute; left: 210px; top: 10px; background: rgb(245, 248, 250); color: #000; width: 200px; min-height: 200px; padding: 10px; border: 1px solid rgb(227, 230, 240);">
            <ul style="padding: 0; margin: 0;">
              <li v-for="m in currentGroup.members" v-bind:key="'gc-m-'+m.uuid" style="padding: 0; margin: 0; font-size: 12px; cursor: default;">
                {{m.author_alias}}
              </li>
            </ul>
            <button v-on:click.prevent="showMembers=false" type="button" aria-label="Close" class="close" style="position: absolute; top: 5px; right: 10px;"><span aria-hidden="true">×</span></button>
          </div>
        </div>
        <div style="position: absolute; left: 0; top: 0; height: 100%; width: 200px; background: #f5f8fa; border-right: 1px solid rgb(227, 230, 240);">
          <div style="padding: 5px;">
            <input v-model="groupsFilterTxt" type="text" class="form-control" placeholder="Search users &amp; groups..." />
          </div>
          <ul class="messaging-group-nav-list">
            <li v-for="(group, i) in sortedGroupChats" v-bind:key="'group-index'+i+'-'+group.uuid">
              <div v-bind:class="{active: selectedGroupId==group.uuid}" v-on:click.prevent="selectedGroupId=group.uuid" class="messaging-group-nav" style="">
                {{(group.uuid.indexOf('pm-')!==0?'[Group] ':'') + group.name}} {{group.unreadCount1}}
                <div v-if="group.unreadCount && group.unreadCount>0" style="position: absolute; top: 8px; right: 10px; background: red; width: 16px; height: 16px; line-height: 16px; text-align: center; color: #fff; border-radius: 50%; font-size: 10px;">{{group.unreadCount}}</div>
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
      showMembers: false,
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
      chatContentId: ('chat-content-' + Math.random()).replace('.', ''),
      textareaId: ('txt-' + Math.random()).replace('.', ''),
      groupsFilterTxt: ''
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
      if (!this.currentGroup) {
        return []
      }
      return this.currentGroup.messagesHistory
    },
    groupMessages: function () {
      if (!this.currentGroup) {
        return []
      }
      return this.currentGroup.messages
    },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    },
    sortedGroupChats: function () {
      var filtered = []
      for (var x in this.groupChats) {
        var gc = this.groupChats[x]
        if (gc.name.toLowerCase().indexOf(this.groupsFilterTxt.toLowerCase()) > -1) {
          filtered.push(gc)
        }
      }

      filtered.sort(function (a, b) {
        return b.last_activity - a.last_activity
      })

      return filtered
    }
  },
  watch: {
    selectedGroupId: function () {
      this.showMembers = false
      if (!this.selectedGroupId) {
        return
      }
      this.chatScrollBottom()
      if (!this.socketConnected) {
        return
      }
      this.socket.emit('group seen', {chat_group_uuid: this.selectedGroupId})
      if (!this.currentGroup.messagesHistoryLoaded) {
        this.socket.emit('group message history', {chat_group_uuid: this.selectedGroupId})
      }
      if (this.currentGroup.unreadCount > 0) {
        if (window.AppMain && window.AppMain.addNotificationCount) {
          window.AppMain.addNotificationCount(this.currentGroup.unreadCount * -1)
        }
        if (window.AppMessageCenterPopup && window.AppMessageCenterPopup.addNotificationCount) {
          window.AppMessageCenterPopup.addNotificationCount(this.currentGroup.unreadCount * -1)
          window.AppMessageCenterPopup.addMessagesCount(this.currentGroup.unreadCount * -1)
        }
        this.currentGroup.unreadCount = 0
      }
    }
  },
  methods: {
    recountUnread: function () {
      //
      var c = 0
      for (var x in this.groupChats) {
        var gc = this.groupChats[x]
        if (gc.unreadCount) {
          c += gc.unreadCount
        }
      }
      if (window.AppMain && window.AppMain.addNotificationKeyedCount) {
        window.AppMain.addNotificationKeyedCount('Group Chat', c)
      }
      if (window.AppMessageCenterPopup && window.AppMessageCenterPopup.addNotificationKeyedCount) {
        this.AppMessageCenterPopup.addNotificationKeyedCount('Group Chat', c)
        this.AppMessageCenterPopup.addMessagesKeyedCount('Group Chat', c)
      }
    },
    messageSeenBy: function (msg, i) {
      var members = this.currentGroup.members || []
      var seenBy = []
      var messageCreatedAt = moment(msg.created_at).format('x')
      for (var ii = 0; ii < members.length; ii++) {
        var m = members[ii]
        if (messageCreatedAt <= moment(m.last_seen_at)) {
          seenBy.push(m.author_alias)
        }
      }
      if (seenBy.length < 1) {
        return 'nobody'
      }
      return seenBy.join(', ')
    },
    chatScrollBottom: function () {
      var scope = this
      if (!this.selectedGroupId) {
        return
      }
      setTimeout(function () {
        var d = document.getElementById(scope.chatContentId)
        if (d) {
          d.scrollTop = d.scrollHeight
        }
      }, 10)
    },
    sendChatMessage: function () {
      if (!this.socketConnected) {
        return
      }
      if (this.chatMessage === '') {
        return
      }
      this.socket.emit('group message', {chat_group_uuid: this.selectedGroupId, message: this.chatMessage})
      this.chatScrollBottom()
      this.chatMessage = ''
    },
    newline: function () {
      this.chatMessage = this.chatMessage + '\n'
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

      socket.on('group seen', function (data) {
        var g = scope.groupChats[data.chat_group_uuid]
        console.log('group seen', data, g)
        if (!g.members) {
          Vue.set(g, 'members', [])
        }
        if (data.members) {
          Vue.set(g, 'members', data.members)
        }
        /*
        for (var i = 0; i < g.members.length; i++) {
          if (g.members[i].author_uuid === data.author_uuid) {
            g.members[i].last_seen_at = data.last_seen_at
          }
        }
        */
        g.members.push()
      })

      socket.on('group message', function (data) {
        console.log('group message: ', data)
        if (data.chat_group_uuid !== scope.selectedGroupId) {
          if (typeof scope.groupChats[data.chat_group_uuid].unreadCount === 'undefined') {
            scope.groupChats[data.chat_group_uuid].unreadCount = 0
          }
          scope.groupChats[data.chat_group_uuid].unreadCount++
          if (window.AppMain && window.AppMain.addNotificationCount) {
            window.AppMain.addNotificationCount(1)
          }
          if (window.AppMessageCenterPopup && window.AppMessageCenterPopup.addNotificationCount) {
            window.AppMessageCenterPopup.addNotificationCount(1)
            window.AppMessageCenterPopup.addMessagesCount(1)
          }
        }
        scope.groupChats[data.chat_group_uuid].messages.push(data)
        scope.groupChats[data.chat_group_uuid].last_activity = parseInt(moment(data.last_activity).format('x'))
        if (data.chat_group_uuid === scope.selectedGroupId) {
          scope.chatScrollBottom()
          scope.socket.emit('group seen', {chat_group_uuid: data.chat_group_uuid})
        }
      })

      socket.on('group message history', function (data) {
        console.log('group message history ', data)
        if (scope.currentGroup && !scope.currentGroup.messagesHistoryLoaded) {
          scope.currentGroup.messagesHistory = data.messages
          scope.currentGroup.messagesHistoryLoaded = true
        }
        if (data.chat_group_uuid === scope.selectedGroupId) {
          scope.chatScrollBottom()
        }
      })

      socket.on('group chats', function (data) {
        console.log('group chats ', data)
        var list = {}
        for (var i = 0; i < data.length; i++) {
          var g = data[i]
          if (!g.messages) {
            g.messages = []
          }
          if (!g.messagesHistory) {
            g.messagesHistory = []
          }
          if (!g.unreadCount) {
            g.unreadCount = 0
          }
          g.name = scope.groupChatDisplayName(g)
          g.last_activity = parseInt(moment(g.last_activity).format('x'))
          list[g.uuid] = g
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
          if (!g.messagesHistory) {
            g.messagesHistory = []
          }
          if (!g.unreadCount) {
            g.unreadCount = 0
          }
          g.name = scope.groupChatDisplayName(g)
          g.last_activity = parseInt(moment(g.last_activity).format('x'))
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
      this.selectedGroupId = null
    }
  },
  mounted: function () {
    var scope = this
    window.AppMessaging = scope
    this.connect()
  },
  beforeDestroy: function () {
    if (this.socketConnected) {
      this.socket.disconnect()
    }
    delete window.AppMessaging
    console.log('window.AppMessaging destroyed')
  }
}
</script>

<style>
.messaging-group-nav-list{padding: 0px;margin: 0px;overflow: auto;height: calc(100% - 85px);position: absolute;width: 100%;}
.messaging-group-nav-list > li{padding: 0; margin: 0;}
.messaging-group-nav{cursor: pointer; font-size: 12px; padding: 8px 15px; position: relative;}
.messaging-group-nav.active{background-color: rgb(227, 230, 240);}
.messaging-group-nav:hover{opacity: 0.5;}
.messaging-group-nav.active{background-color: rgb(227, 230, 240);}
.messaging-msg{float: left; clear: both; color: #fff; border-radius: 10px; background: #496d7d; font-size: 13px; padding: 5px 15px; margin-bottom: 10px; margin-top: 20px; white-space: pre-line;}
.messaging-msg.own{float: right; clear: both; color: #000; border-radius: 10px; background: rgb(227, 230, 240); font-size: 13px; padding: 5px 15px; margin-bottom: 10px; margin-top: 20px; white-space: pre-line;}
.messaging-msg-name{position: absolute; left: 0; top: 5px; opacity: 0.3; font-size: 90%; color: #000;}
.messaging-msg-name.own{position: absolute; left: initial; right: 0; top: 5px; opacity: 0.3; font-size: 90%;}
</style>
