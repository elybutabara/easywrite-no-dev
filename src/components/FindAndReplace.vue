<template>
<div class="find-and-replace-container">
    <div class="form-group">
        <span class="form-label">SCOPE</span>
        <select v-model="scope" class="form-control">
            <option value="all">{{ $t('ALL') }}</option>
            <option value="chapters">{{ $t('CHAPTERS') }}</option>
            <option value="scenes">{{ $t('SCENES') }}</option>
        </select>
    </div>
    <div class="form-group">
        <span class="form-label">FIND</span>
        <input v-model="find" type="text" class="form-control">
    </div>
    <div class="form-group">
        <span class="form-label">{{ $t('REPLACE') }}</span>
        <input v-model="replace" type="text" class="form-control">
    </div>
    <div class="form-group">
        <button @click="saveReplacedWords()" type="button">{{ $t('REPLACE') }}</button>
    </div>
</div> 
</template>

<script>
// In renderer process (web page).
import moment from 'moment'

export default {
  name: 'FindandReplace',
  props: ['properties'],
  data () {
    return {
        find: '',
        replace: '',
        scope: 'all'
    }
  },
  directives: {
    
  },
  components: {
  },
  computed: {
  },
  methods: {
     saveReplacedWords() {
        var scope = this
        window.swal.fire({
                title: this.$t('ARE_YOU_SURE'),
                text: this.$t('YOU_WONT_BE_ABLE_TO_REVERT_THIS'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$t('YES'),
                cancelButtonText: this.$t('CANCEL')
            }).then((result) => {
                if (result.value) {
                    scope.axios.post('http://localhost:3000/books/' + scope.properties.uuid +'/replace-words', {book_id: scope.properties.uuid, scope: scope.scope, find: scope.find, replace: scope.replace})
                    .then(response => {
                        window.swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: scope.find + ' has been replaced with ' + scope.replace,
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            scope.$store.dispatch('updateBookDetails', scope.properties)
                        })
                    })
                }
            })

       
    },
  },
  mounted () {
    var scope = this
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.find-and-replace-container { position: fixed; top: 190px; right: 20px; width: 350px; z-index:3000; padding:10px 15px; background: #fff; border: 1px solid #ccc; border-radius: 4px; }
.find-and-replace-container .form-group { margin-bottom:10px; }
.find-and-replace-container .form-label { font-weight:600; }
.find-and-replace-container .form-control { -webkit-box-shadow: none;  box-shadow:none; width:100%; padding:5px; border:1px solid #ccc; }
.find-and-replace-container button { height: 40px; background:#293742; padding:5px 10px; width:100%; border:none; color:#fff; }
</style>
