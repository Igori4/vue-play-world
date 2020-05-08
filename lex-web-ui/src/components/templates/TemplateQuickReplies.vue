<template>
  <div>
    <v-chip
      v-for="quick_reply in element.quick_replies"
      :key="quick_reply.title"
      @click="quickReplyAction(quick_reply)"
      outline
      color="primary">
      <v-avatar v-if="quick_reply.image_url">
        <img :src="quick_reply.image_url" alt="trevor">
      </v-avatar>
      {{quick_reply.title}}
    </v-chip>
  </div>
</template>

<script>

export default {
  name: 'template-quick-replies',
  props: ['element'],
  methods: {
    quickReplyAction(element) {
      const message = {
        type: 'human',
        text: element.payload,
        value: element.title,
      };
      this.$store.dispatch('postTextMessage', message);
    },
  },
};
</script>

<style scoped>
.chip >>> .chip__content:hover {
  cursor: pointer;
}
.chip >>> .avatar {
    height: 26px!important;
    margin-left: -8px;
    margin-right: 8px;
    min-width: 26px;
    width: 26px!important;
}
</style>
