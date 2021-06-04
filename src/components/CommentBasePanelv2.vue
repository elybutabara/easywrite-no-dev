<template>
<div class="comment-wrap mb-3" v-if="page.is_ready">
  <div class="es-panel-2 comments">
    <div class="es-panel-head d-flex justify-content-between">
      <div class="d-flex algin-items-center"><h5>Comments</h5></div>
      <div class="d-flex">
        <a @click="$parent.toggleComments()" href="javascript:void(0);" class="btn-close-comment close"><i class="las la-arrow-circle-right"></i></a>
      </div>
    </div>
    <div class="es-panel-body p-0 rounded-0" id="custom-scrollbar">
        <div v-if="comments.length">
            <template v-for="comment in comments" >
                <div :key="comment.id" class="comment-single" :class="{'selected-comment' : selected_comment_id === comment.id}"
                     style="cursor: pointer" @click="highlightContentText(comment)" >
                    <div class="comment-single-header">
                        <div class="left">
                            <a class="es-avatar mr-2" href="javascript:void(0);">
                                <i class="las la-user"></i>
                            </a>
                        </div>
                        <div class="right w-100">
                            <div class="d-flex justify-content-between">
                                <div class="d-flex align-items-center mb-1">
                                    <a class="es-avatar" style="margin-right: 6px;" href="javascript:void(0);"><i class="las la-user"></i></a>
                                    <strong v-if="comment.author && comment.author.alias">{{ comment.author.alias }}</strong>
                                    <strong v-else>{{ $t('Anonymous') }}</strong>
                                </div>
                                <span class="date">{{ formatDate(comment) }}</span>
                            </div>
                            <div class="comment-single-content-wrap" v-bind:class="{ 'open' : comment.expand_content }">
                                <p @click="expandCommentContent(comment)" class="message" v-bind:class="{ 'ellipsis-3' : !comment.expand_content }" v-html="comment.comment"></p>
                            </div>
                            <div class="comment-single-replies-header">
                                <div class="d-flex">
                                  <div class="d-flex"><a @click="openSubComment(comment)" class="btn-comment-option" href="javascript:void(0);"><i class="las la-reply"></i> {{ comment.sub_comments.length }} <span>Replies</span></a></div>
                                  <div class="d-flex" v-if="$store.getters.getAuthorID === comment.author_id">
                                    <a @click="modifyComment(comment)" class="btn-comment-option" href="javascript:void(0);"><i class="las la-pencil-alt"></i></a>
                                    <a @click="deleteComment(comment)" class="btn-comment-option" href="javascript:void(0);"><i class="las la-trash-alt"></i></a>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="comment-single-replies-wrap" v-bind:class="{ 'open' : comment.show_sub_comments }">
                        <div class="comment-single-replies">
                            <div v-if="comment.sub_comments.length > 0">
                                <div v-for="sub_comment in comment.sub_comments" :key="sub_comment.uuid" class="response-single">
                                    <div class="comment-single-replies-content" v-bind:class="{ 'open' : sub_comment.expand_content }">
                                        <div class="d-flex justify-content-between">
                                            <div class="d-flex align-items-center mb-1">
                                                <a class="es-avatar" style="margin-right: 6px;" href="javascript:void(0);"><i class="las la-user"></i></a>
                                                <strong v-if="sub_comment.author && sub_comment.author.alias">{{ sub_comment.author.alias }}</strong>
                                                <strong v-else>{{ $t('Anonymous') }}</strong>
                                            </div>
                                            <span class="date">{{ formatDate(sub_comment) }}</span>
                                        </div>
                                        <p @click="expandCommentContent(sub_comment)" class="message"  v-bind:class="{ 'ellipsis-3' : !sub_comment.expand_content }"  v-html="sub_comment.comment"></p>
                                    </div>
                                    <div v-if="$store.getters.getAuthorID === sub_comment.author_id" class="d-flex">
                                        <a @click="modifySubComment(comment, sub_comment)" class="btn-comment-option" href="javascript:void(0);"><i class="las la-pencil-alt"></i>{{$t('EDIT')}}</a>
                                        <a @click="deleteComment(sub_comment)" class="btn-comment-option" href="javascript:void(0);"><i class="las la-trash-alt"></i>{{$t('DELETE')}}</a>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="no-response-wrap">
                                <div class="no-response">
                                    <i class="las la-comment-slash"></i> No response for this comment yet.
                                </div>
                            </div>
                            <div class="p-15px">
                                <form v-on:submit.prevent="sendReply(comment)" class="textarea-wrap">
                                    <textarea style="width:100%;" v-model="sub_comment_msg" placeholder="Write a reply.."></textarea>
                                    <button v-if="main_comment_id != null" type="submit"
                                            class="send-icon"><i class="las la-paper-plane" @click="sendReply(comment)"></i></button>
                                    <!--<button v-else type="submit" class="send-icon"><i class="las la-paper-plane"></i></button>-->
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div v-else class="no-comments-wrap">
            <div class="no-comments">
              <i class="las la-comment"></i> There are no comments yet.
            </div>
        </div>
    </div>
    <div class="foot">
      <div class="textarea-wrap">
        <textarea v-model="comment_msg" type="text" placeholder="Write your comment here.."></textarea>
        <a class="send-icon" v-on:click="saveComment()"  href="javascript:void(0);"><i class="las la-paper-plane"></i></a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// In renderer process (web page).
// import moment from 'moment'

import moment from 'moment'

export default {
  name: 'CommentBasePanel',
  props: ['properties', 'dom'],
  data () {
    var scope = this
    var data = {
      window: window,
      page: {
        is_ready: false
      },
      selection: '',
      selected_comments_target: '',
        selected_comment_id: null,
      comment_id: null,
        comment_uuid: null,
        sub_comment_uuid: null,
      comment_msg: '',
        main_comment_id: null,
      sub_comment_id: null,
      sub_comment_comment_id: null,
      sub_comment_msg: '',
      comment_start_point: '',
      comment_end_point: '',
      comments: []
    }
    return data
  },
  components: {
  },
  computed: {
  },
  methods: {
    formatDate: function (data) {
      return moment(data.created_at).calendar()
    },
    attachCommentor: function (el) {
      var scope = this

      window.$(document).on('click', function (e) {
        e.preventDefault()

        if(window.$(e.target).parents('.swal2-container').length || window.$(e.target).hasClass('swal2-container')) {
          return
        }

        if (window.$(e.target).closest('#' + el.id).length === 0 && !window.$(e.target).hasClass('view-comments') && !window.$(e.target).parents('.show_comments').length && !window.$(e.target).hasClass('btn-close-comment')) {
          scope.toggleCommentPannel(el)
        }

        if (!window.$('.comment-wrap').hasClass('show_comments')) {
          scope.removeHighlightedText()
          scope.$parent.show_comments = false
        }
      })

      // add highlight to the selected texts and/or open the comments sidebar
      el.addEventListener('mouseup', function (e) {
        e.preventDefault()

        scope.toggleCommentPannel(el)
      })
    },
    toggleCommentPannel (el) {
      var scope = this

      var node
      if(window.getSelection) {
        node = window.getSelection().anchorNode
      }
      else if(document.getSelection) {
        node = window.getSelection().anchorNode
      }


      if (!node || window.$(node.parentNode).closest('#' + el.id).attr('id') != el.id) {
        scope.removeHighlightedText()
        scope.$parent.show_comments = false
        return
      }

      // console.log(window.$(window.getSelection().baseNode).closest('#' + el.id).attr('id') != el.id)
      // console.log(window.getSelection().baseNode)
      // if (window.$(window.getSelection().baseNode).closest('#' + el.id).attr('id') != el.id) {
      //   scope.removeHighlightedText()
      //   scope.$parent.show_comments = false
      //   return
      // }

      var selectedText = scope.getHighlightedText()

      if (!selectedText) {
        scope.removeHighlightedText()
        scope.$parent.show_comments = false
        return
      }

      var rangeOfSel = scope.findRangeOfSel(el, window.getSelection())

      if (rangeOfSel) {
        scope.comment_start_point = rangeOfSel[0]
        scope.comment_end_point = rangeOfSel[1]

        this.highlightText()
        scope.$parent.show_comments = true
        console.log('scope.$parent.show_comments', scope.$parent.show_comments)
      }
    },
    removeHighlightedText () {
      var highlightedItems = window.document.querySelectorAll('.new-commentbase-comment-highlight')
      if (highlightedItems) {
        this.comment_start_point  = ''
        this.comment_end_point = ''
        highlightedItems.forEach(function (item) {
          var currText = window.$(item).html()
          var parentText = window.$(item.parentNode).html()
          window.$(item.parentNode).html(parentText.replace(item.outerHTML, currText))
        })
      }
    },
    getTextNodesIn (node) {
      var textNodes = []
      if (node.nodeType == 3) {
        textNodes.push(node)
      } else {
        var children = node.childNodes
        for (var i = 0, len = children.length; i < len; ++i) {
          textNodes.push.apply(textNodes, this.getTextNodesIn(children[i]))
        }
      }
      return textNodes
    },
    highlightContentText (comment) {
      console.log('comment', comment)
      var scope = this
      scope.removeHighlightedText()
        scope.selected_comment_id = comment.id;

      this.comment_start_point  = comment.start_point
      this.comment_end_point = comment.end_point

      var el = scope.dom
      var str = window.$('#' + el.id).text()
      //var str = window.$('#' + el.id).html() // old code is using .text()

      var span = document.createElement('span')
      span.id = 'cm-' + comment.uuid
      span.className = 'new-commentbase-comment-highlight'
      span.setAttribute('style', 'font-weight: inherit; color: #000; background: yellow;')
      span.setAttribute('data-comments-id', 'cm-' + comment.uuid)

      span.append(str.substr(comment.start_point, comment.end_point - comment.start_point))
      //span.append(str.substr(comment.start_point, comment.end_point - comment.start_point + 1)) - old code

      str = str.substr(0, comment.start_point) + span.outerHTML + str.substr(comment.end_point)
      //str = str.substr(0, comment.start_point) + span.outerHTML + str.substr(comment.end_point + 1) - old code
        el.style="white-space: break-spaces;";
      scope.dom.innerHTML = str;
      //scope.dom.innerHTML = str.replace(/&lt;/g, "<").replace(/&gt;/g, ">"); // old don't have replace
    },
    highlightText () {
      console.log(this.comment)
      var id = ('comments-' + Math.random()).replace('.', '')
      var range = window.getSelection().getRangeAt(0)

      var span = document.createElement('span')
      span.id = id
      span.className = 'new-commentbase-comment-highlight'
      span.setAttribute('style', 'font-weight: inherit; color: #000; background: yellow;')
      span.setAttribute('data-comments-id', id)

      // Move the contents of the selection into the container
      span.appendChild(range.extractContents())

      range.insertNode(span)

      this.selected_comments_target = this.window.document.querySelector('[data-comments-id="' + id + '"]')
    },
    findRangeOfSel (el, sel) {
      let range = []
      range[0] = this.findIndexOfSymbol(el, sel.focusNode, sel.focusOffset)
      range[1] = this.findIndexOfSymbol(el, sel.anchorNode, sel.anchorOffset)
      range.sort((a, b) => a - b) // rtl or ltr selection gives same result
      return range
    },
    findIndexOfSymbol (el, node, offset) {
      node = node.parentNode == el ? node : node.parentNode
      let nodes = [...el.childNodes]
      let index = nodes.indexOf(node)
      let num = 0
      for (let i = 0; i < index; i++) {
          // check if node is text type then count the text, if not then the outerHTML length of the element
          //num += nodes[i].nodeType === 3 ? nodes[i].textContent.length : nodes[i].outerHTML.length
          // old code, which do not include the html tags on the count
          num += nodes[i].textContent.length
      }
      return num + offset
    },
    getHighlightedText () {
      var selectedText = ''

      // window.getSelection
      if (window.getSelection) {
        selectedText = window.getSelection()
      }
      // document.getSelection
      else if (document.getSelection) {
        selectedText = document.getSelection()
      }
      else if (document.selection) {   // Internet Explorer before version 9
        selectedText = document.selection.createRange().text
      }
      else {
        return false
      }

      if (!selectedText) { // window.getSelection
        return false
      }

      if(!document.selection) {
        var range = selectedText.getRangeAt(0)

        if (range.toString().trim() === '' || selectedText.toString().trim() === '') {
          return false
        }
      }

      return true
    },
    openSubComment: function (comment) {
        this.main_comment_id = comment.uuid; // set the comment id

        /*$.each(this.comments, function(k, v){

        });*/

      if (!comment.show_sub_comments) {
          this.comments.map(function(listedComment) {
              listedComment.show_sub_comments = listedComment.uuid === comment.uuid;
              return listedComment;
          });
        //this.$set(comment, 'show_sub_comments', true)
      } else {
          this.$set(comment, 'show_sub_comments', false)
      }
    },
      expandCommentContent: function(comment) {
          if (!comment.expand_content) {
              this.$set(comment, 'expand_content', true)
          } else {
              this.$set(comment, 'expand_content', false)
          }
      },
    modifyComment(comment) {
      var scope = this
      scope.comment_msg = comment.comment
      scope.comment_id = comment.id
        scope.comment_uuid = comment.uuid
      scope.comment_start_point = comment.start_point
      scope.comment_end_point = comment.end_point
      scope.author_id = scope.$store.getters.getAuthorID
      scope.highlightContentText(comment)
    },
      modifySubComment(maincomment, subcomment) {
        this.main_comment_id = maincomment.uuid;
        this.sub_comment_id = subcomment.id;
        this.sub_comment_uuid = subcomment.uuid;
        this.sub_comment_msg = subcomment.comment;
      },
    deleteComment(comment) {
      var scope = this
      window.swal.fire({
        title: this.$t('ARE_YOU_SURE'),
        text: this.$t('YOU_WONT_BE_ABLE_TO_REVERT_THIS'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('YES_DELETE_IT'),
        cancelButtonText: this.$t('CANCEL')
      }).then((result) => {
        if (result.value) {
          scope.axios.delete('http://localhost:3000/comments/' + comment.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeCommentFromList', comment)

                  scope.loadComments()
                })
              }
            })
        }
      })
    },
    saveComment () {
      var scope = this

      if (scope.comment_msg === '' || (scope.comment_start_point  === '' && scope.comment_end_point  === '')) {
        return
      }

      let comment = {
        id: scope.comment_id,
          uuid: scope.comment_uuid,
        comment_id: null,
        author_id: scope.$store.getters.getAuthorID,
        parent_id: scope.properties.parent.uuid,
        parent: scope.properties.parent_name,
        start_point: scope.comment_start_point,
        end_point: scope.comment_end_point,
        comment: scope.comment_msg,
        status: 'active'
      }

      scope.axios
        .post('http://localhost:3000/comments/', comment)
        .then(response => {
          if (response.data) {
            if (scope.comment_id === null) {
              scope.$store.dispatch('addCommentToList', response.data)
            } else {
              scope.$store.dispatch('updateCommentInList', response.data)
            }
            scope.loadComments()
            scope.comment_id = null
              scope.comment_uuid = null
            scope.comment_msg = ''
          }
        })
    },
    sendReply(comment) {
      let scope = this;

        if (scope.sub_comment_msg === '' || scope.main_comment_id === null) {
            return
        }

        let reply = {
            id: scope.sub_comment_id,
            uuid: scope.sub_comment_uuid,
            comment_id: scope.main_comment_id,
            author_id: scope.$store.getters.getAuthorID,
            parent_id: scope.properties.parent.uuid,
            parent: scope.properties.parent_name,
            start_point: comment.start_point,  // store same as the parent comment
            end_point: comment.end_point,  // store same as the parent comment
            comment: scope.sub_comment_msg,
            status: 'active'
        };

        scope.axios
            .post('http://localhost:3000/comments/', reply)
            .then(response => {
                if (response.data) {
                    scope.$store.dispatch('updateCommentInList', response.data);
                    let index = scope.comments.findIndex(listedComment => listedComment.uuid === comment.uuid);
                    scope.comments[index].show_sub_comments = true;

                    scope.sub_comment_id = null;
                    scope.sub_comment_uuid = null;
                    scope.sub_comment_msg = ''
                }
            })
    },
    loadComments() {
      this.comments = this.properties.parent_name === 'chapter'
          ? this.$store.getters.getCommentsByChapter(this.properties.parent_id)
          : this.$store.getters.getCommentsByScene(this.properties.parent_id);
    }
  },
  async mounted () {
    var scope = this

    console.log('AuthorID', scope.$store.getters.getAuthorID)
    scope.attachCommentor(scope.dom)
    scope.loadComments()
      console.log('comments', scope.comments)
    scope.page.is_ready = true

      if (scope.properties.selected_comment) {
          scope.highlightContentText(scope.properties.selected_comment);

          if (scope.properties.is_reply) {
              let index = scope.comments.findIndex(listedComment => listedComment.uuid === scope.properties.selected_comment.uuid);
              scope.comments[index].show_sub_comments = true;
              scope.main_comment_id = scope.comments[index].uuid;
          }
      }

  }
}
</script>

<style>
    .comment-single-replies-content {
        max-height: 80px !important; /*increase max height of the container for ellipses*/
    }

    .selected-comment {
        background-color: #ddd !important;
    }
</style>