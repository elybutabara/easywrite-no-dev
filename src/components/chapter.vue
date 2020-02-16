<template>
<div class="page-chapter-details">
    <div class="page-title">
        <button @click="toggleFilter()" class="btn-toggle-filter"><i class="las la-filter"></i></button>
        <h3>The Introduction</h3>
        <p>
            An essay is, generally, a piece of writing that gives the author's own argument — but the definition is vague, overlapping with those of a paper,
            an article, a pamphlet, and a short story.
        </p>
    </div>
    <hr/>
    <div class="es-tab">
        <div>
            <div v-bind:class="{ 'active' : tab.active == 'guidance' }" class="es-tab-button" @click="changeTab('guidance')">
                Chapter Guidance
            </div>
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
        <div class="es-tab-content" v-if="tab.active == 'guidance'">
            <p>
                An essay is, generally, a piece of writing that gives the author's own argument — but the definition is vague, overlapping with those of a paper,
                an article, a pamphlet, and a short story. Essays have traditionally been sub-classified as formal and informal.
            </p>
            <p>
                An essay is, generally, a piece of writing that gives the author's own argument — but the definition is vague, overlapping with those of a paper,
                an article, a pamphlet, and a short story. Essays have traditionally been sub-classified as formal and informal.
            </p>
            <p>
                An essay is, generally, a piece of writing that gives the author's own argument — but the definition is vague, overlapping with those of a paper,
                an article, a pamphlet, and a short story. Essays have traditionally been sub-classified as formal and informal.
            </p>
        </div>
        <div class="es-tab-content" v-if="tab.active == 'content'">

            <h3>Definition of Essay</h3>
            <p>
                Essay is derived from the French word essayer, which means “to attempt,” or “to try.” An essay is a short form of literary composition based on a single subject matter, and often gives the personal opinion of the author. A famous English essayist, Aldous Huxley defines essays as, “a literary device for saying almost everything about almost anything.” The Oxford Dictionary describes it as “a short piece of writing on a particular subject.” In simple words, we can define it as a scholarly work in writing that provides the author’s personal argument.
            </p>

            <h3>Types of Essay</h3>
            <p>There are two forms of essay: literary and non-literary. Literary essays are of four types:</p>

            <ul>
                <li>
                    Expository Essay – In an expository essay, the writer gives an explanation of an idea, theme, or issue to the audience by giving his personal opinions.
                    This essay is presented through examples, definitions, comparisons, and contrast.
                </li>
                <li>
                    Descriptive Essay – As it sounds, this type of essay gives a description about a particular topic, or describes the traits and characteristics of something or a person in detail. It allows artistic freedom, and creates images in the minds of readers through the use of the five senses.
                </li>
                <li>
                    Narrative Essay – Narrative essay is non-fiction, but describes a story with sensory descriptions. The writer not only tells a story, but also makes
                    a point by giving reasons.
                </li>
                <li>
                    Persuasive Essay – In this type of essay, the writer tries to convince his readers to adopt his position or point of view on an issue,
                    after he provides them solid reasoning in this connection. It requires a lot of research to claim and defend an idea. It is also called an argumentative essay.
                </li>
                <li>
                    Non-literary essays could also be of the same types but they could be written in any format.
                </li>
            </ul>
        </div>
        <div class="es-tab-content" v-if="tab.active == 'scenes'">
            <div class="chapter-scenes-list">
                <div class="item">
                    <strong>Scene 1</strong>
                </div>
                <div class="item">
                    <strong>Scene 1</strong>
                </div>
                <div class="item">
                    <strong>Scene 1</strong>
                </div>
                <div class="item">
                    <strong>Scene 1</strong>
                </div>
                <div class="item">
                    <strong>Scene 1</strong>
                </div>
                <div class="item">
                    <strong>Scene 1</strong>
                </div>
            </div>
        </div>
        <div class="es-tab-content" v-if="tab.active == 'versions'">
            <p>
                An essay is, generally, a piece of writing that gives the author's own argument — but the definition is vague, overlapping with those of a paper,
                an article, a pamphlet, and a short story. Essays have traditionally been sub-classified as formal and informal.
            </p>
            <p>
                An essay is, generally, a piece of writing that gives the author's own argument — but the definition is vague, overlapping with those of a paper,
                an article, a pamphlet, and a short story. Essays have traditionally been sub-classified as formal and informal.
            </p>
            <p>
                An essay is, generally, a piece of writing that gives the author's own argument — but the definition is vague, overlapping with those of a paper,
                an article, a pamphlet, and a short story. Essays have traditionally been sub-classified as formal and informal.
            </p>
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
      tab: {
        active: 'guidance'
      }
    }
  },
  methods: {
    changeTab: function (active) {
      var scope = this
      scope.tab.active = active
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

    .chapter-scenes-list .item { font-family: 'Crimson Roman Bold'; border:1px solid #354350; border-top:none; padding:0px 20px; height:35px; line-height:35px}
    .chapter-scenes-list .item:first-child { border-top:1px solid #354350;  }

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
        .page-chapter-listing .item .content strong { font-family:'Crimson Bold'; font-size:16px; }
        .page-chapter-listing .item .content .description { font-size:14px; }

        .page-actions {  text-align:left;  display:none; }
        .page-actions.open {  display:block; }
        .page-actions .search-box  { width:100%; }

        .btn-toggle-filter { display:inline-block; }
    }
</style>
