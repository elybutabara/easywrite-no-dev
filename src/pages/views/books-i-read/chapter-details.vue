<template>
<div>
    <div v-if="page.is_ready" class="page-chapter-details">
        <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <div>
                      <h4><strong>{{ chapter.title }}</strong></h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'books-i-read-chapter-listing', tabData: book, tabTitle: $tc('CHAPTER', 2) + ' - ' + book.title})">{{ $tc('CHAPTER', 2) }}</button>
            /
            <button class="current">{{ chapter.title }}</button>
        </div>
        <div class="es-chapter-details-tab">
            <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-chapter-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'scenes' }" @click="changeTab('scenes')" class="es-chapter-details-tab-item">{{$tc('SCENE', 2).toUpperCase()}}</div>
        </div>
        <div v-if="tab.active === 'content'"  class="es-chapter-details-tab-content">
            <div v-html="getChapterContent" class="description" v-commentbased="commentbased_params"></div>
        </div>
        <div v-if="tab.active === 'scenes'"  class="es-chapter-details-tab-content scene-listing">
            <books-i-read-chapter-scenes :properties="{ book: book, chapter: chapter }"></books-i-read-chapter-scenes>
        </div>
    </div>
</div>
</template>

<<script>
import TinyMCE from '../../../components/TinyMCE'
import ChapterScenes from '@/pages/views/chapters/chapter-scenes'
import ChapterVersions from '@/pages/views/chapters/chapter-versions'
import ChapterCompareVersions from '@/pages/views/chapters/chapter-compare-versions'
import moment from 'moment'
import Vue from 'vue'

const {ipcRenderer} = window.require('electron')

Vue.directive('commentbased', {
  unbind: function (el, binding) {
    console.log('binding: ', binding)
    if (binding.vm && binding.vm.$destroy) {
      binding.vm.$destroy()
    }
    if (document.getElementById(binding.commentbased_sidebar_id)) {
      document.getElementById(binding.commentbased_sidebar_id).remove()
    }
  },
  bind: function (el, binding) {
    console.log('binding: ', binding)
    binding.commentbased_sidebar_id = ('commentbased-sidebar-' + Math.random()).replace('.', '')
    document.body.insertAdjacentHTML('beforeend', `
    <div v-if="selected_comments_id !== null" id="` + binding.commentbased_sidebar_id + `" class="commentbased-comments" style="position: fixed; top: 0; right: 0; width: 300px; height: 100%; background: #fff; border-left: 1px solid #f1f1f1; padding: 5px 15px; margin: 0;">
      <br/>
      <br/>
      <div class="commentbased-comments-header" style="text-align: right;">
        <a href="#" v-on:click.prevent="selected_comments_id=null"><i class="fa fa-times"></i></a>
      </div>
      <div style="height: calc(100% - 175px); background: #fff; overflow-y: scroll;">
        <div v-for="(c, k) in comments[selected_comments_id]" v-bind:style="{'border': editingComment==k?'1px solid orange':'1px solid #f1f1f1'}" class="commentbased-comment" style="border: 1px solid #f1f1f1; padding: 15px; margin-bottom: 15px;">
          <div style="line-height: 0.8; position: relative;">
            <div class="c-pop-menu-btn" style="position: absolute; top: 0; right: 5px; border: 0 solid #c0c0c0;" v-on:click.prevent="showCommentActions=showCommentActions==k?null:k">
                <div style="text-align: right; padding: 0; font-weight: bold; cursor: pointer;">
                    <i class="fa fa-ellipsis-h"></i>
                    <div class="c-pop-menu" v-show="showCommentActions==k" style="display: block; background: #fff; border: 1px solid #f1f1f1; padding: 3px; border-radius: 3px; margin-top: -1px; line-height: 1.2; font-size: 12px;">
                        <div v-on:click="editComment(k, $event)" data-c-pop-menu-action="edit" style="text-align: center; color: #c0c0c0; font-weight: normal; cursor: pointer;">Edit</div>
                        <div v-on:click="deleteComment(k, $event)" style="text-align: center; color: #c0c0c0; font-weight: normal; cursor: pointer;">Delete</div>
                    </div>
                </div>
            </div>
            <span style="font-size: 11px; font-weight: bold;"> {{ c.user_name }}</span>
            <br/>
            <span style="font-size: 11px;"> {{ displayTime(c.created_at) }}</span>
          </div>
          <div style="margin-top: 8px; color: #c0c0c0;">
            {{ c.message }}
          </div>
        </div>
      </div>
      <div class="commentbased-comments-form" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px;">
        <textarea v-model="comment_message_new" class="commentbased-comment-new" style="width: 100%; border: 1px solid #f1f1f1;"></textarea>
        <div style="text-align: right;">
          <button v-on:click="pushComment($event)">Submit</button>
        </div>
      </div>
    </div>`)

    binding.vm = new Vue({
      el: '#' + binding.commentbased_sidebar_id,
      data: function () {
        var data = {
          selected_comments_id: null,
          comments: {},
          comment_message_new: '',
          author: {},
          showCommentActions: null,
          editingComment: null
        }
        return data
      },
      computed: {
        selected_comments: function () {
          return this.comments[this.selected_comments_id]
        }
      },
      watch: {
        selected_comments_id: function () {
          var scope = this
          this.comment_message_new = ''
          this.editingComment = null
          setTimeout(function () {
            scope.focusMessage()
          }, 10)
        }
      },
      methods: {
        displayTime: function (t) {
          var txt = moment(t).fromNow()
          txt = txt.replace('a few seconds ago', 'just now')
          return txt
        },
        focusMessage: function () {
          var elm = document.querySelector('.commentbased-comment-new')
          if (elm) {
            elm.focus()
          }
        },
        editComment: function (k, e) {
          e.preventDefault()
          this.editingComment = k
          this.comment_message_new = this.selected_comments[k].message
          Vue.nextTick(this.focusMessage)
        },
        deleteComment: function (k, e) {
          e.preventDefault()
          delete this.comments[this.selected_comments_id][k]
          binding.value.onAddComment()
        },
        setAuthor: function (author) {
          this.author = author
        },
        setCommentsJSON: function (commentsJson) {
          var c = JSON.parse(commentsJson || '{}')
          this.comments = c
        },
        getCommentsJSON: function () {
          return JSON.stringify(this.comments)
        },
        getContent: function () {
          return el.innerHTML
        },
        pushComment: function (e) {
          e.preventDefault()
          var scope = this

          var message = scope.comment_message_new

          //
          if (message === '') {
            return
          }

          // initialize comment array
          if (!scope.comments[scope.selected_comments_id]) {
            scope.comments[scope.selected_comments_id] = {}
          }

          if (scope.editingComment) {
            var k = scope.editingComment
            scope.comments[scope.selected_comments_id][k].message = message
            scope.comments[scope.selected_comments_id][k].updated_at = new Date().getTime()
          } else {
            // push comment object
            var k = 'c-' + new Date().getTime() + '-' + (Math.random() + '').replace('0.', '')
            scope.comments[scope.selected_comments_id][k] = {
              user_id: scope.author.id,
              user_name: scope.author.first_name,
              created_at: new Date().getTime(),
              message: message
            }
          }

          // console.log('scope.comments', scope.comments)

          //
          scope.comment_message_new = ''
          this.editingComment = null

          if (binding.value.onAddComment) {
            binding.value.onAddComment()
          }
        }
      },
      mounted: function () {
        if (binding.value && binding.value.onMounted) {
          binding.value.onMounted(this)
        }

        el.addEventListener('mouseup', function (e) {
          binding.vm.selected_comments_id = null
          if (e.target && e.target.matches('.commentbase-comment-highlight')) {
            binding.vm.selected_comments_id = e.target.dataset.commentsId
            return
          }
          var sel, range
          var id = ('comments-' + Math.random()).replace('.', '')

          if (window.getSelection) {
            sel = window.getSelection()
            if (sel.getRangeAt && sel.rangeCount) {
              range = window.getSelection().getRangeAt(0)

              if (range.toString().trim() === '') {
                return
              }

              binding.vm.selected_comments_id = id

              var html = '<span class="commentbase-comment-highlight" style="font-weight: inherit; background: orange; color: #fff;" data-comments-id="' + id + '">' + range + '</span>'
              range.deleteContents()

              var el = document.createElement('div')
              el.innerHTML = html
              var frag = document.createDocumentFragment()
              var node
              while ((node = el.firstChild)) {
                frag.appendChild(node)
              }
              range.insertNode(frag)
            }
          }
        })
      }
    })
  }
})

export default {
  name: 'chapter-details',
  props: ['properties'],
  data: function () {
    var scope = this
    return {
      chapter_version: {
        chapter_id: null,
        content: '',
        change_description: ''
      },
      page: {
        title: '',
        is_ready: false,
        data: null
      },
      tab: {
        active: 'content'
      },
      busy: false,
      tempVersionDesc: '',
      commentbased_params: {
        onMounted: (vm) => {
          scope.commentbased_vm = vm
          vm.setAuthor(this.getAuthor)
          vm.setCommentsJSON(this.comments)
        },
        onAddComment: function () {
          scope.saveComments()
        }
      }
    }
  },
  components: {
    TinyMCE,
    ChapterScenes,
    ChapterVersions,
    ChapterCompareVersions
  },
  computed: {
    getChapterContent: function () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid
      return this.$store.getters.getChapterContent(chapterID)
    },
    comments: function () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid
      return this.$store.getters.getChapterComments(chapterID)
    },
    book: function () {
      return this.properties.book
    },
    chapter: function () {
      return this.properties.chapter
    },
    test: function () {
      var stillUtc = moment.utc('2020-04-09 13:51:40').toDate()
      var date = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss')
      return moment('2020-04-09 21:51:40').utc().format('YYYY-MM-DD HH:mm:ss').toString() + ' ---> ' + date
    },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    }
  },
  methods: {
    // Required for geting value from TinyMCE content
    setDescription (value) {
      var scope = this
      scope.tempVersionDesc = value
    },
    changeTab: function (active) {
      var scope = this
      scope.tab.active = active
    },
    saveComments () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid

      scope.chapter_version.chapter_id = chapterID
      scope.chapter_version.uuid = this.$store.getters.getChapterVersionUUID(chapterID)
      scope.chapter_version.change_description = scope.tempVersionDesc
      scope.chapter_version.content = this.commentbased_vm.getContent()
      scope.chapter_version.comments = this.commentbased_vm.getCommentsJSON()

      /*
      var data = Object.assign({}, scope.chapter_version, {
        chapter_id: chapterID,
        uuid: this.$store.getters.getChapterVersionUUID(chapterID),
        change_description: scope.tempVersionDesc,
        content: this.commentbased_vm.getContent(),
        comments: this.commentbased_vm.getCommentsJSON()
      })
      */

      scope.axios
        .post('http://localhost:3000/chapter-versions/comment', scope.chapter_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            scope.$store.dispatch('loadVersionsByChapter', scope.page.data.chapter.uuid)
            this.busy = false
            /*
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('CHAPTER') + ' ' + this.$t('VERSION') + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.tab.active = 'content'
            })
            */
          }
        })
    }
  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this

    scope.page.data = scope.properties
    scope.page.title = scope.properties.chapter.title
    // console.log('PROPERTIES')
    // console.log(scope.properties)
    scope.$store.dispatch('loadScenesByChapter', scope.properties.chapter.uuid)
    scope.$store.dispatch('loadVersionsByChapter', scope.properties.chapter.uuid)

    setTimeout(function () {
      Vue.nextTick(function () {
        scope.page.is_ready = true
        scope.changeTab('content')
      })
    }, 300)
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .export-content{ text-align: right; margin-bottom: 20px;}
    .btn-edit { float:right; background:#fff; border:1px solid #506d84; }
    /*.chapter-scenes-list .item { font-family: 'Crimson Roman Bold'; border:1px solid #354350; border-top:none; padding:0px 20px; height:35px; line-height:35px}*/
    /*.chapter-scenes-list .item:first-child { border-top:1px solid #354350;  }*/

    .image-container { text-align: center; }
    .image-container img { width:100%; max-width:250px; }

    .es-chapter-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
    .es-chapter-details-tab .es-chapter-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
    .es-chapter-details-tab .es-chapter-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
    .es-chapter-details-tab .es-chapter-details-tab-item.active:after { background:#922c39;  }

    .es-chapter-details-tab-content { position:relative; padding:30px; background:#fff; height:calc(100vh - 247px); overflow-y:auto; display:block; }
    .es-chapter-details-tab-content.no-padding { padding:0px; }
    .es-chapter-details-tab-content.active { display:block; }
</style>
