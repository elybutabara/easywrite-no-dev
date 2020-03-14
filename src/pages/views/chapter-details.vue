<template>
<div class="page-chapter-details">
    <div class="page-title">
        <button @click="toggleFilter()" class="btn-toggle-filter"><i class="las la-filter"></i></button>
        <h3>{{ properties.title }}</h3>
        <p>{{ properties.short_description }}</p>
        <input type="hidden" v-model="properties.uuid" @change="getAllChapterVersions(properties)">
    </div>
    <hr/>
    <div class="es-tab">
        <div>
            <div v-bind:class="{ 'active' : tab.active == 'content' }" class="es-tab-button" @click="changeTab('content')">
                Content
            </div>
            <div v-bind:class="{ 'active' : tab.active == 'scenes' }" class="es-tab-button" @click="changeTab('scenes')">
                Scenes
            </div>
            <div v-bind:class="{ 'active' : tab.active == 'versions' }" class="es-tab-button" @click="changeTab('versions')">
                Versions
            </div>
        </div>
        <div class="es-tab-content" v-if="tab.active == 'content'">
            <div v-html="properties.chapter_version[0].content" class="description" >{{ properties.chapter_version[0].content }}</div>
        </div>
        <div class="es-tab-content" v-if="tab.active == 'scenes'">
            <div class="chapter-scenes-list">
              <div class="row">
                <div class="col-12 col-lg-4 col-md-6 col-sm-6 fadeIn animated" v-for="scene in properties.scenes" v-bind:key="scene.id">
                  <div class="item" >
                    <div class="header"><i class="las la-bookmark"></i> {{ scene.title }}</div>
                    <div class="content" >
                      <strong>{{ scene.short_description }}</strong>
                      <div v-html="scene.notes" class="description" >{{ scene.notes }}</div>
                      <button type="button">VIEW</button>
                      <button type="button">EDIT</button>
                      <button type="button">DELETE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div class="es-tab-content" v-if="tab.active == 'versions'">
            <div style="margin-bottom: 1rem;text-align: right">
              <b-button @click="createChapterVersion()" variant="dark">Create new version</b-button>
            </div>
            <div role="tablist">
              <b-card no-body class="mb-1" v-for="(version, index) in chapter_version" v-bind:key="version.id">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button block href="#" v-b-toggle="'accordion-' + version.id" class="text-left" variant="light">
                    Version {{ index+1 }}
                    <b-badge variant="primary" v-if="index+1 == chapter_version.length" >Latest</b-badge>
                    <b-badge variant="success" v-else-if="version.is_same == true" >Same</b-badge>
                    <b-badge variant="secondary" v-else >Diff</b-badge>
                  </b-button>
                </b-card-header>
                <b-collapse :id="'accordion-' + version.id" accordion="chapter-scenes" role="tabpanel">
                  <b-card-body>
                    <b-card-text v-html=" version.change_description "></b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'chapter-details',
  props: ['properties'],
  data: function () {
    return {
      chapter: this.properties,
      chapter_version: this.getAllChapterVersions(this.properties),
      tab: {
        active: 'content'
      }
    }
  },
  methods: {
    changeTab: function (active) {
      var scope = this
      scope.tab.active = active
    },
    getAllChapterVersions: function (chapter) {
      var scope = this
      scope.axios
        .get('http://localhost:3000/chapters/' + chapter.uuid + '/versions')
        .then(response => {
          scope.chapter_version = response.data
        })
    },
    createChapterVersion: function () {
      var scope = this
      scope.$parent.changeComponent('chapter-version-form', scope.properties)
    }
  },
  updated () {
    var scope = this
    if (scope.chapter.uuid !== scope.properties.uuid) {
      scope.chapter = scope.properties
      scope.getAllChapterVersions(scope.properties)
    }
  },
  mounted () {
    // var scope = this
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page-chapter-details { padding:20px; }

    .es-tab .es-tab-button {
        cursor:pointer; background:#354350; color:#fff; border:1px solid #efefef; display:inline-block; height:40px; line-height:40px; padding:0px 40px; font-family: 'Crimson Roman Bold'; cursor:pointer;
        border-top-left-radius:3px;  border-top-right-radius:3px;
    }
    .es-tab .es-tab-button.active {  position:relative; background:#fff; border:1px solid #efefef; color:#354350; }
    .es-tab .es-tab-button.active:after {  content:''; position:absolute; bottom:-3px; left:0px; width:100%; height:4px; background:#fff; }
    .es-tab-content {  background:#fff; padding:20px; border:1px solid #efefef; min-height:50vh; font-size:18px; }

    .chapter-scenes-list .item { margin-top:20px; border:1px solid #efefef; }
    .chapter-scenes-list .item .header { background:#354350; padding:0px 10px; height:35px; line-height:38px; color:#fff; border:2px solid #354350; }
    .chapter-scenes-list .item .content { padding:20px; background:#fff; }
    .chapter-scenes-list .item .content strong { font-family:'Crimson Bold'; font-size:18px; }
    .chapter-scenes-list .item .content .description { font-size:16px; }
    .chapter-scenes-list .item .content button { background:#fff; border:1px solid #efefef; padding:5px 10px; padding-bottom:0px; }

    /*.chapter-scenes-list .item { font-family: 'Crimson Roman Bold'; border:1px solid #354350; border-top:none; padding:0px 20px; height:35px; line-height:35px}*/
    /*.chapter-scenes-list .item:first-child { border-top:1px solid #354350;  }*/

    .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
    .page-title h3 { font-size:35px; }
    .page-title p { font-size:18px; }
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
