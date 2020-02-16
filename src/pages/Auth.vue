<template>
  <div class="page-auth">
    <div class="es-login-wrapper">
        <div class="es-login">
            <div class="inner">
                <div class="heading">
                    <img src="@/assets/img/es-logo.png">
                </div>
                <div class="content">
                    <form v-on:submit.prevent="authenticate()">
                        <p class="welcome">Welcome to EasyWrite, please login to your account to continue.</p>
                        <div class="input-group line">
                            <label>Username</label>
                            <input v-model="username" type="text" placeholder="Enter your username here...">
                        </div>
                        <div class="input-group line">
                            <label>Password</label>
                            <input v-model="password" type="password" placeholder="Enter your password here...">
                        </div>
                        <div class="input-group">
                            <button type="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
// In renderer process (web page).
export default {
  name: 'Auth',
  data () {
    return {
      username: 'Support',
      password: '123QazQaz'
    }
  },
  methods: {
    authenticate: function (event) {
      var scope = this
      var response = this.IPCSendSync('AUTHENTICATE', { username: scope.username, password: scope.password })

      if (!response.success) {
        this.$notify({
          group: 'notification',
          type: 'error',
          title: 'Authentication Failed',
          text: response.message
        })
        return
      }

      this.$store.commit('authenticate', {
        user: response.user,
        author: response.author
      })

      this.$router.push({name: 'Main'})
    }
  },
  mounted () {
    // this.IPCSendSync('/books/get', { id: 1, title: 'The Book' })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body { background:#fff; }
.es-login-wrapper { display: table; position: absolute;  top: 0; left: 0; height: 100%; width: 100%; }
.es-login-wrapper .es-login { display: table-cell; vertical-align: middle; }
.es-login-wrapper .es-login  .inner { margin-left: auto; margin-right: auto; width: 400px; min-height:90vh;  }
.es-login-wrapper .es-login  .inner .heading { text-align:center; margin-bottom:30px;  }
.es-login-wrapper .es-login  .inner .heading img { width:200px;  }
.es-login-wrapper .es-login  .inner .welcome { text-align:left;  }

.input-group { margin-bottom:20px;  text-align:left; width:100%; }
.input-group label { color:#293742; font-size:12px; font-family:'Gotham Bold';  }
.input-group.line input { width:100%; height:30px; line-height:30px; border:none; border-bottom:1px solid #c3d1dc; padding:0px 2px;  }
.input-group.line input:hover, .input-group.line input:active, .input-group.line input:focus { border-bottom:1px solid #293742;  }

.input-group button { width:100%; height:40px; line-height:40px; border:none; background:#293742; padding:0px 10px; color:#fff;  }
.input-group button:hover { background:#2f414f;  }
</style>
