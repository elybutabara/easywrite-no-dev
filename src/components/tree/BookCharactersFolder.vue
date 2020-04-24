<template>
    <li v-if="component.is_ready" v-bind:class="{ 'open' : $store.getters.isBookCharactersFolderOpen(book) == true }">
        <div @click="TOGGLE_BOOK(book,'characters')"  class="label">
            <span>
                <img v-if="$store.getters.isBookCharactersFolderOpen(book)" src="@/assets/img/icons/folder-open.svg">
                <img v-else src="@/assets/img/icons/folder.svg">
                {{ $tc('CHARACTER', 2) }}
            </span>
        </div>
        <ul class="level-3">
            <li v-bind:key="character.id" v-for="character in characters">
                <div @click="CHANGE_COMPONENT({tabKey: 'character-details-' + character.uuid, tabComponent: 'character-details',  tabData:  {  book_id: book.uuid, character: character }, tabTitle: character.fullname})" class="label"><span><img  src="@/assets/img/icons/character.svg"> {{ character.fullname || 'Unamed' }}</span></div>
            </li>
        </ul>
    </li>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'book-characters-folder',
  props: ['properties'],
  data: function () {
    return {
      component: {
        title: '',
        is_ready: false,
        data: null
      },
      chapter: null
    }
  },
  components: {
    draggable
  },
  computed: {
    characters: function () {
      return this.$store.getters.getCharactersByBook(this.book.uuid)
    }
  },
  methods: {

  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this
    scope.book = scope.properties

    setTimeout(function () {
      scope.component.is_ready = true
    }, 500)
  }
}
</script>
