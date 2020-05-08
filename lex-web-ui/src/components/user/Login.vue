<template>
	<div class="form-container">
		<div class="form-body">
			<h3 class="text-center">
				<strong>Log in</strong>
			</h3>
			<div class="form">
				<form v-on:submit.prevent="login" role="form">
					<div class="form-group">
						<label for="email">Email</label>
						<input v-validate="'required|email'" type="email" class="form-field" placeholder="example@email.com" name="email" required v-model="user.email">
					</div>
					<div class="form-group">
						<div class="float-right small-size"><router-link :to="'forgot-password'">Forgot Password?</router-link></div>
						<label for="password">Password</label>
						<input v-validate="'required'" type="password" class="form-field" placeholder="Your Password" name="password" required v-model="user.password">
					</div>
                    <v-btn
                        class="form-button"
                        type="submit"
                        :loading="status"
                        :disabled="status"
                    >
                        Log in
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
          <p><router-link :to="'activate-account'">Activate Account</router-link></p>
        </div>
			</div>
		</div>
    <footer-links></footer-links>
	</div>
</template>

<script>
import FooterLinks from './footer/FooterLinks';

export default {
  name: 'login-form',
  components: {
    FooterLinks,
  },
  data() {
    return {
      user: {
        email: '',
        password: '',
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
    login() {
      this.$store.dispatch('applicationStateDefault');
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        if (this.errors.items.length === 0) {
          this.$store.dispatch('putInRequest');
          this.$store.dispatch('authenticateUser', {
            username: this.user.email,
            password: this.user.password,
          }).then(() => {
            this.$store.dispatch('applicationStateDefault');
            this.$router.push('/');
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
