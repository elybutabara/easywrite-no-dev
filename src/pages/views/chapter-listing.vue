<template>
<div class="page-chapter-listing">
   <div>
        <button @click="createChapter" class="btn-new-record"><i class="las la-plus"></i></button>
        <div class="row">
           <div class="col-12 col-md-7">
                <div class="page-title">
                    <button @click="toggleFilter()" class="btn-toggle-filter"><i class="las la-filter"></i></button>
                    <h3>{{ properties.title }}'s Chapters</h3>
                </div>
           </div>
           <div class="col-12 col-md-5">
               <div v-bind:class="{ 'open' : filter.is_open }" class="page-actions">
                    <div class="search-box">
                        <form v-on:submit.prevent="filterResults()">
                            <input v-model="filter.keyword" type="text" placeholder="Enter a keyword...">
                            <button class="btn-search" type="submit"><i class="las la-search"></i></button>
                        </form>
                    </div>
                </div>
           </div>
        </div>
        <hr/>
       <div class="row">
            <div class="ccol-12 col-sm-6 col-lg-4  fadeIn animated" v-for="chapter in chapters" v-bind:key="chapter.id">
                <div class="item">
                    <div class="header"><i class="las la-bookmark"></i> {{ chapter.title }}</div>
                    <div class="content" >
                        <strong> {{ chapter.chapter_guidance }}</strong>
                        <p class="description" >{{ chapter.short_description }}</p>
                        <button @click="viewChapter(chapter)" type="button">VIEW</button>
                        <button @click="editChapter(chapter)" type="button">EDIT</button>
                        <button @click="deleteChapter(chapter.uuid)" type="button">DELETE</button>
                    </div>
                </div>
            </div>
       </div>
   </div>
</div>
</template>

<script>
export default {
  name: 'chapter-listing',
  props: ['properties'],
  data: function () {
    return {
      chapters: [],
      filter: {
        is_open: false,
        keyword: ''
      }
    }
  },
  methods: {
    toggleFilter: function () {
      var scope = this
      scope.filter.is_open = !scope.filter.is_open
    },
    filterResults: function () {
      var scope = this
      console.log(scope.filter.keyword)
    },
    getChapters: function (bookId) {
      var scope = this
      scope.axios
        .get('http://localhost:3000/books/' + bookId + '/chapters')
        .then(response => {
          scope.chapters = response.data
        })
    },
    createChapter: function () {
      var scope = this
      scope.$parent.changeComponent('chapter-form', scope.properties)
    },
    editChapter: function (chapter) {
      var scope = this
      scope.$parent.changeComponent('chapter-form', { chapter: chapter })
    },
    viewChapter: function (chapter) {
      var scope = this
      scope.axios
        .get('http://localhost:3000/chapters/' + chapter.uuid + '/scenes')
        .then(response => {
          chapter.scenes = response.data
          scope.$parent.changeComponent('chapter-details', chapter)
        })
    },
    deleteChapter: function (chapterId) {
      var scope = this
      window.swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          scope.axios
            .delete('http://localhost:3000/chapters/' + chapterId)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Chapter successfuly deleted',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.getChapters(scope.properties.uuid)
                  scope.$parent.changeComponent('chapter-listing', scope.properties)
                })
              }
            })
        }
      })
    }
  },
  mounted () {
    var scope = this
    scope.getChapters(scope.properties.uuid)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page-chapter-listing { padding:20px; padding-top:60px; }
    .page-chapter-listing .item { z-index:400; margin-top:20px; border:1px solid #efefef; }
    .page-chapter-listing .item .header { background:#354350; padding:0px 10px; height:35px; line-height:38px; color:#fff; border:2px solid #354350; }
    .page-chapter-listing .item .content { padding:20px; background:#fff; min-height: 127px; }
    .page-chapter-listing .item .content strong { font-family:'Crimson Bold'; font-size:18px; }
    .page-chapter-listing .item .content .description { font-size:16px; }
    .page-chapter-listing .item .content button { background:#fff; border:1px solid #efefef; padding:5px 10px; padding-bottom:0px; }

    .page-title { position:relative; padding-right:50px; }
    .page-actions { text-align:right; margin-top:10px;  }
    .page-actions .search-box  { position:relative; display:inline-block; width:350px; }
    .page-actions .search-box input { width:100%;  padding:0px 10px; padding-top:3px; padding-right:30px; height:35px; line-height:35px; }
    .page-actions .search-box .btn-search {  position:absolute; top:2px; right:0px; height:35px; width:35px; background:none; border:none; }

    .btn-new-record { z-index:500; padding-top:8px; position:fixed; bottom:20px; right:20px; height:50px; width:50px; border-radius:50%; background:#c12938; color:#fff; border:none; font-size:25px; }
    .btn-toggle-filter { display:none; float:right;  position:absolute; top:0px; right:0px; background:#fff; border:1px solid #9fb1c2; padding-top:5px; padding-bottom:0px; }

    @media only screen and (max-width: 968px) {
        .page-chapter-listing .item .header { padding:0px 15px; }
        .page-chapter-listing .item .content { padding:15px;  }

        .page-chapter-listing .item .content strong { font-family:'Crimson Bold'; font-size:16px; }
        .page-chapter-listing .item .content .description { font-size:14px; }

        .page-actions {  text-align:left;  display:none; }
        .page-actions.open {  display:block; }
        .page-actions .search-box  { width:100%; }

        .btn-toggle-filter { display:inline-block; }
    }
</style>
