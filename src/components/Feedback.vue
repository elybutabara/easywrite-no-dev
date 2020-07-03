<template>
<div style="z-index:3000;">
    <div class="feedback-wrap">
      <div class="feedbacks">
        <div class="head">
          Feedbacks
          <select v-model="filter" v-if="$store.getters.getAuthorID === properties.book.author_id" style="position:absolute; top:7px; right:50px;">
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="undone">Undone</option>
          </select>
          <span @click="$parent.toggleFeedbacks()" style="cursor:pointer; width:30px; height:30px; line-height:30px; text-align:center; position:absolute; background:#922c39; color:#fff; top:2px; right:5px;">X</span>
        </div>
        <div class="body">
          <template @click="openFeedback(feedback)" v-for="feedback in feedbacks" >
          <div :key="feedback.id"  v-if="isVisible(feedback)" v-bind:class="{'done' : feedback.is_done}" class="feedback-single">
            <div class="feedback-single-header">
              <strong class="author" >{{ feedback.author.alias }}</strong>
              <span class="date">{{ formatDate(feedback) }}</span>
              <div v-if="$store.getters.getAuthorID === properties.book.author_id">
                <span @click="toggleMark(feedback)" v-if="!feedback.is_done" style="cursor:pointer; font-size:12px; border:1px solid #ccc; border-radius:3px; padding:3px 5px; background:#fff;">Mark as Done</span>
                <span @click="toggleMark(feedback)" v-else style="cursor:pointer; font-size:12px; border:1px solid #fff; border-radius:3px; padding:3px 5px; background:#5bd05d; color:#fff;">Mark as Undone</span>
              </div>
            </div>
            <div class="feedback-single-content-wrap" v-bind:class="{ 'open' : feedback.expand_content }">
              <p @click="expandFeedbackContent(feedback)" class="message" v-bind:class="{ 'ellipsis-3' : !feedback.expand_content }" v-html="feedback.message"></p>
              <div class="feedback-modify" v-if="$store.getters.getAuthorID === feedback.author_id">
                <!-- <span @click="modifyFeedbackContent(feedback)">{{$t('EDIT')}}</span> -->
                <span @click="deleteFeedbackContent(feedback)">{{$t('DELETE')}}</span>
              </div>
            </div>
            <div class="feedback-single-replies-wrap " v-bind:class="{ 'open' : feedback.show_replies }">
              <div class="feedback-single-replies-header ">
                <span @click="openFeedback(feedback)">{{ feedback.feedback_responses.length }} Replies</span>
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
                    <div class="feedback-modify" v-if="$store.getters.getAuthorID === response.author_id">
                      <!-- <span @click="modifyFeedbackResponseContent(response)">{{$t('EDIT')}}</span> -->
                      <span @click="deleteFeedbackResponseContent(response)">{{$t('DELETE')}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else style="padding:10px; text-align:center;">
                No Response for this feedback yet.
              </div>
              <div class="" style="text-align:right;">
                <form v-on:submit.prevent="sendReply(feedback)">
                  <textarea style="width:100%;" type="text" v-model="feedback.reponse_text"></textarea>
                  <button type="submit" class="es-button-white">Submit</button>
                </form>
              </div>
              </div>
            </div>
          </div>
          </template>
        </div>
        <div class="foot">
          <textarea  type="text" v-model="message"></textarea>
          <button @click="saveFeedback()" class="es-button-white">Submit</button>
        </div>
      </div>
    </div>
</div>
</template>

<script>
// In renderer process (web page).
import moment from 'moment'

export default {
  name: 'Feedback',
  props: ['properties'],
  data () {
    return {
      filter: 'all',
      feedbacks: null,
      selected: false,
      message: '',
      response: ''
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    initFeedbacks: function () {
      var scope = this
      scope.axios.get('http://localhost:3000/feedbacks/' + scope.properties.parent_name + '/' + scope.properties.parent.uuid)
        .then(function (response) {
          scope.feedbacks = response.data
          console.log(scope.feedbacks)
        })
        .catch(function (error) {
          console.log(error)
        })
        .finally(function () {
          // always executed
        })
    },
    modifyFeedbackContent: function (feedback) {
      // console.log(feedback)
    },
    deleteFeedbackContent: function (feedback) {
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
            .delete('http://localhost:3000/feedbacks/' + feedback.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.initFeedbacks()
                })
              }
            })
        }
      })
    },
    modifyFeedbackResponseContent: function (response) {
      // console.log(response)
    },
    deleteFeedbackResponseContent: function (response) {
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
            .delete('http://localhost:3000/feedback-responses/' + response.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.initFeedbacks()
                })
              }
            })
        }
      })
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
    expandFeedbackResponseContent: function (response) {
      if (!response.expand_content) {
        this.$set(response, 'expand_content', true)
      } else {
        this.$set(response, 'expand_content', false)
      }
    },
    closeFeedback: function () {
      let scope = this
      scope.selected = false
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
        parent_id: scope.properties.parent.uuid,
        parent: scope.properties.parent_name,
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
    }
  },
  mounted () {
    var scope = this
    scope.initFeedbacks()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .feedback-modify {text-align: right;}
  .feedback-wrap { position:absolute; top:0px; right:0px; z-index:9999; height:100%; overflow-y:auto; border-left:1px solid #ccc; background:#efefef; z-index:3000; width:480px; }
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
</style>
