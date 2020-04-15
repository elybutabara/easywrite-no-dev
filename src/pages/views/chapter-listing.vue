<template>
<div class="page-chapter-listing">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <h4>{{ properties.title }}</h4>
                <small>Below are the list of chapters under {{ properties.title }}</small>
            </div>
            <div class="actions">
                <button class="es-button-white" @click="CHANGE_COMPONENT('chapter-form', {  book_id: properties.uuid, chapter: null }, 'New Chapter', true)">New Chapter</button>
            </div>
        </div>
    </div>

    <div class="es-page-content">
        <div class="es-row">
            <div class="es-col fadeIn animated" v-for="chapter in GET_CHAPTERS_BY_BOOK(bookUUID)" v-bind:key="chapter.id">
                <div class="es-card">
                    <div class="es-card-content">
                        <div class="es-card-actions">
                            <button class="btn-circle" @click="CHANGE_COMPONENT('chapter-form', {  book_id: properties.uuid, chapter: chapter }, 'Edit - ' + chapter.title, true)"><i class="las la-pencil-alt"></i></button>
                            <button class="btn-circle" @click="DELETE_FROM_LIST('chapters', chapter)"><i class="las la-trash-alt"></i></button>
                            <button class="btn-circle" @click="CHANGE_COMPONENT('chapter-details', {  book_id: properties.uuid, chapter: chapter }, 'View - ' + chapter.title)"><i class="lar la-eye"></i></button>
                        </div>
                        <p class="title">{{ displayTitle(chapter.title) }}</p>
                        <i class="description ellipsis-2">{{ chapter.short_description || 'No Short Description...'  }}</i>
                    </div>
                    <div class="es-card-footer">
                        <small>Scenes: {{ GET_SCENES_BY_CHAPTER(chapter.uuid).length }}</small>
                        &nbsp; &bull; &nbsp;
                        <small>Versions: {{ chapter.chapter_version.length }}</small>
                        <small style="float:right;">Word Count: {{ WORD_COUNT(chapter.chapter_version[0].content) }}</small>
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
      bookUUID: ''
    }
  },
  methods: {
    displayTitle: function (title) {
      if (title.length > 70) {
        return title.slice(0, 70) + '...'
      } else if (title.length < 1) {
        return 'Untitled'
      } else {
        return title.slice(0, 39)
      }
    }
  },
  mounted () {
    var scope = this
    scope.bookUUID = scope.properties.uuid
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
.es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
.es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; padding-right:110px; }
.es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

.es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }
.es-card .es-card-content .es-card-actions .btn-circle { background:transparent; border:1px solid #e0e5ee; border-radius:50%; width:30px; height:30px; line-height:22px; text-align:center; font-size:15px; }
.es-card .es-card-footer { background:#f5f8fa; height:40px; line-height:40px; padding:0px 20px; border-top:1px solid #e0e5ee; }

@media only screen and (max-width: 968px) {

}
</style>
