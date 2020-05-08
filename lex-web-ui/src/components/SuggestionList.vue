<template>
  <v-navigation-drawer
    v-model="drawer"
    clipped
    fixed
    app
    enable-resize-watcher
    @input="emitIsOpen"
    class="grey darken-4"
  >
    <v-subheader class="mt-3 white--text headline">Useful Shortcuts:</v-subheader>
    <v-list v-if="suggestions" class="suggestion-list">
      <v-list-tile
        v-on:click="triggerMessage(suggestion)"
        v-for="suggestion in suggestions"
        :key="suggestion.text"
      >
        <v-list-tile-content>
          <v-list-tile-title class="suggest-list-item">{{suggestion.text}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

export default {
  name: 'suggestion-list',
  data() {
    return {
      drawer: true,
    };
  },
  computed: {
    suggestions() {
      return this.$store.state.suggestions;
    },
  },
  methods: {
    triggerMessage(payload) {
      const inputText = payload.value.trim();
      const inputValue = payload.text.trim();
      // empty string
      if (!inputText.length) {
        return Promise.resolve();
      }
      if (!inputValue.length) {
        return Promise.resolve();
      }

      const message = {
        type: 'human',
        text: inputText,
        value: inputValue,
      };
      return this.$store.dispatch('postTextMessage', message);
    },
    emitIsOpen(payload) {
      this.$emit('input', payload);
    },
  },
};
</script>

<style scoped>
.suggestion-list li{
  border: 1px solid #fff;
  border-radius: 30px;
  margin: 5px 10px;
}
.suggestion-list li >>> a {
  color: #fff !important;
}
.suggestion-list li:hover{
  background: #F1F0F0;
  color: #000 !important;
  border: 1px solid #F1F0F0;
}
.suggestion-list li:hover >>> a {
  color: #000 !important;
}
</style>
