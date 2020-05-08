<template>
  <v-footer app>
    <v-layout
      row
      justify-space-between
      ma-0
      class="input-container"
    >
      <v-toolbar color="white" dense :class="[isPopup? 'inputContainer':'']">
        <!--
          using v-show instead of v-if to make recorder-status transition work
        -->
        <v-text-field
          v-bind:label="textInputPlaceholder"
          v-show="shouldShowTextInput"
          v-model="textInput"
          v-on:keyup.enter.stop="postTextMessage"
          v-on:focus="onTextFieldFocus"
          v-on:blur="onTextFieldBlur"
          id="text-input"
          name="text-input"
          single-line
          hide-details
        ></v-text-field>

        <recorder-status
          v-show="!shouldShowTextInput"
        ></recorder-status>

        <!-- separate tooltip as a workaround to support mobile touch events -->
        <!-- tooltip should be before btn to avoid right margin issue in mobile -->
        <v-tooltip
          activator=".input-button"
          v-model="shouldShowTooltip"
          v-if="!isPopup"
          ref="tooltip"
          left
        >
          <span id="input-button-tooltip">{{inputButtonTooltip}}</span>
        </v-tooltip>
        <v-btn
          v-if="shouldShowSendButton"
          v-on:click="postTextMessage"
          v-on="tooltipEventHandlers"
          v-bind:disabled="isSendButtonDisabled"
          ref="send"
          class="black--text input-button"
          icon
        >
          <v-icon medium>send</v-icon>
        </v-btn>
        <v-btn
          v-else
          v-on:click="onMicClick"
          v-on="tooltipEventHandlers"
          v-bind:disabled="isMicButtonDisabled"
          ref="mic"
          class="black--text input-button"
          icon
        >
          <v-icon medium>{{micButtonIcon}}</v-icon>
        </v-btn>
        <v-btn
          v-if="!isPopup"
          v-show="!shouldShowSendButton || isSendButtonDisabled"
          v-on:click="onFileUploadClick"
          v-on="tooltipEventHandlers"
          v-bind:disabled="isFileUploadModalOpened"
          ref="fileupload"
          class="black--text input-button"
          icon
        >
          <v-icon medium>attachment</v-icon>
        </v-btn>
      </v-toolbar>
      <v-dialog v-model="isFileUploadModalOpened" max-width="500px" v-if="!isPopup">
        <v-card>
          <v-card-title>
            <span class="headline">Upload File</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <upload-button ref="uploadButton" :name="uploadFileName" title="Browse File" :selectedCallback="onFileSelected"></upload-button>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click.native="isFileUploadModalOpened = false">Close</v-btn>
            <v-btn
              :disabled="isUploadFileEmpty"
              color="success"
              :loading="!isUploadFileEmpty && isFileUploading"
              v-on:click="uploadFileAction"
            >
              Upload
              <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isErrorUploadModalOpened" max-width="500px" v-if="!isPopup">
        <v-card>
          <v-card-title>
            <span class="headline">Attention</span>
          </v-card-title>
          <v-card-text>
            The file upload feature can be used when a user is expected to upload a file in the conversation flow.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click.native="isErrorUploadModalOpened = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar
        :timeout=5000
        :color="snackbar_color"
        v-model="snackbar"
      >
        {{ snackbar_message }}
        <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-layout>
  </v-footer>
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
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import axios from 'axios';
import RecorderStatus from '@/components/RecorderStatus';
import UploadButton from './upload-button/UploadButton';

export default {
  name: 'input-container',
  data() {
    return {
      textInput: '',
      isTextFieldFocused: false,
      shouldShowTooltip: false,
      isFileUploadModalOpened: false,
      isErrorUploadModalOpened: false,
      uploadFile: null,
      isFileUploading: false,
      snackbar: false,
      snackbar_color: 'error',
      snackbar_message: '',
      // workaround: vuetify tooltips doesn't seem to support touch events
      tooltipEventHandlers: {
        mouseenter: this.onInputButtonHoverEnter,
        mouseleave: this.onInputButtonHoverLeave,
        touchstart: this.onInputButtonHoverEnter,
        touchend: this.onInputButtonHoverLeave,
        touchcancel: this.onInputButtonHoverLeave,
      },
    };
  },
  props: ['textInputPlaceholder', 'initialSpeechInstruction'],
  components: {
    RecorderStatus,
    UploadButton,
  },
  computed: {
    isBotSpeaking() {
      return this.$store.state.botAudio.isSpeaking;
    },
    isSpeechConversationGoing() {
      return this.$store.state.recState.isConversationGoing;
    },
    isMicButtonDisabled() {
      return this.isMicMuted;
    },
    isMicMuted() {
      return this.$store.state.recState.isMicMuted;
    },
    isRecorderSupported() {
      return this.$store.state.recState.isRecorderSupported;
    },
    isRecorderEnabled() {
      return this.$store.state.recState.isRecorderEnabled;
    },
    isSendButtonDisabled() {
      return this.textInput.length < 1;
    },
    micButtonIcon() {
      if (this.isMicMuted) {
        return 'mic_off';
      }
      if (this.isBotSpeaking || this.isSpeechConversationGoing) {
        return 'stop';
      }
      return 'mic';
    },
    inputButtonTooltip() {
      if (this.shouldShowSendButton) {
        return 'send';
      }
      if (this.isMicMuted) {
        return 'mic seems to be muted';
      }
      if (this.isBotSpeaking || this.isSpeechConversationGoing) {
        return 'interrupt';
      }
      return 'click to use voice';
    },
    shouldShowSendButton() {
      return (
        (this.textInput.length && this.isTextFieldFocused) ||
        (!this.isRecorderSupported || !this.isRecorderEnabled)
      );
    },
    shouldShowTextInput() {
      return !(this.isBotSpeaking || this.isSpeechConversationGoing);
    },
    isUploadFileEmpty() {
      return (this.uploadFile === null);
    },
    uploadFileName() {
      return this.isUploadFileEmpty ? '' : this.uploadFile.name;
    },
    isPopup() {
      return this.$store.getters.isPopup;
    },
    sessionAttributes() {
      return this.$store.state.lex.sessionAttributes;
    },
  },
  methods: {
    onInputButtonHoverEnter() {
      this.shouldShowTooltip = true;
    },
    onInputButtonHoverLeave() {
      this.shouldShowTooltip = false;
    },
    onMicClick() {
      this.onInputButtonHoverLeave();
      if (this.isBotSpeaking || this.isSpeechConversationGoing) {
        return this.$store.dispatch('interruptSpeechConversation');
      }
      if (!this.isSpeechConversationGoing) {
        return this.startSpeechConversation();
      }

      return Promise.resolve();
    },
    isS3SaveKey() {
      const { sessionAttributes } = this;
      return (sessionAttributes && typeof sessionAttributes === 'object'
        && sessionAttributes.S3_save_key && sessionAttributes.S3_save_key.length > 0);
    },
    getS3SaveKey() {
      const { sessionAttributes } = this;
      if (this.isS3SaveKey()) {
        return sessionAttributes.S3_save_key;
      }
      return false;
    },
    onFileUploadClick() {
      if (this.isS3SaveKey()) {
        this.isFileUploadModalOpened = true;
      } else {
        this.isErrorUploadModalOpened = true;
      }
    },
    onFileSelected(file) {
      this.uploadFile = file;
    },
    uploadFileReset() {
      this.uploadFile = null;
      this.isFileUploading = false;
      this.isFileUploadModalOpened = false;
      this.isErrorUploadModalOpened = false;
      this.$refs.uploadButton.fileReset();
    },
    uploadFileAction() {
      if (!this.isS3SaveKey()) {
        this.isErrorUploadModalOpened = true;
        return;
      }
      if (!this.isUploadFileEmpty) {
        this.isFileUploading = true;
        const data = new FormData();
        data.append('file', this.uploadFile);
        axios.post('https://25x0ngbkub.execute-api.us-east-1.amazonaws.com/api/upload', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            access_token: this.$store.state.cognito.user.tokens.AccessToken,
            S3_save_key: this.getS3SaveKey(),
          },
        }).then((response) => {
          this.uploadFileReset();
          const { data: responsePayload } = response;
          if (responsePayload.message && responsePayload.message !== '') {
            this.$store.dispatch('pushMessage', {
              text: responsePayload.message,
              type: 'bot',
            });
          }
          if (responsePayload.success) {
            const message = {
              type: 'human',
              text: responsePayload.payload,
              visibility: 'hide',
            };
            this.$store.dispatch('postTextMessage', message);
          }
        }).catch((error) => {
          console.error('FILE_UPLOAD_ERROR', error);
          this.uploadFileReset();
          this.snackbar_color = 'error';
          this.snackbar_message = 'Error Uploading try again!';
          this.snackbar = true;
        });
      }
    },
    onTextFieldFocus() {
      this.isTextFieldFocused = true;
    },
    onTextFieldBlur() {
      if (!this.textInput.length && this.isTextFieldFocused) {
        this.isTextFieldFocused = false;
      }
    },
    playInitialInstruction() {
      const isInitialState = ['', 'Fulfilled', 'Failed']
        .some(initialState => (
          this.$store.state.lex.dialogState === initialState
        ));

      return (isInitialState) ?
        this.$store.dispatch(
          'pollySynthesizeSpeech',
          this.initialSpeechInstruction,
        ) :
        Promise.resolve();
    },
    postTextMessage() {
      this.onInputButtonHoverLeave();
      this.textInput = this.textInput.trim();
      // empty string
      if (!this.textInput.length) {
        return Promise.resolve();
      }

      const message = {
        type: 'human',
        text: this.textInput,
      };

      return this.$store.dispatch('postTextMessage', message)
        .then(() => {
          this.textInput = '';
        });
    },
    startSpeechConversation() {
      if (this.isMicMuted) {
        return Promise.resolve();
      }
      return this.setAutoPlay()
        .then(() => this.playInitialInstruction())
        .then(() => this.$store.dispatch('startConversation'))
        .catch((error) => {
          console.error('error in startSpeechConversation', error);
          const errorMessage = (this.$store.state.config.ui.showErrorDetails) ?
            ` ${error}` : '';

          this.$store.dispatch(
            'pushErrorMessage',
            "Sorry, I couldn't start the conversation. Please try again." +
            `${errorMessage}`,
          );
        });
    },
    /**
     * Set auto-play attribute on audio element
     * On mobile, Audio nodes do not autoplay without user interaction.
     * To workaround that requirement, this plays a short silent audio mp3/ogg
     * as a reponse to a click. This silent audio is initialized as the src
     * of the audio node. Subsequent play on the same audio now
     * don't require interaction so this is only done once.
     */
    setAutoPlay() {
      if (this.$store.state.botAudio.autoPlay) {
        return Promise.resolve();
      }
      return this.$store.dispatch('setAudioAutoPlay');
    },
  },
};
</script>
<style scoped>
.footer {
  /* make footer same height as dense toolbar */
  min-height: 48px;
}
.inputContainer {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow:
    0 2px 4px -1px rgba(0,0,0,.2),
    0 0px 5px rgba(0,0,0,.14),
    0 0px 0px rgba(0,0,0,.12);
}
</style>
