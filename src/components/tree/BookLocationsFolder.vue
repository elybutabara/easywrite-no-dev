<template>
    <li v-if="component.is_ready" v-bind:class="{ 'open' : $store.getters.isBookLocationsFolderOpen(book)  == true }">
        <div @click="TOGGLE_BOOK(book,'locations')" class="label">
            <span>
                <img v-if="$store.getters.isBookLocationsFolderOpen(book)" src="@/assets/img/icons/folder-open.svg">
                <img v-else src="@/assets/img/icons/folder.svg">
                {{ $tc('LOCATION', 2) }}
            </span>
        </div>
        <ul class="level-3">
            <li v-bind:key="location.id" v-for="location in locations">
                <div @click="CHANGE_COMPONENT({tabKey: 'location-details-' + location.uuid, tabComponent: 'location-details',  tabData: { book_id: book.uuid, location: location }, tabTitle: location.location})" class="label"><span><img  src="@/assets/img/icons/location.svg"> {{ location.location || 'Untitled' }}</span></div>
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
    locations: function () {
      return this.$store.getters.getLocationsByBook(this.book.uuid)
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
