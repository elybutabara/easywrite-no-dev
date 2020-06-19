<template>
<div style="z-index:3000;">
    <div class="note-wrap">
      <div class="notes">
        <div class="head">
          Notes
          <span @click="$parent.toggleNotes()" style="cursor:pointer; width:30px; height:30px; line-height:30px; text-align:center; position:absolute; background:#922c39; color:#fff; top:2px; right:5px;">X</span>
        </div>
        <div class="body">
          <template @click="toggleNotes(note)" v-for="note in notes" >
          <div :key="note.id" class="note-single">
            <div class="note-single-header">
              <strong class="author" >{{ note.author.alias || note.author.first_name }}</strong>
              <span class="date">{{ formatDate(note) }}</span>
            </div>
            <div class="note-single-content-wrap" v-bind:class="{ 'open' : note.expand_content }">
              <p @click="expandNoteContent(note)" class="message" v-bind:class="{ 'ellipsis-3' : !note.expand_content }" v-html="note.message"></p>
            </div>
          </div>
          </template>
        </div>
        <div class="foot">
          <textarea  type="text" v-model="message"></textarea>
          <button @click="saveNote()" class="es-button-white">Submit</button>
        </div>
      </div>
    </div>
</div>
</template>

<script>
// In renderer process (web page).
import moment from 'moment'

export default {
  name: 'Note',
  props: ['properties'],
  data () {
    return {
      filter: 'all',
      notes: null,
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
    formatDate: function (data) {
      return moment(data.created_at).calendar()
    },
    expandNoteContent: function (note) {
      if (!note.expand_content) {
        this.$set(note, 'expand_content', true)
      } else {
        this.$set(note, 'expand_content', false)
      }
    },
    saveNote: function () {
      var scope = this
      if (scope.message === '') {
        return
      }

      let note = {
        author_id: scope.$store.getters.getAuthorID,
        parent_id: scope.properties.parent.uuid,
        parent: scope.properties.parent_name,
        message: scope.message
      }

      scope.axios
        .post('http://localhost:3000/notes', note)
        .then(response => {
          if (response.data) {
            scope.message = ''
            scope.notes.push(response.data)
          }
        })
    }
  },
  mounted () {
    var scope = this
    scope.axios.get('http://localhost:3000/notes/' + scope.properties.parent_name + '/' + scope.properties.parent.uuid)
      .then(function (response) {
        scope.notes = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
      .finally(function () {
        // always executed
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .note-wrap { position:absolute; top:0px; right:0px; z-index:9999; height:100%; overflow-y:auto; border-left:1px solid #ccc; background:#efefef; z-index:3000; width:480px; }
  .note-wrap .notes { position:relative; height:100%;}
  .note-wrap .notes .head {  position:relative; height:35px; line-height:35px; padding:0px 10px; background:#fff; border-bottom:1px solid #ccc; }
  .note-wrap .notes .body { height:calc(100% - 125px); overflow-y:auto; }
  .note-wrap .notes .body .note-single { background:#fff; border-bottom:1px solid #ccc; padding:0px 0px; padding-top:5px; }
  .note-wrap .notes .body .note-single.done { background:#d3eed8; }
  .note-wrap .notes .body .note-single .date { margin:0px; font-size:11px; color:#888; float:right; }
  .note-wrap .notes .body .note-single .message { margin:0px; font-style:italic;}
  .note-wrap .notes .foot { background:#fff; position:absolute; bottom:0px; left:0px; width:100%; height:90px; border-top:1px solid #ccc; padding:8px 5px; }
  .note-wrap .notes .foot  textarea { width:100%; padding:5px; font-size:12px; }
  .note-wrap .notes .foot  button { float:right; }

  .note-single .note-single-header { padding:5px 15px; }
  .note-single .note-single-content-wrap { cursor:pointer; padding:5px 15px; max-height:70px; overflow:hidden; margin-bottom:10px; }
  .note-single .note-single-content-wrap.open { max-height: none !important; }

  .note-single .note-single-replies-wrap { background:#efefef; }
  .note-single .note-single-replies-wrap .note-single-replies-header { border-bottom:1px solid #ccc; padding:5px 10px; text-align:right; font-size:12px; }
  .note-single .note-single-replies-wrap .note-single-replies-header span { cursor:pointer; }
  .note-single .note-single-replies-wrap .note-single-replies { padding:5px 10px; text-align:left; font-size:12px; display:none; }
  .note-single .note-single-replies-wrap.open .note-single-replies { display:block; }
  .note-single .note-single-replies-wrap .note-single-replies-content { cursor:pointer; max-height:75px; overflow:hidden; margin-bottom:10px; }
  .note-single .note-single-replies-wrap .note-single-replies-content.open { max-height:none !important;  }
</style>
