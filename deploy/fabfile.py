import os
from fabric.api import *


env.hosts = ['iborrowdesk.com']
env.use_ssh_config = True
VIRTUALENV = '/home/cameron/.pyenv/versions/iborrowdesk/bin/activate'
SCRIPT_DIRECTORY = os.path.join(os.path.abspath('..'), 'front_end')
WEBAPP_DIRECTORY = os.path.join(os.path.abspath('..'), 'stock_loan')
REMOTE_DIRECTORY = '/var/www/iborrowdesk.com/static/'

def deploy():
    code_dir = '/home/cameron/iborrowdesk'
    repo = "git@bitbucket.org:cjmochrie/I-Borrow-Desk.git"
    with settings(warn_only=True):
        if run("test -d %s" % code_dir).failed:
            run("git clone {} {}".format(repo, code_dir))
    with cd(code_dir):
        run("git pull {}".format(repo))
        with prefix('source {}'.format(VIRTUALENV)):
            run('pip install -r requirements/prod.txt')
    #         # with shell_env(PYFILE=PYFILE):
    #         #     run('python migrate.py db upgrade')

    build_frontend()
    copy_static()
    sudo("service iborrowdesk restart")
    sudo("service iborrowdesk.manager restart")
    sudo("service iborrowdesk.twitter restart")
    cleanup_local_dist()
    cleanup_local_dist()


def build_frontend(script_directory=SCRIPT_DIRECTORY, webapp_directory=WEBAPP_DIRECTORY):
    with lcd(webapp_directory):
        local('mkdir static/dist')
        local('cp -r static/css static/dist/css')
        local('cp -r static/fonts static/dist/fonts')

    with lcd(script_directory):
        local('npm run deploy') # deposits js bundle in dist/js


def cleanup_local_dist(webapp_directory=WEBAPP_DIRECTORY):
    with lcd(webapp_directory):
        local('rm -rf static/dist')


def copy_static(remote_dir=REMOTE_DIRECTORY):
    rsync_project(
        remote_dir=remote_dir,
        local_dir=os.path.join(os.path.abspath('..'), 'stock_loan', 'static', 'dist'),
    )
