<template>
<div class="find-and-replace-container">
    <div class="form-group">
        <span class="form-label">SCOPE</span>
        <select v-model="scope" class="form-control">
            <option value="all">All</option>
            <option value="chapters">Chapters</option>
            <option value="scenes">Scenes</option>
        </select>
    </div>
    <div class="form-group">
        <span class="form-label">FIND</span>
        <input v-model="find" type="text" class="form-control">
    </div>
    <div class="form-group">
        <span class="form-label">REPLACE</span>
        <input v-model="replace" type="text" class="form-control">
    </div>
    <div class="form-group">
        <button @click="saveReplacedWords()" type="button">REPLACE</button>
    </div>
</div> 
</template>

<script>

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
    saveReplacedWords: function () {
      var scope = this
      console.log(scope.properties, 'gg')

      scope.axios.post('http://localhost:3000/books/' + scope.properties.id + '/replace-words', 
      {
        scope: 'all',
        find: 'testes',
        replace: 'ggwp'
      })
      .then(response => {
            console.log(response)

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
