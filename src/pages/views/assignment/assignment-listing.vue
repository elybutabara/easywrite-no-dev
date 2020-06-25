<template>
<div class="page-assignment">
  <h4>{{ $tc('ASSIGNMENTS') }}</h4>
  <hr>
  <div class="row">
    <div class="col-12 col-md-4 mb-3" v-for="assingment in assignments" v-bind:key="assingment.id">
      <div class="panel panel-default">
        <div class="panel-heading">
          <strong><i class="fas fa-file-signature"></i> {{ assingment.title }}</strong>
          <div class="float-right">
            <button v-if="!('assignment_manuscript' in assingment)" class="btn btn-sm" style="background: rgb(41, 55, 66); color: rgb(255, 255, 255); border: 1px solid rgb(41, 55, 66); border-radius: 3px;" :title="$tc('UPLOAD_SCRIPT')" @click="showForm(assingment)"><i class="fa fa-upload" aria-hidden="true"></i></button>
          </div>
        </div>
        <div class="panel-body">
          <p class="description">{{ assingment.description }}</p>
          <span>{{ $tc('DEADLINE') }}: {{ assingment.submission_date }}</span>
          <div v-if="('assignment_manuscript' in assingment)" class="mt-3">
            <a href="javascript:;" @click="showManuscript(assingment)" >{{ (assingment.assignment_manuscript.is_file) ? assingment.assignment_manuscript.content : $t('DETAILS')}}</a>
            <div class="float-right">
              <a href="javascript:;" :title="$t('EDIT')" @click="showForm(assingment)" class="btn btn-xs btn-info"><i class="fas fa-pencil-alt" aria-hidden="true"></i></a>
              <a href="javascript:;" :title="$t('DELETE')" @click="deleteManuscript(assingment.assignment_manuscript)" class="btn btn-xs btn-danger"><i class="fas fa-trash-alt" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
        <div class="panel-footer">{{ $tc('COURSE') }}: {{ assingment.course_title }}</div>
      </div>
    </div>
  </div>
  <assignment-form v-show="show_form==true" :show_form="show_form" :assignment="selected_assignment" :book_genres="genres" v-on:getIsFormShow="setShowForm"></assignment-form>
  <div class="b-overlay" v-if="show_manuscript_detail">
    <b-container class="bv-example-row">
      <b-card-group deck>
        <b-card>
          <template v-slot:header>
            <h6 class="mb-0 card-title">{{ assignment_detail.title }}</h6>
            <a href="javascript:;" ref="close-manuscript-detail" class="close" @click="show_manuscript_detail = !show_manuscript_detail">
              <i class="fa fa-times"></i>
            </a>
          </template>
          <div v-html="assignment_detail.assignment_manuscript.content"></div>
        </b-card>
      </b-card-group>
    </b-container>
  </div>
</div>
</template>

<script>
import AssignmentForm from './assignment-form'
export default {
  name: 'assignment-listing',
  props: ['properties'],
  data: function () {
    return {
      assignments: [],
      selected_assignment: [],
      genres: [],
      show_form: false,
      show_manuscript_detail: false,
      assignment_detail: []
    }
  },
  components: {
    'assignment-form': AssignmentForm
  },
  methods: {
    showForm: function (assignment) {
      let scope = this
      scope.$set(scope, 'selected_assignment', assignment)
      scope.show_form = !scope.show_form
    },
    setShowForm (value) {
      let scope = this
      scope.show_form = value.show_form

      if (value.manuscript.id) {
        const index = scope.assignments.findIndex(assignment => assignment.uuid === value.manuscript.assignment_id)

        scope.$set(scope.assignments[index], 'assignment_manuscript', value.manuscript)
      }
    },
    getGenre: function () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/books/genres')
        .then(response => {
          scope.genres = response.data
        })
    },
    getAssignments: function () {
      var scope = this
      var userUUID = this.$store.getters.getUserID

      scope.axios
        .get('http://localhost:3000/assignments/' + userUUID, scope.data)
        .then(response => {
          scope.assignments = response.data
        })
    },
    showManuscript: function (assignment) {
      if (assignment.assignment_manuscript.is_file) {
        console.log(assignment.assignment_manuscript)
      } else {
        let scope = this
        scope.show_manuscript_detail = !scope.show_manuscript_detail
        scope.assignment_detail = assignment
      }
    },
    deleteManuscript: function (manuscript) {
      var scope = this

      window.swal.fire({
        title: this.$t('ARE_YOU_SURE'),
        text: this.$t('YOU_WONT_BE_ABLE_TO_REVERT_THIS'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('YES_DELETE_IT'),
        cancelButtonText: this.$t('CANCEL')
      }).then((result) => {
        if (result.value) {
          scope.axios
            .delete('http://localhost:3000/assignment-manuscripts/' + manuscript.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  const index = scope.assignments.findIndex(assignment => assignment.uuid === manuscript.assignment_id)

                  scope.$delete(scope.assignments[index], 'assignment_manuscript')
                })
              }
            })
        }
      })
    }
  },
  mounted () {
    var scope = this

    scope.getGenre()
    scope.getAssignments()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .panel-default { font-size: 16px; background-color: rgb(245, 248, 250); border-radius: 4px; border: 1px solid rgb(203, 214, 226) }
    .panel-heading, .panel-body, .panel-footer { padding: 15px; }
    .panel-body { border-top: 1px solid rgb(203, 214, 226); border-bottom: 1px solid rgb(203, 214, 226); min-height: 140px; }
    .panel-body .description { font-size: 14px }

    .btn-xs {
      padding: 1px 5px;
      font-size: 12px;
      line-height: 1.5;
      border-radius: 3px;
    }

    .card-header { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: start; -ms-flex-align: start; align-items: flex-start; -webkit-box-pack: justify; -ms-flex-pack: justify; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #e9ecef; border-top-left-radius: .3rem; border-top-right-radius: .3rem; }
    .card-header .card-title { font-size: 1.25rem; margin-bottom: 0; line-height: 1.5; }
    .card-header .close { padding: 1rem; margin: -1rem -1rem -1rem auto; }

    .b-overlay { position: fixed; top: 0; left: 0; bottom: 0; right: 0; overflow: auto; background-color: rgba(44, 46, 47, 0.9); }
    .bv-example-row { margin-top: 100px; margin-bottom: 70px; }
</style>
