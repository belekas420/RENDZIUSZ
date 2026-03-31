fx_version 'cerulean'
game 'gta5'

description 'CyberESX Advanced Dashboard'
version '2.5.0'

ui_page 'ui_build/index.html'

files {
    'ui_build/index.html',
    'ui_build/assets/*.js',
    'ui_build/assets/*.css'
}

client_scripts {
    'client.lua'
}

server_scripts {
    'server.lua'
}
