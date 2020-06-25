<template>
    <div class="page-save">
        This is a test
    </div>
</template>

<style scoped>
    .page-syncing.fullscreen .es-page-content {  position: fixed; top: 0px; left: 0px;  background: rgba(31,46,58,0.8); width: 100%; height: 100vh; z-index: 999; }
    .page-syncing.fullscreen .es-card { margin-top:100px; }

    .es-card { width:calc(100% - 40px); max-width:750px; margin:0px auto; margin-top:10px; color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    .es-card .es-card-content { position:relative; padding:20px; min-height:150px; text-align:center; }
    .es-card .es-card-content .intro-message { padding:80px 10px; }
    .es-card .es-card-content .loader { display:inline-block; margin:0px auto; padding:20px 0px; max-width:100px; }

    .es-card .es-card-content .syncer-button {cursor:pointer; background:#862e3b; border:none; color:#fff; padding:10px 40px; border-radius:4px; }
    .es-card .es-card-content .syncer-button:hover { background:#973241;  }

    .es-card .es-card-content .es-progress-bar { margin-top:-8px; margin-bottom:10px; position:relative; background:#ccc; border-radius:8px; height:10px;  }
    .es-card .es-card-content .es-progress { position:absolute; top:0px; left:0px; border-radius:8px; height:10px; background:#43c853; width:0%; height:100%;  }
    .es-card .es-card-content .es-progress.error { background:#ef3551;  }

    .es-card .es-card-header { font-weight:600; position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 10px; border-bottom:1px solid #e0e5ee; }
</style>
