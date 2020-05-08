<template>
  <v-card>
    <v-list
      three-line>
      <template
        v-for="(list, index) in element.elements">
        <v-list-tile
          :key="index"
          href="#"
          @click.prevent="listElementClick(list)">
          <v-list-tile-content>
            <v-list-tile-title
              v-html="list.title" />
            <v-list-tile-sub-title
              v-html="list.subtitle" />
            <v-list-tile-sub-title
              v-if="list.button && checkUrl(list.button.value)"
              v-html="list.button.value" />
          </v-list-tile-content>
          <v-list-tile-avatar
            class="thumbnail"
            size="60px"
            tile>
            <img
              v-bind:src="list.image_url" />
          </v-list-tile-avatar>
        </v-list-tile>
        <v-divider
          :key="`divider_${index}`"
          v-if="element.button || index != element.elements.length - 1" />
      </template>
      <a
        v-if="element.button"
        class="read_more"
        @click="readMoreClick()">
        {{ element.button.text }}
      </a>
    </v-list>
  </v-card>
</template>

<script>
import isUrl from 'is-url';

export default {
  name: 'template-grid',
  props: ['element'],
  methods: {
    readMoreClick() {
      if (isUrl(this.element.button.value)) {
        window.open(this.element.button.value, '_blank');
      } else {
        const message = {
          type: 'human',
          text: this.element.button.value,
          value: this.element.button.text,
        };
        this.$store.dispatch('postTextMessage', message);
      }
    },
    listElementClick(list) {
      if (list.button) {
        if (isUrl(list.button.value)) {
          window.open(list.button.value, '_blank');
        } else {
          const message = {
            type: 'human',
            text: list.button.value,
            value: list.button.text,
          };
          this.$store.dispatch('postTextMessage', message);
        }
      }
    },
    checkUrl(value) {
      return isUrl(value);
    },
  },
};
</script>

<style scoped>
.card {
  position: inherit; /* workaround to card being displayed on top of toolbar shadow */
  border-radius: 15px;
  text-align: center;
}
.thumbnail > img{
  border-radius: 6px;
}
.list__tile__content {
  padding-right: 15px;
}
.read_more {
  display: block;
  padding-top: 12px;
  padding-bottom: 5px;
  font-size: 16px;
  text-decoration: none;
}
</style>
