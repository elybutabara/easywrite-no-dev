<template>
    <div>
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
                <a style="float: right" href="#" v-on:click.prevent="openMessage(null, $event)">
                    {{ $t("site.messages") }}
                    <b-badge variant="primary">{{ $parent.itemsCounts['messages'] }}</b-badge>
                </a>
                <span style="float: right;border-left: 1px solid rgba(0, 0, 0, 0.125);height: 60px;margin: 5px 10px;"></span>
            </div>
            <!--<div class="p-15px">
                <a href="#" v-on:click.prevent="type = 'All'">{{$t('ALL')}} ({{ itemsCounts['Message'] + itemsCounts['Notification']}})</a> |
                <a href="#" v-on:click="openMessage(null, $event)">{{$t('MESSAGES')}} ({{itemsCounts['Message']}})</a> |
                <a href="#" v-on:click.prevent="type = 'Notification'">{{$t('NOTIFICATIONS')}} ({{itemsCounts['Notification']}})</a>

                <div style="float: right;">
                    <button v-on:click="openMessage(null, $event)" class="btn btn-default" style="height: 24px; line-height: 24px; text-transform: none;">{{$t('NEW_MESSAGE')}}</button>
                </div>
            </div>-->
            <div class="card-body" style="padding: 0;">
                <div style="overflow-y: auto; max-height: calc(100vh - 266px);">
                    <div v-if="rows.length < 1" style="text-align: center; padding: 30px 0; opacity: 0.5;">
                        {{$t('EMPTY')}}
                    </div>
<!--                    <div v-for="(row, i) in rows" v-bind:key="'mcp-key-'+i" style="padding: 10px; border-top: 1px solid #e3e6f0; clear: both;" v-bind:style="{backgroundColor: row.is_seen?'#fff':'rgb(245, 248, 250)'}">-->
<!--                        <div v-bind:style="{'background-image': 'url(@/assets/img/blank-profile-picture.png)'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0; float: left;"></div>-->
<!--                        <div style="float: left; margin-left: 10px;">-->
<!--                            <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{ row.data.user_name || 'Null'}}</div>-->
<!--                            <div v-if="row.type=='Message'" style="cursor: pointer;">-->
<!--                                <div v-html="row.data.message" v-on:click="openMessage(3)"></div>-->
<!--                            </div>-->
<!--                            &lt;!&ndash;<div v-if="row.type === 'SceneComment'">-->
<!--                              {{$t('COMMENTED_ON_SCENE')}} <a v-bind:href="'#'" @click.prevent="openLink(row)">{{ row.data.scene_title }}</a>-->
<!--                            </div>-->
<!--                            <div v-if="row.type === 'ChapterComment'">-->
<!--                              {{$t('COMMENTED_ON_CHAPTER')}} <a v-bind:href="'#'" @click.prevent="openLink(row)">{{ row.data.chapter_title }}</a>-->
<!--                            </div>-->
<!--                            <div v-if="row.type === 'FeedbackBook'">-->
<!--                              {{$t('LEFT_A_FEEDBACK_ON_BOOK')}} <a v-bind:href="'#'" @click.prevent="openLink(row)">{{ row.data.book.title }}</a>-->
<!--                            </div>-->
<!--                            <div v-if="row.type === 'FeedbackChapter'">-->
<!--                               {{$t('LEFT_A_FEEDBACK_ON_CHAPTER')}} <a v-bind:href="'#'" @click.prevent="openLink(row)">{{ row.data.chapter.title }}</a>-->
<!--                            </div>-->
<!--                            <div v-if="row.type === 'FeedbackScene'">-->
<!--                              {{$t('LEFT_A_FEEDBACK_ON_SCENE')}} <a v-bind:href="'#'" @click.prevent="openLink(row)">{{ row.data.scene.title }}</a>-->
<!--                            </div>&ndash;&gt;-->
<!--                            <div style="font-size: 80%; line-height: 100%; opacity: 0.5;">{{displayTime(row.created_at)}}</div>-->
<!--                        </div>-->
<!--                        <div style="clear: both;"></div>-->
<!--                    </div>-->
                </div>
            </div>-->
          <div class="card-body" style="padding: 0;">
            <div style="overflow-y: auto; max-height: calc(100vh - 330px);">
              <div v-if="items.length < 1" style="text-align: center; padding: 30px 0; opacity: 0.5;">
                Empty
              </div>
              <div v-for="model in items" v-bind:key="model.id" v-if="model != null" @click="updateNotificationStatus(model)"  style="padding: 10px; border-top: 1px solid #e3e6f0; clear: both;" v-bind:style="{backgroundColor: model.status!=0?'#fff':'rgb(177,226,239)'}">
                <!--INVITE AREA -->
                <div v-if="model.action == 'invite'" class="row ml-0 mr-0">
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
                <div v-else-if="model.type == 'book' && modelaction =='query'" class="row ml-0 mr-0">
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
                          <a href='javascript:void(0)' @click="(model.to === model.book.author_id)?openChapterDetails(model, 'open-comment'):openBookIReadChapterDetails(model, 'open-comment')">
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
                          <a href='javascript:void(0)' @click="(model.to === model.book.author_id)?openSceneDetails(model, 'open-comment'):openBookIReadSceneDetails(model, 'open-comment')">
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
                                                <a href='javascript:void(0)' @click="(model.from==model.to)?openSceneDetails(model, 'open-feedback'):openBookIReadSceneDetails(model, 'open-feedback')">
                                                    {{ capitalizeFirstLetter($t('site.click-here')) }}
                                                </a> {{ $t('site.to-view')  }}
                                            </span>
                          <!--CHAPTER FEEDBACK-->
                          <span v-else-if="model.chapter_id">
                                                {{ model.alias +' '+$t('site.has-replied-to-your-feedback')+' '+ model.book.title +'-'+model.chapter.title+'.'}}
                                                <a href='javascript:void(0)' @click="(model.from==model.to)?openChapterDetails(model, 'open-feedback'):openBookIReadChapterDetails(model, 'open-feedback')">
                                                    {{ capitalizeFirstLetter($t('site.click-here')) }}
                                                </a> {{ $t('site.to-view')  }}
                                            </span>
                          <!--BOOK FEEDBACK-->
                          <span v-else>
                                                {{ model.alias +' '+$t('site.has-replied-to-your-feedback')+' '+ model.book.title+'.'}}
                                                <a href='javascript:void(0)' @click="(model.from==model.to)?openBookDetails(model):openBookIReadBookDetails(model)">
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
      items: {
        'messages': [],
        'notifications': [],
        'invitations': []
      },
      allItems: {
        'messages': [],
        'notifications': [],
        'invitations': []
      },
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
    // setItemCount: function (k, n) {
    //   console.log('setItemCount', n)
    //   this.itemsCounts[k] = n
    // },
    // addItemCount: function (k, n) {
    //   console.log('addItemCount', n)
    //   this.itemsCounts[k] += n
    // },
    // openMessage: function (v) {
    //   window.AppMessaging.open(v)
    //   window.AppMain.showMessageCenter = false
    // },
    // openLink: function (row) {
    //   var type = row.type
    //   var data = row.data
    //   var scope = this
    //   var url = ''
    //
    //   if (type === 'ChapterComment') {
    //     url = 'chapters/' + data.chapter_id + '/book'
    //   } else if (type === 'SceneComment') {
    //     url = 'scenes/' + data.scene_id + '/book-chapter'
    //   } else if (type === 'FeedbackChapter') {
    //     url = 'chapters/' + data.parent_id + '/book'
    //   } else if (type === 'FeedbackScene') {
    //     url = 'scenes/' + data.parent_id + '/book-chapter'
    //   } else if (type === 'FeedbackBook') {
    //     scope.CHANGE_COMPONENT(
    //       {
    //         tabKey: 'book-details-' + data.book.uuid,
    //         tabComponent: 'books-i-read-book-details',
    //         tabData: { book: data.book },
    //         tabTitle: scope.$t('VIEW') + ' - ' + data.book.title,
    //         newTab: true
    //       })
    //     return
    //   }
    //
    //   scope.getData(url).then(res => {
    //     if (type === 'ChapterComment' || type === 'FeedbackChapter') {
    //       let chapter = res.data
    //       let book = chapter.book
    //
    //       scope.CHANGE_COMPONENT(
    //         {
    //           tabKey: 'chapter-details-' + chapter.uuid,
    //           tabComponent: 'books-i-read-chapter-details',
    //           tabData: { book: book, chapter: chapter },
    //           tabTitle: scope.$t('VIEW') + ' - ' + chapter.title,
    //           newTab: true
    //         })
    //     } else if (type === 'SceneComment' || type === 'FeedbackScene') {
    //       let scene = res.data
    //       let book = scene.book
    //       let chapter = scene.chapter
    //
    //       scope.CHANGE_COMPONENT(
    //         {
    //           tabKey: 'scene-details-' + scene.uuid,
    //           tabComponent: 'books-i-read-scene-details',
    //           tabData: { book: book, chapter: chapter, scene: scene },
    //           tabTitle: scope.$t('VIEW') + ' - ' + scene.title,
    //           newTab: true
    //         })
    //     }
    //   })
    //
    //   row.is_seen = 1
    //   scope.getData('notifications/read/' + row.uuid).then(res => {
    //     //
    //   })
    // },
    // updateItemsCounts: function () {
    //   var scope = this
    //   for (var x in scope.itemsCounts) {
    //     scope.itemsCounts[x] = 0
    //   }
    //   for (var i = 0; i < scope.items.length; i++) {
    //     var item = scope.items[i]
    //     scope.itemsCounts[item.type]++
    //     scope.itemsCounts['All']++
    //     if (item.type !== 'Message') {
    //       scope.itemsCounts['Notification']++
    //     }
    //   }
    // },
    // getData: function (url) {
    //   var scope = this
    //   // scope.credentials.error = null
    //   return scope.axios
    //     .get('http://localhost:3000' + '/' + url)
    //     .then(response => {
    //       return response
    //     })
    //     .catch(function (error) {
    //       return error
    //     })
    // },
    // displayTime: function (t) {
    //   var txt = moment(t).fromNow()
    //   txt = txt.replace('a few seconds ago', 'just now')
    //   return txt
    // },
    setItem: function (itemType, id) {
      const scope = this
      scope.itemType = itemType
      if (itemType == scope.defaultType) {
        let arr = []
        scope.items = arr.concat(scope.allItems['notifications'], scope.allItems['invitations'])
      } else {
        scope.items = scope.allItems[itemType]
      }
    },
    // getData: function (url) {
    //   var scope = this
    //   // scope.credentials.error = null
    //   return scope.axios
    //     .get('http://localhost:3000' + '/' + url)
    //     .then(response => {
    //       return response
    //     })
    //     .catch(function (error) {
    //       return error
    //     })
    // },
    fetch: function () {
      const scope = this
      scope.axios
        .get('http://localhost:3000/message-center/' + scope.getAuthor.uuid)
        .then(async function (response) {
          if (response.data) {
            try {
              // console.clear()
              // window.$.each(response.data, function (i, node) {
              //   scope.allItems[i] = node
              // })
              // scope.messageCenterCounter()
              // console.log('allItems ----------------')
              // console.log(scope.allItems)
              // /*
              // * This is for fetching realtime data for Message Center
              // * */
              // let notificationPusher = new Pusher('e99246ed672ceca44ed3', { cluster: 'mt1' })
              // notificationPusher.subscribe('pilotleser')
              // notificationPusher.bind('new_notification', data => {
              //   if (scope.$store.getters.getAuthorID == data.notification.to) {
              //     scope.allItems['notifications'].unshift(data.notification)
              //   }
              //   scope.messageCenterCounter()
              // })
              //
              // let messagePusher = new Pusher('e99246ed672ceca44ed3', { cluster: 'mt1' })
              // messagePusher.subscribe('pilotleser')
              // messagePusher.bind('new_invitations', data => {
              //   if (scope.$store.getters.getAuthorID == data.notification.to) {
              //     scope.allItems['invitations'].unshift(data.notification)
              //   }
              //   scope.messageCenterCounter()
              // })
              //
              // messagePusher.bind('remove_invitation', data => {
              //   if (scope.$store.getters.getAuthorID == data.notification.to) {
              //     let index = scope.allItems['invitations'].map(x => {
              //       return x.id
              //     }).indexOf(data.notification.id)
              //     scope.allItems['invitations'].splice(index, 1)
              //   }
              //   scope.messageCenterCounter()
              // })
            } catch (ex) {
              console.log(ex)
              console.log('Failed to load data')
            } finally {
              scope.page.is_ready = true
            }
          }
        })
    },
    // displayTime: function (t) {
    //   var txt = moment(t).fromNow()
    //   txt = txt.replace('a few seconds ago', 'just now')
    //   return txt
    // },
    messageCenterCounter () {
      const scope = this
      scope.itemsCounts['notifications'] = scope.allItems['notifications'].filter(model => {
        return model.status == 0
      }).length

      scope.itemsCounts['invitations'] = scope.allItems['invitations'].filter(model => {
        return model.status == 0
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
    }
  },
  mounted: async function () {
    var scope = this
    // window.AppMessageCenterPopup = scope
    // scope.updateItemsCounts()
    await scope.fetch()
    // if (window.AppMessaging.recountUnread) {
    //   window.AppMessaging.recountUnread()
    // }
  },
  beforeDestroy: function () {
    delete window.AppMessageCenterPopup
    console.log('window.AppMessageCenterPopup destroyed')
  }
}
</script>

<style scoped>
.activeTab {
    border-radius: 5px;
    background: #b9efff;
    padding: 5px;
}
</style>
