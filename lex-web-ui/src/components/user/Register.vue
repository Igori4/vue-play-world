<template>
	<div class="form-container">
		<div class="form-body">
			<h3 class="text-center">
				<strong>Register</strong>
			</h3>
			<div class="form">
				<form v-on:submit.prevent="register" role="form">
          <div class="form-group">
						<label for="first_name">First Name</label>
						<input v-validate="'required'" type="text" class="form-field" placeholder="Your First Name" name="first_name" required v-model="user.attributes.first_name">
					</div>
          <div class="form-group">
						<label for="last_name">Last Name</label>
						<input v-validate="'required'" type="text" class="form-field" placeholder="Your Last Name" name="last_name" required v-model="user.attributes.last_name">
					</div>
					<div class="form-group">
						<label for="email">Email</label>
						<input v-validate="'required|email'" type="email" class="form-field" placeholder="example@email.com" name="email" required v-model="user.username">
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<input v-validate="'required'" type="password" class="form-field" placeholder="Your Password" name="password" required v-model="user.password">
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
            Register
          </v-btn>
				</form>
        <div class="spacer20"></div>
        <div class="text-center">
          <p>
            Already have an Account?
            <br>
            <router-link :to="'login'">Login.</router-link>
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
  name: 'register',
  components: {
    FooterLinks,
  },
  data() {
    return {
      user: {
        username: '',
        password: '',
        attributes: {
          first_name: '',
          last_name: '',
          ref_param: '',
        },
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
  mounted() {
    this.user.attributes.ref_param = this.$store.state.refParam === '' ? this.$store.state.config.lex.refParam : this.$store.state.refParam;
  },
  computed: {
    status() {
      return this.$store.getters.isRequest;
    },
  },
  methods: {
    register() {
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
            this.user.attributes.email = this.user.username;
            this.$store.dispatch('signUp', {
              username: this.user.username,
              password: this.user.password,
              attributes: {
                email: this.user.username,
                given_name: this.user.attributes.first_name,
                family_name: this.user.attributes.last_name,
                'custom:ref_param': this.user.attributes.ref_param,
                'custom:source_url': window.location.href,
              },
            }).then(() => {
              this.$store.dispatch('putInSuccess', 'CustomRegistrationSuccess');
              this.$router.push('/activate-account');
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
