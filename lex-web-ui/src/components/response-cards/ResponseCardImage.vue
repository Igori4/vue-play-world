<template>
	<v-card>
		<v-card-media
			v-if="responseCard.attachmentLinkUrl"
			v-bind:src="responseCard.attachmentLinkUrl"
			:height="getHeight"
			:style="{ width: getWidth, borderRadius: '15px', boxShadow: '0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)' }"
		></v-card-media>
	</v-card>
</template>

<script>
export default {
  name: 'response-card-image',
  props: ['response-card'],
  data() {
    return {
      imgHeight: '',
      imgWidth: '',
    };
  },
  computed: {
    getHeight() {
      return this.imgHeight;
    },
    getWidth() {
      return this.imgWidth;
    },
  },
  methods: {
    loadImage() {
      const image = new Image();
      image.addEventListener('load', () => {
        const ratio = image.width / image.height;
        this.imgWidth = (image.width > this.$el.clientWidth) ?
          this.$el.clientWidth : image.width;
        this.imgHeight = (image.width > this.$el.clientWidth) ?
          (this.$el.clientWidth / ratio) : image.height;
        this.imgWidth = (this.imgHeight > 200) ?
          `${200 * ratio}px` : `${this.imgWidth}px`;
        this.imgHeight = (this.imgHeight > 200) ? '200px' : `${this.imgHeight}px`;
      });
      image.src = this.responseCard.attachmentLinkUrl;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.loadImage();
    });
  },
};
</script>

<style scoped>
.card {
  position: inherit; /* workaround to card being displayed on top of toolbar shadow */
  box-shadow: none;
}
</style>
