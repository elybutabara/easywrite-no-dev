<template>
<div class="mt-3">

    <div class="col-md-12 col-12">
        <div class="form-group">
            <div style="text-align: center; font-size: 30px;" class="es-form-control-wrap">
                <label class="form-label" for="treadline-title">{{Treadline.title}}</label>
                <button class="btn btn-outline-success btn-sm rounded float-right" @click="showModal()">
                {{ $t('EDIT_ANSWERS') }}
                </button>
            </div>
        </div>
    </div>

    <div class="col-md-12 col-12">
        <div class="form-group">
            <div class="form-control-wrap">
                <div v-html="Treadline.core_of_story"></div>
            </div>
        </div>
    </div>



    <div class="mt-4">
        <div class="row mx-0">
            <div class="col-md-12 p-4">
                <table class="table table-bordered treadline-table">
                    <thead>
                        <tr>
                            <th style="width: 40px;">{{ $t('COUNT') }}</th>
                            <th>{{ $t('QUESTIONS') }}</th>
                            <th>{{ $t('ANSWERS') }}</th>
                            <th>{{ $t('COMMENTS') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>{{ Treadline.question_1 }}</td>
                            <td><span v-html="display.answer_1"></span></td>
                            <td>{{ Treadline.comment_1 }}</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>{{ Treadline.question_2 }}</td>
                            <td><span v-html="display.answer_2"></span></td>
                            <td>{{ Treadline.comment_2 }}</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>{{ Treadline.question_3 }}</td>
                            <td><span v-html="display.answer_3"></span></td>
                            <td>{{ Treadline.comment_3 }}</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>{{ Treadline.question_4 }}</td>
                            <td><span v-html="display.answer_4"></span></td>
                            <td>{{ Treadline.comment_4 }}</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>{{ Treadline.question_5 }}</td>
                            <td><span v-html="display.answer_5"></span></td>
                            <td>{{ Treadline.comment_5 }}</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>{{ Treadline.question_6 }}</td>
                            <td><span v-html="display.answer_6"></span></td>
                            <td>{{ Treadline.comment_6 }}</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>{{ Treadline.question_7 }}</td>
                            <td><span v-html="display.answer_7"></span></td>
                            <td>{{ Treadline.comment_7 }}</td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td>{{ Treadline.question_8 }}</td>
                            <td><span v-html="display.answer_8"></span></td>
                            <td>{{ Treadline.comment_8 }}</td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td>{{ Treadline.question_9 }}</td>
                            <td><span v-html="display.answer_9"></span></td>
                            <td>{{ Treadline.comment_9 }}</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>{{ Treadline.question_10 }}</td>
                            <td><span v-html="display.answer_10"></span></td>
                            <td>{{ Treadline.comment_10 }}</td>
                        </tr>
                        <tr>
                            <td>11</td>
                            <td>{{ Treadline.question_11 }}</td>
                            <td><span v-html="display.answer_11"></span></td>
                            <td>{{ Treadline.comment_11 }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>


    <div class="col-md-12 col-12">
        <div class="form-group">
            <div class="form-control-wrap">
                <div v-html="Treadline.ending"></div>
            </div>
        </div>
    </div>



    <b-modal :no-enforce-focus="true"
            ref="modal"
            :title="'Treadline Form'"
            @hidden="closeModal()"
            size="lg"
            centered
    >

        <div class="form-group" v-for="index in 11" v-bind:key = index>
            <div>
                <strong><label>
                    {{ $t('QUESTION') }} {{ index }}: {{ Treadline['question_' + index]}}
                </label></strong>
            </div>

            <div>
                <label><strong><span>{{ $t('COMMENT') }}: </span></strong>{{ Treadline['comment_' + index]}}</label>
            </div>
            <div>
                <tiny-editor ref="answer_1" v-if="index == 1" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer1" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
                <tiny-editor ref="answer_2" v-if="index == 2" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer2" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
                <tiny-editor ref="answer_3" v-if="index == 3" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer3" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
                <tiny-editor ref="answer_4" v-if="index == 4" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer4" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
                <tiny-editor ref="answer_5" v-if="index == 5" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer5" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
                <tiny-editor ref="answer_6" v-if="index == 6" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer6" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
                <tiny-editor ref="answer_7" v-if="index == 7" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer7" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
                <tiny-editor ref="answer_8" v-if="index == 8" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer8" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
                <tiny-editor ref="answer_9" v-if="index == 9" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer9" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
                <tiny-editor ref="answer_10" v-if="index == 10" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer10" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
                <tiny-editor ref="answer_11" v-if="index == 11" :initValue="formdata['answer_' + index]" v-on:getEditorContent="setAnswer11" v-on:typing="isTyping_" :params="{answer: 'answer_'+index, type: 'user_treadline'}" class="form-control" />           
            </div>
        </div>

        <small v-html="$t('site.treadline-auto-save-note')"></small>
        <small v-if="isAutoSaving" class="text-red"> | {{$t('site.saving')}}...</small>


        <div slot="modal-footer">

            <button :disabled="!allowSave" class="btn btn-primary btn-sm" @click="saveAnswers()">
                <b-spinner v-if="!allowSave" small label="Small Spinner" type="grow"></b-spinner>
                {{ $t('site.save-changes') }}
            </button>
        </div>
    </b-modal>

</div>

</template>

<script>
import TinyMCE from '../../../components/TinyMCE'
let timer = null;
import tinymce from 'tinymce'
const moment = require('moment')
const {ipcRenderer} = window.require('electron')
export default {
    name: 'user-treadline',
    props: ['properties'],
    components: {
        TinyMCE,
    },
    data: function () {
        var scope = this
        return {
            Treadline: {
                title: '',
                core_of_story: '',
                question_1: '',
                comment_1: '',
                question_2: '',
                comment_2: '',
                question_3: '',
                comment_3: '',
                question_4: '',
                comment_4: '',
                question_5: '',
                comment_5: '',
                question_6: '',
                comment_6: '',
                question_7: '',
                comment_7: '',
                question_8: '',
                comment_8: '',
                question_9: '',
                comment_9: '',
                question_10: '',
                comment_10: '',
                question_11: '',
                comment_11: '',
                ending: ''
            },
            formdata: {
                id: null,
                user_id: '',
                answer_1: '',
                answer_2: '',
                answer_3: '',
                answer_4: '',
                answer_5: '',
                answer_6: '',
                answer_7: '',
                answer_8: '',
                answer_9: '',
                answer_10: '',
                answer_11: ''
            },
            display:{
                id:null,
                answer_1: '',
                answer_2: '',
                answer_3: '',
                answer_4: '',
                answer_5: '',
                answer_6: '',
                answer_7: '',
                answer_8: '',
                answer_9: '',
                answer_10: '',
                answer_11: ''
            },
            temp_formdata: {
                answer_1: '',
                answer_2: '',
                answer_3: '',
                answer_4: '',
                answer_5: '',
                answer_6: '',
                answer_7: '',
                answer_8: '',
                answer_9: '',
                answer_10: '',
                answer_11: ''
            },
            auto_save_interval: null,
            userStoppedTyping: true,
            isAutoSaving: false,
            tinyEditorAccess: null,
            tiny_editor_params: {
                onEditorSetup: function (ed) {
                scope.tinyEditorAccess = ed
                // console.log('ed setup----->', ed, ed.contentDocument)
                },
                onEditorInit: function (ed) {
                // console.log('ed init----->', ed, ed.contentDocument, ed.getDoc())
                // scope.commentbase_editor = ed
                // scope.commentbase_dom = ed.getDoc()
                }
            },
            allowSave: true
        }
    },
    computed: {
        getUser: function () {
            return this.$store.getters.getUser
        },
        bookId: function (){
          return this.properties.bookId
        }
    },
    methods: {

    async getAnswersByBook()
    {
        var scope = this
        await scope.axios.get('http://localhost:3000/treadline/'+ scope.bookId +'/answers-by-book').then(response => {
            console.log(response.data)
            if (response.data[0]) {

                scope.formdata.id = response.data[0].id
                scope.formdata.user_id = response.data[0].user_id
                scope.formdata.answer_1 = response.data[0].answer_1
                scope.formdata.answer_2 = response.data[0].answer_2
                scope.formdata.answer_3 = response.data[0].answer_3
                scope.formdata.answer_4 = response.data[0].answer_4
                scope.formdata.answer_5 = response.data[0].answer_5
                scope.formdata.answer_6 = response.data[0].answer_6
                scope.formdata.answer_7 = response.data[0].answer_7
                scope.formdata.answer_8 = response.data[0].answer_8
                scope.formdata.answer_9 = response.data[0].answer_9
                scope.formdata.answer_10 = response.data[0].answer_10
                scope.formdata.answer_11 = response.data[0].answer_11

                scope.temp_formdata.id = response.data[0].id
                scope.temp_formdata.user_id = response.data[0].user_id
                scope.temp_formdata.answer_1 = response.data[0].answer_1
                scope.temp_formdata.answer_2 = response.data[0].answer_2
                scope.temp_formdata.answer_3 = response.data[0].answer_3
                scope.temp_formdata.answer_4 = response.data[0].answer_4
                scope.temp_formdata.answer_5 = response.data[0].answer_5
                scope.temp_formdata.answer_6 = response.data[0].answer_6
                scope.temp_formdata.answer_7 = response.data[0].answer_7
                scope.temp_formdata.answer_8 = response.data[0].answer_8
                scope.temp_formdata.answer_9 = response.data[0].answer_9
                scope.temp_formdata.answer_10 = response.data[0].answer_10
                scope.temp_formdata.answer_11 = response.data[0].answer_11


                scope.display.answer_1 = response.data[0].answer_1
                scope.display.answer_2 = response.data[0].answer_2
                scope.display.answer_3 = response.data[0].answer_3
                scope.display.answer_4 = response.data[0].answer_4
                scope.display.answer_5 = response.data[0].answer_5
                scope.display.answer_6 = response.data[0].answer_6
                scope.display.answer_7 = response.data[0].answer_7
                scope.display.answer_8 = response.data[0].answer_8
                scope.display.answer_9 = response.data[0].answer_9
                scope.display.answer_10 = response.data[0].answer_10
                scope.display.answer_11 = response.data[0].answer_11

            }
        })
    },

    async getAdminTreadline()
    {
        var scope = this

        await scope.axios.get('http://localhost:3000/treadline/admin-treadline').then(response => {

            if (response.data) {

                scope.Treadline.title = response.data.title
                scope.Treadline.core_of_story = response.data.core_of_story
                scope.Treadline.question_1 = response.data.question_1
                scope.Treadline.comment_1 = response.data.comment_1
                scope.Treadline.question_2 = response.data.question_2
                scope.Treadline.comment_2 = response.data.comment_2
                scope.Treadline.question_3 = response.data.question_3
                scope.Treadline.comment_3 = response.data.comment_3
                scope.Treadline.question_4 = response.data.question_4
                scope.Treadline.comment_4 = response.data.comment_4
                scope.Treadline.question_5 = response.data.question_5
                scope.Treadline.comment_5 = response.data.comment_5
                scope.Treadline.question_6 = response.data.question_6
                scope.Treadline.comment_6 = response.data.comment_6
                scope.Treadline.question_7 = response.data.question_7
                scope.Treadline.comment_7 = response.data.comment_7
                scope.Treadline.question_8 = response.data.question_8
                scope.Treadline.comment_8 = response.data.comment_8
                scope.Treadline.question_9 = response.data.question_9
                scope.Treadline.comment_9 = response.data.comment_9
                scope.Treadline.question_10 = response.data.question_10
                scope.Treadline.comment_10 = response.data.comment_10
                scope.Treadline.question_11 = response.data.question_11
                scope.Treadline.comment_11 = response.data.comment_11
                scope.Treadline.ending = response.data.ending

            }
        })
    },

    closeModal() {
        clearInterval(this.auto_save_interval); // stop the interval
        this.getAnswersByBook();
        this.$refs.modal.hide();
    },

    showModal() {
        this.auto_save_interval = setInterval(this.autoSave, 10000);
        this.$refs.modal.show();
    },

    saveAnswers: async function (showSuccess = true) {
        var scope = this
        
        if(!scope.allowSave){
            return
        }

        scope.formdata.user_id = scope.getUser.data.uuid
        scope.formdata.book_id = scope.bookId
        console.log('heyyyyyyyyyy', scope.temp_formdata)
        for (var i = 1; i<= 11; i++){
            scope.formdata['answer_'+i] = scope.temp_formdata['answer_'+i]?scope.temp_formdata['answer_'+i].replace(/<br\s*[\/]?>/gi, "\n"):''
        }
        await scope.axios.post('http://localhost:3000/treadline/save', scope.formdata).then(response => {

            scope.getAnswersByBook();
            if (response.data && showSuccess) {
                scope.closeModal()

                window.swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: this.$t('messages.successfully-saved'),
                    showConfirmButton: false,
                    timer: 1500
                })

            }

            // always set the editor cursos at the end 
            tinymce.activeEditor.selection.select(tinyMCE.activeEditor.getBody(), true);
            tinymce.activeEditor.selection.collapse(false);
        })

        scope.isAutoSaving = false;
    },

        isTyping() {
            let scope = this;
            
            scope.userStoppedTyping = false;
            if (timer) {
                clearTimeout(timer)
            }

            timer = setTimeout(function () {
                scope.userStoppedTyping = true;
                scope.stopTyping(); // call to save again
            }, 2000)
        },

        isTyping_ (data) { //this is needed since there is a delay in tinymce v-on:click - delay on getting the tinymce content. if removed, saving answer might be empty
            let scope = this
                scope.allowSave = false
                console.log('scope.allowSave = false', data)
        },

        stopTyping() {
            let scope = this;
            console.log('stop typing -------------------')
            // save the answer after user stops typing
            scope.userStoppedTyping = true;
            this.isAutoSaving = true;
            scope.saveAnswers(false);
        },

        autoSave() {
            console.log('auto save')
            if (!this.userStoppedTyping) {
                this.isAutoSaving = true;
                this.saveAnswers(false);
            }
        }, 

        setAnswer1(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_1'] = value
            this.stopTyping()
        },
        setAnswer2(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_2'] = value
            this.stopTyping()
        },
        setAnswer3(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_3'] = value
            this.stopTyping()
        },
        setAnswer4(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_4'] = value
            this.stopTyping()
        },
        setAnswer5(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_5'] = value
        },
        setAnswer6(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_6'] = value
            this.stopTyping()
        },
        setAnswer7(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_7'] = value
            this.stopTyping()
        },
        setAnswer8(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_8'] = value
            this.stopTyping()
        },
        setAnswer9(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_9'] = value
            this.stopTyping()
        },
        setAnswer10(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_10'] = value
            this.stopTyping()
        },
        setAnswer11(value) {
            this.allowSave = true
            console.log('this.allowSave = true')
            this.temp_formdata['answer_11'] = value
            this.stopTyping()
        },


    },
    mounted() {
        var scope = this
        scope.getAdminTreadline()
        scope.getAnswersByBook()
    }
}
</script>
<style scoped>
    .tox .tox-tbtn--bespoke .tox-tbtn__select-label {
        color: #fff;
    }

    .treadline-table p {
        margin-bottom: 1em;
    }

    #tinymce{
        color: #000 !important;
    }
</style>