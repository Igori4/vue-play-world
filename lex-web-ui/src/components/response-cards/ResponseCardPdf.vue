<template>
  <iframe :src="getPdfUrl" width="100%" height="480"></iframe>
</template>

<script>
export default {
  name: 'response-card-pdf',
  props: ['response-card'],
  computed: {
    getPdfUrl() {
      let pdfUrl = '';
      if (this.responseCard.attachmentLinkUrl.endsWith('.pdf')) {
        pdfUrl = this.responseCard.attachmentLinkUrl;
      } else if (this.responseCard.attachmentLinkUrl.endsWith('/view')) {
        pdfUrl = this.responseCard.attachmentLinkUrl.replace('/view', '/preview');
      }
      return pdfUrl;
    },
  },
};
</script>

<style scoped>
</style>
