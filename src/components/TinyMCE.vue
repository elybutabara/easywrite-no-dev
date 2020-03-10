<template>
  <input v-model="initValue" type="text" class="tiny-area" v-on:click="emitToParent" />
</template>

<script>
import tinymce from 'tinymce'

export default {
  name: 'TinyMCE',
  data: function () {
    return {
      initConfig: {
        selector: 'input.tiny-area',
        min_height: 400,
        resize: false,
        hidden_input: false,
        plugins: [
          'autolink link lists charmap hr anchor',
          'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime nonbreaking',
          'table contextmenu directionality template paste textcolor'// remove autoresize
        ],
        toolbar: [
          'undo | redo | print | copy | cut | paste | bold | italic | underline | strikethrough | backcolor | leftChev | rightChev | enDash | numlist | bullist | alignleft | aligncenter | alignright'
        ],
        browser_spellcheck: true,
        menubar: false,
        branding: false,
        autoresize_on_init: false,
        forced_root_block: false,
        setup: function (editor) {
          editor.ui.registry.addButton('leftChev', {
            text: '<<',
            tooltip: 'leftChev',
            onAction: function (_) {
              editor.insertContent('&#171;')
            }
          })

          editor.ui.registry.addButton('rightChev', {
            text: '>>',
            tooltip: 'rightChev',
            onAction: function (_) {
              editor.insertContent('&#187;')
            }
          })

          editor.ui.registry.addButton('enDash', {
            text: '-',
            tooltip: 'en dash',
            onAction: function (_) {
              editor.insertContent('&#8211;')
            }
          })

          editor.on('change', function (e) {
            window.jQuery('#' + this.id).val(editor.getContent()).click()
          })
        }
      }
    }
  },
  props: ['initValue', 'disabled'],
  methods: {
    initEditor: function () {
      var vm = this

      tinymce.init(vm.initConfig)

      if (vm.$attrs.value) {
        var editor = tinymce.get(vm.$attrs.id)
        editor.setContent(vm.$attrs.value)
      }
    },
    emitToParent (event) {
      this.$emit('getEditorContent', this.$el.value)
    }
  },
  updated: function () {
    // Since we're using Ajax to load data, hence we have to use this hook because when parent's data got loaded, it will fire this hook.
    // Depends on your use case, you might not need this
    var vm = this

    if (vm.initValue) {
      var editor = tinymce.get(vm.$el.id)
      editor.setContent(vm.initValue)
    }
  },
  mounted () {
    var vm = this
    vm.initEditor()
  }
}
</script>

<style scoped>

</style>
