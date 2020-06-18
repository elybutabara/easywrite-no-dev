<template>
<div class="page-assignment">
  <h4>Assignments</h4>
  <hr>
  <div class="row">
    <div class="col-12 col-md-4">
      <div class="panel panel-default">
        <div class="panel-heading">
          <strong><i class="fas fa-file-signature"></i> Assignment 1</strong>
          <div class="float-right">
            <button style="background: rgb(41, 55, 66); color: rgb(255, 255, 255); border: 1px solid rgb(41, 55, 66); border-radius: 3px; width: 120px;">Upload script</button>
          </div>
        </div>
        <div class="panel-body">
          <p class="description">Test Content</p>
          <span>Frist: submission date</span>
        </div>
        <div class="panel-footer">Course: Course Title</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'assignment',
  props: ['properties'],
  data: function () {
    return {
      'assignment': []
    }
  },
  mounted () {
    console.log('is called')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .panel-default { font-size: 16px; background-color: rgb(245, 248, 250); border-radius: 4px; border: 1px solid rgb(203, 214, 226) }
    .panel-heading, .panel-body, .panel-footer { padding: 15px; }
    .panel-body { border-top: 1px solid rgb(203, 214, 226); border-bottom: 1px solid rgb(203, 214, 226); min-height: 140px; }
    .panel-body .description { font-size: 14px }
</style>
