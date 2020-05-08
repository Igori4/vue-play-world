<template>
  <v-flex d-flex class="message">
    <!-- contains message and response card -->
    <v-layout column my-2 class="message-layout">

      <!-- contains message bubble and date -->
      <v-flex d-flex class="message-bubble-date-container" :style="{maxWidth: isPopup ? '275px' : ''}">
        <v-layout column class="message-bubble-column" :style="{maxWidth: isPopup ? '275px' : ''}">

          <!-- contains message bubble and avatar -->
          <v-flex d-flex class="message-bubble-avatar-container">
            <v-layout row class="message-bubble-row">
              <div
                v-if="shouldShowAvatarImage"
                v-bind:style="botAvatarBackground"
                v-bind:tabindex="message.id + 1"
                class="bot-avatar focusable"
              >
              </div>
              <div
                v-bind:tabindex="message.id + 1"
                v-on:focus="onMessageFocus"
                v-on:blur="onMessageBlur"
                class="message-bubble focusable"
              >
                <message-text
                  v-bind:message="message"
                  v-if="'text' in message && message.text !== null && message.text.length"
                ></message-text>
                <div
                  v-if="message.type === 'human' && message.audio"
                  class="message-audio"
                >
                  <audio>
                    <source v-bind:src="message.audio" type="audio/wav">
                  </audio>
                  <v-btn
                    v-on:click="playAudio"
                    v-bind:tabindex="message.id + 1"
                    icon
                    class="black--text ml-0 mr-0"
                  >
                    <v-icon class="play-icon">play_circle_outline</v-icon>
                  </v-btn>
                </div>
                <v-icon
                  medium
                  v-if="message.type === 'bot' && botDialogState && showDialogStateIcon"
                  v-bind:class="`dialog-state-${botDialogState.state}`"
                  class="dialog-state"
                >
                  {{botDialogState.icon}}
                </v-icon>
              </div>
            </v-layout>
          </v-flex>
          <v-flex
            v-if="shouldShowMessageDate && isMessageFocused"
            class="text-xs-center message-date"
          >
            {{messageHumanDate}}
          </v-flex>
        </v-layout>
      </v-flex>
      <v-container
        v-if="shouldDisplayRenderObjectBeforeResponseCards"
        :style="{maxWidth: isPopup?'250px':''}"
        :class="[isPopup?'grid-list-xs':'grid-list-md']"
        class="response-card render-objects-before">
        <v-layout row wrap>
          <v-flex
            :class="renderObjectsClasses(element.template_type)"
            v-for="(element, index) in message.renderObjects.elements"
            :key="index">
            <template-grid v-if="element.template_type==='grid'" v-bind:element="element"/>
            <template-list v-else-if="element.template_type==='list'" v-bind:element="element"/>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container
        v-if="shouldDisplayResponseCard"
        :style="{maxWidth: isPopup?'250px':''}"
        :class="[isPopup?'grid-list-xs':'grid-list-md']"
        class="response-card">
        <v-layout row wrap v-if="message.responseCard.genericAttachments.length > 1">
          <v-flex
            :class="responseCardClasses(card.subTitle)"
            v-for="(card, index) in message.responseCard.genericAttachments"
            :style="{marginBottom: isPopup?'10px':''}"
            :key="index">
            <response-card-image v-if="card.subTitle==='just_image'" v-bind:response-card="card">
            </response-card-image>
            <response-card-pdf v-else-if="card.subTitle==='pdf'" v-bind:response-card="card">
            </response-card-pdf>
            <response-card-youtube v-else-if="card.subTitle==='youtube_video'" v-bind:response-card="card">
            </response-card-youtube>
            <response-card-video v-else-if="card.subTitle==='other_video'" v-bind:response-card="card">
            </response-card-video>
            <response-card v-else v-bind:response-card="card">
            </response-card>
          </v-flex>
        </v-layout>
        <v-layout row wrap v-else-if="message.responseCard.genericAttachments.length == 1">
          <v-flex
            :class="[isPopup?'sm12':'sm12 md9']"
            v-if="message.responseCard.genericAttachments[0].subTitle === 'just_image'">
            <response-card-image
              v-bind:response-card="message.responseCard.genericAttachments[0]"
              >
            </response-card-image>
          </v-flex>
          <v-flex
            :class="[isPopup?'sm12':'sm12 md9']"
            v-else-if="message.responseCard.genericAttachments[0].subTitle === 'pdf'">
            <response-card-pdf
              v-bind:response-card="message.responseCard.genericAttachments[0]"
              >
            </response-card-pdf>
          </v-flex>
          <v-flex
            :class="[isPopup?'sm12':'sm12 md9']"
            v-else-if="message.responseCard.genericAttachments[0].subTitle === 'youtube_video'">
            <response-card-youtube
              v-bind:response-card="message.responseCard.genericAttachments[0]"
              >
            </response-card-youtube>
          </v-flex>
          <v-flex
            :class="[isPopup?'sm12':'sm12 md9']"
            v-else-if="message.responseCard.genericAttachments[0].subTitle === 'other_video'">
            <response-card-video
              v-bind:response-card="message.responseCard.genericAttachments[0]"
              >
            </response-card-video>
          </v-flex>
          <v-flex
            :class="[isPopup?'sm12':'sm12 md6 lg4']"
            v-else>
            <response-card v-bind:response-card="message.responseCard.genericAttachments[0]">
            </response-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container
        v-if="shouldDisplayRenderObjectAfterResponseCards"
        :style="{maxWidth: isPopup?'250px':''}"
        :class="[isPopup?'grid-list-xs':'grid-list-md']"
        class="response-card render-objects-after">
        <v-layout row wrap>
          <v-flex
            :class="renderObjectsClasses(element.template_type)"
            v-for="(element, index) in message.renderObjects.elements"
            :key="index">
            <template-grid v-if="element.template_type==='grid'" v-bind:element="element"/>
            <template-list v-else-if="element.template_type==='list'" v-bind:element="element"/>
            <template-quick-replies
              v-else-if="element.template_type==='quick_replies' && (messagesLength - 1) === mindex"
              v-bind:element="element"
              />
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </v-flex>
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
import MessageText from './MessageText';
import ResponseCard from './ResponseCard';
import ResponseCardImage from './response-cards/ResponseCardImage';
import ResponseCardPdf from './response-cards/ResponseCardPdf';
import ResponseCardYoutube from './response-cards/ResponseCardYoutube';
import ResponseCardVideo from './response-cards/ResponseCardVideo';
import TemplateGrid from './templates/TemplateGrid';
import TemplateList from './templates/TemplateList';
import TemplateQuickReplies from './templates/TemplateQuickReplies';

export default {
  name: 'message',
  props: ['message', 'mindex'],
  components: {
    MessageText,
    ResponseCard,
    ResponseCardImage,
    ResponseCardPdf,
    ResponseCardYoutube,
    ResponseCardVideo,
    TemplateGrid,
    TemplateList,
    TemplateQuickReplies,
  },
  data() {
    return {
      isMessageFocused: false,
      messageHumanDate: 'Now',
    };
  },
  computed: {
    messagesLength() {
      return this.$store.state.messages.length;
    },
    botDialogState() {
      if (!('dialogState' in this.message)) {
        return null;
      }
      switch (this.message.dialogState) {
        case 'Failed':
          return { icon: 'error', color: 'red', state: 'fail' };
        case 'Fulfilled':
        case 'ReadyForFulfillment':
          if (!('intentName' in this.message)) {
            return { icon: 'done', color: 'green', state: 'ok' };
          }
          switch (this.message.intentName) {
            case 'bookAppointment':
              return { icon: 'today', color: 'green', state: 'ok' };
            case 'shareQuote':
              return { icon: 'format_quote', color: 'green', state: 'ok' };
            case 'tellJoke':
              return { icon: 'sentiment_satisfied', color: 'green', state: 'ok' };
            default:
              return { icon: 'done', color: 'green', state: 'ok' };
          }
        default:
          return null;
      }
    },
    botAvatarUrl() {
      return this.$store.state.config.ui.avatarImageUrl;
    },
    showDialogStateIcon() {
      return this.$store.state.config.ui.showDialogStateIcon;
    },
    shouldDisplayResponseCard() {
      return (
        this.message.responseCard &&
        (this.message.responseCard.version === '1' ||
         this.message.responseCard.version === 1) &&
        this.message.responseCard.contentType === 'application/vnd.amazonaws.card.generic' &&
        'genericAttachments' in this.message.responseCard &&
        this.message.responseCard.genericAttachments instanceof Array
      );
    },
    shouldDisplayRenderObjectBeforeResponseCards() {
      return this.message.renderObjects
        && this.message.renderObjects.elements.length > 0
        && this.message.renderObjects.priority === 'BEFORE_RC';
    },
    shouldDisplayRenderObjectAfterResponseCards() {
      return this.message.renderObjects
        && this.message.renderObjects.elements.length > 0
        && this.message.renderObjects.priority === 'AFTER_RC';
    },
    shouldShowAvatarImage() {
      return (
        this.message.type === 'bot' &&
        this.botAvatarUrl
      );
    },
    botAvatarBackground() {
      return {
        background: `url(${this.botAvatarUrl}) center center / contain no-repeat`,
      };
    },
    shouldShowMessageDate() {
      return this.$store.state.config.ui.showMessageDate;
    },
    isPopup() {
      return this.$store.getters.isPopup;
    },
  },
  methods: {
    renderObjectsClasses(key) {
      if (this.isPopup) {
        return 'sm12';
      }
      if (key === 'grid') {
        return 'sm12 md9';
      } else if (key === 'list') {
        return 'sm12 md7 lg6';
      } else if (key === 'quick_replies') {
        return 'sm12';
      }
      return 'sm12 md6 lg5';
    },
    responseCardClasses(key) {
      if (this.isPopup) {
        return 'sm12';
      }
      if (key === 'pdf') {
        return 'sm12 md9';
      } else if (key === 'just_image' || key === 'youtube_video' || key === 'other_video') {
        return 'sm12 md9';
      }
      return 'sm12 md6 lg4';
    },
    playAudio() {
      // XXX doesn't play in Firefox or Edge
      /* XXX also tried:
      const audio = new Audio(this.message.audio);
      audio.play();
      */
      const audioElem = this.$el.querySelector('audio');
      if (audioElem) {
        audioElem.play();
      }
    },
    onMessageFocus() {
      if (!this.shouldShowMessageDate) {
        return;
      }
      this.messageHumanDate = this.getMessageHumanDate();
      this.isMessageFocused = true;
      if (this.message.id === this.$store.state.messages.length - 1) {
        // this.$emit('scrollDown');
      }
    },
    onMessageBlur() {
      if (!this.shouldShowMessageDate) {
        return;
      }
      this.isMessageFocused = false;
    },
    getMessageHumanDate() {
      const dateDiff = Math.round((new Date() - this.message.date) / 1000);
      const secsInHr = 3600;
      const secsInDay = secsInHr * 24;
      if (dateDiff < 60) {
        return 'Now';
      } else if (dateDiff < secsInHr) {
        return `${Math.floor(dateDiff / 60)} min`;
      } else if (dateDiff < secsInDay) {
        return this.message.date.toLocaleTimeString();
      }
      return this.message.date.toLocaleString();
    },
  },
};
</script>

<style scoped>
.message, .message-bubble-column {
  flex: 0 0 auto;
}

.message, .message-bubble-row {
  max-width: 60vw;
}

.bot-avatar {
  align-self: center;
  border-radius: 50%;
  min-width: calc(2.5em + 1.5vmin);
  min-height: calc(2.5em + 1.5vmin);
  align-self: flex-start;
  margin-right: 4px;
}

.message-bubble {
  border-radius: 24px;
  display: inline-flex;
  font-size: calc(1em + 0.25vmin);
  padding: 0 12px;
  width: fit-content;
  align-self: center;
}

.focusable {
  box-shadow: 0 0.25px 0.75px rgba(0,0,0,0.12), 0 0.25px 0.5px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  cursor: default;
}

.focusable:focus {
  box-shadow: 0 1.25px 3.75px rgba(0,0,0,0.25), 0 1.25px 2.5px rgba(0,0,0,0.22);
  outline: none;
}

.message-bot .message-bubble {
  background-color: #f1f0f0; /* red-50 from material palette */
}

.message-human .message-bubble {
  background-color: #666; /* indigo-50 from material palette */
  color: #fff;
}

.dialog-state {
  display: inline-flex;
}

.icon.dialog-state-ok {
  color: green;
}
.icon.dialog-state-fail {
  color: red;
}

.play-icon {
  font-size: 2em;
}

.response-card {
  margin: 0.8em 0;
  width: 60vw;
  flex: auto;
}
.render-objects-before {
  margin-bottom: 0px;
  padding-bottom: 0px;
}
.render-objects-after {
  margin-top: 0px;
  padding-top: 0px;
}
@media only screen and (max-width: 599px) {
  .row .flex.sm12 {
    width: 100%;
  }
}
</style>
