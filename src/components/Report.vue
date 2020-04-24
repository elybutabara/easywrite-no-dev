<template>
  <div class="component-report">
    <div class="row">
      <div class="col-12 col-md-3">
        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('today')) }}</h3>
          <p style="margin:0px;">{{$t('WORD_COUNT_FOR_THE_DAY')}}</p>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('monthly')) }}</h3>
          <p style="margin:0px;">{{$t('WORD_COUNT_FOR_THIS_MONTH')}}</p>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('yearly')) }}</h3>
          <p style="margin:0px;">{{$t('WORD_COUNT_FOR_THIS_YEAR')}}</p>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div style="text-align:center; padding:40px 40px; background:#f5f8fa; border:1px solid #cbd6e2;">
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('all_time')) }}</h3>
          <p style="margin:0px;">{{$t('OVERALL_WORD_COUNT')}}</p>
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
      return number.toLocaleString()
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
