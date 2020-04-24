<template>
    <li v-if="component.is_ready" v-bind:class="{ 'open' : $store.getters.isBookItemsFolderOpen(book) }">
        <div @click="TOGGLE_BOOK(book,'items')" class="label">
            <span>
                <img v-if="$store.getters.isBookItemsFolderOpen(book)" src="@/assets/img/icons/folder-open.svg">
                <img v-else src="@/assets/img/icons/folder.svg">
                 {{ $tc('ITEM', 2) }}
            </span>
        </div>
        <ul class="level-3">
            <li v-bind:key="item.id" v-for="item in items">
                <div @click="CHANGE_COMPONENT({tabKey: 'item-details-' + item.uuid, tabComponent: 'item-details',  tabData: {  book_id: book.uuid, item: item }, tabTitle: item.itemname})" class="label"><span><img  src="@/assets/img/icons/item.svg"> {{ item.itemname || 'Untitled' }}</span></div>
            </li>
        </ul>
    </li>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'book-items-folder',
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
    items: function () {
      return this.$store.getters.getItemsByBook(this.book.uuid)
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
    scope.component.is_ready = true
  }
}
</script>
