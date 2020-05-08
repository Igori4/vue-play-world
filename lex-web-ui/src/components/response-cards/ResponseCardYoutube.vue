<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <vue-media-embed
	    v-if="responseCard.attachmentLinkUrl"
	    :source="responseCard.attachmentLinkUrl"
	    :color="'white'"
	    :allow-fullscreen="0"
	    :modest-branding="0"
      :class="[video.youtube ? 'pt-3' : '']"
	    />
        <v-card-title primary-title>
          <div>
            <h3 :class="isPopup ? 'title mb-1': 'headline mb-0'">{{ this.video.title }}</h3>
            <div>{{ this.video.description }}</div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios';

export default {
  name: 'response-card-youtube',
  props: ['response-card'],
  data() {
    return {
      video: {
        title: '',
        description: '',
        youtube: '',
      },
    };
  },
  computed: {
    isPopup() {
      return this.$store.getters.isPopup;
    },
  },
  created() {
    if (this.responseCard.attachmentLinkUrl.indexOf('youtube') !== -1) {
      this.video.youtube = true;
      const regex = /(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
      const match = this.responseCard.attachmentLinkUrl.match(regex);
      const apiKey = 'AIzaSyCpFWKdFW0rljQ3IT5czy7s9m2Z21qJMag';
      axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${match[2]}&key=${apiKey}&part=snippet`)
        .then((response) => {
          const result = response.data.items[0];
          this.video.title = result.snippet.title;
          this.video.description = result.snippet.description;
          console.info(this.video);
        }).catch((error) => {
          console.error('Error', error);
        });
    } else {
      this.video.youtube = false;
      const regex = /https:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
      const match = this.responseCard.attachmentLinkUrl.match(regex);
      axios.get(`https://vimeo.com/api/v2/video/${match[2]}.json`)
        .then((response) => {
          const result = response.data[0];
          this.video.title = result.title;
          this.video.description = result.description;
        }).catch((error) => {
          console.error('Error', error);
        });
    }
  },
};
</script>

<style scoped>
.card {
  position: inherit; /* workaround to card being displayed on top of toolbar shadow */
  border-radius: 15px;
}
.title {
  font-size: 16px!important;
  font-weight: 600;
  line-height: 1.2!important;
}
</style>
