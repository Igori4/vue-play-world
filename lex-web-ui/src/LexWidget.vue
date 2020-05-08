<template>
  <div id="lex-widget" class="popup">
    <transition name="slide-fade">
      <lex-widget-ui :class="{ 'is-opened': isChat }" v-show="isChat"></lex-widget-ui>
    </transition>
    <v-fab-transition>
      <v-btn
        color="red"
        fab
        fixed
        bottom
        medium
        right
        v-model="isChat"
        class="btn--chat"
        @click.native="isChat=!isChat"
      >
        <v-icon>forum</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
/*
Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file
except in compliance with the License. A copy of the License is located at

http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS"
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
License for the specific language governing permissions and limitations under the License.
*/

/* eslint no-console: ["error", { allow: ["warn", "error", "info"] }] */
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueTruncate from 'vue-truncate-filter';
import VueMediaEmbed from 'vue-media-embed';
import { Loader as LexWidgetUi } from '@/lex-widget-ui';

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.use(VueTruncate);

const lexWidgetUi = new LexWidgetUi();
const { store } = lexWidgetUi;
Vue.use(VueMediaEmbed, { store });

export default {
  name: 'lex-widget',
  store: lexWidgetUi.store,
  data() {
    return {
      isChat: false,
    };
  },
  beforeMount() {
    this.$store.commit('popup');
  },
};
</script>

<style>
body, html {
  overflow-y: auto; /* allow reload by scrolling down on mobile */
  overflow-x: hidden;
}
.popup .container{
  padding: 3px !important;
}
.popup .message-text{
  padding: 0.6em !important;
	display: inline-block;
  overflow-wrap: break-word;
  word-break: normal;
}
.popup .chip{
  font-size: calc(0.9em + 0.25vmin) !important;
  padding: 0 10px !important;
}
.popup .response-card .card__text{
  height: auto !important;
}
.popup .response-card .btn{
  height: 30px !important;
  font-size: 13px !important;
}
</style>
<style scoped>
@import '../node_modules/roboto-fontface/css/roboto/roboto-fontface.css';
@import '../node_modules/material-design-icons/iconfont/material-icons.css';
@import '../node_modules/vuetify/dist/vuetify.min.css';
#lex-widget {
  position: relative;
  min-height: 100%;
  width: 100%;
}
.btn--chat i {
  color: #fff !important;
}
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
  /* transition: all .3s ease; */
}
@media(max-width: 351px){
  .btn--chat.btn--active{
    top: 14px;
    right: 14px;
  }
}
</style>

