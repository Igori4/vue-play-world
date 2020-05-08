<template>
  <v-card :class="isPopup?'card-popup':''">
    <v-card-media
      v-if="responseCard.imageUrl"
      v-bind:src="responseCard.imageUrl"
      v-bind:class="responseCard.attachmentLinkUrl?'card__link':''"
      v-on:click="openLink(responseCard.attachmentLinkUrl)"
      height="160px"
    ></v-card-media>
    <v-card-title v-if="shouldDisplayResponseCardTitle && responseCard.title.trim()" primary-title class="red lighten-5">
      <span :class="responseCard.attachmentLinkUrl?'headline card__link':'headline'" v-on:click="openLink(responseCard.attachmentLinkUrl)">{{responseCard.title | truncate(30)}}</span>
    </v-card-title>
    <v-card-text v-if="responseCard.subTitle">
      <span>{{responseCard.subTitle | truncate(80)}}</span>
    </v-card-text>
    <v-card-actions
      v-for="(button, index) in responseCard.buttons"
      v-bind:key="index"
      actions
      class="button-row"
      v-if="button.text && button.value"
    >
      <v-btn
        v-if="checkIsURL(button.value)"
        default
        tag="a"
        class="botActionButton"
        v-bind:href="button.value"
        target="_blank"
      >
        {{button.text}}
      </v-btn>
      <v-btn
        v-else
        v-on:click.once.native="onButtonClick(button.text, button.value)"
        v-bind:disabled="hasButtonBeenClicked"
        default
        class="botActionButton"
      >
        {{button.text}}
      </v-btn>
    </v-card-actions>
  </v-card>
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
import isUrl from 'is-url';

export default {
  name: 'response-card',
  props: ['response-card'],
  data() {
    return {
      hasButtonBeenClicked: false,
    };
  },
  computed: {
    shouldDisplayResponseCardTitle() {
      return this.$store.state.config.ui.shouldDisplayResponseCardTitle;
    },
    isPopup() {
      return this.$store.getters.isPopup;
    },
  },
  methods: {
    onButtonClick(text, value) {
      this.hasButtonBeenClicked = true;
      const message = {
        type: 'human',
        text: value,
        value: text,
      };

      this.$store.dispatch('postTextMessage', message);
    },
    checkIsURL(str) {
      return isUrl(str);
    },
    openLink(link) {
      if (link) {
        window.open(link, '_blank');
      }
      return false;
    },
  },
};
</script>

<style scoped>
.card {
  /* width: 75vw; */
  position: inherit; /* workaround to card being displayed on top of toolbar shadow */
  padding-bottom: 0.5em;
  border-radius: 15px;
}
.card__title {
  background-color: #fff !important;
  padding: 0 0.33em;
  padding-top: 0.33em;
}
.card__title .headline {
  font-size: 18px !important;
  font-weight: 600 !important;
}
.card__text {
  padding: 0 0.33em 0.33em;
  overflow: hidden;
  height: 46.61px;
}
.card__actions.button-row {
  justify-content: center;
  padding-bottom: 0.15em;
}
.card__link {
  cursor: pointer;
}
.botActionButton {
  width: 100%;
}
.red.botActionButton {
  background-color: #EE2024 !important;
  color: #ffffff !important;
}
.card-popup {
  width: 85%;
}
.card-popup .card__title .headline {
  font-size: 17px !important;
}
</style>
