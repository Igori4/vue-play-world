<template>
  <v-toolbar-items v-if="username" class="botToolbar--menu">
    <v-menu offset-y>
      <v-btn flat slot="activator" class="menu-activator">
        <span class="hidden-sm-and-down">{{username}}</span>
        <v-icon right dark>more_vert</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile @click="openChangePasswordModal">
          <v-list-tile-title>Change Password</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-title>Logout</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-dialog persistent v-model="isChangePasswordModalOpened" max-width="500px">
      <v-btn class="cp_dialog_close" icon @click.native="isChangePasswordModalOpened = false" dark>
        <v-icon>close</v-icon>
      </v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Change Password</span>
        </v-card-title>
        <v-card-text style="padding-bottom: 32px;">
          <form v-on:submit.prevent="changePassword" role="form">
            <div class="form-group">
              <label for="old_password">Old Password</label>
              <input v-validate="'required'" type="password" class="form-field" placeholder="Your Old Password" name="old_password" required v-model="user.old_password">
            </div>
            <div class="form-group">
              <label for="password">New Password</label>
              <input v-validate="'required'" type="password" class="form-field" placeholder="New Password" name="password" required v-model="user.password">
            </div>
            <div class="form-group">
              <label for="c_password">Confirm Password</label>
              <input v-validate="'required'" type="password" class="form-field" placeholder="Confirm Password" name="c_password" required v-model="user.c_password">
            </div>
            <v-btn
              class="form-button"
              type="submit"
              :loading="status"
              :disabled="status"
            >
              Change Password
            </v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-toolbar-items>
</template>
<script>
export default {
  name: 'account-actions',
  data() {
    return {
      isChangePasswordModalOpened: false,
      user: {
        old_password: '',
        password: '',
        c_password: '',
      },
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('signOut')
        .then(() => {
          this.$router.push('/login');
        });
    },
    openChangePasswordModal() {
      this.isChangePasswordModalOpened = true;
    },
    changePassword() {
      this.$store.dispatch('applicationStateDefault');
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        if (this.errors.items.length === 0) {
          if (this.user.password !== this.user.c_password) {
            this.$store.dispatch('putInError', {
              code: 'CustomPasswordDoesnotMatched',
              message: 'Passwords are not same',
            });
          } else {
            this.$store.dispatch('putInRequest');
            this.$store.dispatch('changePassword', {
              oldPassword: this.user.old_password,
              newPassword: this.user.password,
            }).then(() => {
              this.$store.dispatch('putInSuccess', 'CustomPasswordChangedSuccess');
              this.isChangePasswordModalOpened = false;
              this.user = {
                password: '',
                old_password: '',
                c_password: '',
              };
            }).catch((error) => {
              this.$store.dispatch('putInError', error);
            });
          }
        }
      });
    },
  },
  computed: {
    username() {
      const cognito = this.$store.state.cognito.user;
      return cognito ? cognito.username : null;
    },
    status() {
      return this.$store.getters.isRequest;
    },
  },
};
</script>
<style scoped>
.menu-activator {
  text-transform: lowercase;
}
.cp_dialog_close {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #EE2024;
}
@media only screen and (max-width: 599px) {
  .menu-activator {
    min-width: 24px;
  }
  .menu-activator >>> .btn__content {
    padding: 0;
  }
  .menu-activator i{
    margin-left: 0;
    margin-right: 5px;
  }
  .botToolbar--menu {
    margin-right: 0px !important;
  }
}
</style>