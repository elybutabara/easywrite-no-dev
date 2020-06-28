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
        <div v-if="!selected_group_id">
          <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding-left: 200px; padding-bottom: 40px; background: #fff;">
            <div style="padding: 15px; border-bottom: 1px solid rgb(227, 230, 240);">
                <h6 style="margin: 0;">New Message</h6>
            </div>
            <div style="padding: 15px;">
                <div style="color: #c0c0c0; font-size: 13px;">You may select 1 user for private message or multiple users for group chat.</div>
                <multiselect v-model="userSelect.selected" id="ajax" label="name" track-by="id" placeholder="Select a user..." open-direction="bottom" :options="userSelect.rows" :multiple="true" :searchable="true" :loading="userSelect.isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :options-limit="300" :limit="3" :limit-text="userSelectLimitText" :max-height="600" :show-no-results="false" :hide-selected="true" @search-change="userSelectFind">
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
                  <button class="btn es-button-white btn-secondary">Next <i class="fa fa-arrow-right"></i></button>
                </div>
            </div>
          </div>
        </div>
        <div v-if="selected_group_id">
          <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding-left: 200px; padding-bottom: 40px; background: #fff;">
            <div style="padding: 15px;" v-if="selected_group_id == 1">
                <div style="float: left; clear: both; color: #fff; border-radius: 10px; background: #496d7d; font-size: 13px; padding: 5px 15px; margin-bottom: 10px;">Hey!</div>
                <div style="float: right; clear: both; color: #000; border-radius: 10px; background: rgb(227, 230, 240); font-size: 13px; padding: 5px 15px; margin-bottom: 10px;">Dummy reply...</div>
            </div>
            <div style="padding: 15px;" v-if="selected_group_id == 2">
                <div style="float: right; clear: both; color: #000; border-radius: 10px; background: rgb(227, 230, 240); font-size: 13px; padding: 5px 15px; margin-bottom: 10px;">Test Message...</div>
                <div style="float: left; clear: both; color: #fff; border-radius: 10px; background: #496d7d; font-size: 13px; padding: 5px 15px; margin-bottom: 10px;">Dummy reply test..</div>
            </div>
            <div style="padding: 15px;" v-if="selected_group_id == 3">
                <div style="float: left; clear: both; color: #fff; border-radius: 10px; background: #496d7d; font-size: 13px; padding: 5px 15px; margin-bottom: 10px;">Dummy chat..</div>
                <div style="float: right; clear: both; color: #000; border-radius: 10px; background: rgb(227, 230, 240); font-size: 13px; padding: 5px 15px; margin-bottom: 10px;">Dummy reply...</div>
                <div style="float: left; clear: both; color: #fff; border-radius: 10px; background: #496d7d; font-size: 13px; padding: 5px 15px; margin-bottom: 10px;">Dummy long chat.. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                <div style="float: right; clear: both; color: #000; border-radius: 10px; background: rgb(227, 230, 240); font-size: 13px; padding: 5px 15px; margin-bottom: 10px;">Dummy reply...</div>
                <div style="float: left; clear: both; color: #fff; border-radius: 10px; background: #496d7d; font-size: 13px; padding: 5px 15px; margin-bottom: 10px;">Dummy reply test..</div>
            </div>
          </div>
          <div style="position: absolute; padding-left: 200px; bottom: 0; width: 100%;">
            <div style="padding: 5px;">
            <textarea class="form-control" style="height: 30px; width: 100%; padding: 0 10px;" placeholder="Type a message..."></textarea>
            </div>
          </div>
        </div>
        <div style="position: absolute; left: 0; top: 0; height: 100%; width: 200px; background: #f5f8fa; border-right: 1px solid rgb(227, 230, 240);">
          <div style="padding: 5px;">
            <input type="text" class="form-control" placeholder="Search users &amp; groups..." />
          </div>
          <ul style="padding: 0; margin: 0;">
            <li v-for="(group, i) in groups" v-bind:key="'group-index-'+i" style="padding: 0; margin: 0;">
              <div v-bind:class="{active: selected_group_id==group.id}" v-on:click.prevent="selected_group_id=group.id" class="messaging-group-nav" style="font-size: 12px; padding: 8px 15px;">{{group.name}}</div>
            </li>
          </ul>
          <div style="position: absolute; bottom: 0; left: 0; width: 100%; text-align: center; padding: 5px;">
            <button class="btn es-button-white btn-secondary" v-on:click.prevent="selected_group_id=null"><i class="fa fa-plus"></i> New Message</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
// import Vue from 'vue'

export default {
  name: 'Messaging',
  props: ['params'],
  data: function () {
    // var scope = this
    var data = {
      show: false,
      groups: [
        {id: 3, name: 'John'},
        {id: 1, name: 'Luell Kearl'},
        {id: 2, name: 'Kenji'}
      ],
      userSelect: {
        groupName: '',
        selected: [],
        rows: [],
        isLoading: false
      },
      selected_group_id: null,
      window: window
    }
    return data
  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    //
    userSelectLimitText (count) {
      return `and ${count} other users`
    },
    userSelectFind (query) {
      var scope = this
      scope.userSelect.isLoading = true

      setTimeout(function () {
        scope.userSelect.rows = [
          {id: 3, name: 'John'},
          {id: 1, name: 'Luell Kearl'},
          {id: 2, name: 'Kenji'}
        ]
        scope.userSelect.isLoading = false
      }, 1)

      scope.axios
        .post('http://localhost:3000/chapter-versions/comment', scope.chapter_version)
        .then(response => {
          if (response.data) {
            //
          }
        })
    },
    userSelectClearAll () {
      this.userSelect.rows = []
    },
    //
    open: function (params) {
      this.show = true
      if (!params) {
        this.selected_group_id = null
      } else {
        this.selected_group_id = params
      }
    },
    close: function () {
      this.show = false
    }
  },
  mounted: function () {
    var scope = this
    window.AppMessaging = scope
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
