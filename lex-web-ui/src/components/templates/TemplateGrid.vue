<template>
  <v-card>
    <v-data-table
      v-bind:headers='headers'
      :items='element.data'
      hide-actions
      class='elevation-1'
    >
      <template slot="headers" slot-scope="props">
        <tr
          :style="elementHeaderRowStyle()">
          <td
            v-for="(header, index) in props.headers"
            :style="elementHeaderCellStyle()"
            :key="index">
            {{ header.text }}
          </td>
        </tr>
      </template>
      <template slot='items' slot-scope='props'>
        <tr
          @click="elementRowClick(props.item.MetaData)"
          :style="elementRowStyle(props)">
          <td
            v-for="(header, index) in headers"
            :style="element.template_style.font_color ? `color: ${element.template_style.font_color};`:''"
            :key="index">
            {{ props.item[header.value] }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import isUrl from 'is-url';

export default {
  name: 'template-grid',
  props: ['element'],
  methods: {
    elementRowClick(payload) {
      if (payload) {
        const inputText = payload.text;
        const inputValue = payload.value;
        // empty string
        if (isUrl(inputValue)) {
          window.open(inputValue, '_blank');
        } else {
          const message = {
            type: 'human',
            text: inputValue,
            value: inputText,
          };
          this.$store.dispatch('postTextMessage', message);
        }
      }
    },
    elementRowStyle(props) {
      let style = '';
      if (props.index % 2 === 0) {
        style = this.element.template_style.even_rows_bg_color ? `background-color: ${this.element.template_style.even_rows_bg_color};` : '';
      } else {
        style = this.element.template_style.odd_rows_bg_color ? `background-color: ${this.element.template_style.odd_rows_bg_color};` : '';
      }
      if (props.item.MetaData) {
        style += 'cursor: pointer;';
      }
      return style;
    },
    elementHeaderRowStyle() {
      let style = '';
      style = this.element.template_style.header_bg_color ? `background-color: ${this.element.template_style.header_bg_color}` : '';
      return style;
    },
    elementHeaderCellStyle() {
      let style = this.element.template_style.header_font_color ? `color: ${this.element.template_style.header_font_color};` : '';
      style += this.element.template_style.header_weight ? `font-weight: ${this.element.template_style.header_weight};` : '';
      return style;
    },
  },
  computed: {
    headers() {
      const headers = [];
      Object.keys(this.element.headers).forEach((key) => {
        headers.push({
          text: this.element.headers[key],
          sortable: false,
          value: this.element.headers[key],
        });
      });
      return headers;
    },
  },
};
</script>

<style scoped>
.card {
  position: inherit; /* workaround to card being displayed on top of toolbar shadow */
  border-radius: 15px;
}
</style>
