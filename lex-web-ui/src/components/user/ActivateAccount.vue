<template>
	<div class="form-container">
		<div class="form-body">
			<h3 class="text-center">
				<strong>Activate Account</strong>
			</h3>
			<div class="form">
				<form v-on:submit.prevent="activate" role="form">
					<div class="form-group">
						<label for="email">Email</label>
						<input v-validate="'required|email'" type="email" class="form-field" placeholder="example@email.com" name="email" required v-model="user.email">
					</div>
					<div class="form-group">
            <div class="float-right small-size"><router-link :to="'resend-verification'">Resend Email Verification?</router-link></div>
						<label for="code">Verification Code</label>
						<input v-validate="'required'" type="text" class="form-field" placeholder="Verification Code" name="code" required v-model="user.code">
					</div>
          <v-btn
            class="form-button"
            type="submit"
            :loading="status"
            :disabled="status"
          >
            Activate
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
  name: 'activate-account',
  components: {
    FooterLinks,
  },
  data() {
    return {
      user: {
        email: '',
        code: '',
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
    activate() {
      this.$store.dispatch('applicationStateDefault');
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        if (this.errors.items.length === 0) {
          this.$store.dispatch('putInRequest');
          this.$store.dispatch('confirmRegistration', {
            username: this.user.email,
            code: this.user.code,
          }).then(() => {
            this.$store.dispatch('putInSuccess', 'CustomActivateSuccess');
            this.$router.push('/login');
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
