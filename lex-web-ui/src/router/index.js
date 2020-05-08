/*
 Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Amazon Software License (the "License"). You may not use this file
 except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/asl/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS"
 BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
 License for the specific language governing permissions and limitations under the License.
 */

import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/user/Login';
import Register from '@/components/user/Register';
import ForgotPassword from '@/components/user/ForgotPassword';
import ActivateAccount from '@/components/user/ActivateAccount';
import ResetPassword from '@/components/user/ResetPassword';
import ResendVerificationCode from '@/components/user/ResendVerificationCode';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.PUBLIC_PATH || '/',
  routes: [
    {
      path: '/',
      name: 'LexWebUi',
      component: { template: '<lex-web-ui></lex-web-ui>' },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/forgot-password',
      name: 'Forgot Password',
      component: ForgotPassword,
    },
    {
      path: '/reset-password',
      name: 'Reset Password',
      component: ResetPassword,
    },
    {
      path: '/activate-account',
      name: 'Activate Account',
      component: ActivateAccount,
    },
    {
      path: '/resend-verification',
      name: 'Resend Verification',
      component: ResendVerificationCode,
    },
  ],
});

export default router;
