<template>
<div class="page-main">
    <main-side-navigation></main-side-navigation>
    <syncer v-if="syncer.is_open"></syncer>
    <div style="text-align:left; padding-left:320px;">
        <div style="background:#dbdee3; text-align:right; padding:5px 10px;">
            <button @click="toggleSyncer()" style="background:#293742; padding:0px 10px; line-height:30px; height:30px; border:none; font-size:14px; color:#fff;">OPEN SYNCER</button>
        </div>
        <div style="display:none; " class="tab-nav">
            <div class="tab-nav-item" v-bind:class="{ 'active': tab.active }" v-for="(tab,index) in tabs" v-bind:key="index">
                {{ tab.title }}
                <span class="tab-closer"><i class="fas fa-times"></i></span>
            </div>
        </div>
        <div>
            <book-listing v-if="active.component == 'book-listing'"></book-listing>
            <chapter-listing v-if="active.component == 'chapter-listing'" :properties="active.data"></chapter-listing>
            <scene-listing v-if="active.component == 'scene-listing'" :properties="active.data"></scene-listing>
            <item-listing v-if="active.component == 'item-listing'" :properties="active.data"></item-listing>
            <location-listing v-if="active.component == 'location-listing'" :properties="active.data"></location-listing>
            <character-listing v-if="active.component == 'character-listing'" :properties="active.data"></character-listing>

            <book-details v-if="active.component == 'book-details'" :properties="active.data"></book-details>
            <chapter-details v-if="active.component == 'chapter-details'" :properties="active.data"></chapter-details>
            <scene-details v-if="active.component == 'scene-details'" :properties="active.data"></scene-details>
            <item-details v-if="active.component == 'item-details'" :properties="active.data"></item-details>
            <location-details v-if="active.component == 'location-details'" :properties="active.data"></location-details>
            <character-details v-if="active.component == 'character-details'" :properties="active.data"></character-details>

            <book-form v-if="active.component == 'book-form'" :properties="active.data"></book-form>
            <location-form v-if="active.component == 'location-form'" :properties="active.data"></location-form>
            <item-form v-if="active.component == 'item-form'" :properties="active.data"></item-form>
        </div>
    </div>
</div>
</template>

<script>
import MainSideNavigation from '@/components/MainSideNavigation'
import Syncer from '@/components/Syncer'

import BookListing from '@/pages/views/book-listing'
import ChapterListing from '@/pages/views/chapter-listing'
import SceneListing from '@/pages/views/scene-listing'
import ItemListing from '@/pages/views/item-listing'
import CharacterListing from '@/pages/views/character-listing'
import LocationListing from '@/pages/views/location-listing'

import BookDetails from '@/pages/views/book-details'
import ChapterDetails from '@/pages/views/chapter-details'
import SceneDetails from '@/pages/views/scene-details'
import ItemDetails from '@/pages/views/item-details'
import CharacterDetails from '@/pages/views/character-details'
import LocationDetails from '@/pages/views/location-details'

import BookForm from '@/pages/views/book-form'
import LocationForm from '@/pages/views/location-form'
import ItemForm from '@/pages/views/item-form'

const electron = window.require('electron')

const remote = electron.remote

const loginInfo = remote.getGlobal('loginInfo')

export default {
  name: 'Main',
  data: function () {
    return {
      books: [],
      syncer: {
        is_open: false
      },
      active: {
        id: 0,
        data: null,
        component: 'book-listing'
      },
      tabs: [
        { title: 'Books', component: 'book-listing', active: true },
        { title: 'The Story of john hahaha hehehe hohoho', component: 'book-listing', active: false },
        { title: 'TEST', component: 'book-listing', active: false }
      ]
    }
  },
  components: {
    'main-side-navigation': MainSideNavigation,
    'syncer': Syncer,
    'book-listing': BookListing,
    'chapter-listing': ChapterListing,
    'scene-listing': SceneListing,
    'item-listing': ItemListing,
    'character-listing': CharacterListing,
    'location-listing': LocationListing,
    'book-details': BookDetails,
    'chapter-details': ChapterDetails,
    'scene-details': SceneDetails,
    'item-details': ItemDetails,
    'character-details': CharacterDetails,
    'location-details': LocationDetails,
    'book-form': BookForm,
    'location-form': LocationForm,
    'item-form': ItemForm
  },
  methods: {
    changeComponent: function (component, data) {
      var scope = this
      scope.$delete(scope.active, 'data')
      scope.$set(scope.active, 'data', data)
      scope.active.component = ''
      scope.active.component = component
    },
    toggleSyncer: function () {
      var scope = this
      scope.syncer.is_open = !scope.syncer.is_open
    },
    getBooks: function () {
      var scope = this
      // eslint-disable-next-line camelcase
      var userID = this.$store.getters.getUserID

      scope.axios
        .get('http://localhost:3000/users/' + userID + '/books')
        .then(response => {
          scope.books = response.data
        })
      // scope.books = response
    }
  },
  beforeMount () {
    this.$store.commit('authenticate', {
      user: loginInfo.data.user,
      author: loginInfo.data.author
    })
  },
  mounted () {
    var scope = this
    scope.getBooks()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul { margin-left:0px; list-style:none;  }

.left-side-bar { position:fixed; top:0px; left:0px; background:#293742; width:320px; height:100vh; overflow-y:auto; }

.left-side-bar .header { text-align:center; height:70px; line-height:70px; border-bottom:1px solid #3c505f; padding:0px 10px; }
.left-side-bar .header img { height:60px; }

.left-side-bar .search-box { height:40px; line-height:40px; border-bottom:1px solid #3c505f; padding:0px 5px; position:relative; }
.left-side-bar .search-box .icon { position:absolute; top:8px; right:8px; color:#506d84; font-size:25px; }
.left-side-bar .search-box input { background:#324553; width:100%; height:30px; border:none; color:#fff; padding:0px 5px; padding-right:35px;  }
.left-side-bar .search-box input:focus, .search-box input:active{ background:#324553; }
.left-side-bar .search-box input::placeholder { color: #506d84; }

.es-tree-view { padding:10px 5px; }
.es-tree-view ul { padding-left:10px; text-align: left; }
.es-tree-view ul:not(:first-child) { padding-left:30px; }
.es-tree-view ul li  { padding-top:10px; cursor:pointer; }
.es-tree-view ul li  img { height:14px; }
.es-tree-view ul li .label { font-family:'Crimson Roman'; color:#abc4d7; font-size:18px; }
.es-tree-view ul li .label span i { padding-right:5px; }
.es-tree-view ul li .label:hover { color:#fff; }

.es-tree-view ul.level-1 > li > .label { text-decoration:none; }

.es-tree-view ul.level-1 > li > ul  { position:relative;  }
.es-tree-view ul.level-1 > li > ul:after { height:100%; width:1px; content:''; border-left:1px #abc4d7 dotted ; position:absolute; top:0px; left:12px; }

.es-tree-view ul.level-2 > li  { position:relative;  }
.es-tree-view ul.level-2 > li:after  { content:''; position:absolute; top:18px; left:-10px; width:12px; height:1px; border-bottom:1px #abc4d7 dotted;  }

.es-tree-view ul.level-2 > li ul { position:relative;  }
.es-tree-view ul.level-2 > li ul:after { height:100%; width:1px; content:''; border-left:1px #abc4d7 dotted ; position:absolute; top:0px; left:12px; }

.es-tree-view ul.level-3 > li  { position:relative;  }
.es-tree-view ul.level-3 > li:after  { content:''; position:absolute; top:18px; left:-10px; width:12px; height:1px; border-bottom:1px #abc4d7 dotted;  }

.es-tree-view ul.level-3 > li ul { position:relative;  }
.es-tree-view ul.level-3 > li ul:after { height:100%; width:1px; content:''; border-left:1px #abc4d7 dotted ; position:absolute; top:0px; left:9px; }

.es-tree-view ul.level-4 > li  { position:relative;  }
.es-tree-view ul.level-4 > li:after  { content:''; position:absolute; top:18px; left:-10px; width:12px; height:1px; border-bottom:1px #abc4d7 dotted;  }

.es-tree-view ul.level-4 > li ul { position:relative;  }
.es-tree-view ul.level-4 > li ul:after { height:100%; width:1px; content:''; border-left:1px #abc4d7 dotted ; position:absolute; top:0px; left:12px; }

.es-tree-view .level-1 li ul, .es-tree-view .level-1 li > ul > li { display:none; }
.es-tree-view .level-1 li.open ul, .es-tree-view .level-1 li.open > ul > li{ display:block; }

.es-tree-view .level-2 li ul, .es-tree-view .level-2 li > ul > li { display:none; }
.es-tree-view .level-2 li.open ul, .es-tree-view .level-2 li.open > ul > li{ display:block; }

.es-tree-view .level-3 li ul, .es-tree-view .level-3 li > ul > li { display:none; }
.es-tree-view .level-3 li.open ul, .es-tree-view .level-3 li.open > ul > li{ display:block; }

.tab-nav { background:#293742; padding-top:5px; display:flex; }
.tab-nav .tab-nav-item { position:relative; font-size:12px; cursor:pointer; color:#fff; background:#324859; padding:7px 15px; padding-bottom:10px; padding-right:20px; width:180px; text-align:center; margin:0px 1px; display:inline-block;  border-top-left-radius: 3px; border-top-right-radius: 3px; border:1px solid #324351; border-bottom:none; white-space: nowrap; overflow:hidden; text-overflow: ellipsis; }
.tab-nav .tab-nav-item .tab-closer { position:absolute; top:7px; right:5px;  border-radius:50%; font-size:12px; line-height:15px; color:#82a5c0; font-weight:600; width:15px; height:15px; display:inline-block; text-align:center; }
.tab-nav .tab-nav-item:first-child {  margin-left:-1px; }
.tab-nav .tab-nav-item.active { background:#ffffff; color:#324351; }
.tab-nav .tab-nav-item.active .tab-closer {color:#902c39; }
</style>
