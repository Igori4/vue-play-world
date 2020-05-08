<template>
	<div class="form-container">
		<div class="form-body">
			<h3 class="text-center">
				<strong>Resend Verification Code</strong>
			</h3>
			<div class="form">
				<form v-on:submit.prevent="resend" role="form">
					<div class="form-group">
						<label for="email">Email</label>
						<input v-validate="'required|email'" type="email" class="form-field" placeholder="example@email.com" name="email" required v-model="user.email">
					</div>
          <v-btn
            class="form-button"
            type="submit"
            :loading="status"
            :disabled="status"
          >
            Resend
          </v-btn>
				</form>
        <div class="spacer20"></div>
        <div class="text-center">
          <p>
            Already activated?
            <br>
            <router-link :to="'login'">Login.</router-link>
          </p>
        </div>
        <div class="text-center">
          <p><router-link :to="'register'">Create account.</router-link></p>
        </div>
			</div>
		</div>
    <footer-links></footer-links>
	</div>
</template>

<script>
import FooterLinks from './footer/FooterLinks';

export default {
  name: 'resend-verification',
  components: {
    FooterLinks,
  },
  data() {
    return {
      user: {
        email: '',
      },
    };
  },
  async beforeMount() {
    try {
      await this.$store.dispatch('getCurrentUser');
      this.$router.push('/');
    } catch (e) {
      console.info(e);
    }
  },
  computed: {
    status() {
      return this.$store.getters.isRequest;
    },
  },
  methods: {
    resend() {
      this.$store.dispatch('applicationStateDefault');
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        if (this.errors.items.length === 0) {
          this.$store.dispatch('putInRequest');
          this.$store.dispatch('resendConfirmationCode', {
            username: this.user.email,
          }).then(() => {
            this.$store.dispatch('putInSuccess', 'CustomResendSuccess');
            this.$router.push('/activate-account');
          }).catch((error) => {
            this.$store.dispatch('putInError', error);
          });
        }
      });
    },
  },
};
</script>
<style scoped>
.error{
  background-color: #EE2024 !important;
  border-color: #EE2024 !important;
}
.alert {
  margin: 4px auto 15px;
}
</style>
