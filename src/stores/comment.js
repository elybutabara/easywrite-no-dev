import Vue from 'vue'
import axios from 'axios'

export default {
    strict: true,
    state: {
        comments: {},
    },
    getters: {
        getCommentsByChapter: state => (chpaterUUID) => {
            if (state.comments.chapters.hasOwnProperty(chpaterUUID)) {
                return state.comments.chapters[chpaterUUID].rows
            }
            return []
        },

        getCommentsByScene: state => (sceneUUID) => {
            if (state.comments.scenes.hasOwnProperty(sceneUUID)) {
                return state.comments.scenes[sceneUUID].rows
            }
            return []
        },
    },

    mutations: {
        loadCommentsByChapter(state, payload) {
            let chapterID = payload.chapter_id
            let comments = payload.comments
            Vue.set(state.comments, 'chapters', {chapterID: {rows: []}})
            state.comments.chapters[chapterID] = {is_open: false, rows: comments.data}
        },

        loadCommentsByScene(state, payload) {
            let sceneID = payload.scene_id;
            let comments = payload.comments;
            Vue.set(state.comments, 'scenes', { sceneID: { rows: [] } })
            state.comments.scenes[sceneID] = { is_open: false, rows: comments.data }
        },

        removeCommentFromList (state, payload) {
            if(payload.parent === 'chapter') {
                let chapterID = payload.parent_id
                for (var key in state.comments.chapters[chapterID].rows) {
                    if(state.comments.chapters[chapterID].rows[key].uuid === payload.comment_id) {
                        for (var index in state.comments.chapters[chapterID].rows[key].sub_comments) {
                            if (state.comments.chapters[chapterID].rows[key].sub_comments[index].id === payload.id) {
                                state.comments.chapters[chapterID].rows[key].sub_comments.splice(index, 1)
                            }
                        }
                    } else {
                        if (state.comments.chapters[chapterID].rows[key].uuid === payload.uuid) {
                            state.comments.chapters[chapterID].rows.splice(key, 1)
                        }
                    }
                }
            }

            if(payload.parent === 'scene') {
                let sceneID = payload.parent_id
                for (let key in state.comments.scenes[sceneID].rows) {
                    if(state.comments.scenes[sceneID].rows[key].uuid === payload.comment_id) {
                        for (let index in state.comments.scenes[sceneID].rows[key].sub_comments) {
                            if (state.comments.scenes[sceneID].rows[key].sub_comments[index].id === payload.id) {
                                state.comments.scenes[sceneID].rows[key].sub_comments.splice(index, 1)
                            }
                        }
                    } else {
                        if (state.comments.scenes[sceneID].rows[key].uuid === payload.uuid) {
                            state.comments.scenes[sceneID].rows.splice(key, 1)
                        }
                    }
                }
            }
        },

        updateCommentInList (state, payload) {
            if (payload.parent === 'chapter') {
                let chapterID = payload.parent_id
                for (var key in state.comments.chapters[chapterID].rows) {
                    if (state.comments.chapters[chapterID].rows[key].uuid === payload.uuid) {
                        Vue.set(state.comments.chapters[chapterID].rows, key, payload)
                    }
                }
            }

            if(payload.parent === 'scene') {
                let sceneID = payload.parent_id
                for (let key in state.comments.scenes[sceneID].rows) {
                    if (state.comments.scenes[sceneID].rows[key].uuid === payload.uuid) {
                        Vue.set(state.comments.scenes[sceneID].rows, key, payload)
                    }
                }
            }
        },

        addCommentToList (state, payload) {
            if (payload.parent === 'chapter') {
                let chapterID = payload.parent_id
                if (payload.comment_id) {
                    for (var i = 0; i <= (state.comments.chapters[chapterID].rows.length - 1); i++) {
                        if (state.comments.chapters[chapterID].rows[i].id === payload.parent_id) {
                            state.comments.chapters[chapterID].rows[i].sub_comments.push(payload)
                        }
                    }
                } else {
                    state.comments.chapters[chapterID].rows.unshift(payload)
                }
            }

            if(payload.parent === 'scene') {
                let sceneID = payload.parent_id
                if(payload.comment_id) {
                    for (var i = 0; i <= (state.comments.scenes[sceneID].rows.length - 1); i++) {
                        if (state.comments.scenes[sceneID].rows[i].id === payload.parent_id) {
                            state.comments.scenes[sceneID].rows[i].sub_comments.push(payload)
                        }
                    }
                } else {
                    state.comments.scenes[sceneID].rows.unshift(payload)
                }
            }
        }
    },

    actions: {
        async loadCommentsByChapter({commit, state, rootGetters}, payload) {
            let chapterID = payload;
            let authorID = rootGetters.getAuthorID;
            let comments = await axios.get('http://localhost:3000/comments/chapter/' + chapterID + '/author/' + authorID);
            commit('loadCommentsByChapter', {chapter_id: chapterID, comments: comments})
        },

        async loadCommentsByScene ({ commit, state, rootGetters }, payload) {
            let sceneID = payload;
            let authorID = rootGetters.getAuthorID;
            let comments = await await axios.get('http://localhost:3000/comments/scene/' + sceneID + '/author/' + authorID);
            commit('loadCommentsByScene', { scene_id: sceneID, comments: comments })
        },

        removeCommentFromList ({ commit, state }, payload) {
            commit('removeCommentFromList', payload)
        },

        updateCommentInList ({ commit, state }, payload) {
            commit('updateCommentInList', payload)
        },

        addCommentToList ({ commit, state }, payload) {
            commit('addCommentToList', payload)
        },
    }
}