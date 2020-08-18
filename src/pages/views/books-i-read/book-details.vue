<template>
<div v-if="page.is_ready" class="page-book-details">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <h4>{{ properties.title }}</h4>
                <small>{{ $t('DATE_MODIFIED') }}: {{ properties.created_at }}</small>
            </div>
            <div class="actions">
              <button class="es-button-white" @click="markAsFinished()">{{$t('MARK_AS_FINISHED')}}</button>
              <button class="es-button-white" @click="markAsCanceled()">{{$t('MARK_AS_CANCEL')}}</button>
              <button class="es-button-white" @click="toggleNotes()">{{$t('MY NOTES').toUpperCase()}}</button>
            </div>
        </div>
        <span class="book-genre" v-for="genre in properties.genre" :key="genre.uuid">{{ genre.name }}</span>
    </div>
    <div class="es-page-content" style="position:relative;">
        <Note v-if="show_notes" :properties="{ book: properties, parent: properties, parent_name: 'book' }"></Note>
        <div class="es-panel">
            <h4>{{ $t('ABOUT') }}</h4>
            <div v-html="properties.about"></div>
        </div>

        <div class="es-panel" style="margin-top:10px; border:none; padding:0px; background:transparent;">
          <div class="feedback-wrap">
          <div class="feedbacks">
          <div class="head">
            {{$t('FEEDBACKS')}}
          </div>
          <div class="body">
            <template @click="openFeedback(feedback)" v-for="feedback in feedbacks" >
            <div :key="feedback.id"  v-if="isVisible(feedback)" v-bind:class="{'done' : feedback.is_done}" class="feedback-single">
              <div class="feedback-single-header">
                <strong class="author" >{{ feedback.author.alias }}</strong>
                <span class="date">{{ formatDate(feedback) }}</span>
                <div v-if="$store.getters.getAuthorID === properties.author_id">
                  <span @click="toggleMark(feedback)" v-if="!feedback.is_done" style="cursor:pointer; font-size:12px; border:1px solid #ccc; border-radius:3px; padding:3px 5px; background:#fff;">{{$t('MARK_AS_DONE')}}</span>
                  <span @click="toggleMark(feedback)" v-else style="cursor:pointer; font-size:12px; border:1px solid #fff; border-radius:3px; padding:3px 5px; background:#5bd05d; color:#fff;">{{$t('MARK_AS_UNDONE')}}</span>
                </div>
              </div>
              <div class="feedback-single-content-wrap" v-bind:class="{ 'open' : feedback.expand_content }">
                <p @click="expandFeedbackContent(feedback)" class="message" v-bind:class="{ 'ellipsis-3' : !feedback.expand_content }" v-html="feedback.message"></p>
              </div>
              <div class="feedback-single-replies-wrap " v-bind:class="{ 'open' : feedback.show_replies }">
                <div class="feedback-single-replies-header ">
                  <span @click="openFeedback(feedback)">{{ feedback.feedback_responses.length }} {{$t('REPLIES')}}</span>
                </div>
                <div class="feedback-single-replies">
                <div v-if="feedback.feedback_responses.length > 0" >
                  <div v-for="response in feedback.feedback_responses" :key="response.uuid" class="response-single">
                    <div class="feedback-single-replies-content" v-bind:class="{ 'open' : response.expand_content }">
                      <div class="feedback-response-single-header">
                        <strong style="font-size:14px;" class="author" >{{ response.author.alias }}</strong>
                        <span class="date">{{ formatDate(response) }}</span>
                      </div>
                      <p @click="expandFeedbackResponseContent(response)" class="message"  v-bind:class="{ 'ellipsis-3' : !response.expand_content }"  v-html="response.message"  style="font-size:14px;"></p>
                    </div>
                  </div>
                </div>
                <div v-else style="padding:10px; text-align:center;">
                  {{$t('NO_RESPONSE_FOR_THIS_FEEDBACK_YET')}}
                </div>
                <div class="" style="text-align:right;">
                  <form v-on:submit.prevent="sendReply(feedback)">
                    <textarea style="width:100%;" type="text" v-model="feedback.reponse_text"></textarea>
                    <button type="submit" class="es-button-white">{{$t('SUBMIT')}}</button>
                  </form>
                </div>
                </div>
              </div>
            </div>
            </template>
          </div>
          <div class="foot">
            <textarea  type="text" v-model="message"></textarea>
            <button @click="saveFeedback()" class="es-button-white">{{$t('SUBMIT')}}</button>
          </div>
        </div>
        </div>
        </div>
    </div>
</div>
</template>

<script>
import moment from 'moment'
import Note from '../../../components/Note'
const {ipcRenderer} = window.require('electron')

export default {
  name: 'books-i-read-book-details',
  props: ['properties'],
  data: function () {
    return {
      page: {
        is_ready: false,
        title: '',
        data: null
      },
      filter: 'all',
      selected: false,
      message: '',
      response: '',
      show_feedbacks: false,
      show_notes: false,
      export_book: this.$t('EXPORT').toUpperCase() + ' ' + this.$t('BOOK').toUpperCase(),
      feedbacks: []
    }
  },
  computed: {

  },
  components: {
    Note
  },
  methods: {
    reloadBookIReadPage (authorId) {
      const scope = this
      const remainingBooksIRead = scope.$store.getters.getBooksIReadByAuthor(authorId)
      if (remainingBooksIRead.length) {
        scope.TOGGLE_BOOK_I_READ(remainingBooksIRead[0], 'book', authorId)
      } else {
        scope.CHANGE_COMPONENT({tabKey: 'dashboard', tabComponent: 'dashboard', tabData: null, tabTitle: 'DASHBOARD'})
      }
    },
    markAsFinished () {
      const scope = this
      window.swal.fire({
        title: scope.$t('Mark as Finished ?'),
        text: scope.$t("Are you sure you've done reading?"),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.value) {
          scope.axios.post('http://localhost:3000/readers/mark-as-finished', {
            book_id: scope.properties.uuid,
            author_id: scope.$store.getters.getAuthorID,
            status: 1
          }).then(response => {
            if (response.data) {
              // console.log(response)
              window.swal.fire({
                position: 'center',
                icon: 'success',
                title: scope.$tc('Finished reading this book'),
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                const data = {
                  uuid: response.data.book.uuid,
                  author_id: response.data.author_id
                }
                scope.$store.dispatch('removeBookIReadFromList', data)
                scope.reloadBookIReadPage(scope.$store.getters.getAuthorID)
              })
            } else {
              console.error(response.data.message)
            }
          })
        }
      })
    },
    markAsCanceled () {
      const scope = this
      window.swal.fire({
        title: scope.$t('Mark as Canceled ?'),
        text: scope.$t("Please let the author know why you weren't able to finish the book:"),
        input: 'textarea',
        inputValue: '',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!'
          }
        },
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          scope.axios.post('http://localhost:3000/readers/mark-as-canceled', {
            book_id: scope.properties.uuid,
            author_id: scope.$store.getters.getAuthorID,
            reasons: result.value,
            status: 2
          }).then(response => {
            if (response.data) {
              window.swal.fire({
                position: 'center',
                icon: 'success',
                title: scope.$tc('Successfuly canceled reading this book'),
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                const data = {
                  uuid: response.data.book.uuid,
                  author_id: response.data.author_id
                }
                scope.$store.dispatch('removeBookIReadFromList', data)
                scope.reloadBookIReadPage(scope.$store.getters.getAuthorID)
              })
            } else {
              console.error(response.data.message)
            }
          })
        }
      })
    },
    updateBook () {
      var scope = this
      // scope.$parent.getBooks()
      // scope.$parent.changeComponent('book-form', scope.properties)
      scope.$parent.changeComponent('book-form', scope.properties, scope.properties.title, true)
      scope.$store.commit('addTab', { title: scope.properties.title, component: 'book-form', data: scope.properties })
    },

    deleteBook () {
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
          scope.axios
            .delete('http://localhost:3000/books/' + scope.properties.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeBookFromList', scope.properties)
                  scope.CHANGE_COMPONENT({tabKey: 'dashboard', tabComponent: 'dashboard', tabData: null, tabTitle: 'DASHBOARD'})
                })
              }
            })
        }
      })
    },
    exportBook: function () {
      const scope = this
      scope.export_book = scope.$t('LOADING').toUpperCase() + '....'

      let book = scope.properties

      ipcRenderer.send('EXPORT-DOCX-SHOW-BOOK-WINDOW', book)

      ipcRenderer.on('CHANGE-EXPORT-BOOK-BUTTON-NAME', function (event, data) {
        scope.export_book = scope.$t('EXPORT').toUpperCase() + ' ' + scope.$t('BOOK').toUpperCase()
      })
    },
    toggleFeedbacks: function () {
      let scope = this
      scope.show_feedbacks = !scope.show_feedbacks
    },
    toggleNotes: function () {
      let scope = this
      scope.show_notes = !scope.show_notes
    },
    formatDate: function (data) {
      return moment(data.created_at).calendar()
    },
    openFeedback: function (feedback) {
      if (!feedback.show_replies) {
        this.$set(feedback, 'show_replies', true)
      } else {
        this.$set(feedback, 'show_replies', false)
      }
    },
    expandFeedbackContent: function (feedback) {
      if (!feedback.expand_content) {
        this.$set(feedback, 'expand_content', true)
      } else {
        this.$set(feedback, 'expand_content', false)
      }
    },
    loadFeedbacks: function () {
      var scope = this
      scope.axios.get('http://localhost:3000/feedbacks/book/' + scope.properties.uuid)
        .then(function (response) {
          scope.feedbacks = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
        .finally(function () {
        // always executed
        })
    },
    isVisible: function (feedback) {
      var scope = this
      return (feedback.message !== null) && ((scope.filter === 'all') || (scope.filter === 'done' && feedback.is_done) || (scope.filter === 'undone' && !feedback.is_done))
    },
    saveFeedback: function () {
      var scope = this
      if (scope.message === '') {
        return
      }

      let feedback = {
        author_id: scope.$store.getters.getAuthorID,
        parent_id: scope.properties.uuid,
        parent: 'book',
        is_done: 0,
        message: scope.message
      }

      scope.axios
        .post('http://localhost:3000/feedbacks', feedback)
        .then(response => {
          if (response.data) {
            scope.message = ''
            scope.feedbacks.push(response.data)
          }
        })
    },
    sendReply: function (feedback) {
      var scope = this
      if (!feedback.reponse_text || feedback.reponse_text === '') {
        return
      }

      let data = {
        author_id: scope.$store.getters.getAuthorID,
        feedback_id: feedback.uuid,
        message: feedback.reponse_text
      }

      scope.axios
        .post('http://localhost:3000/feedback-responses', data)
        .then(response => {
          if (response.data) {
            scope.$set(feedback, 'reponse_text', '')
            feedback.feedback_responses.push(response.data)
          }
        })
    },
    toggleMark: function (feedback) {
      var scope = this
      scope.axios
        .post('http://localhost:3000/feedbacks/update-status', { uuid: feedback.uuid, is_done: feedback.is_done })
        .then(response => {
          if (response.data) {
            feedback.is_done = !feedback.is_done
          }
        })
    },
    toggleSeen: function (feedback) {
      var scope = this
      scope.axios
        .post('http://localhost:3000/feedbacks/seen', { uuid: feedback.uuid, is_seen: feedback.is_seen })
        .then(response => {
          if (response.data) {
            feedback.is_seen = !feedback.is_seen
          }
        })
    }
  },
  mounted () {
    var scope = this
    scope.page.title = scope.properties.title
    scope.page.data = scope.properties
    scope.page.is_ready = true
    scope.loadFeedbacks()
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.book-stats { padding-left:30px; }
.book-stats .heading { font-family:'Gotham Bold'; }
.book-stats ul { margin-top:5px; }
.book-genre { padding:3px 10px; font-size:12px; font-size:10px; font-family:'Crimson Roman Bold'; text-transform: uppercase; margin-right: 3px; }
.book-genre:nth-child(odd) { background:#e1e7fe; color:#9098c5; }
.book-genre:nth-child(even) { background:#feedda; color:#d6a67f; }

.es-page-head {
  height: 110px;
}

.feedback-wrap  { height: 520px;}
.feedback-wrap .feedbacks { position:relative; height:100%;}
.feedback-wrap .feedbacks .head {  position:relative; height:35px; line-height:35px; padding:0px 10px; background:#fff; border-bottom:1px solid #ccc; }
.feedback-wrap .feedbacks .body { height:calc(100% - 125px); overflow-y:auto; }
.feedback-wrap .feedbacks .body .feedback-single { background:#fff; border-bottom:1px solid #ccc; padding:0px 0px; padding-top:5px; }
.feedback-wrap .feedbacks .body .feedback-single.done { background:#d3eed8; }
.feedback-wrap .feedbacks .body .feedback-single .date { margin:0px; font-size:11px; color:#888; float:right; }
.feedback-wrap .feedbacks .body .feedback-single .message { margin:0px; font-style:italic;}
.feedback-wrap .feedbacks .foot { background:#fff; position:absolute; bottom:0px; left:0px; width:100%; height:90px; border-top:1px solid #ccc; padding:8px 5px; }
.feedback-wrap .feedbacks .foot  textarea { width:100%; padding:5px; font-size:12px; }
.feedback-wrap .feedbacks .foot  button { float:right; }

.feedback-single .feedback-single-header { padding:5px 15px; }
.feedback-single .feedback-single-content-wrap { cursor:pointer; padding:5px 15px; max-height:70px; overflow:hidden; margin-bottom:10px; }
.feedback-single .feedback-single-content-wrap.open { max-height: none !important; }

.feedback-single .feedback-single-replies-wrap { background:#efefef; }
.feedback-single .feedback-single-replies-wrap .feedback-single-replies-header { border-bottom:1px solid #ccc; padding:5px 10px; text-align:right; font-size:12px; }
.feedback-single .feedback-single-replies-wrap .feedback-single-replies-header span { cursor:pointer; }
.feedback-single .feedback-single-replies-wrap .feedback-single-replies { padding:5px 10px; text-align:left; font-size:12px; display:none; }
.feedback-single .feedback-single-replies-wrap.open .feedback-single-replies { display:block; }
.feedback-single .feedback-single-replies-wrap .feedback-single-replies-content { cursor:pointer; max-height:75px; overflow:hidden; margin-bottom:10px; }
.feedback-single .feedback-single-replies-wrap .feedback-single-replies-content.open { max-height:none !important;  }

@media only screen and (max-width: 968px) {
  .book-stats { display:none; }
}
</style>
