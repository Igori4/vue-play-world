<template>
  <v-card>
		<video width="100%" controls v-if="responseCard.attachmentLinkUrl">
				<source v-bind:src="responseCard.attachmentLinkUrl">
		</video>
	</v-card>
</template>

<script>
export default {
  name: 'response-card-video',
  props: ['response-card'],
};
</script>

<style scoped>
.card {
  position: inherit; /* workaround to card being displayed on top of toolbar shadow */
  border-radius: 15px;
}
</style>
