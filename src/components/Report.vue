<template>
  <div class="component-report">
    <div class="row">
      <div class="col-12 col-md-3">
        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('today')) }}</h3>
          <p style="margin:0px;">Today Word Count</p>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('monthly')) }}</h3>
          <p style="margin:0px;">This Month Word Count</p>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('yearly')) }}</h3>
          <p style="margin:0px;">This Year Word Count</p>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('all_time')) }}</h3>
          <p style="margin:0px;">All Time Word Count</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Report',
  methods: {
    numberFormat: function (number) {
      return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  beforeMount () {
    let scope = this
    scope.$store.dispatch('loadAuthorPersonalProgress', { authorId: this.$store.getters.getAuthorID })
  },
  mounted () {
    // let scope = this
  }
}
</script>

<style scoped>

</style>
