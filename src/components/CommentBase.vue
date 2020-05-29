
<script>
import moment from 'moment'
import Vue from 'vue'

export default {
  unbind: function (el, binding) {
    if (binding.vm && binding.vm.$destroy) {
      binding.vm.$destroy()
    }
    if (document.getElementById(binding.commentbase_sidebar_id)) {
      document.getElementById(binding.commentbase_sidebar_id).remove()
    }
  },
  bind: function (el, binding) {
    // console.log('binding: ', binding)
    binding.commentbase_sidebar_id = ('commentbase-sidebar-' + Math.random()).replace('.', '')
    document.body.insertAdjacentHTML('beforeend', `
    <div v-if="selected_comments_id !== null" id="` + binding.commentbase_sidebar_id + `" class="commentbase-comments" style="position: fixed; bottom: 0; right: 37px; width: 300px; height: calc(100% - 337px); background: #324553; border-left: 1px solid #f1f1f1; padding: 5px 15px; margin: 0;">
      <div class="commentbase-comments-header" style="text-align: right;">
        <a href="#" v-on:click.prevent="close($event)"><i class="fa fa-times"></i></a>
      </div>
      <div style="height: calc(100% - 127px); background: #fff; overflow-y: auto;">
        <div v-for="(c, k) in comments[selected_comments_id]" v-bind:style="{'border': editingComment==k?'1px solid orange':'1px solid #f1f1f1'}" class="commentbase-comment" style="border: 0; border: 1px solid #f1f1f1; padding: 15px; margin-bottom: 0;">
          <div style="line-height: 0.8; position: relative;">
            <div v-if="c.user_id==author.id" class="c-pop-menu-btn" style="position: absolute; top: 0; right: 5px; border: 0 solid #c0c0c0;" v-on:click.prevent="showCommentActions=showCommentActions==k?null:k">
                <div style="text-align: right; padding: 0; font-weight: bold; cursor: pointer;">
                    <i class="fa fa-ellipsis-h"></i>
                    <div class="c-pop-menu" v-show="showCommentActions==k" style="display: block; background: #293742; border: 1px solid #293742; padding: 3px; border-radius: 3px; margin-top: -1px; line-height: 1.2; font-size: 12px;">
                        <div v-on:click="editComment(k, $event)" style="text-align: center; color: #fff; font-weight: normal; cursor: pointer;">Edit</div>
                        <div v-on:click="deleteComment(k, $event)" style="text-align: center; color: #fff; font-weight: normal; cursor: pointer;">Delete</div>
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
      <div class="commentbase-comments-form" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px;">
        <textarea v-model="comment_message_new" class="commentbase-comment-new" style="width: 100%; border: 1px solid #f1f1f1;"></textarea>
        <div style="text-align: right;">
          <button v-on:click="pushComment($event)" class="es-button-white">Submit</button>
          <button v-on:click="cancelCommentEdit($event)" v-if="editingComment" class="es-button-white">Cancel</button>
        </div>
      </div>
    </div>`)

    binding.vm = new Vue({
      el: '#' + binding.commentbase_sidebar_id,
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
          this.showCommentActions = null
          setTimeout(function () {
            scope.focusMessage()
          }, 10)
        }
      },
      methods: {
        close: function (e) {
          this.checkSelectedComments(true)
          this.selected_comments_id = null
        },
        displayTime: function (t) {
          var txt = moment(t).fromNow()
          txt = txt.replace('a few seconds ago', 'just now')
          return txt
        },
        focusMessage: function () {
          var elm = document.querySelector('.commentbase-comment-new')
          if (elm) {
            elm.focus()
          }
        },
        checkSelectedComments: function (removeIfEmpty) {
          var scope = this
          var highlightedItems = document.querySelectorAll('[data-comments-id]')
          highlightedItems.forEach(function (item) {
            var id = item.dataset.commentsId
            var selectedComments = scope.comments[id]
            var c = 0
            // eslint-disable-next-line no-unused-vars
            for (var x in selectedComments) {
              c++
            }
            console.log('item ', item)
            if (c > 0) {
              item.style.color = '#fff'
              item.style.background = 'orange'
            } else {
              if (removeIfEmpty === true) {
                item.style.color = null
                item.style.background = null
              } else {
                item.style.color = '#000'
                item.style.background = 'yellow'
              }
            }
          })
        },
        cancelCommentEdit: function () {
          this.editingComment = null
          this.comment_message_new = ''
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
          this.editingComment = null
          this.comment_message_new = ''
          this.checkSelectedComments()
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
            // update comment
            var c = scope.comments[scope.selected_comments_id][scope.editingComment]
            c.message = message
            c.updated_at = new Date().getTime()
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

          //
          this.checkSelectedComments(true)

          //
          scope.comment_message_new = ''
          this.editingComment = null

          if (binding.value.onAddComment) {
            binding.value.onAddComment()
            scope.focusMessage()
          }
        }
      },
      mounted: function () {
        if (binding.value && binding.value.onMounted) {
          binding.value.onMounted(this)
        }

        // add highlight to the selected texts and/or open the comments sidebar
        el.addEventListener('mouseup', function (e) {
          binding.vm.selected_comments_id = null
          if (e.target && e.target.matches('.commentbase-comment-highlight')) {
            binding.vm.selected_comments_id = e.target.dataset.commentsId
            binding.vm.selected_comments_target = e.target
            binding.vm.checkSelectedComments()
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

              var html = '<span class="commentbase-comment-highlight" style="font-weight: inherit; background: yellow; color: #000;" id="' + id + '" data-comments-id="' + id + '">' + range + '</span>'
              range.deleteContents()

              var el = document.createElement('div')
              el.innerHTML = html
              var frag = document.createDocumentFragment()
              var node
              while ((node = el.firstChild)) {
                frag.appendChild(node)
              }
              range.insertNode(frag)

              binding.vm.selected_comments_target = document.querySelector('[data-comments-id="' + id + '"]')[0]

            }
          }
        })
      }
    })
  }
}
</script>

<style>
.commentbase-comment-highlight {font-weight: inherit; background: orange; color: #fff;}
</style>
