<template>
  <div id="lex-app">
    <v-alert color="success" icon="check_circle" dismissible v-model="isSuccess">
      {{getStateMessage}}
    </v-alert>
    <v-alert color="error" icon="warning" dismissible v-model="isError">
      {{getStateMessage}}
    </v-alert>
    <page
      v-bind:favIcon="favIcon"
      v-bind:pageTitle="pageTitle"
      v-once
    ></page>
    <router-view></router-view>
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
import VeeValidate from 'vee-validate';
import VueTruncate from 'vue-truncate-filter';
import VueMediaEmbed from 'vue-media-embed';
import router from '@/router';
import Page from '@/components/Page';
import { Loader as LexWebUi } from '@/lex-web-ui';

import flowerLogo from '../node_modules/material-design-icons/maps/2x_web/ic_local_florist_white_18dp.png';

function getToolbarLogo() {
  // Search for logo image files in ../assets/
  // if not found, assigns the default flower logo.
  const toolbarLogoRequire =
    // Logo loading depends on the webpack require.context API:
    // https://webpack.github.io/docs/context.html
    require.context('@/assets', false, /^\.\/logo.(png|jpe?g|svg)$/);
  const toolbarLogoRequireKey = toolbarLogoRequire.keys().pop();

  return (toolbarLogoRequireKey) ?
    toolbarLogoRequire(toolbarLogoRequireKey) :
    flowerLogo;
}

function getFavIcon() {
  // search for favicon in assets directory - use toolbar logo if not found
  const favIconRequire =
    require.context('@/assets', false, /^\.\/favicon.(png|jpe?g|svg|ico)$/);
  const favIconRequireKey = favIconRequire.keys().pop();
  return (favIconRequireKey) ?
    favIconRequire(favIconRequireKey) :
    flowerLogo;
}

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.use(VeeValidate);
Vue.use(VueTruncate);

const lexWebUi = new LexWebUi({
  ui: {
    toolbarLogo: getToolbarLogo(),
  },
});
const { store } = lexWebUi;
Vue.use(VueMediaEmbed, { store });

router.beforeEach((to, from, next) => {
  if (to.query.ref && to.query.ref !== '') {
    store.commit(
      'setRefParam',
      to.query.ref,
    );
  }
  if (from.query.ref && from.query.ref !== '') {
    store.commit(
      'setRefParam',
      from.query.ref,
    );
  }
  next();
});

export default {
  name: 'lex-app',
  store: lexWebUi.store,
  components: { Page },
  data() {
    return {
      favIcon: getFavIcon(),
      pageTitle: lexWebUi.store.state.config.ui.pageTitle || '1-min Me',
    };
  },
  computed: {
    isError: {
      set() {
        this.$store.dispatch('applicationStateDefault');
      },
      get() {
        return this.$store.getters.isError;
      },
    },
    isSuccess: {
      set() {
        this.$store.dispatch('applicationStateDefault');
      },
      get() {
        return this.$store.getters.isSuccess;
      },
    },
    getStateMessage() {
      return this.$store.getters.getStateMessage;
    },
  },
};
</script>

<style>
@import '../node_modules/roboto-fontface/css/roboto/roboto-fontface.css';
@import '../node_modules/material-design-icons/iconfont/material-icons.css';
@import '../node_modules/vuetify/dist/vuetify.min.css';
@import './assets/css/style.css';
#lex-app {
  min-height: 100vh;
}
body, html {
  font-family: Roboto,sans-serif;
  overflow-y: auto; /* allow reload by scrolling down on mobile */
  overflow-x: hidden;
}
</style>
