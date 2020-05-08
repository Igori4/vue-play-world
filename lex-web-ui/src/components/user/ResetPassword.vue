<template>
	<div class="form-container">
		<div class="form-body">
			<h3 class="text-center">
				<strong>Reset Password</strong>
			</h3>
			<div class="form">
				<form v-on:submit.prevent="activate" role="form">
					<div class="form-group">
						<label for="email">Email</label>
						<input v-validate="'required|email'" type="email" class="form-field" placeholder="example@email.com" name="email" required v-model="user.email">
					</div>
					<div class="form-group">
            <div class="float-right small-size"><router-link :to="'forgot-password'">Resend Verification Code?</router-link></div>
						<label for="code">Verification Code</label>
						<input v-validate="'required'" type="text" class="form-field" placeholder="Verification Code" name="code" required v-model="user.code">
					</div>
          <div class="form-group">
						<label for="password">New Password</label>
						<input v-validate="'required'" type="password" class="form-field" placeholder="Your New Password" name="password" required v-model="user.password">
					</div>
          <div class="form-group">
						<label for="c_password">Confirm Password</label>
						<input v-validate="'required'" type="password" class="form-field" placeholder="Confirm Password" name="c_password" required v-model="c_password">
					</div>
          <v-btn
            class="form-button"
            type="submit"
            :loading="status"
            :disabled="status"
          >
            Reset
          </v-btn>
				</form>
        <div class="spacer20"></div>
        <div class="text-center">
          <p>
            Have Account?
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
  name: 'reset-password',
  components: {
    FooterLinks,
  },
  data() {
    return {
      user: {
        email: '',
        code: '',
        password: '',
      },
      c_password: '',
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
          if (this.user.password !== this.c_password) {
            this.$store.dispatch('putInError', {
              code: 'CustomPasswordDoesnotMatched',
              message: 'Passwords are not same',
            });
          } else {
            this.$store.dispatch('putInRequest');
            this.$store.dispatch('confirmPassword', {
              username: this.user.email,
              code: this.user.code,
              newPassword: this.user.password,
            }).then(() => {
              this.$store.dispatch('putInSuccess', 'CustomPasswordResetSuccess');
              this.$router.push('/login');
            }).catch((error) => {
              this.$store.dispatch('putInError', error);
            });
          }
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
