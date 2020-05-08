<template>
  <v-layout row>
    <v-flex xs8>
      <v-text-field
        placeholder="Please select file..."
        v-bind:value="name"
        disabled
        single-line
      ></v-text-field>
    </v-flex>
    <v-flex xs4>
      <v-btn dark class="btn--dark-flat-focused jbtn-file">
        {{ title }}
        <input
          ref="selectFile"
          type="file"
          v-on:change="fileSelected"
          accept=".pdf, .doc, .docx, .ppt, .pptx, .xlsx, .xls, text/plain, application/pdf, image/*"
        >
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'upload-button',
    props: {
      selectedCallback: Function,
      title: String,
      name: String,
    },
    methods: {
      fileSelected(e) {
        if (this.selectedCallback) {
          if (e.target.files[0]) {
            this.selectedCallback(e.target.files[0]);
          } else {
            this.selectedCallback(null);
          }
        }
      },
      fileReset() {
        this.$refs.selectFile.value = '';
      },
    },
  };
</script>

<style scoped>
  .jbtn-file {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: 15px;
  }

  .jbtn-file input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    cursor: inherit;
    display: block;
  }
</style>
