<template>
<div>
    <div v-if="page.is_ready" class="page-chapter-versions">
        <div class="switch-version">
            <button class="es-button-white mr-2" @click="setDefaultVersion()" v-if="isDefaultVersion">
                Mark as current version
            </button>
            <select @change="changeChapterVersion()" v-model="version.uuid" style="padding:5px 7px;">
                <option value="null">{{$t('SELECT_A_VERSION').toUpperCase()}}</option>
                <option :value="version.uuid"  v-for="(version, index) in versions" v-bind:key="index">{{$t('VERSION')}} {{ index + 1 }}</option>
            </select>
        </div>
        <div class="chapter-version-description">
            <strong>{{$t('DESCRIPTION')}}</strong>
            <div v-if="version.change_description !== 'undefined' && version.change_description !== null && version.change_description !== ''" v-html="version.change_description" class="description"></div>
            <div v-else vclass="description">{{$t('NO_DESCRIPTION_ON_THIS_VERSION')}}.</div>
        </div>
        <div class="chapter-version-content">
            <div v-html="version.content" class="description" ></div>
        </div>
    </div>
</div>
</template>

<script>
import TinyMCE from '../../../components/TinyMCE'
export default {
  name: 'chapter-versions',
  props: ['properties'],
  data: function () {
    return {
      page: {
        title: '',
        is_ready: false,
        data: null
      },
      version: {
        id: null,
        uuid: null,
        chapter_id: null,
        content: '',
        change_description: ''
      }
    }
  },
  components: {
    TinyMCE
  },
  computed: {
    defaultVersion: {
      get () {
        return this.$store.getters.findLatestChapterVersionByChapter(this.chapter)
      },
      set (version) {
        return version
      }
    },
    isDefaultVersion: function () {
      if (this.versions.length > 1 && (typeof (this.defaultVersion) === 'undefined' || this.defaultVersion.id !== this.version.id)) {
        return true
      }
    },
    chapter: function () {
      return this.$store.getters.findChapter(this.properties.chapter)
    },
    versions: function () {
      return this.$store.getters.getChapterVersions(this.properties.chapter.uuid)
    }
  },
  methods: {
    changeChapterVersion: function () {
      var scope = this
      let versions = scope.versions
      for (let i = 0; i < versions.length; i++) {
        let version = versions[i]
        if (scope.version.uuid === version.uuid) {
          scope.version.id = version.id
          scope.version.uuid = version.uuid
          scope.version.change_description = version.change_description
          scope.version.content = version.content
          break
        }
      }
    },
    getLatestVersion: function () {
      var scope = this
      var count = scope.versions.length
      if (count > 1) {
        let version = scope.versions[(count - 1)]
        scope.version.id = version.id
        scope.version.uuid = version.uuid
        scope.version.change_description = version.change_description
        scope.version.content = version.content
      } else {
        scope.version.id = null
        scope.version.uuid = null
        scope.version.change_description = null
        scope.version.content = null
      }
    },
    setDefaultVersion: async function () {
      var scope = this
      await scope.axios.post('http://localhost:3000/chapter-versions/' + scope.version.uuid + '/set-as-current')
        .then(response => {
          scope.$store.dispatch('loadVersionsByChapter', response.data.chapter_id)
          scope.versions = scope.$store.getters.getChapterVersions(response.data.chapter_id)
          window.swal.fire({
            position: 'center',
            icon: 'success',
            title: scope.$t('SUCCESS MESSAGE'),
            showConfirmButton: false,
            timer: 1500
          })
        })
    }
  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this

    setTimeout(function () {
      scope.getLatestVersion()
      scope.page.is_ready = true
    }, 500)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .switch-version { text-align:right; }
    .chapter-version-content { margin-top:20px; }
    .chapter-version-description { margin-top:10px; margin-bottom:10px; padding:10px 20px; background:#f0efaf; color:#000; border:1px solid #f0e1af; }
</style>
