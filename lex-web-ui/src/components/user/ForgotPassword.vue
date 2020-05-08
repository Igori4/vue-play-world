<template>
	<div class="form-container">
		<div class="form-body">
			<h3 class="text-center">
				<strong>Forgot Password</strong>
			</h3>
			<div class="form">
				<form v-on:submit.prevent="forgot" role="form">
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
            Send
          </v-btn>
				</form>
        <div class="spacer20"></div>
        <div class="text-center">
          <p>
            Don't have an account yet?
            <br>
            <router-link :to="'register'">Create account.</router-link>
          </p>
        </div>
        <div class="text-center">
          <p><router-link :to="'reset-password'">Reset Password.</router-link></p>
        </div>
			</div>
		</div>
    <footer-links></footer-links>
	</div>
</template>

<script>
import FooterLinks from './footer/FooterLinks';

export default {
  name: 'forgot-password',
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
    forgot() {
      this.$store.dispatch('applicationStateDefault');
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        if (this.errors.items.length === 0) {
          this.$store.dispatch('putInRequest');
          this.$store.dispatch('forgotPassword', {
            username: this.user.email,
          }).then(() => {
            this.$store.dispatch('putInSuccess', 'CustomForgotPasswordSuccess');
            this.$router.push('/reset-password');
          }).catch((error) => {
            this.$store.dispatch('putInError', error);
          });
        }
      });
    },
  },
};
</script>
