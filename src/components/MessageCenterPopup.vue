<template>
  <div ref="message-center">
    <div class="card shadow mb-4">
      <div class="card-header py-3 inline">
        <b-form inline>
          <div class="col-md-6"><h6 class="m-0 font-weight-bold">{{ $t("site.message-center") }}</h6></div>
          <div class="col-md-6">
            <!-- <button v-on:click.prevent="closeMessageCenter" class="btn btn-default" style="height: 24px; line-height: 24px; text-transform: none;float:right;">
              <span aria-hidden="true">&times;</span>
            </button> -->
            <button v-on:click.prevent="openMessage(null, $event)" class="btn btn-default" style="height: 24px; line-height: 24px; text-transform: none;float:right;">{{ $t("site.new-message") }}</button>
          </div>
        </b-form>
      </div>
      <div style="padding: 0 20px;border-bottom: 1px solid rgba(0,0,0,.125);">
        <a class="actionLink" v-bind:class="{ 'activeTab': (itemType=='all')}" id="allMessageCenter" href="#" v-on:click.prevent="setItem(defaultType)">
          {{ $t("site.all") }}
          <b-badge variant="primary">{{ $parent.itemsCounts['invitations'] + $parent.itemsCounts['notifications'] }}</b-badge>
        </a> |
        <a class="actionLink"  v-bind:class="{ 'activeTab': (itemType=='invitations')}" href="#" v-on:click.prevent="setItem('invitations')">
          {{ $t("site.invitations") }}
          <b-badge variant="primary">{{ $parent.itemsCounts['invitations'] }}</b-badge>
        </a> |
        <a class="actionLink" v-bind:class="{ 'activeTab': (itemType=='notifications')}" href="#" v-on:click.prevent="setItem('notifications')">
          {{ $t("site.notifications") }}
          <b-badge variant="primary">{{ $parent.itemsCounts['notifications'] }}</b-badge>
        </a>
        <a class="actionLink actionLink_message" style="float: right" href="#" v-on:click.prevent="openMessage(null, $event)">
          {{ $t("site.messages") }}
          <b-badge variant="primary">{{ $parent.itemsCounts['messages'] }}</b-badge>
        </a>
        <span style="float: right;border-left: 1px solid rgba(0, 0, 0, 0.125);height: 60px;margin: 5px 10px;"></span>
      </div>
      <div class="card-body" style="padding: 0;">
        <div style="overflow-y: auto; max-height: calc(100vh - 330px);">
          <div v-if="items.length < 1" style="text-align: center; padding: 30px 0; opacity: 0.5;">
            Empty
          </div>
          <div v-for="model in items" v-bind:key="model.id" v-if="model != null" @click="updateNotificationStatus(model)"  style="padding: 10px; border-top: 1px solid #e3e6f0; clear: both;" v-bind:style="{backgroundColor: model.status!=0?'#fff':'rgb(177,226,239)'}">
            <!--INVITE AREA -->
            <div v-if="model.action == 'invite'" class="TnxGiv1ng  row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <!--INVITE AREA -->
                <div class="" style="margin-left: 10px;">
                  <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{model.alias}}</div>
                  <div class="mt-2" style="font-size: 14px; line-height: 100%;">
                    {{model.alias +' '+ $t('site.has-invited-you-to-read') +' '+ model.book.title  }}
                  </div>
                  <!--ACTION-->
                  <div class="mt-2">
                    <a class="btn btn-dark btn-sm" href="javascript:void(0)" @click="acceptInvite(model)">{{ $t('site.sendmail.accept') }}</a>
                    <a @click="declineInvite(model)" class="btn btn-dark-red btn-sm">{{ $t('site.sendmail.decline') }}</a>
                    <a class="btn btn-secondary btn-sm" href="javascript:void(0)"
                       @click="showBookDetailsModal(model.book)">
                      <i class="fas fa-book fa-fw"></i> {{ $t('site.book-directory-preview') }}
                    </a>
                  </div>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <!-- NOTIFICATION AREA -->
            <div v-else-if="model.type == 'book' && model.action =='query'" class="row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <div style="margin-left: 10px;">
                  <div>
                    <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{model.alias}}</div>
                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">
                      {{ model.alias +' '+$t('site.has-queried-you-to-request-an-access-to-read')+' '+ model.book.title+'.'}}
                      <a href='javascript:void(0)' @click="CHANGE_COMPONENT({
                                                tabKey: 'main-book-directory',
                                                tabComponent: 'main-book-directory',
                                                tabData: {'activeTab':'received-query','book_id':model.book.id,'author_id':model.author.id},
                                                tabTitle: 'Main Reader Directory'
                                              })">
                        {{ capitalizeFirstLetter($t('site.click-here')) }}
                      </a> {{ $t('site.to-view') }}
                    </div>
                    <!--                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">-->
                    <!--                      {{ model.type+'='+model.action}}-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <div v-else-if="model.type == 'chapter_comment' && model.action =='post'" class="row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <div style="margin-left: 10px;">
                  <div><div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{ model.alias }}</div>
                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">
                      {{ model.alias +' '+$t('site.commented-on-chapter')+' '+ model.chapter.title+'.'}}
                      <a href='javascript:void(0)' @click="(model.to === model.book.author_id)?openChapterDetails(model, 'open-feedback'):openBookIReadChapterDetails(model, 'open-feedback')">
                        {{ capitalizeFirstLetter($t('site.click-here')) }}
                      </a> {{ $t('site.to-view') }}
                    </div>
                    <!--                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">-->
                    <!--                      {{ model.type+'='+model.action}}-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <div v-else-if="model.type == 'scene_comment' && model.action =='post'" class="row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <div style="margin-left: 10px;">
                  <div>
                    <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{ model.alias }}</div>
                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">
                      {{ model.alias +' '+$t('site.commented-on-scene')+' '+ model.scene.title+'.'}}
                      <a href='javascript:void(0)' @click="(model.to === model.book.author_id)?openSceneDetails(model, 'open-feedback'):openBookIReadSceneDetails(model, 'open-feedback')">
                        {{ capitalizeFirstLetter($t('site.click-here')) }}
                      </a> {{ $t('site.to-view') }}
                    </div>
                    <!--                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">-->
                    <!--                      {{ model.type+'='+model.action}}-->
                    <!--                    </div>-->
                  </div>
                </div>
                <div style="clear: both;"></div>
              </div>
            </div>
            <div v-else-if="model.type == 'book' && model.action =='invitation'" class="row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <div style="margin-left: 10px;">
                  <div>
                    <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{ model.alias }}</div>
                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">
                      {{ model.alias +' '+$tc('has been invited to read ')+' '+ model.book.title+'.'}}
                      <a href='javascript:void(0)' @click="CHANGE_COMPONENT({
                                                tabKey: 'invitations-tab',
                                                tabComponent: 'invitations-tab',
                                                tabData: {bookId:model.book.id, goTo: 'pending-tab'},
                                                tabTitle: 'Invitations'
                                              })">
                        {{ capitalizeFirstLetter($t('site.click-here')) }}
                      </a> {{ $t('site.to-view') }}
                    </div>
                  </div>
                </div>
                <div style="clear: both;"></div>
              </div>
            </div>
            <div v-else-if="model.type == 'book_invite_decision' && ['accept','declined'].includes(model.action)" class="row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <div class="" style="margin-left: 10px;">
                  <div>
                    <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{model.alias}}</div>
                    <!--accept-->
                    <div v-if="model.action=='accept'" class="mt-2" style="font-size: 14px; line-height: 100%;">
                      {{ model.alias +' '+$t('site.has-accepted-your-invitation-to-read')+' '+ model.book.title+'.'}}
                    </div>
                    <!--declined-->
                    <div v-if="model.action=='declined'" class="mt-2" style="font-size: 14px; line-height: 100%;">
                      {{ model.alias +' '+$t('site.has-declined-your-invitation-to-read')+' '+ model.book.title+'.'}}
                    </div>

                    <!--                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">-->
                    <!--                      {{ model.type+'='+model.action}}-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <div v-else-if="model.type == 'feedback' && ['post','response','inlined'].includes(model.action)" class="row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <div style="margin-left: 10px;">
                  <div>
                    <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{model.alias}}</div>
                    <!--FEEDBACK POST-->
                    <div v-if="model.action=='post'" class="mt-2" style="font-size: 14px; line-height: 100%;">
                      <!--SCENE FEEDBACK-->
                      <span v-if="model.parent_id && model.parent_name == 'scene' ">
                                                {{ model.alias +' '+$t('site.has-left-a-feedback-on')+' '+ model.book.title +'-'+model.chapter.title+' ('+model.scene.title+' Scene).'}}
                                                <a href='javascript:void(0)' @click="openSceneDetails(model, 'open-feedback')">
                                                    {{ capitalizeFirstLetter($t('site.click-here')) }}
                                                </a> {{ $t('site.to-view')  }}
                                            </span>
                      <!--CHAPTER FEEDBACK-->
                      <span v-else-if="model.chapter_id">
                                                {{ model.alias +' '+$t('site.has-left-a-feedback-on')+' '+ model.book.title +'-'+model.chapter.title+'.'}}
                                                <a href='javascript:void(0)' @click="openChapterDetails(model, 'open-feedback')">
                                                    {{ capitalizeFirstLetter($t('site.click-here')) }}
                                                </a> {{ $t('site.to-view')  }}
                                            </span>
                      <!--BOOK FEEDBACK-->
                      <span v-else>
                                                {{ model.alias +' '+$t('site.has-left-a-feedback-on')+' '+ model.book.title+'.'}}
                                                <a href='javascript:void(0)' @click="openBookDetails(model)">
                                                    {{ capitalizeFirstLetter($t('site.click-here')) }}
                                                </a> {{ $t('site.to-view') }}
                                            </span>
                    </div>
                    <!--END FEEDBACK POST-->
                    <!--FEEDBACK RESPONSE-->
                    <div v-if="model.action=='response'" class="mt-2" style="font-size: 14px; line-height: 100%;">
                      <!--SCENE FEEDBACK-->
                      <span v-if="model.parent_id && model.parent_name == 'scene' ">
                                                {{ model.alias +' '+$t('site.has-replied-to-your-feedback')+' '+ model.book.title +'-'+model.chapter.title+' ('+model.scene.title+' Scene).'}}
                                                <a href='javascript:void(0)' @click="(model.to === model.book.author_id)?openSceneDetails(model, 'open-feedback'):openBookIReadSceneDetails(model, 'open-feedback')">
                                                    {{ capitalizeFirstLetter($t('site.click-here')) }}
                                                </a> {{ $t('site.to-view')  }}
                                            </span>
                      <!--CHAPTER FEEDBACK-->
                      <span v-else-if="model.chapter_id">
                                                {{ model.alias +' '+$t('site.has-replied-to-your-feedback')+' '+ model.book.title +'-'+model.chapter.title+'.'}}
                                                <a href='javascript:void(0)' @click="(model.to === model.book.author_id)?openChapterDetails(model, 'open-feedback'):openBookIReadChapterDetails(model, 'open-feedback')">
                                                    {{ capitalizeFirstLetter($t('site.click-here')) }}
                                                </a> {{ $t('site.to-view')  }}
                                            </span>
                      <!--BOOK FEEDBACK-->
                      <span v-else>
                                                {{ model.alias +' '+$t('site.has-replied-to-your-feedback')+' '+ model.book.title+'.'}}
                                                <a href='javascript:void(0)' @click="(model.to === model.book.author_id)?openBookDetails(model):openBookIReadBookDetails(model)">
                                                    {{ capitalizeFirstLetter($t('site.click-here')) }}
                                                </a> {{ $t('site.to-view') }}
                                            </span>
                    </div>
                    <!--END FEEDBACK RESPONSE-->
                    <!--FEEDBACK INLINE-->
                    <div v-if="model.action=='inlined' " class="mt-2" style="font-size: 14px; line-height: 100%;">
                      {{ model.alias +' '+$t('site.commented-on')+' '+ model.book.title +'-'+model.chapter.title+'.'}}
                      <a href='javascript:void(0)' @click="openChapterDetails(model,'open-feedback')">
                        {{ capitalizeFirstLetter($t('site.click-here')) }}
                      </a> {{ $t('site.to-view') }}
                    </div>
                    <!--END FEEDBACK INLINE-->
                    <!--                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">-->
                    <!--                      {{ model.type+'='+model.action}}-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <div v-else-if="model.type == 'notif' && model.action =='response'" class="row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <div style="margin-left: 10px;">
                  <div>
                    <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{model.alias}}</div>
                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">
                      {{ model.alias +' '+$t('site.sent-you-a-message')+'.'}}
                      <a href='javascript:void(0)' @click="openMessage(null, $event)">
                        {{ capitalizeFirstLetter($t('site.click-here')) }}
                      </a> {{ $t('site.to-view') }}
                    </div>
                    <!--                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">-->
                    <!--                      {{ model.type+'='+model.action}}-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <!--reader type is refactored to reader-directory-->
            <div v-else-if="(model.type == 'reader' || model.type =='reader-directory') && ['query','reader-decision'].includes(model.action)" class="row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <div style="margin-left: 10px;">
                  <div>
                    <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{model.alias}}</div>
                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">
                                            <span v-if="model.action == 'query'">
                                                {{ model.alias +' '+$t('site.has-queried-you-to-read')+' '+ model.book.title+'.'}}
                                                <a href='javascript:void(0)' @click="CHANGE_COMPONENT({
                                                  tabKey: 'main-reader-directory',
                                                  tabComponent: 'main-reader-directory',
                                                  tabData: {'activeTab':'received-query','book_id':model.book.id,'author_id':model.author.id},
                                                  tabTitle: 'Main Reader Directory'
                                                })">
                                                    {{ capitalizeFirstLetter($t('site.click-here')) }}
                                                </a> {{ $t('site.to-view') }}
                                            </span>
                      <span v-if="model.action == 'notify'">
                                                {{ model.alias +' '+ $t('site.sent-you-a-notification') +'.'}}
                                                <strong><div class="font-italic mt-1 mb-1" v-html="model.message"></div></strong>
                                                <a href='javascript:void(0)' @click="openMessage(null, $event)">
                                                    {{ capitalizeFirstLetter($t('site.click-here')) }}
                                                </a> {{ $t('site.to-view') }}
                                            </span>
                      <span v-else-if="model.action == 'reader-decision'">
                                                <!--accept-->
                                                <div v-if="model.decision=='accepted'" class="mt-2" style="font-size: 14px; line-height: 100%;">
                                                    {{ model.alias +' '+$t('site.has-accepted-your-invitation-to-read')+' '+ model.book.title+'.'}}
                                                </div>
                        <!--declined-->
                                                <div v-else-if="model.decision=='declined'" class="mt-2" style="font-size: 14px; line-height: 100%;">
                                                    {{ model.alias +' '+$t('site.has-declined-your-invitation-to-read')+' '+ model.book.title+'.'}}
                                                    <span v-if="model.letter" class="'ellipsis-2'">{{ model.letter }}</span>
                                                </div>
                                                <div v-else-if="model.decision=='accept-later'" class="mt-2" style="font-size: 14px; line-height: 100%;">
                                                    {{ model.alias +' '+$t('site.has-declined-your-invitation-to-read-but-accept-later')+' '+ model.book.title+'.'}}
                                                    <span v-if="model.letter" class="'ellipsis-2'">{{ model.letter }}</span>
                                                </div>
                                                <div v-else class="mt-2" style="font-size: 14px; line-height: 100%;">
                                                    {{ model.alias +' '+$t('site.has-not-yet-decided')+' '+ model.book.title+'.'}}
                                                    <span v-if="model.letter" class="'ellipsis-2'">{{ model.letter }}</span>
                                                </div>
                                            </span>
                    </div>
                    <!--                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">-->
                    <!--                      {{ model.type+'='+model.action}}-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <div v-else-if="(model.type =='personalize-notification') && ['notify'].includes(model.action)" class="row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <div style="margin-left: 10px;">
                  <div>
                    <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{model.alias}}</div>
                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">
                                            <span v-if="model.action == 'notify'">
                                                {{ model.alias +' '+ $t('site.sent-you-a-notification') +'.'}}
                                                <strong><div class="font-italic mt-1 mb-1" v-html="model.message"></div></strong>
                                              <!--<a href='javascript:void(0)' @click="openMessage(null, $event)">
                                                  {{ capitalizeFirstLetter($t('site.click-here')) }}
                                              </a> {{ $t('site.to-view') }}-->
                                            </span>
                    </div>
                    <!--                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">-->
                    <!--                      {{ model.type+'='+model.action}}-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <div v-else-if="model.type == 'book-directory' && model.action =='query'" class="row ml-0 mr-0">
              <div class="col-md-2">
                <div v-bind:style="{'background-image': 'url(images/avatars/icons8-source-code-100.png)','background-size':'cover'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0;"></div>
              </div>
              <div class="col-md-10">
                <div style="margin-left: 10px;">
                  <div>
                    <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{model.alias}}</div>
                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">
                                            <span v-if="model.query_decision === 1">{{ model.alias +' '+$t('site.has-accepted-your-query-for-requesting-to-read')+' '+ model.book.title+'.'}}
                                            </span>
                      <span v-else-if="model.query_decision === 2">{{ model.alias +' '+ $t('site.has-declined-your-query-for-requesting-to-read') +' '+ model.book.title+'.'}}
                                            </span>
                      <span v-else>{{ model.alias +' har spurt deg om tilgang til ålese '+ model.book.title+'.'}}
                                            </span>
                      <a class="no-underline" href='javascript:void(0)' @click="CHANGE_COMPONENT({
                                                tabKey: 'main-book-directory',
                                                tabComponent: 'main-book-directory',
                                                tabData: model.query_decision
                                                ? {'activeTab':'sent-query','book_id':model.book.id,'author_id':model.to}
                                                : {'activeTab':'received-query','book_id':model.book.id,'author_id':model.author.id},
                                                tabTitle: 'Main Reader Directory'
                                              })">
                        {{ capitalizeFirstLetter($t('site.click-here')) }}
                      </a> {{ $t('site.to-view') }}
                    </div>
                    <!--                    <div class="mt-2" style="font-size: 14px; line-height: 100%;">-->
                    <!--                      {{ model.type+'='+model.action}}-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <!-- NO AREA ? -->
            <div v-else>
              <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{model.alias}}</div>
              <div class="mt-2" style="font-size: 14px; line-height: 100%;" v-html="model.message"></div>
              <!--              <div class="mt-2" style="font-size: 14px; line-height: 100%;">-->
              <!--                {{ model.type+'='+model.action}}-->
              <!--              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- TODO: enable this if accept Invite is implemented -->
    <!--<feedback-and-book-details-modal ref="feedbackAndBookDetailsModal" v-on:refreshNotif="fetch"></feedback-and-book-details-modal>-->
  </div>
</template>

<script>
// import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'MessageCenterPopup',
  props: ['params'],
  data: function () {
    var scope = this
    var data = {
      items: [],
      allItems: [],
      itemsLength: 0,
      defaultType: 'all',
      itemType: 'all',
      page: {

      },
      itemsCounts: {
        'all': 0,
        'messages': 0,
        'notifications': 0,
        'invitations': 0
      },
      params_: {},
      notificationsCount: 0
    }
    if (scope.params) {
      Vue.nextTick(() => {

      })
    }
    return data
  },
  computed: {
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    },
    rows: function () {
      var scope = this
      var rows = []
      if (scope.type === 'All') {
        rows = scope.items
      } else {
        for (var i = 0; i < scope.items.length; i++) {
          var item = scope.items[i]

          if (scope.type === 'Notification') {
            if (item.type !== 'Message') {
              rows.push(item)
            }
          } else if (item.type === scope.type) {
            rows.push(item)
          }
        }
      }
      return rows
    }
  },
  methods: {
    async openBookDetails (model) {
      const scope = this
      scope.$store.dispatch('setActiveMainSideNavTab', 'my-books')
      try {
        await scope.TOGGLE_BOOK(model.book, 'book')
      } finally {
        scope.CHANGE_COMPONENT({
          tabKey: 'book-details-' + model.book.uuid,
          tabComponent: 'book-details',
          tabData: model.book,
          tabTitle: model.book.title
        })
      }
    },
    async openBookIReadBookDetails (model) {
      const scope = this
      scope.$store.dispatch('setActiveMainSideNavTab', 'books-i-read')
      try {
        await scope.$store.dispatch('loadBooksIReadByAuthor', {authorID: scope.params.author.id, userID: scope.params.data.id})
      } finally {
        scope.CHANGE_COMPONENT({tabKey: 'book-details-' + model.book.id, tabComponent: 'books-i-read-book-details', tabData: model.book, tabTitle: model.book.title})
      }
    },
    async openBookIReadChapterDetails (model, action = '') {
      const scope = this
      scope.$store.dispatch('setActiveMainSideNavTab', 'books-i-read')
      try {
        await scope.$store.dispatch('loadBooksIReadByAuthor', {authorID: scope.params.author.id, userID: scope.params.data.id})
      } finally {
        await scope.TOGGLE_BOOK_I_READ(model.book, 'books', scope.params.author.id)
        await scope.TOGGLE_BOOK_I_READ(model.book, 'chapters', scope.params.author.id)

        var openfeedback = (action == 'open-feedback')

        let config = {
          tabKey: 'books-i-read-chapter-details-' + model.chapter.id,
          tabComponent: 'books-i-read-chapter-details',
          tabData: {book: model.book, chapter: model.chapter, openfeedback: openfeedback},
          tabTitle: scope.trans('site.to-view') + ' - ' + model.chapter.title
        }
        scope.CHANGE_COMPONENT(config)
        // TODO : open Book-i-read tree for the specific chapter
      }
    },
    async openChapterDetails (model, action = '') {
      const scope = this
      scope.$store.dispatch('setActiveMainSideNavTab', 'my-books')
      try {
        await scope.TOGGLE_BOOK(model.book, 'book')
        await scope.TOGGLE_BOOK(model.book, 'chapters')
        // TODO: how to open scene Tree
      } finally {
        // let openfeedback = null
        // if(model.type =='feedback' && (model.action == 'post' || model.action == 'inlined')){
        //     openfeedback = true
        // }

        var openfeedback = (action == 'open-feedback')
        scope.CHANGE_COMPONENT({
          tabKey: 'chapter-details-' + model.chapter.uuid,
          tabComponent: 'chapter-details',
          tabData: {book: model.book, chapter: model.chapter, openfeedback: openfeedback},
          tabTitle: ('VIEW') + ' - ' + model.chapter.title
        })
      }
    },
    async openSceneDetails (model, action = '') {
      const scope = this
      scope.$store.dispatch('setActiveMainSideNavTab', 'my-books')
      try {
        await scope.TOGGLE_BOOK(model.book, 'book')
        await scope.TOGGLE_BOOK(model.book, 'chapters')
        await scope.TOGGLE_BOOK(model.book, 'scenes')
        // TODO: how to open scene Tree
      } finally {
        var openfeedback = (action == 'open-feedback')
        scope.CHANGE_COMPONENT({
          tabKey: 'scene-details-' + model.scene.uuid,
          tabComponent: 'scene-details',
          tabData: {book: model.book, chapter: model.chapter, scene: model.scene, openfeedback: openfeedback},
          tabTitle: ('VIEW') + ' - ' + model.scene.title
        })
      }
    },
    async openBookIReadSceneDetails (model, action = '') {
      const scope = this

      try {
        await scope.$store.dispatch('setActiveMainSideNavTab', 'books-i-read')
        await scope.TOGGLE_BOOK_I_READ(model.book, 'book')
        await scope.TOGGLE_BOOK_I_READ(model.book, 'chapters')

        await scope.TOGGLE_BOOK_I_READ(model.book, 'scenes', scope.params.author.id)
        // TODO: how to open scene Tree
      } finally {
        var openfeedback = (action == 'open-feedback')
        scope.CHANGE_COMPONENT({
          tabKey: 'scene-details-' + model.scene.id,
          tabComponent: 'books-i-read-scene-details',
          tabData: {book: model.book, scene: model.scene, chapter: model.chapter, openfeedback: openfeedback},
          tabTitle: model.scene.title
        })
      }
    },
    fetch: async function () {
      const scope = this
      var authorUUID = this.$store.getters.getAuthorID
      scope.allItems['notifications'] = []
      scope.allItems['invitations'] = []
      /**
       * Get notifications | feedback and comments only
       */
      console.log('authorUUID', authorUUID)
      await scope.axios
        .get('http://localhost:3000/notifications/' + authorUUID)
        .then(response => {
          console.log('response data', response.data.data)
          scope.allItems['notifications'] = response.data.data.notifications
        })
        .catch(error => {
          console.log('error', error)
        })

      scope.messageCenterCounter()

      // const scope = this
      // scope.axios
      //   .get('api/message-center')
      //   .then(async function (response) {
      //     if (response.data) {
      //       try {
      //         // TODO: refactor return notifications shouldn't have null values
      //         scope.allItems = response.data
      //         scope.messageCenterCounter()
      //
      //         // /*
      //         // * This is for fetching realtime data for Message Center
      //         // * */
      //         // let notificationPusher = new Pusher('e99246ed672ceca44ed3', { cluster: 'mt1' })
      //         // notificationPusher.subscribe('pilotleser')
      //         // notificationPusher.bind('new_notification', data => {
      //         //   if (scope.$store.getters.getAuthorID == data.notification.to) {
      //         //     scope.allItems['notifications'].unshift(data.notification)
      //         //   }
      //         //   scope.messageCenterCounter()
      //         // })
      //         //
      //         // let messagePusher = new Pusher('e99246ed672ceca44ed3', { cluster: 'mt1' })
      //         // messagePusher.subscribe('pilotleser')
      //         // messagePusher.bind('new_invitations', data => {
      //         //   if (scope.$store.getters.getAuthorID == data.notification.to) {
      //         //     scope.allItems['invitations'].unshift(data.notification)
      //         //   }
      //         //   scope.messageCenterCounter()
      //         // })
      //         //
      //         // messagePusher.bind('remove_invitation', data => {
      //         //   if (scope.$store.getters.getAuthorID == data.notification.to) {
      //         //     let index = scope.allItems['invitations'].map(x => {
      //         //       return x.id
      //         //     }).indexOf(data.notification.id)
      //         //     scope.allItems['invitations'].splice(index, 1)
      //         //   }
      //         //   scope.messageCenterCounter()
      //         // })
      //         //
      //         // messagePusher.bind('remove_notification', data => {
      //         //   if (scope.$store.getters.getAuthorID == data.notification.to) {
      //         //     let index = scope.allItems['notifications'].map(x => {
      //         //       return x.id
      //         //     }).indexOf(data.notification.id)
      //         //     scope.allItems['notifications'].splice(index, 1)
      //         //   }
      //         //   scope.messageCenterCounter()
      //         // })
      //       } catch (ex) {
      //         console.log(ex)
      //         console.log('Failed to load data')
      //       } finally {
      //         scope.page.is_ready = true
      //       }
      //     }
      //   })
    },
    messageCenterCounter () {
      const scope = this

      scope.itemsCounts['notifications'] = scope.allItems['notifications'].filter(model => {
        return model && model.status == 0
      }).length

      scope.itemsCounts['invitations'] = scope.allItems['invitations'].filter(model => {
        return model && model.status == 0
      }).length

      scope.itemsCounts['all'] = scope.itemsCounts['invitations'] + scope.itemsCounts['notifications']
      // scope.$parent.notification.count = scope.itemsCounts['all']
      scope.setItem(scope.defaultType)

      // send data to Main.vue
      scope.$parent.itemsCounts['notifications'] = scope.itemsCounts['notifications']
      scope.$parent.itemsCounts['invitations'] = scope.itemsCounts['invitations']

      scope.$parent.itemsCounts['all'] = scope.itemsCounts['all']
      scope.$parent.itemsCounts = scope.itemsCounts
      scope.$parent.countNotificationItemTotal()
    },
    updateNotificationStatus (model) {
      const scope = this
      if (model.status == 1) return // only un-read status
      if (model.action == 'invite') return // only notifications , dont include invites

      var params = {
        model: model,
        authorUUID: this.$store.getters.getAuthorID
      }

      scope.axios.post('http://localhost:3000/notifications/update-notification-status', params)
        .then(response => {
          console.log('updateNotificationStatus response', response.data)
          scope.items = response.data
          const itemType = 'notifications'
          scope.allItems[itemType] = response.data
          // scope.itemsCounts['all'] -= 1
          // // scope.$parent.notification.count = scope.itemsCounts['all']
          // scope.itemsCounts[itemType] = 0;
          //
          // scope.$parent.itemsCounts[itemType] = 0;
          scope.messageCenterCounter()
          scope.$parent.countNotificationItemTotal()
        })
        .catch(error => {
          console.log(error)
        })
    },
    setItem: function (itemType, id) {
      const scope = this
      scope.itemType = itemType
      if (itemType == scope.defaultType) {
        let arr = []
        scope.items = arr.concat(scope.allItems['notifications'], scope.allItems['invitations']) ? arr.concat(scope.allItems['notifications'], scope.allItems['invitations']) : []
      } else {
        scope.items = scope.allItems[itemType] ? scope.allItems[itemType] : []
      }
    },
    acceptInvite (model) {
      let scope = this
      this.$nextTick(function () {
        scope.$refs.feedbackAndBookDetailsModal.showModal(model)
      })
    },
    declineInvite (model) {
      const scope = this
      scope.axios.get('/api/invitations/2/' + model.token).then(response => {
        scope.CHANGE_COMPONENT({tabKey: 'invitations-actions' + response.data.action, tabComponent: 'invitations-actions', tabData: response.data, tabTitle: 'Main Reader Directory'})
        scope.fetch()
      })
    },
    showBookDetailsModal (book) {
      let self = this
      this.$nextTick(function () {
        self.$refs.feedbackAndBookDetailsModal.showBookDetails(book)
      })
    },
    openMessage: function (v) {
      window.AppMessaging.open(v)
    }
  },
  mounted: async function () {
    let scope = this
    try {
      await scope.fetch()
    } finally {

    }
    scope.$root.$on('loadMessageCenter', async () => {
      await scope.fetch()
    })
  },
  beforeDestroy: function () {
    delete window.AppMessageCenterPopup

    console.log('window.AppMessageCenterPopup destroyed')
  },
  created () {
    const scope = this
    window.addEventListener('click', function (e) {
      /*
        * This will trigger close MessageCenter if click oustside MessageCenter
        * */
      if (scope.$parent.showMessageCenter && document.getElementById('message-centerr').contains(e.target) == false && document.getElementById('message-center').contains(e.target) == false) {
        scope.$parent.showMessageCenter = false
      }

      /*
        * Trigger <a> tag ang button as close MessageCenter
        * */
      document.querySelectorAll('#message-centerr a:not(.actionLink) , #message-centerr .actionLink_message , #message-centerr button, #right-menu-actions a:not(.actionLink)').forEach(link => {
        link.onclick = () => {
          scope.$parent.showMessageCenter = false
        }
      })
    })
  }
}
</script>

<style scoped>
.activeTab {
  border-radius: 5px;
  background: #b9efff;
  padding: 5px;
}
.actionLink {
  line-height: 70px;
}
</style>
