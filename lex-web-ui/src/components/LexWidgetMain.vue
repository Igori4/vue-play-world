<template>
  <div id="lex-web">
    <v-app class="widget-container">
      <div class="widget-header">
        <div class="header-logo">
          <img class="header-logo-img" :src="require('@/assets/logo.jpg')" alt="1-mim Me"/>
        </div>
        <div class="header-title">1-mim Me: conversations</div>
      </div>
      <message-list
        v-show="!isUiMinimized"
        :offset=64
      ></message-list>
      <input-container
        v-if="!isUiMinimized"
        v-bind:text-input-placeholder="textInputPlaceholder"
        v-bind:initial-speech-instruction="initialSpeechInstruction"
      ></input-container>
    </v-app>
  </div>
</template>

<script>
/*
Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file
except in compliance with the License. A copy of the License is located at

http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS"
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
License for the specific language governing permissions and limitations under the License.
*/

/* eslint no-console: ["error", { allow: ["warn", "error", "info"] }] */
import MessageList from '@/components/MessageList';
import InputContainer from '@/components/InputContainer';

export default {
  name: 'lex-widget-main',
  components: {
    MessageList,
    InputContainer,
  },
  computed: {
    initialSpeechInstruction() {
      return this.$store.state.config.lex.initialSpeechInstruction;
    },
    textInputPlaceholder() {
      return this.$store.state.config.ui.textInputPlaceholder;
    },
    toolbarColor() {
      return this.$store.state.config.ui.toolbarColor;
    },
    toolbarTitle() {
      return this.$store.state.config.ui.toolbarTitle;
    },
    toolbarLogo() {
      return this.$store.state.config.ui.toolbarLogo;
    },
    isUiMinimized() {
      return this.$store.state.isUiMinimized;
    },
    lexState() {
      return this.$store.state.lex;
    },
  },
  watch: {
    // emit lex state on changes
    lexState() {
      this.$emit('updateLexState', this.lexState);
    },
  },
  beforeMount() {
    const sessionAttributes = {
      first_name: '',
      last_name: '',
      ref_param: '',
      client: 'widget_bot',
      source_url: window.parent.location.href,
    };
    this.$store.commit(
      'setConfigSessionAttributes',
      sessionAttributes,
    );
    this.$store.commit(
      'setLexSessionAttributes',
      sessionAttributes,
    );
    if (this.$store.state.config.urlQueryParams.lexWigetUiEmbed !== 'true') {
      console.info('running in standalone mode');
      this.$store.commit('setIsRunningEmbedded', false);
      this.$store.commit('setAwsCredsProvider', 'cognito');
    } else {
      // running embedded
      console.info(
        'running in embedded mode from URL: ',
        document.location.href,
      );
      console.info('referrer (possible parent) URL: ', document.referrer);
      console.info(
        'config parentOrigin:',
        this.$store.state.config.ui.parentOrigin,
      );
      if (!document.referrer
        .startsWith(this.$store.state.config.ui.parentOrigin)
      ) {
        console.warn(
          'referrer origin: [%s] does not match configured parent origin: [%s]',
          document.referrer, this.$store.state.config.ui.parentOrigin,
        );
      }

      window.addEventListener('message', this.messageHandler, false);
      this.$store.commit('setIsRunningEmbedded', true);
      this.$store.commit('setAwsCredsProvider', 'parentWindow');
    }
  },
  mounted() {
    this.$store.dispatch('initConfig', this.$lexWigetUi.config)
      .then(() => this.$store.dispatch('getConfigFromParent'))
      // avoid merging an empty config
      .then(config => (
        (Object.keys(config).length) ?
          this.$store.dispatch('initConfig', config) : Promise.resolve()
      ))
      .then(() => Promise.all([
        this.$store.dispatch(
          'initCredentials',
          this.$lexWigetUi.awsConfig.credentials,
        ),
        this.$store.dispatch('initRecorder'),
        this.$store.dispatch('initBotAudio', (window.Audio) ? new Audio() : null),
      ]))
      .then(() => Promise.all([
        this.$store.dispatch('initMessageList'),
        this.$store.dispatch('initPollyClient', this.$lexWigetUi.pollyClient),
        this.$store.dispatch('initLexClient', this.$lexWigetUi.lexRuntimeClient),
      ]))
      .then(() => (
        (this.$store.state.isRunningEmbedded) ?
          this.$store.dispatch(
            'sendMessageToParentWindow',
            { event: 'ready' },
          ) :
          Promise.resolve()
      ))
      .then(() => console.info(
        'sucessfully initialized lex web ui version: ',
        this.$store.state.version,
      ))
      .then(() => this.$store.dispatch('postInitialSessionTextMessage'))
      .catch((error) => {
        console.error('could not initialize application while mounting:', error);
      });
  },
  methods: {
    toggleMinimizeUi() {
      return this.$store.dispatch('toggleIsUiMinimized');
    },
    // messages from parent
    messageHandler(evt) {
      // security check
      if (evt.origin !== this.$store.state.config.ui.parentOrigin) {
        console.warn('ignoring event - invalid origin:', evt.origin);
        return;
      }
      if (!evt.ports) {
        console.warn('postMessage not sent over MessageChannel', evt);
        return;
      }
      switch (evt.data.event) {
        case 'ping':
          console.info('pong - ping received from parent');
          evt.ports[0].postMessage({
            event: 'resolve',
            type: evt.data.event,
          });
          break;
        // received when the parent page has loaded the iframe
        case 'parentReady':
          evt.ports[0].postMessage({ event: 'resolve', type: evt.data.event });
          break;
        case 'toggleMinimizeUi':
          this.$store.dispatch('toggleIsUiMinimized')
            .then(() => evt.ports[0].postMessage({
              event: 'resolve', type: evt.data.event,
            }));
          break;
        case 'postText':
          if (!evt.data.message) {
            evt.ports[0].postMessage({
              event: 'reject',
              type: evt.data.event,
              error: 'missing message field',
            });
            return;
          }

          this.$store.dispatch(
            'postTextMessage',
            { type: 'human', text: evt.data.message },
          )
            .then(() => evt.ports[0].postMessage({
              event: 'resolve', type: evt.data.event,
            }));
          break;
        default:
          console.warn('unknown message in messageHanlder', evt);
          break;
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Shadows+Into+Light');
#lex-web {
  /* background: #fff; */
  position: fixed;
  width: 100%;
  max-width: 350px;
  right: 6px;
  bottom: 76px;
  height: calc(100% - 97px);
  max-height: 704px;
}
.application {
  /* substract the input container height as a workaround on mobile
     to prevent the input container to be out of view
   */
  /* min-height: 80vh;
  max-height: 80vh; */
  height: 100%;
  background: #ffffff !important;
  box-shadow:
    0 2px 4px -1px rgba(0,0,0,.2),
    0 0px 5px rgba(0,0,0,.14),
    0 0px 10px rgba(0,0,0,.12);
  border-radius: 8px;
}
.widget-container >>> .application--wrap {
  height: 100%;
  min-height: 100%;
  max-height: 100%;
}
.widget-header{
  background: #ee2024;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  height: 80px;
  line-height: 80px;
  display: flex;
  align-items: center;
  min-height: 80px;
  max-height: 80px;
}
.widget-header .header-logo{
  height: 100%;
  max-height: 80px;
  padding: 14px;
}
.widget-header .header-logo .header-logo-img{
  height: 50px;
  max-height: 50px;
  min-height: 50px;
  width: 50px;
}
.widget-header .header-title{
  color: #ffffff;
  font-family: 'Shadows Into Light', cursive;
  font-weight: 600;
  font-size: 22px;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media(max-width: 350px){
  #lex-web {
    max-width: 100%;
    top: 0;
    left: 0;
    bottom: 76px;
    padding: 0;
    height: 100%;
    max-height: 100%;
  }
  .application{
    border-radius: 0;
  }
  .widget-header{
    border-radius: 0;
  }
}
</style>
