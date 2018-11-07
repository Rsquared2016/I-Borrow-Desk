import os
from fabric.api import *
from fabric.contrib.project import rsync_project

env.use_ssh_config = True
VIRTUALENV = '/home/cameron/.pyenv/versions/iborrowdesk/bin/activate'
SCRIPT_DIRECTORY = os.path.join(os.path.abspath('..'), 'front_end')
WEBAPP_DIRECTORY = os.path.join(os.path.abspath('..'), 'stock_loan')

REMOTE_CODE_DIRECTORY = '/home/cameron/iborrowdesk'
REMOTE_DIRECTORY = '/var/www/iborrowdesk.com/static/'
REPO = 'git@github.com:cjmochrie/I-Borrow-Desk.git'

def deploy():
    build_frontend()
    with settings(warn_only=True):
        if run("test -d %s" % REMOTE_CODE_DIRECTORY).failed:
            run("git clone {} {}".format(REPO, REMOTE_CODE_DIRECTORY))
    with cd(REMOTE_CODE_DIRECTORY):
        run("git pull {}".format(REPO))
        with prefix('source {}'.format(VIRTUALENV)):
            run('pip install --upgrade pip')
            run('pip install -r requirements/prod.txt')
            with shell_env(**REQUIRED_ENVS):
                run('flask db upgrade')

    copy_static()
    sudo("service iborrowdesk restart")
    sudo("service iborrowdesk.manager restart")
    if not any('staging' in host for host in env.hosts):
        sudo("service iborrowdesk.twitter restart")
    cleanup_local_dist()

def build_frontend(script_directory=SCRIPT_DIRECTORY, webapp_directory=WEBAPP_DIRECTORY):
    with lcd(webapp_directory):
        local('mkdir -p static/dist')
        local('cp -r static/css static/dist/css')
        local('cp -r static/fonts static/dist/fonts')

    with lcd(script_directory):
        local('. ~/.nvm/nvm.sh use')
        local('npm install')
        local('npm run deploy') # deposits js bundle in dist/js


def cleanup_local_dist(webapp_directory=WEBAPP_DIRECTORY):
    with lcd(webapp_directory):
        local('rm -rf static/dist')


def copy_static(remote_dir=REMOTE_DIRECTORY):
    rsync_project(
        remote_dir=remote_dir,
        local_dir=os.path.join(os.path.abspath('..'), 'stock_loan', 'static', 'dist/'),
    )

REQUIRED_ENVS = {
    'ADMIN_ADDRESS': '',
    'APP_ADDRESS': '',
    'DATABASE_PATH': os.getenv('REMOTE_DATABASE_PATH').strip(),
    'MAIL_PASSWORD': '',
    'MAIL_USERNAME': '',
    'SECRET_KEY': '',
}